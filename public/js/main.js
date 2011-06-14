$(function() {
    DNode({
        join: function(player) {
            bt.ingame.addPlayer(player);
            bt.game.players[player.guid] = player;
        },
        leave: function(guid) {
            var player = bt.game.players[guid];
            player.p.set.remove();
            bt.ingame.removePlayer(player);
            delete bt.game.players[guid];
        },
        move: function(guid, x, y, way) {
            var p = bt.game.players[guid];
            p.p.way = way;
            p.p.SetOriginPosition(new box2d.Vec2(x, y), 0);

        },
        jumping: function(guid, x, y, jumping) {
            var p = bt.game.players[guid];
            p.p.jumping = jumping;
            p.p.SetOriginPosition(new box2d.Vec2(x, y), 0);
        },
        bullet: function(guid, x, y, mx, my) {
            bt.ingame.addBullet(x, y, mx, my);
        },
        hit: function(guid) {
            var p = bt.game.players[guid];
            bt.panel.shake(p.p.set, 10);
            if (p.hp <= 0) {
                p.p.set.animate({
                    scale: 0
                },
                1000);
            }
        },
        dead: function(guid, x, y) {
            var p = bt.game.players[guid];
            bt.panel.hide(p.p.set, function() {
                p.p.SetOriginPosition(new box2d.Vec2(x, y), 0);
                bt.panel.show(p.p.set);
            });
        }
    }).connect(function(remote) {
        bt.remote = remote;
        remote.start(function(game, guid) {
            console.log(game.guid);
            //window.location.hash = game.guid;
            bt.game = game;
            bt.panel.start();
            bt.ingame.start(game, guid);
        });
    });
});

