/// <reference path="recortephong.ts" />
var ZbufferConstante = /** @class */ (function () {
    function ZbufferConstante(width, height) {
        this.width = width;
        this.height = height;
        this.scanline = new Map(); // Inicializa o HashMap
        this.depthBuffer = Array.from({ length: height + 10 }, function () { return Array(width + 10).fill(-100000000); });
        this.colorBuffer = Array.from({ length: height + 10 }, function () { return Array(width + 10).fill('#000000'); });
        for (var i = 0; i < height + 10; i++) {
            for (var j = 0; j < width + 10; j++) {
                this.depthBuffer[i][j] = -100000000;
                this.colorBuffer[i][j] = '#000000';
            }
        }
        ;
    }
    ZbufferConstante.prototype.rasterizePolygon = function (face) {
        this.Scanline([face]);
    };
    ZbufferConstante.prototype.Scanline = function (faces) {
        this.scanline = new Map();
        for (var _i = 0, faces_1 = faces; _i < faces_1.length; _i++) {
            var face = faces_1[_i];
            for (var i = 0; i < face.dots.length; i++) {
                var Dx = void 0, Dy = void 0, Dz = void 0, Tx = void 0, Tz = void 0;
                var next_i = (i + 1) % face.dots.length;
                if (face.dots[i].y === face.dots[next_i].y) {
                    continue;
                }
                var start = void 0, end = void 0;
                if (face.dots[i].y < face.dots[next_i].y) {
                    start = face.dots[i];
                    end = face.dots[next_i];
                }
                else {
                    start = face.dots[next_i];
                    end = face.dots[i];
                }
                Dx = end.x - start.x;
                Dy = end.y - start.y;
                Dz = end.z - start.z;
                Tx = Dx / Dy;
                Tz = Dz / Dy;
                var start_y = void 0;
                var end_y = void 0;
                if (face.dots[i].y < face.dots[next_i].y) {
                    start_y = Math.ceil(face.dots[i].y);
                    end_y = Math.floor(face.dots[next_i].y);
                }
                else {
                    start_y = Math.ceil(face.dots[next_i].y);
                    end_y = Math.floor(face.dots[i].y);
                }
                var x = Math.round(start.x);
                var z = start.z;
                for (var y = start_y; y <= end_y; y++) {
                    this.updateHash(y, x, z, face.color);
                    x += Tx;
                    z += Tz;
                }
            }
        }
    };
    ZbufferConstante.prototype.updateHash = function (y, x, z, color) {
        if (!this.scanline.has(y)) {
            this.scanline.set(y, []);
        }
        var listaDePontos = this.scanline.get(y);
        var novoPonto = new Dot(x, y, z, color);
        listaDePontos.push(novoPonto);
    };
    ZbufferConstante.prototype.ZbufferConstante = function () {
        var _this = this;
        this.scanline.forEach(function (points, y) {
            points = points.sort(function (a, b) { return a.x - b.x; });
            for (var i = 0; i < points.length - 1; i += 2) {
                var next_i = (i + 1) % (points.length);
                if ((Math.floor(points[next_i].x) - Math.ceil(points[i].x)) > 0) {
                    var z1 = points[i].z;
                    var z2 = points[next_i].z;
                    var dz = (z2 - z1) / (points[next_i].x - points[i].x);
                    var x1 = Math.ceil(points[i].x);
                    var x2 = Math.ceil(points[next_i].x);
                    var start = x1, end = x2;
                    var dx = points[i].x - x1;
                    z1 += dx * dz;
                    for (var x = start; x <= end; x++) {
                        _this.AtualizaBufferConstante(z1, x, Math.round(y), points[i].color);
                        z1 += dz;
                    }
                }
            }
        });
    };
    ZbufferConstante.prototype.AtualizaBufferConstante = function (constant_z, x, y, color) {
        if (constant_z > this.depthBuffer[y][x]) {
            this.depthBuffer[y][x] = constant_z;
            this.colorBuffer[y][x] = color;
        }
    };
    return ZbufferConstante;
}());
