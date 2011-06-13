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

var cPlayer = function(client) {
    if (!client.player) {
        client.player = {
            guid: s4() + s4(),
            x: 0,
            y: 0,
            hp: 100
        };
    }
    return client.player;
};

var cGame = function() {
    var game = openGames[0];
    if (!game) {
        openGames.push(game = {
            guid: s4() + s4(),
            players: {}
        });
    }
    return game;
};

var allX = function(client, cb) {
    Object.keys(client.game.players).forEach(function(k) {
        var p = client.game.players[k];
        if (p !== client.player) {
            cb(clients[p]);
        }
    });
};

server.listen(5050);

dnode(function(client) {
    this.start = function(cb) {
        var game = cGame(),
        player = cPlayer(client);
        clients[player] = client;

        if (Object.keys(game.players).length === 3) {
            openGames = openGames.slice(1, openGames.indexOf(game));
        }
        game.players[player.guid] = player;
        client.game = game;

        cb(game, player.guid);
    };

    this.move = function(way) {
        allX(client, function(c) {
            c.move(client.player.guid, way);
        });
    };
}).listen(server);

