bt.client = (function() {
    var r, remote = function() {
        return r;
    },
    dnode = DNode({
        join: bt.ingame.addPlayer,
        leave: bt.ingame.leave,
        move: bt.ingame.move,
        jumping: bt.ingame.jumping,
        bullet: bt.ingame.addBullet,
        hit: bt.ingame.hit,
        dead: bt.ingame.dead
    });
    $(function() {
        dnode.connect(function(remote) {
            r = remote;
            remote.start(function(game, guid) {
                window.location.hash = game.guid;
                bt.panel.start(game);
                bt.ingame.start(game, guid);
            }, window.location.hash);
        });
    });
    return {
        remote: remote
    };
} ());

