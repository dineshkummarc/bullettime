var bt = {};
bt.bodies = [];

bt.moveAll = function() {
    $.each(bt.bodies, function(i, b) {
        bt.move(b);
    });
};

bt.move = function(body) {
    var x1 = Math.floor(body.GetOriginPosition().x),
    x2 = body.lastX,
    y1 = Math.floor(body.GetOriginPosition().y),
    y2 = body.lastY;

    if (x1 !== x2 || y1 !== y2) {
        if (body.animate && x1 !== x2) {
            body.animate();
        }
        body.set.translate(x1 - x2, y1 - y2);
        body.lastX = x1;
        body.lastY = y1;
    }
};

bt.player = function(paper, x, y) {
    var lFot = paper.path('M10 30L0 45'),
    rFot = paper.path('M10 30L20 45'),
    t = 0,
    a = false,
    player = body(x, y, {
        preventRotation: true,
        allowSleep: false
    }).box(20, 35).circle(10, 0, 25, {
        density: 1,
        friction: 1
    }).c();

    player.animate = function() {
        if (++t >= 4) {
            t = 0;
            a = ! a;
            $.each([lFot, rFot], function(i, fot) {
                var r = i === 0 ? - 1: 1;
                r = a ? r: - 1 * r;
                fot.rotate(r * 35);
                fot.translate(r * - 6, 0);
            });
        }
    };

    player.speed = 100;
    player.lastX = player.lastY = 0;
    player.shoot = 0;

    player.set = paper.set().
    push(paper.circle(10, 5, 5), paper.path('M10 10L10 30'), paper.path('M0 18L20 18')).
    push(lFot, rFot);
    bt.bodies.push(player);
    return player;
};

bt.bullet = function(paper, player, mx, my) {
    var x = player.m_position.x,
    y = player.m_position.y,
    a = my - y,
    b = mx - x,
    h = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)),
    c = b / h,
    s = a / h,
    bullet = body(x + 20 * c, y + 20 * s, {
        allowSleep: false,
        preventRotation: true,
        bullet: true
    }).circle(2).c();
    bullet.t = 'bullet';

    bullet.lastX = bullet.lastY = 0;
    bullet.GetLinearVelocity().Set(c * 1000, s * 1000);
    bullet.set = paper.circle(0, 0, 2);
    bt.bodies.push(bullet);
    return bullet;
};

bt.ground = function(paper, x, y, width, height) {
    var ground = body(x, y).box(width, height, 0, 0, {
        density: 0,
        userData: 'filled'
    }).c();
    if (paper) {
        paper.rect(x, y, width, height);
    }
    return ground;
};

bt.wall = function(x, y, width, height) {
    return body(x, y).box(width, height, 0, 0, {
        density: 0,
        friction: 0
    }).c();
};

