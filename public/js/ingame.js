var hack;
bt.ingame = (function() {
    var worldAABB = new box2d.AABB(),
    gravity = new box2d.Vec2(0, 600),
    walls = [],
    bodies = [],
    me;

    worldAABB.maxVertex.Set(bt.width, bt.height);

    world = new box2d.World(worldAABB, gravity, true);

    var Filter = function() {
        this.ShouldCollide = function(a, b) {
            $.each([[a, b], [b, a]], function(i, c) {
                var a = c[0],
                b = c[1];
                if (a.m_body.t === 'bullet') {
                    bt.panel.remove(a.m_body);
                    world.DestroyBody(a.m_body);
                    if (b.m_body === me) {
                        bt.remote.hit();
                    }
                }
            });
        };
        return this;
    };
    world.SetFilter(new Filter());

    var timer;
    timer = function() {
        world.Step(1.0 / 60, 1);

        $.each(bodies, function(i, b) {
            var v = b.GetLinearVelocity();
            if (typeof b.way !== 'undefined') {
                v.Set(b.way * b.speed, v.y);
            }
            if (b.jumping) {
                v.y = - b.speed;
            }
            bt.panel.move(b);
        });
        draw.drawWorld(world, ctx);
        me.shoot = me.shoot > 0 ? me.shoot - 1: 0;
        if (me.shooting && me.shoot === 0) {
            addBullet(u.x(me), u.y(me), me.mx, me.my);
            me.shoot = me.shooting ? 10: 0;
            bt.client.remote().bullet(u.x(me), u.y(me), me.mx, me.my);
        }
        setTimeout(timer, 1000 / 60);
    };

    var addPlayer = function(player) {
        player.body = u.body(player.x, player.y, {
            preventRotation: true,
            allowSleep: false
        }).box(20, 35).circle(10, 0, 25, {
            density: 1,
            friction: 1
        }).c();

        player.body.speed = 200;
        player.body.lastX = player.body.lastY = 0;
        player.body.shoot = 0;
        bodies.push(player.body);
        bt.panel.addPlayer(player.body);
        return player;
    };

    var ground = function(x, y, width, height) {
        var g = u.body(x, y).box(width, height, 0, 0, {
            density: 0,
            userData: 'filled'
        }).c();
        bt.panel.rect(x, y, width, height);
        return g;
    };

    var wall = function(x, y, width, height) {
        return u.body(x, y).box(width, height, 0, 0, {
            density: 0,
            friction: 0
        }).c();
        bt.panel.rect(x, y, width, height);
    };

    var removePlayer = function(player) {
        world.DestroyBody(player.p);
    };

    var addBullet = function(x, y, mx, my) {
        var a = my - y,
        b = mx - x,
        h = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)),
        c = b / h,
        s = a / h,
        bullet = u.body(x + 20 * c, y + 20 * s, {
            allowSleep: false,
            preventRotation: true,
            bullet: true
        }).circle(2).c();
        bullet.t = 'bullet';

        bullet.lastX = bullet.lastY = 0;
        bullet.GetLinearVelocity().Set(c * 1000, s * 1000);
        bt.panel.addBullet(bullet);
        bodies.push(bullet);
        return bullet;
    };

    var start = function(game, guid) {
        var k, p;

        for (k in game.players) {
            if (game.players.hasOwnProperty(k)) {
                p = game.players[k];
                addPlayer(p);
                if (k === guid) {
                    me = p.body;
                    hack = me;
                }
            }
        }

        walls.push(ground(0, bt.height - 20, bt.width, 10));
        walls.push(wall(0, 0, bt.width, 1));
        walls.push(wall(0, 0, 1, bt.height));
        walls.push(wall(bt.width - 10, 0, 1, bt.height));
        timer();
    };

    var pressLeft = function() {
        me.way = - 1;
        bt.client.remote().move(u.x(me), u.y(me), me.way);
    };

    var pressRight = function() {
        console.log('R')
        me.way = 1;
        bt.client.remote().move(u.x(me), u.y(me), me.way);
    };

    var pressUp = function() {
        me.jumping = true;
        bt.client.remote().jumping(u.x(me), u.y(me), me.jumping);
    };

    var releaseLeft = function() {
        me.way = me.way === - 1 ? 0: me.way;
        bt.client.remote().move(u.x(me), u.y(me), me.way);
    };

    var releaseRight = function() {
        me.way = me.way === 1 ? 0: me.way;
        bt.client.remote().move(u.x(me), u.y(me), me.way);
    };

    var releaseUp = function() {
        me.jumping = false;
        bt.client.remote().jumping(u.x(me), u.y(me), me.jumping);
    };

    var mousedown = function() {
        me.shooting = true;
    };

    var mouseup = function() {
        me.shooting = false;
    };

    var mousemove = function(e) {
        me.mx = e.offsetX;
        me.my = e.offsetY;
    };

    return {
        addPlayer: addPlayer,
        removePlayer: removePlayer,
        start: start,
        addBullet: addBullet,
        pressLeft: pressLeft,
        pressRight: pressRight,
        pressUp: pressUp,
        releaseLeft: releaseLeft,
        releaseRight: releaseRight,
        releaseUp: releaseUp,
        mousedown: mousedown,
        mouseup: mouseup,
        mousemove: mousemove
    };
} ());

