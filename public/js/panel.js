var bt = {
    width: 900,
    height: 200
};
bt.panel = (function() {

    var key, paperi, start = function() {
        $('svg').remove();

        paper = Raphael($('#container')[0], bt.width, bt.height);

        $('body').keydown(function(e) {
            if (e.keyCode !== key) {
                key = e.keyCode;
                switch (e.keyCode) {
                case 65:
                    bt.ingame.pressLeft();
                    break;
                case 68:
                    bt.ingame.pressRight();
                    break;
                case 87:
                    bt.ingame.pressUp();
                    break;
                }
            }
        }).keyup(function(e) {
            key = null;
            switch (e.keyCode) {
            case 65:
                bt.ingame.releaseLeft();
                break;
            case 68:
                bt.ingame.releaseRight();
                break;
            case 87:
                bt.ingame.releaseUp();
                break;
            }
        });

        $('svg').mousedown(bt.ingame.mousedown).mouseup(bt.ingame.mouseup).mousemove(bt.ingame.mousemove);
    };

    var addPlayer = function(player) {
        var lFot = paper.path('M10 30L0 45'),
        rFot = paper.path('M10 30L20 45'),
        t = 0,
        a = false;

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

        player.set = paper.set().
        push(paper.circle(10, 5, 5), paper.path('M10 10L10 30'), paper.path('M0 18L20 18')).
        push(lFot, rFot);
    };

    var move = function(body, x1, x2, y1, y2) {
        var x1 = u.x(body),
        x2 = body.lastX,
        y1 = u.y(body),
        y2 = body.lastY;

        if (x1 !== x2 || y1 !== y2) {
            if (body.set) {
                body.set.translate(x1 - x2, y1 - y2);
            }
            body.lastX = x1;
            body.lastY = y1;
        }
        if (body.animate && x1 !== x2) {
            body.animate();
        }
    };

    var shake;
    shake = function(body, times) {
        if (times > 0) {
            var r = Math.floor(Math.random() * 4 - 2);
            body.set.animate({
                translation: r + ' ' + r
            },
            10, function() {
                r *= - 1;
                body.set.animate({
                    translation: r + ' ' + r
                },
                10, shake(body, times - 1));
            });
        }
    };

    var hide = function(body, cb) {
        body.set.animate({
            scale: 0.01
        },
        1000, cb);
    };

    var show = function(body) {
        body.set.animate({
            scale: 1.5
        },
        500, '<>', function() {
            body.set.animate({
                scale: 1
            },
            500, '<>');
        });
    };

    var rect = function(x, y, width, height) {
        paper.rect(x, y, width, height);
    };

    var addBullet = function(bullet) {
        bullet.set = paper.circle(0, 0, 2);
    };

    var remove = function(body) {
        if (body.set) {
            body.set.remove();
        }
    };

    return {
        start: start,
        addPlayer: addPlayer,
        move: move,
        shake: shake,
        hide: hide,
        show: show,
        rect: rect,
        addBullet: addBullet,
        remove: remove
    };
} ());

