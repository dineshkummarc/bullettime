bt.client = (function() {
    var r, remote = function() {
        return r;
    },
    dnode = DNode({
        join: bt.ingame.join,
        leave: bt.ingame.leave,
        move: bt.ingame.move,
        jumping: bt.ingame.jumping,
        bullet: bt.ingame.bullet,
        hit: bt.ingame.hit,
        dead: bt.ingame.dead
    });
    $(function() {
        dnode.connect(function(remote) {
            r = remote;
            remote.start(function(game, guid) {
                window.location.hash = game.guid;
                bt.panel.start();
                bt.ingame.start(game, guid);
            }, window.location.hash);
        });
    });
    return {
        remote: remote
    };
} ());

