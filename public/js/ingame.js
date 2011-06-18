bt.ingame = (function() {
    var me, game, bulletCount = 0;

    var start = function(g, guid) {
        game = g;
        var k, p;

        for (k in game.players) {
            if (game.players.hasOwnProperty(k)) {
                p = game.players[k];
                game.players[k] = addPlayer(p);
                if (k === guid) {
                    me = p;
                }
            }
        }

        $.playground().registerCallback(function() {
            var m = function($this, body) {
                if ((!body.way || body.way.sin === 0) && body.y < game.height - body.height) {
                    body.y += body.speed;
                }
                if (body.way) {
                    body.x += body.speed * body.way.cos;
                    body.y += body.speed * body.way.sin;
                }

                $this.css('left', body.x).css('top', body.y);
            };
            $('.player').each(function() {
                var $this = $(this),
                body = $this.data('body');
                m($this, body);
                body.x = body.x < 0 ? 0: body.x;
                body.x = body.x + body.width > game.width ? game.width - body.width: body.x;
                body.y = body.y < 0 ? 0: body.y;
                body.y = body.y + body.height > game.height ? game.height - body.height: body.y;
                $this.collision('.group,.bullet').each(function(i, e) {
                    $(e).remove();
                    if (body.guid === me.guid) {
                        bt.client.remote().hit();
                    }
                });
            });
            $('.bullet').each(function()  {
                var $this = $(this),
                body = $this.data('body');
                m($this, body);
                if (body.x < 0 || body.x + body.width > game.width || body.y < 0 || body.y + body.height > game.height) {
                    $this.remove();
                }
            });
            me.shoot = me.shoot > 0 ? me.shoot - 1: 0;
            if (me.shooting && me.shoot === 0) {
                addBullet(me.x, me.y, me.mx, me.my);
                me.shoot = me.shooting ? 10: 0;
                bt.client.remote().bullet(me.x, me.y, me.mx, me.my);
            }
            $('.player').each(function() {});
        },
        30).startGame();
    };

    var addPlayer = function(player) {
        player.shoot = 0;
        $('#players').addSprite('player-' + player.guid, {
            animation: new $.gameQuery.Animation({
                imageURL: '/images/face.png'
            }),
            width: player.width,
            height: player.height,
            posx: player.x,
            posy: player.y
        });
        $('#player-' + player.guid).addClass('player').data('body', player);
    };

    var addBullet = function(x, y, mx, my) {
        x += me.width / 2;
        y += me.height / 2;
        var a = my - y,
        b = mx - x,
        h = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)),
        cos = b / h,
        sin = a / h,
        bullet = {
            x: x + cos * me.width,
            y: y + sin * me.height,
            width: 10,
            height: 10,
            speed: 20,
            way: {
                cos: b / h,
                sin: a / h
            }
        };
        var id = 'bullet-' + bulletCount++;
        $('#bullets').addSprite(id, {
            animation: new $.gameQuery.Animation({
                imageURL: '/images/bullet.png'
            }),
            width: bullet.width,
            height: bullet.height,
            posx: bullet.x,
            posy: bullet.y
        });
        $('#' + id).addClass('bullet').data('body', bullet);
    };

    var updatePlayer = function(guid, x, y) {
        var body = $('#player-' + guid).css('left', x).css('top', y).data('body');
        body.x = x;
        body.y = y;
        return body;
    };

    var setWay = function(way) {
        me.way = way;
        bt.client.remote().move(me.x, me.y, me.way);
    };

    var mousedown = function() {
        me.shooting = true;
    };

    var mouseup = function() {
        me.shooting = false;
    };

    var mousemove = function(e) {
        me.mx = e.offsetX;
        me.my = e.offsetY;
    };

    var move = function(guid, x, y, way) {
        updatePlayer(guid, x, y).way = way;
    };

    var leave = function(guid) {
        $('#player-' + guid).remove();
    };

    var jumping = function(guid, x, y, jumping) {
        updatePlayer(guid, x, y).jumping = jumping;
    };

    var hit = function(guid) {};

    var dead = function(guid, x, y) {
        $('#player-' + guid).hide();
        updatePlayer(guid, x, y);
        setTimeout(function() {
            $('#player-' + guid).show();
        }, 1000);
    };

    return {
        addPlayer: addPlayer,
        start: start,
        addBullet: addBullet,
        setWay: setWay,
        mousedown: mousedown,
        mouseup: mouseup,
        mousemove: mousemove,
        move: move,
        leave: leave,
        jumping: jumping,
        hit: hit,
        dead: dead
    };
} ());

