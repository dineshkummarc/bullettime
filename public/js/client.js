var me;
$(function() {
    DNode.connect(function(remote) {
        remote.zing(66, function(n) {
            console.log(n);
        });
    });

    var paper = Raphael($('#container')[0], game.width, game.height);
    me = new bt.Player(paper);
    game.addBody(me);

    setInterval(function() {
        game.step();
    },
    50);

    $(document).keydown(function(e) {
        switch (e.keyCode) {
        case 65:
            me.direction.cos = - 1;
            break;
        case 68:
            me.direction.cos = 1;
            break;
        case 87:
            me.direction.sin = - 1;
            break;
        }
    });

    $(document).keyup(function(e) {
        if (e.keyCode === 65 && me.direction.cos === - 1 || e.keyCode === 68 && me.direction.cos === 1) {
            me.direction.cos = 0;
        }
        if (e.keyCode === 87) {
            me.direction.sin = 0;
        }
    });

    $('svg').click(function(e) {
        game.bullet(paper, me, e.offsetX, e.offsetY);
    });
});

