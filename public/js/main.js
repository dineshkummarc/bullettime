var world, me;

$(function() {
    DNode({
        join: function(player) {
            console.log('join', player);
            bt.player(paper, 20, 50);
        }
    }).connect(function(remote) {
        remote.start(function(game, guid) {
            console.log(game);
        });
    });

    var width = 900,
    height = 200,
    $canvas = $('<canvas width="' + width + '" height="' + height + '">'),
    paper = Raphael($('#container').append($canvas)[0], width, height),
    ctx = $canvas[0].getContext('2d'),
    worldAABB = new box2d.AABB(),
    gravity = new box2d.Vec2(0, 600);

    worldAABB.maxVertex.Set(width, height);

    world = new box2d.World(worldAABB, gravity, true);

    var walls = [
    bt.ground(paper, 0, height - 20, width, 10), w2 = bt.wall(0, 0, width, 1), w3 = bt.wall(0, 0, 1, height), w4 = bt.wall(width - 10, 0, 1, height)];

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

    $('body').keydown(function(e) {
        switch (e.keyCode) {
        case 65:
            me.way = - 1;
            break;
        case 68:
            me.way = 1;
            break;
        case 87:
            me.jump = true;
            break;
        }
    }).keyup(function(e) {
        if ((e.keyCode === 65 && me.way === - 1) || (e.keyCode === 68 && me.way === 1)) {
            var v = me.GetLinearVelocity();
            v.Set(me.way = 0, v.y);
        } else if (e.keyCode === 87) {
            me.jump = false;
        }
    });

    $('svg').mousedown(function() {
        me.shooting = true;
    }).mouseup(function() {
        me.shooting = false;
    }).mousemove(function(e) {
        me.mx = e.offsetX;
        me.my = e.offsetY;
    });

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
        setTimeout(timer, 1000 / 60);
    };
});

