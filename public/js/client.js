window.onload = function() {
    DNode.connect(function(remote) {
        remote.zing(66, function(n) {
            console.log(n);
        });
    });

    var paper = Raphael(document.getElementById('container')),
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
                _.each([lFot, rFot], function(fot, i) {
                    var r = i === 0 ? - 1: 1;
                    r = a ? r: - 1 * r;
                    fot.rotate(r * 45);
                    fot.translate(r * - 7, r * - 2);
                });
            }
        };
        s.way = 0;
        s.speed = 5;

        s.push(paper.circle(15, 10, 5), paper.path('M15 15L15 35'), paper.path('M0 20L30 20'));
        s.push(lFot, rFot);
        s.move = function() {
            var x = 0,
            y = s.jump ? - 1: 0;
            if (s.way === 65) x = - 1;
            else if (s.way === 68) x = 1;
            else if (s.way === 87) y = - 1;
            if (y === 0 && s[0].attr('cy') < paper.height - 50) {
                y = 1;
            }
            x !== 0 && animate();
            s.translate(x * s.speed, y * s.speed);
            if (s[0].attr('cx') < 15 || s[0].attr('cx') > paper.width - 15) {
                s.translate(-x * s.speed, 0);
            }
            if (s[0].attr('cy') < 5) {
                s.translate(0, -y * s.speed);
            }
            return s;
        };

        return s;
    };

    var p = createPlayer();

    setInterval(function() {
        p.move();
    },
    50);

    document.onkeydown = function(e) {
        if (e.keyCode === 65 || e.keyCode === 68) {
            p.way = e.keyCode;
        } else if (e.keyCode === 87) {
            p.jump = true;
        }
    };

    document.onkeyup = function(e) {
        if (e.keyCode === p.way) {
            p.way = 0;
        }
        if (e.keyCode === 87) {
            p.jump = false;
        }
    };

};

