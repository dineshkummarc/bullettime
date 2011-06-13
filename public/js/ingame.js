bt.ingame = (function(width, height) {
    var worldAABB = new box2d.AABB(),
    gravity = new box2d.Vec2(0, 600);

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
        var v = me.GetLinearVelocity();
        if (me.way) {
            v.Set(me.way * me.speed, v.y);
        }
        if (me.jump) {
            v.y = - me.speed;
        }
        bt.moveAll();
        draw.drawWorld(world, ctx);
        me.shoot = me.shoot > 0 ? me.shoot - 1: 0;
        if (me.shooting && me.shoot === 0) {
            bt.bullet(paper, me, me.mx, me.my);
            me.shoot = me.shooting ? 10: 0;
        }
        setTimeout(this.timer, 1000 / 60);
    };

    var start = function() {
        var walls = [];
        walls.push(bt.ground(paper, 0, height - 20, width, 10));
        walls.push(bt.wall(0, 0, width, 1));
        walls.push(bt.wall(0, 0, 1, height));
        walls.push(bt.wall(width - 10, 0, 1, height));
        timer();
    };

    return {
        start: start
    };
})(bt.width, bt.height);

