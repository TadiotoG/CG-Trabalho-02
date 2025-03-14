/// <reference path="./gouraud.ts" />
var ZBuffer = /** @class */ (function () {
    function ZBuffer(width, height) {
        this.width = width;
        this.height = height;
        this.depthBuffer = Array.from({ length: height }, function () { return Array(width).fill(Infinity); });
        this.colorBuffer = Array.from({ length: height }, function () { return Array(width).fill('#FFFFFF'); });
        this.scanline = new Map(); // Inicializa o HashMap
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                this.depthBuffer[i][j] = 100000;
            }
        }
        ;
    }
    ZBuffer.prototype.rasterizePolygon = function (face) {
        this.Scanline([face]);
    };
    ZBuffer.prototype.Scanline = function (faces) {
        for (var _i = 0, faces_1 = faces; _i < faces_1.length; _i++) {
            var face = faces_1[_i];
            for (var i = 0; i < face.dots.length; i++) {
                var next_i = (i + 1) % face.dots.length;
                if (face.dots[i].y === face.dots[next_i].y) {
                    continue;
                }
                face.dots[i].x = Math.round(face.dots[i].x);
                face.dots[i].y = Math.round(face.dots[i].y);
                var start = face.dots[i].y < face.dots[next_i].y ? face.dots[i] : face.dots[next_i];
                var end = face.dots[i].y < face.dots[next_i].y ? face.dots[next_i] : face.dots[i];
                var Dx = end.x - start.x;
                var Dy = end.y - start.y;
                var Dz = end.z - start.z;
                var Tx = Dx / Dy;
                var Tz = Dz / Dy;
                var x = start.x;
                var z = start.z;
                for (var y = start.y; y < end.y; y++) {
                    // Adiciona ao HashMap de scanlines
                    this.updateHash(y, x, z, start.color); // NAO TEM CALCULO DE COR NENHUM AQUI 
                    x += Tx;
                    z += Tz;
                }
            }
        }
    };
    ZBuffer.prototype.updateHash = function (y, x, z, color) {
        if (!this.scanline.has(y)) {
            // Se 'y' não existe no HashMap, criamos uma nova lista vazia
            this.scanline.set(y, []);
        }
        var listaDePontos = this.scanline.get(y);
        var novoPonto = new Dot(x, y, z, color);
        listaDePontos.push(novoPonto);
    };
    ZBuffer.prototype.Zbuffer = function () {
        var _this = this;
        console.log("Scanlines 01 -> ", this.scanline);
        this.scanline.forEach(function (points, y) {
            //console.log(`Y = ${y}:`);
            points.sort(function (a, b) { return a.x - b.x; }); // Ordena pela coordenada x
            // Após a ordenação, podemos atualizar o scanline
            _this.scanline.set(y, points);
        });
        // console.log("Scanlines -> ", this.scanline)
        this.scanline.forEach(function (points, y) {
            for (var i = 0; i < points.length - 1; i += 2) {
                var x1 = Math.ceil(points[i].x);
                var x2 = Math.floor(points[i + 1].x);
                var z1 = points[i].z;
                var z2 = points[i + 1].z;
                var R = points[i].r_gouraud;
                var G = points[i].g_gouraud;
                var B = points[i].b_gouraud;
                var dz = (z2 - z1) / (x2 - x1);
                var dR = (points[i + 1].r_gouraud - points[i].r_gouraud) / (x2 - x1);
                var dG = (points[i + 1].g_gouraud - points[i].g_gouraud) / (x2 - x1);
                var dB = (points[i + 1].b_gouraud - points[i].b_gouraud) / (x2 - x1);
                for (var x = x1; x <= x2; x++) {
                    // console.log("z1 -> ", z1)
                    _this.AtualizaBuffer(z1, points[i].r_gouraud, points[i].g_gouraud, points[i].b_gouraud, Number(x), Number(y));
                    z1 += dz;
                    R += dR;
                    G += dG;
                    B += dB;
                }
            }
        });
        //console.log(this.scanline);
    };
    ZBuffer.prototype.AtualizaBuffer = function (constant_z, new_R, new_G, new_B, x, y) {
        // console.log("this.depthBuffer -> ", this.depthBuffer)
        // console.log("this.colorBuffer -> ", this.colorBuffer)
        // console.log("width -> ", this.width)
        // console.log("height -> ", this.height)
        // console.log("this.depthBuffer.length -> ", this.depthBuffer.length)
        // console.log("this.depthBuffer.length[0] -> ", this.depthBuffer[0].length)
        // console.log("Y -> ", typeof(y))
        // console.log("X -> ", typeof(x))
        // console.log("z1 -> ", constant_z, "    this.depthBuffer[y][x] -> ", this.depthBuffer[y][x])
        if (constant_z < this.depthBuffer[y][x]) {
            this.depthBuffer[y][x] = constant_z;
            this.colorBuffer[y][x] = "rgb(".concat(new_R, ", ").concat(new_G, ", ").concat(new_B, ")");
            console.log("Chega aqui?" + "rgb(".concat(new_R, ", ").concat(new_G, ", ").concat(new_B, ")"));
        }
    };
    return ZBuffer;
}());
