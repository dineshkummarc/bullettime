$(function() {
    DNode.connect(function(remote) {
        remote.zing(66, function(n) {
            console.log(n);
        });
    });

    var paper = Raphael($('#container')[0]),
    createPlayer = function() {
        var s = paper.set(),
        lFot = paper.path('M15 35L0 50'),
        rFot = paper.path('M15 35L30 50'),
        t = 0,
        a = false,
        speed = 5,
        animate = function() {
            if (++t >= 2) {
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
        s.way = 0;
        s.speed = 5;

        s.push(paper.circle(15, 10, 5), paper.path('M15 15L15 35'), paper.path('M0 20L30 20'));
        s.push(lFot, rFot);
        s.move = function() {
            var x = me.way,
            y = s.jump ? - 1: 0;
            if (y === 0 && s[0].attr('cy') < paper.height - 50) {
                y = 1;
            }
            if (x !== 0) {
                animate();
            }
            s.translate(x * s.speed, y * s.speed);
            if (s[0].attr('cx') < 15 || s[0].attr('cx') > paper.width - 15) {
                s.translate( - x * s.speed, 0);
            }
            if (s[0].attr('cy') < 5) {
                s.translate(0, - y * s.speed);
            }
            return s;
        };

        return s;
    };

    var me = createPlayer();

    setInterval(function() {
        me.move();
    },
    50);

    $(document).keydown(function(e) {
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
    });

    $(document).keyup(function(e) {
        if ((e.keyCode === 65 && me.way === - 1) || (e.keyCode === 68 && me.way === 1)) {
            me.way = 0;
        }
        if (e.keyCode === 87) {
            me.jump = false;
        }
    });

    $('svg').click(function() {
        console.log(arguments);
    });
});

