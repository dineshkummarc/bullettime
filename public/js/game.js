var bt = {};

bt.Game = function() {
    OGE.World.apply(this, arguments);
    var self = this;
    self.bodies = [];
    self.bullet = function(paper, player, mx, my) {
        var bullet = new bt.Bullet(paper, player, mx, my);
        self.addBody(bullet);
        bullet.onCollision(function(b) {
            if (b === self) {
                self.removeBody(bullet);
            }
        });
        return bullet;
    };
};
bt.Game.prototype = new OGE.World();
bt.Game.prototype.addBody = function(body) {
    this.bodies.push(body);
    OGE.World.prototype.addBody.apply(this, arguments);
};

bt.Game.prototype.step = function() {
    $.each(this.bodies, function(i, b) {
        b.move();
    });

    OGE.World.prototype.step.apply(this, arguments);
};

bt.Game.prototype.removeBody = function(body) {
    this.bodies = $.grep(this.bodies, function(b) {
        return body !== b;
    });
    body.set.remove();
    OGE.World.prototype.removeBody.apply(this, arguments);
};

var game = new bt.Game(900, 400);

OGE.Body.prototype.move = function() {
    if (this.lastX !== this.x || this.lastY !== this.y) {
        if (this.animate && this.lastX !== this.x) {
            this.animate();
        }
        this.set.translate(this.x - this.lastX, this.y - this.lastY);
        this.lastX = this.x;
        this.lastY = this.y;
    }
    if (this.gravity && this.direction.sin !== - 1) {
        this.direction.sin = this.y < game.height - this.height ? 1: 0;
    }
};

bt.Player = function(paper) {
    OGE.Body.apply(this, [0, 0, 35, 50]);
    var lFot = paper.path('M15 35L0 50'),
    rFot = paper.path('M15 35L30 50'),
    t = 0,
    a = false;

    this.animate = function() {
        if (++t >= 2) {
            t = 0;
            a = ! a;
            $.each([lFot, rFot], function(i, fot) {
                var r = i === 0 ? - 1: 1;
                r = a ? r: - 1 * r;
                fot.rotate(r * 35);
                fot.translate(r * - 6, 0);
            });
        }
    };

    this.direction = new OGE.Direction();
    this.speed = 5;
    this.lastX = 0;
    this.lastY = 0;
    this.gravity = true;
    this.active = true;
    this.set = paper.set().
    push(paper.circle(15, 10, 5), paper.path('M15 15L15 35'), paper.path('M0 20L30 20')).
    push(lFot, rFot);
    return this;
};
bt.Player.prototype = new OGE.Body();

bt.Bullet = function(paper, player, mx, my) {
    OGE.Body.apply(this, [player.x + player.width / 2, player.y + player.height / 2, 2, 2]);
    a = my - this.y,
    b = mx - this.x,
    h = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    this.direction = new OGE.Direction(b / h, a / h);
    this.speed = 15;
    this.active = true;

    this.set = paper.set().push(paper.circle(this.x, this.y, 2));

    return this;
};
bt.Bullet.prototype = new OGE.Body();

