var http = require('http'),
nodeStatic = require('node-static'),
dnode = require('dnode');

var server = http.createServer(function(req, res) {
    var publicFiles = new nodeStatic.Server('public', {
        cache: false
    });

    publicFiles.serve(req, res);
});

server.listen(5050);

var d = dnode({
    zing: function(n, cb) {
        cb(n * 100);
    }
});
d.listen(server);

