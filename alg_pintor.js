function VetA_minus_VetB(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}
function prod_vet(a, b) {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x
    };
}
function prod_escalar(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}
function get_unitary_vector(v) {
    var magnitude = Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) + Math.pow(v.z, 2));
    return { x: v.x / magnitude, y: v.y / magnitude, z: v.z / magnitude };
}
function face_visibility(vertices, VRP, centroide) {
    var A = VetA_minus_VetB(vertices[0], vertices[1]);
    var B = VetA_minus_VetB(vertices[2], vertices[1]);
    var N = get_unitary_vector(prod_vet(B, A));
    var O = get_unitary_vector(VetA_minus_VetB(VRP, centroide));
    return prod_escalar(O, N) > 0;
}
function calc_distance(centroide, VRP) {
    return Math.sqrt(Math.pow((VRP.x - centroide.x), 2) +
        Math.pow((VRP.y - centroide.y), 2) +
        Math.pow((VRP.z - centroide.z), 2));
}
var Poly = /** @class */ (function () {
    function Poly() {
        this.points = [];
        this.color = "rgb(0, 0, 0)";
        this.arestas = [];
        this.inters = [];
        this.arestac = 0;
    }
    Poly.prototype.addPoint = function (x, y, z) {
        if (z === void 0) { z = 0; }
        this.points.push({ x: x, y: y, z: z });
    };
    Poly.prototype.containsPoint = function (x, y) {
        var inside = false;
        var j = this.points.length - 1;
        for (var i = 0; i < this.points.length; i++) {
            var xi = this.points[i].x, yi = this.points[i].y;
            var xj = this.points[j].x, yj = this.points[j].y;
            var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect)
                inside = !inside;
            j = i;
        }
        return inside;
    };
    Poly.prototype.addAresta = function (x1, y1, x2, y2) {
        this.arestas.push({ x1: x1, y1: y1, x2: x2, y2: y2 });
    };
    Poly.prototype.cria_arestas = function () {
        var _this = this;
        this.points.forEach(function (point, i) {
            var nextPoint = _this.points[(i + 1) % _this.points.length];
            _this.addAresta(point.x, point.y, nextPoint.x, nextPoint.y);
        });
    };
    Poly.prototype.swap_arestas = function (i) {
        var _a, _b;
        _a = [this.arestas[i].x2, this.arestas[i].x1], this.arestas[i].x1 = _a[0], this.arestas[i].x2 = _a[1];
        _b = [this.arestas[i].y2, this.arestas[i].y1], this.arestas[i].y1 = _b[0], this.arestas[i].y2 = _b[1];
    };
    Poly.prototype.draw = function (line, y, context, color) {
        context.fillStyle = color;
        for (var i = 0; i < line.length; i += 2) {
            var x1 = Math.ceil(line[i]);
            var x2 = Math.floor(line[i + 1]);
            for (var x = x1; x <= x2; x++) {
                context.fillRect(x, y, 1, 1);
            }
        }
    };
    Poly.prototype.fillpoly = function (ctx, VRP, centroide) {
        var _this = this;
        var color = this.color;
        var ymin = Math.min.apply(Math, this.points.map(function (p) { return p.y; }));
        var ymax = Math.max.apply(Math, this.points.map(function (p) { return p.y; }));
        this.inters = Array.from({ length: ymax - ymin + 1 }, function () { return []; });
        this.arestas.forEach(function (aresta, i) {
            if (aresta.y1 === aresta.y2)
                return;
            if (aresta.y1 > aresta.y2)
                _this.swap_arestas(i);
            var _a = _this.arestas[i], x1 = _a.x1, y1 = _a.y1, x2 = _a.x2, y2 = _a.y2;
            var coeficiente = (x2 - x1) / (y2 - y1);
            var x = x1;
            var index = Math.floor(y1 - ymin);
            for (var y = y1; y < y2; y++) {
                _this.inters[index++].push(x);
                x += coeficiente;
            }
        });
        this.inters.forEach(function (line, i) {
            line.sort(function (a, b) { return a - b; });
            _this.draw(line, ymin + i, ctx, color);
        });
    };
    return Poly;
}());
