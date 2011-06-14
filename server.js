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

var getPlayer = function(client) {
    if (!client.player) {
        client.player = {
            guid: s4() + s4(),
            x: 0,
            y: 0,
            hp: 100
        };
    }
    clients[client.player.guid] = client;
    return client.player;
};

var getGame = function(client) {
    if (openGames.length === 0) {
        openGames.push({
            guid: s4() + s4(),
            players: {}
        });
    }
    var game = openGames[0];
    game.players[client.player.guid] = client.player;
    if (Object.keys(game.players).length === 3) {
        openGames = openGames.slice(1, openGames.indexOf(game));
    }
    client.game = game;
    return game;
};

var all = function(client, cb, x) {
    Object.keys(client.game.players).forEach(function(k) {
        var p = client.game.players[k];
        if (!x || p !== client.player) {
            cb(clients[p.guid]);
        }
    });
};

var allX = function(client, cb) {
    all(client, cb, true);
};

server.listen(10518);

dnode(function(client, con) {
    con.on('end', function() {
        allX(client, function(c) {
            c.leave(client.player.guid);
        });
        delete client.game.players[client.player.guid];
    });

    this.start = function(cb) {
        var player = getPlayer(client),
        game = getGame(client);
        allX(client, function(c) {
            c.join(client.player);
        });
        cb(game, player.guid);
    };

    this.move = function(x, y, way) {
        client.player.x = x;
        client.player.y = y;
        allX(client, function(c) {
            c.move(client.player.guid, x, y, way);
        });
    };

    this.jumping = function(x, y, jumping) {
        client.player.x = x;
        client.player.y = y;
        allX(client, function(c) {
            c.jumping(client.player.guid, x, y, jumping);
        });
    };

    this.bullet = function(x, y, mx, my) {
        allX(client, function(c) {
            c.bullet(client.player.guid, x, y, mx, my);
        });
    };

    this.hit = function() {
        client.player.hp -= 10;
        allX(client, function(c) {
            c.hit(client.player.guid);
        });
        if (client.player.hp <= 0) {
            client.player.hp = 100;
            client.player.x = Math.floor(Math.random() * 800);
            client.player.y = Math.floor(Math.random() * 100);
            all(client, function(c) {
                c.dead(client.player.guid, client.player.x, client.player.y);
            });
        }
    };
}).listen(server);

