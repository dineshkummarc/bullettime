var http = require('http'),
nodeStatic = require('node-static'),
dnode = require('dnode'),
openGames = [],
clients = {},
s4 = function() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

var server = http.createServer(function(req, res) {
    var publicFiles = new nodeStatic.Server('public', {
        cache: false
    });

    publicFiles.serve(req, res);
});

server.listen(5050);

dnode(function(client) {
    this.start = function(cb) {
        var game;
        if (!client.player) {
            client.player = {
                guid: s4() + s4(),
                x: 0,
                y: 0,
                hp: 100
            };
            clients[client.player.guid]  = client;
        }
        if (openGames.length === 0) {
            game = {
                guid: s4() + s4(),
                players: []
            };
            openGames.push(game);
        }
        game = openGames[0];
        game.players.forEach(function(p) {
            clients[p.guid].join(client.player);
        });
        if (game.players.length === 3) {
            openGames = openGames.slice(1, openGames.indexOf(game));
        }
        game.players.push(client.player);
        cb(game, client.guid);
    };
}).listen(server);

