/// <reference path="./gouraud.ts" />
var ZbufferGouraud = /** @class */ (function () {
    function ZbufferGouraud(width, height) {
        this.width = width;
        this.height = height;
        this.scanline = new Map(); // Inicializa o HashMap
        this.depthBuffer = Array.from({ length: height }, function () { return Array(width).fill(100000000); });
        this.colorBuffer = Array.from({ length: height }, function () { return Array(width).fill('#000000'); });
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                this.depthBuffer[i][j] = 1000000;
                this.colorBuffer[i][j] = '#000000';
            }
        }
        ;
        // console.log("")
    }
    ZbufferGouraud.prototype.rasterizePolygon = function (face) {
        this.Scanline([face]);
    };
    ZbufferGouraud.prototype.Scanline = function (faces) {
        //console.log("Faces -> ", faces);
        for (var _i = 0, faces_1 = faces; _i < faces_1.length; _i++) {
            var face = faces_1[_i];
            for (var i = 0; i < face.dots.length; i++) {
                var Dx = void 0, Dy = void 0, Dz = void 0, Dr = void 0, Db = void 0, Dg = void 0, Tx = void 0, Tz = void 0, Tr = void 0, Tg = void 0, Tb = void 0;
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
                Dr = end.r_gouraud - start.r_gouraud;
                Dg = end.g_gouraud - start.g_gouraud;
                Db = end.b_gouraud - start.b_gouraud;
                Tx = Dx / Dy;
                Tz = Dz / Dy;
                Tr = Dr / Dy;
                Tg = Dg / Dy;
                Tb = Db / Dy;
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
                var r = start.r_gouraud;
                var g = start.g_gouraud;
                var b = start.b_gouraud;
                for (var y = start_y; y <= end_y; y++) {
                    this.updateHash(y, x, z, r, g, b);
                    x += Tx;
                    z += Tz;
                    r += Tr;
                    g += Tg;
                    b += Tb;
                }
            }
        }
    };
    ZbufferGouraud.prototype.updateHash = function (y, x, z, new_R, new_G, new_B) {
        if (!this.scanline.has(y)) {
            this.scanline.set(y, []);
        }
        var listaDePontos = this.scanline.get(y);
        var novoPonto = new Dot(x, y, z, "rgb(".concat(0, ", ").concat(0, ", ").concat(0, ")"), new_R, new_G, new_B);
        listaDePontos.push(novoPonto);
    };
    ZbufferGouraud.prototype.ZbufferGourand = function () {
        var _this = this;
        this.scanline.forEach(function (points, y) {
            points = points.sort(function (a, b) { return a.x - b.x; });
            for (var i = 0; i < points.length - 1; i += 2) {
                var next_i = (i + 1) % (points.length);
                if ((Math.floor(points[next_i].x) - Math.ceil(points[i].x)) > 0) {
                    var z1 = points[i].z;
                    var z2 = points[next_i].z;
                    // if(points[i].x > points[next_i].x){
                    //     z1 = points[next_i].z;
                    //     z2 = points[i].z;
                    // }
                    //console.log(points[i].x, points[i+1].x, points[i].z, points[i+1].z);
                    var dz = (z2 - z1) / (points[next_i].x - points[i].x);
                    // console.log(dz);
                    var dR = (points[next_i].r_gouraud - points[i].r_gouraud) / (points[next_i].x - points[i].x);
                    var dG = (points[next_i].g_gouraud - points[i].g_gouraud) / (points[next_i].x - points[i].x);
                    var dB = (points[next_i].b_gouraud - points[i].b_gouraud) / (points[next_i].x - points[i].x);
                    //console.log(dR, dG, dB);
                    var x1 = Math.ceil(points[i].x);
                    var x2 = Math.ceil(points[next_i].x);
                    var R = points[i].r_gouraud;
                    var G = points[i].g_gouraud;
                    var B = points[i].b_gouraud;
                    var start = x1, end = x2;
                    if (x1 > x2) {
                        start = x2;
                        end = x1;
                        console.log("Invertido ", x1, "  >   ", x2); // NUNCA DEVE SER PRINTADO
                        // points.sort((a, b) => a.x - b.x);
                    }
                    var dx = points[i].x - x1;
                    z1 += dx * dz;
                    for (var x = start; x <= end; x++) {
                        // console.log(`x = ${x}   y = ${y}`)
                        _this.AtualizaBufferGourand(z1, points[i].r_gouraud, points[i].g_gouraud, points[i].b_gouraud, x, Math.round(y));
                        //console.log(points[new_i].r_gouraud, points[new_i].g_gouraud, points[new_i].b_gouraud);
                        z1 += dz;
                        R += dR;
                        G += dG;
                        B += dB;
                    }
                }
            }
        });
        //console.log(this.depthBuffer[0][150]);
        //console.log(this.scanline);
    };
    ZbufferGouraud.prototype.AtualizaBufferGourand = function (constant_z, new_R, new_G, new_B, x, y) {
        //console.log("tamanho", this.depthBuffer.length, this.depthBuffer[0].length);
        if (constant_z < this.depthBuffer[y][x]) {
            this.depthBuffer[y][x] = constant_z;
            //console.log(this.depthBuffer[y][x]);
            this.colorBuffer[y][x] = "rgb(".concat(new_R, ", ").concat(new_G, ", ").concat(new_B, ")");
            //console.log(this.depthBuffer);
        }
    };
    return ZbufferGouraud;
}());
