bt.ingame = (function() {
    var worldAABB = new box2d.AABB(),
    gravity = new box2d.Vec2(0, 600),
    walls = [],
    bodies = [];

    worldAABB.maxVertex.Set(bt.width, bt.height);

    world = new box2d.World(worldAABB, gravity, true);

    var Filter = function() {
        this.ShouldCollide = function(a, b) {
            $.each([[a, b], [b, a]], function(i, c) {
                var a = c[0],
                b = c[1];
                if (a.m_body.t === 'bullet') {
                    a.m_body.set.remove();
                    world.DestroyBody(a.m_body);
                    if (b.m_body === bt.me) {
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
            bt.move(b);
        });
        draw.drawWorld(world, ctx);
        bt.me.shoot = bt.me.shoot > 0 ? bt.me.shoot - 1: 0;
        if (bt.me.shooting && bt.me.shoot === 0) {
            bodies.push(bt.bullet(bt.me.x(), bt.me.y(), bt.me.mx, bt.me.my));
            bt.me.shoot = bt.me.shooting ? 10: 0;
            bt.remote.bullet(bt.me.x(), bt.me.y(), bt.me.mx, bt.me.my);
        }
        setTimeout(timer, 1000 / 60);
    };

    var addPlayer = function(player) {
        player.p = bt.player(player.x, player.y);
        bodies.push(player.p);
        return player;
    };

    var removePlayer = function(player) {
        world.DestroyBody(player.p);
    };

    var start = function(game, guid) {
        var k, p;

        for (k in game.players) {
            if (game.players.hasOwnProperty(k)) {
                p = game.players[k];
                addPlayer(p);
                if (k === guid) {
                    bt.me = p.p;
                }
            }
        }

        walls.push(bt.ground(0, bt.height - 20, bt.width, 10));
        walls.push(bt.wall(0, 0, bt.width, 1));
        walls.push(bt.wall(0, 0, 1, bt.height));
        walls.push(bt.wall(bt.width - 10, 0, 1, bt.height));
        timer();
    };

    var addBullet = function(x, y, mx, my) {
        bodies.push(bt.bullet(x, y, mx, my));
    };

    return {
        addPlayer: addPlayer,
        removePlayer: removePlayer,
        start: start,
        addBullet: addBullet
    };
} ());

