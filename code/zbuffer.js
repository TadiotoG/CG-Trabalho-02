"use strict";
exports.__esModule = true;
/// <reference path= "./spline.ts" />
var fs = require("fs");
var ZBuffer = /** @class */ (function () {
    function ZBuffer(width, height) {
        this.width = width;
        this.height = height;
        this.depthBuffer = Array.from({ length: height }, function () { return Array(width).fill(Infinity); });
        this.colorBuffer = Array.from({ length: height }, function () { return Array(width).fill('#000000'); }); // Default background color
    }
    ZBuffer.prototype.initializeBuffers = function () {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                this.depthBuffer[y][x] = Infinity;
                this.colorBuffer[y][x] = '#000000'; // Default background color
            }
        }
    };
    ZBuffer.prototype.updateBuffer = function (x, y, z, color) {
        if (z < this.depthBuffer[y][x]) {
            this.depthBuffer[y][x] = z;
            this.colorBuffer[y][x] = color;
        }
    };
    ZBuffer.prototype.render = function (faces) {
        this.initializeBuffers();
        for (var _i = 0, faces_1 = faces; _i < faces_1.length; _i++) {
            var face = faces_1[_i];
            this.rasterizePolygon(face);
        }
    };
    ZBuffer.prototype.rasterizePolygon = function (face) {
        var pontos = face.dots;
        var edges = [];
        var activeEdges = [];
        for (var i = 0; i < pontos.length; i++) {
            if (i + 1 < pontos.length) {
                edges.push(new Aresta(pontos[i], pontos[i + 1]));
            }
            else {
                edges.push(new Aresta(pontos[i], pontos[0]));
            }
        }
        // Find ymin and ymax of the face
        var ymin = Infinity;
        var ymax = -Infinity;
        for (var _i = 0, _a = face.dots; _i < _a.length; _i++) {
            var vertex = _a[_i];
            if (vertex.y < ymin)
                ymin = vertex.y;
            if (vertex.y > ymax)
                ymax = vertex.y;
        }
        var logFile = 'scanline_log.txt';
        var logStream = fs.createWriteStream(logFile, { flags: 'a' });
        var _loop_1 = function (y) {
            var _b, _c;
            // Update active edges
            activeEdges.length = 0;
            for (var _d = 0, edges_1 = edges; _d < edges_1.length; _d++) {
                var edge = edges_1[_d];
                if ((edge.p1.y <= y && edge.p2.y > y) || (edge.p2.y <= y && edge.p1.y > y)) {
                    activeEdges.push(edge);
                }
            }
            // Sort active edges by x
            activeEdges.sort(function (a, b) { return a.p1.x + a.tx * (y - a.p1.y) - (b.p1.x + b.tx * (y - b.p1.y)); });
            // Fill pixels between pairs of intersections
            for (var i = 0; i < activeEdges.length; i += 2) {
                var edge1 = activeEdges[i];
                var edge2 = activeEdges[i + 1];
                var x1 = edge1.p1.x + edge1.tx * (y - edge1.p1.y);
                var z1 = edge1.p1.z + edge1.tz * (y - edge1.p1.y);
                var x2 = edge2.p1.x + edge2.tx * (y - edge2.p1.y);
                var z2 = edge2.p1.z + edge2.tz * (y - edge2.p1.y);
                if (x1 > x2) {
                    _b = [x2, x1], x1 = _b[0], x2 = _b[1];
                    _c = [z2, z1], z1 = _c[0], z2 = _c[1];
                }
                // Log the values for each scanline
                var tz = (x2 - x1 === 0) ? 0 : ((z2 - z1) / (x2 - x1)).toFixed(6);
                logStream.write("Scanline: ".concat(y, ", Edge1: (").concat(x1.toFixed(3), ", ").concat(z1.toFixed(3), "), Edge2: (").concat(x2.toFixed(3), ", ").concat(z2.toFixed(3), "), Xi: ").concat(Math.ceil(x1), ", Xf: ").concat(Math.floor(x2), ", Tz: ").concat(tz, "\n"));
                for (var x = Math.ceil(x1); x <= Math.floor(x2); x++) {
                    var t = (x - x1) / (x2 - x1);
                    var z = z1 + t * (z2 - z1);
                    this_1.updateBuffer(x, y, z, face.color);
                }
            }
        };
        var this_1 = this;
        // Process each scanline from ymin to ymax
        for (var y = ymin; y <= ymax; y++) {
            _loop_1(y);
        }
        logStream.end();
    };
    return ZBuffer;
}());
// Example usage
function createTestPolygons() {
    // Crie alguns polígonos de teste
    var polygons = [
        new Face([
            new Dot(85, 192, -32.570),
            new Dot(93, 251, -22.807),
            new Dot(125, 107, -21.815)
        ])
    ];
    return polygons;
}
function main() {
    var width = 400;
    var height = 300;
    var zBuffer = new ZBuffer(width, height);
    var polygons = createTestPolygons();
    zBuffer.render(polygons);
    console.log('Rendering complete. Check the scanline_log.txt file for details.');
}
main();
