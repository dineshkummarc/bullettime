var bt = {};

bt.panel = (function() {
    var bulletCount = 0;

    var start = function(game) {
        var size = {
            width: game.width,
            height: game.height
        },
        way = {
            cos: 0,
            sin: 0
        },
        key;

        $('#panel').playground(size).addGroup('players', size).addGroup('bullets', size);

        $('body').keydown(function(e) {
            if (e.keyCode !== key) {
                key = e.keyCode;
                switch (e.keyCode) {
                case 65:
                    way.cos = - 1;
                    break;
                case 68:
                    way.cos = 1;
                    break;
                case 87:
                    way.sin = - 1;
                    break;
                }
                bt.ingame.setWay(way);
            }
        }).keyup(function(e) {
            key = null;
            switch (e.keyCode) {
            case 65:
                way.cos = 0;
                break;
            case 68:
                way.cos = 0;
                break;
            case 87:
                way.sin = 0;
                break;
            }
            bt.ingame.setWay(way);
        });

        $('#bullets').mousedown(bt.ingame.mousedown).mouseup(bt.ingame.mouseup).mousemove(bt.ingame.mousemove);
    };

    return {
        start: start,
    };
} ());

