// https://github.com/brian3kb/graham_scan_js
// http://jsfiddle.net/HYEONGJINKIM/wmcopdko/

function ConvexHullGrahamScan() {
    this.anchorPoint = void 0, this.reverse = !1, this.points = []
}
ConvexHullGrahamScan.prototype = {
    constructor: ConvexHullGrahamScan,
    Point: function(a, b) {
        this.x = a, this.y = b
    },
    _findPolarAngle: function(a, b) {
        var c, d, e = 57.295779513082;
        if (!a || !b) return 0;
        if (c = b.x - a.x, d = b.y - a.y, 0 == c && 0 == d) return 0;
        var f = Math.atan2(d, c) * e;
        return this.reverse ? 0 >= f && (f += 360) : f >= 0 && (f += 360), f
    },
    addPoint: function(a, b) {
        var c = void 0 === this.anchorPoint || this.anchorPoint.y > b || this.anchorPoint.y === b && this.anchorPoint.x > a;
        c ? (void 0 !== this.anchorPoint && this.points.push(new this.Point(this.anchorPoint.x, this.anchorPoint.y)), this.anchorPoint = new this.Point(a, b)) : this.points.push(new this.Point(a, b))
    },
    _sortPoints: function() {
        var a = this;
        return this.points.sort(function(b, c) {
            var d = a._findPolarAngle(a.anchorPoint, b),
                e = a._findPolarAngle(a.anchorPoint, c);
            return e > d ? -1 : d > e ? 1 : 0
        })
    },
    _checkPoints: function(a, b, c) {
        var d, e = this._findPolarAngle(a, b),
            f = this._findPolarAngle(a, c);
        return e > f ? (d = e - f, !(d > 180)) : f > e ? (d = f - e, d > 180) : !0
    },
    getHull: function() {
        var a, b, c = [];
        if (this.reverse = this.points.every(function(a) {
                return a.x < 0 && a.y < 0
            }), a = this._sortPoints(), b = a.length, 3 > b) return a.unshift(this.anchorPoint), a;
        for (c.push(a.shift(), a.shift());;) {
            var d, e, f;
            if (c.push(a.shift()), d = c[c.length - 3], e = c[c.length - 2], f = c[c.length - 1], this._checkPoints(d, e, f) && c.splice(c.length - 2, 1), 0 == a.length) {
                if (b == c.length) {
                    var g = this.anchorPoint;
                    return c = c.filter(function(a) {
                        return !!a
                    }), c.some(function(a) {
                        return a.x == g.x && a.y == g.y
                    }) || c.unshift(this.anchorPoint), c
                }
                a = c, b = a.length, c = [], c.push(a.shift(), a.shift())
            }
        }
    }
}, "function" == typeof define && define.amd && define(function() {
    return ConvexHullGrahamScan
}), "undefined" != typeof module && (module.exports = ConvexHullGrahamScan);


function Vec2(x, y) {
  return [x, y]
}
Vec2.nsub = function (v1, v2) {
  return Vec2(v1[0]-v2[0], v1[1]-v2[1])
}
// aka the "scalar cross product"
Vec2.perpdot = function (v1, v2) {
  return v1[0]*v2[1] - v1[1]*v2[0]
}

// Determine if a point is inside a polygon.
//
// point     - A Vec2 (2-element Array).
// polyVerts - Array of Vec2's (2-element Arrays). The vertices that make
//             up the polygon, in clockwise order around the polygon.
//
function coordsAreInside(point, polyVerts) {
  var i, len, v1, v2, edge, x
  // First translate the polygon so that `point` is the origin. Then, for each
  // edge, get the angle between two vectors: 1) the edge vector and 2) the
  // vector of the first vertex of the edge. If all of the angles are the same
  // sign (which is negative since they will be counter-clockwise) then the
  // point is inside the polygon; otherwise, the point is outside.
  for (i = 0, len = polyVerts.length; i < len; i++) {
    v1 = Vec2.nsub(polyVerts[i], point)
    v2 = Vec2.nsub(polyVerts[i+1 > len-1 ? 0 : i+1], point)
    edge = Vec2.nsub(v1, v2)
    // Note that we could also do this by using the normal + dot product
    x = Vec2.perpdot(edge, v1)
    // If the point lies directly on an edge then count it as in the polygon
    if (x < 0) { return false }
  }
  return true
}
