bt.ingame = (function(width, height) {
    var worldAABB = new box2d.AABB(),
    gravity = new box2d.Vec2(0, 600),
    walls = [],
    bodies = [];

    worldAABB.maxVertex.Set(width, height);

    world = new box2d.World(worldAABB, gravity, true);

    world.SetFilter(new function() {
        this.ShouldCollide = function(a, b) {
            $.each(walls, function(i, w) {
                if (a.m_body.t === 'bullet') {
                    a.m_body.set.remove();
                    world.DestroyBody(a.m_body);
                } else if (b.m_body.t === 'bullet') {
                    b.m_body.set.remove();
                    world.DestroyBody(b.m_body);
                }
            });
        };
    } ());

    var timer = function() {
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
            bodies.push(bt.bullet(bt.me, bt.me.mx, bt.me.my));
            bt.me.shoot = bt.me.shooting ? 10: 0;
        }
        setTimeout(timer, 1000 / 60);
    };

    var start = function(game, guid) {
        var k, p;

        for (k in game.players) {
            if (game.players.hasOwnProperty(k)) {
                p = game.players[k];
                p.p = bt.player(p.x, p.y);
                if (k === guid) {
                    bt.me = p.p;
                }
                bodies.push(p.p);
            }
        }

        walls.push(bt.ground(0, height - 20, width, 10));
        walls.push(bt.wall(0, 0, width, 1));
        walls.push(bt.wall(0, 0, 1, height));
        walls.push(bt.wall(width - 10, 0, 1, height));
        timer();
    };

    var move = function(player, way) {
        player.way = way;
    };

    var jump = function(player, j) {
        player.jumping = j;
    };

    var aim = function(x, y) {
        bt.me.mx = x;
        bt.me.my = y;
    };

    var shooting = function(s) {
        bt.me.shooting = s;
    };

    return {
        start: start,
        move: move,
        jump: jump,
        aim: aim,
        shooting: shooting
    };
})(bt.width, bt.height);

