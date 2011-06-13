$(function() {
    var width = 900,
    height = 200;

    DNode({
        join: function(player) {
            console.log('join', player);
            bt.player(paper, 20, 50);
        }
    }).connect(function(remote) {
        remote.start(function(game, guid) {
            //bt.ingame.start();
        });
    });
});

