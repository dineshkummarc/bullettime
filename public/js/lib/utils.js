var u = {};
u.body = function(x, y, opts) {
    return (function() {
        var self = this,
        bd = new box2d.BodyDef(),
        addSd = function(sd, opts) {
            if (opts) {
                sd = $.extend(sd, opts);
            } else {
                sd.density = 1;
            }
            bd.AddShape(sd);
            return sd;
        };
        bd.position.Set(x, y);
        if (opts) {
            bd = $.extend(bd, opts);
        }
        self.box = function(width, height, x, y, opts) {
            x = typeof x === 'undefined' ? 0: x;
            y = typeof y === 'undefined' ? 0: y;
            var sd = addSd(new box2d.BoxDef(), opts);
            sd.localPosition.Set(x + (width / 2), y + height / 2);
            sd.extents.Set(width / 2, height / 2);
            return self;
        };
        self.circle = function(radius, x, y, opts) {
            x = typeof x === 'undefined' ? 0: x;
            y = typeof y === 'undefined' ? 0: y;
            var sd = addSd(new box2d.CircleDef(), opts);
            sd.localPosition.Set(x + radius, y + radius);
            sd.radius = radius;
            return self;
        };
        self.c = function() {
            return world.CreateBody(bd);
        };
        return self;
    }());
};

u.x = function(body) {
    return Math.floor(body.GetOriginPosition().x);
};

u.y = function(body) {
    return Math.floor(body.GetOriginPosition().y);
};

