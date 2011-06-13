bt.panel = (function(width, height) {

    var start = function() {
        $('canvas, svg').remove();

        var $canvas = $('<canvas width="' + width + '" height="' + height + '">');
        bt.panel.paper = Raphael($('#container').append($canvas)[0], width, height);
        ctx = $canvas[0].getContext('2d');

        $('body').keydown(function(e) {
            switch (e.keyCode) {
            case 65:
                if (bt.me.way !== - 1) {
                    bt.ingame.move(bt.me, - 1);
                    bt.remote.move( - 1);
                }
                break;
            case 68:
                if (bt.me.way !== 1) {
                    bt.ingame.move(bt.me, 1);
                    bt.remote.move(1);
                }
                break;
            case 87:
                if (!bt.me.jumping) {
                    bt.ingame.jump(bt.me, true);
                }
                break;
            }
        }).keyup(function(e) {
            if ((e.keyCode === 65 && bt.me.way === - 1) || (e.keyCode === 68 && bt.me.way === 1)) {
                bt.ingame.move(bt.me, 0);
                bt.remote.move(0);
            } else if (e.keyCode === 87) {
                bt.ingame.jump(bt.me, false);
            }
        });

        $('svg').mousedown(function() {
            bt.ingame.shooting(true);
        }).mouseup(function() {
            bt.ingame.shooting(false);
        }).mousemove(function(e) {
            bt.ingame.aim(e.offsetX, e.offsetY);
        }).mouseout(function() {
            bt.ingame.shooting(false);
        });
    };

    return {
        start: start
    };
})(bt.width, bt.height);

