/// <reference path="./gouraud.ts" />
var ZbufferConstante = /** @class */ (function () {
    function ZbufferConstante(width, height) {
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
    }
    ZbufferConstante.prototype.rasterizePolygon = function (face) {
        this.Scanline([face]);
    };
    ZbufferConstante.prototype.Scanline = function (faces) {
        //  console.log("Faces -> ", faces);
        for (var _i = 0, faces_1 = faces; _i < faces_1.length; _i++) {
            var face = faces_1[_i];
            for (var i = 0; i < face.dots.length; i++) {
                // console.log("Pontos ", face.dots[i]);
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
                // console.log("Start -> ", start, "End -> ", end);
                var real_start_z = Dx = end.x - start.x;
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
                //const rgb1 = this.extractRGB(start.color);
                // console.log("Start -> ", start_y, "End -> ", end_y);
                for (var y = start_y; y <= end_y; y++) {
                    // Adiciona ao HashMap de scanlines
                    this.updateHash(y, x, z, face.color);
                    // if(i == 2 && next_i == 3){
                    // console.log("Ate aqui vai ", y, "  HASH -> ", this.scanline)
                    // }
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
        //console.log(new_R, new_G, new_B);
        var novoPonto = new Dot(x, y, z, color);
        listaDePontos.push(novoPonto);
    };
    ZbufferConstante.prototype.ZbufferConstante = function () {
        // console.log("Scanline -> ", this.scanline);
        var _this = this;
        this.scanline.forEach(function (points, y) {
            points = points.sort(function (a, b) { return a.x - b.x; });
            // console.log("depois", points);
            //console.log(points.length);
            for (var i = 0; i < points.length - 1; i += 2) {
                var next_i = (i + 1) % (points.length);
                if ((Math.floor(points[next_i].x) - Math.ceil(points[i].x)) > 0) {
                    // const next_i = i+1;
                    //console.log(`L: ${face.dots.length}  I: ${i}  Next: ${next_i}` );
                    var z1 = points[i].z;
                    var z2 = points[next_i].z;
                    //console.log(points[i].x, points[i+1].x, points[i].z, points[i+1].z);
                    var dz = (z2 - z1) / (points[next_i].x - points[i].x);
                    // console.log(dz);
                    //console.log(dR, dG, dB);
                    var x1 = Math.ceil(points[i].x);
                    var x2 = Math.ceil(points[next_i].x);
                    var start = x1, end = x2;
                    var dx = points[i].x - x1;
                    // let dx = points[i].x - x1;
                    z1 += dx * dz;
                    for (var x = start; x <= end; x++) {
                        //console.log(z1, x, y, points[i].color);
                        _this.AtualizaBufferConstante(z1, x, Math.round(y), points[i].color);
                        //console.log(points[i].r_gouraud, points[i].g_gouraud, points[i].b_gouraud);
                        z1 += dz;
                    }
                }
                // else {
                //     this.AtualizaBufferConstante(points[i].z, points[i].x, y, "green");
                // }
            }
        });
    };
    ZbufferConstante.prototype.AtualizaBufferConstante = function (constant_z, x, y, color) {
        if (constant_z < this.depthBuffer[y][x]) {
            console.log("Constant_z -> ", constant_z);
            this.depthBuffer[y][x] = constant_z;
            //console.log(this.depthBuffer[y][x]);
            //console.log(this.colorBuffer[y][x]);
            this.colorBuffer[y][x] = color;
            //console.log(this.depthBuffer);
        }
    };
    return ZbufferConstante;
}());
