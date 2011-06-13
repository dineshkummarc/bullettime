bt.panel = (function(width, height) {

    var start = function() {
        $('canvas, svg').remove();

        var $canvas = $('<canvas width="' + width + '" height="' + height + '">'),
        paper = Raphael($('#container')[0], width, height),
        ctx = $canvas[0].getContext('2d');

        $('body').keydown(function(e) {
            switch (e.keyCode) {
            case 65:
                main.move( - 1);
                break;
            case 68:
                main.move(1);
                break;
            case 87:
                main.jump(true);
                break;
            }
        }).keyup(function(e) {
            if ((e.keyCode === 65 && me.way === - 1) || (e.keyCode === 68 && me.way === 1)) {
                main.move(0);
            } else if (e.keyCode === 87) {
                main.jump(false);
            }
        });

        $('svg').mousedown(function() {
            main.shooting(true);
        }).mouseup(function() {
            main.shooting(false);
        }).mousemove(function(e) {
            main.aim(e.offsetX, e.offsetY);
        });
    };

    return {
        start: start
    };
})(bt.width, bt.height);

