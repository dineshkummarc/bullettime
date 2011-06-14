bt.panel = (function() {

    var start = function() {
        $('canvas, svg').remove();

        var $canvas = $('<canvas width="' + bt.width + '" height="' + bt.height + '">');
        bt.panel.paper = Raphael($('#container').append($canvas)[0], bt.width, bt.height);
        ctx = $canvas[0].getContext('2d');

        $('body').keydown(function(e) {
            switch (e.keyCode) {
            case 65:
                if (bt.me.way !== - 1) {
                    bt.me.way = - 1;
                    bt.remote.move(bt.me.x(), bt.me.y(), - 1);
                }
                break;
            case 68:
                if (bt.me.way !== 1) {
                    bt.me.way = 1;
                    bt.remote.move(bt.me.x(), bt.me.y(), 1);
                }
                break;
            case 87:
                if (!bt.me.jumping) {
                    bt.me.jumping = true;
                    bt.remote.jumping(bt.me.x(), bt.me.y(), true);
                }
                break;
            }
        }).keyup(function(e) {
            if ((e.keyCode === 65 && bt.me.way === - 1) || (e.keyCode === 68 && bt.me.way === 1)) {
                bt.me.way = 0;
                bt.remote.move(bt.me.x(), bt.me.y(), 0);
            } else if (e.keyCode === 87) {
                bt.remote.jumping(bt.me.x(), bt.me.y(), false);
                bt.me.jumping = false;
            }
        });

        $('svg').mousedown(function() {
            bt.me.shooting = true;
        }).mouseup(function() {
            bt.me.shooting = false;
        }).mousemove(function(e) {
            bt.me.mx = e.offsetX;
            bt.me.my = e.offsetY;
        });
    };

    var shake;
    shake = function(set, times) {
        if (times > 0) {
            var r = Math.floor(Math.random() * 4 - 2);
            set.animate({
                translation: r + ' ' + r
            },
            10, function() {
                r *= - 1;
                set.animate({
                    translation: r + ' ' + r
                },
                10, shake(set, times - 1));
            });
        }
    };

    var hide = function(set, cb) {
        set.animate({
            scale: 0.01
        },
        1000, cb);
    };

    var show = function(set) {
        set.animate({
            scale: 1.5
        },
        500, function() {
            set.animate({
                scale: 1
            },
            500);
        });
    };

    return {
        start: start,
        shake: shake,
        hide: hide,
        show: show
    };
} ());

