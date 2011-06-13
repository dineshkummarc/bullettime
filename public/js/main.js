$(function() {
    DNode({
        join: function(player) {
            console.log('join', player);
            bt.player(paper, 20, 50);
        },
    move: function(guid, way) {
              console.log(guid, way, bt.game.players[guid]);
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

