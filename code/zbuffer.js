/// <reference path="recorte.ts" />
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
var ZbufferGouraud = /** @class */ (function () {
    function ZbufferGouraud(width, height) {
        this.width = width;
        this.height = height;
        this.scanline = new Map();
        this.depthBuffer = Array.from({ length: height + 10 }, function () { return Array(width + 10).fill(-100000000); });
        this.colorBuffer = Array.from({ length: height + 10 }, function () { return Array(width + 10).fill('#000000'); });
        for (var i = 0; i < height + 10; i++) {
            for (var j = 0; j < width + 10; j++) {
                this.depthBuffer[i][j] = -1000000;
                this.colorBuffer[i][j] = '#000000';
            }
        }
        ;
    }
    ZbufferGouraud.prototype.rasterizePolygon = function (face) {
        this.Scanline([face]);
    };
    ZbufferGouraud.prototype.Scanline = function (faces) {
        this.scanline = new Map();
        for (var _i = 0, faces_2 = faces; _i < faces_2.length; _i++) {
            var face = faces_2[_i];
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
                    var dz = (z2 - z1) / (points[next_i].x - points[i].x);
                    var dR = (points[next_i].r_gouraud - points[i].r_gouraud) / (points[next_i].x - points[i].x);
                    var dG = (points[next_i].g_gouraud - points[i].g_gouraud) / (points[next_i].x - points[i].x);
                    var dB = (points[next_i].b_gouraud - points[i].b_gouraud) / (points[next_i].x - points[i].x);
                    var x1 = Math.ceil(points[i].x);
                    var x2 = Math.ceil(points[next_i].x);
                    var R = points[i].r_gouraud;
                    var G = points[i].g_gouraud;
                    var B = points[i].b_gouraud;
                    var start = x1, end = x2;
                    if (x1 > x2) {
                        start = x2;
                        end = x1;
                    }
                    var dx = points[i].x - x1;
                    z1 += dx * dz;
                    for (var x = start; x <= end; x++) {
                        _this.AtualizaBufferGourand(z1, R, G, B, x, Math.round(y));
                        z1 += dz;
                        R += dR;
                        G += dG;
                        B += dB;
                    }
                }
            }
        });
    };
    ZbufferGouraud.prototype.AtualizaBufferGourand = function (constant_z, new_R, new_G, new_B, x, y) {
        if (constant_z > this.depthBuffer[y][x]) {
            this.depthBuffer[y][x] = constant_z;
            this.colorBuffer[y][x] = "rgb(".concat(new_R, ", ").concat(new_G, ", ").concat(new_B, ")");
        }
    };
    return ZbufferGouraud;
}());
function get_ilum(vrp, lamp, vet_normal, centroide, amb_light_par, ks, kd, n) {
    var amb_light = amb_light_par;
    var aux_x = lamp.pos.x - centroide.x;
    var aux_y = lamp.pos.y - centroide.y;
    var aux_z = lamp.pos.z - centroide.z;
    var test_vis = new Vet(centroide.x - vrp.x, centroide.y - vrp.y, centroide.z - vrp.z);
    if (prod_escalar(vet_normal.unitary, test_vis.unitary) < 0) {
        vet_normal = new Vet(-vet_normal.x, -vet_normal.y, -vet_normal.z);
    }
    var vet_LampMinusCent = new Vet(aux_x, aux_y, aux_z);
    vet_LampMinusCent.print_obj("Lamp - Centroide");
    var UN_times_UL = prod_escalar(vet_LampMinusCent.unitary, vet_normal.unitary);
    console.log("vet_normal = ", vet_normal.unitary);
    if (UN_times_UL > 0) {
        var ilum_difusa = lamp.il * kd * UN_times_UL;
        aux_x = 2 * UN_times_UL * vet_normal.unitary.x - vet_LampMinusCent.unitary.x;
        aux_y = 2 * UN_times_UL * vet_normal.unitary.y - vet_LampMinusCent.unitary.y;
        aux_z = 2 * UN_times_UL * vet_normal.unitary.z - vet_LampMinusCent.unitary.z;
        var idk_r = new Vet(aux_x, aux_y, aux_z);
        aux_x = vrp.x - centroide.x;
        aux_y = vrp.y - centroide.y;
        aux_z = vrp.z - centroide.z;
        var direcao_observ = new Vet(aux_x, aux_y, aux_z);
        var r_escalar_dir_obs = prod_escalar(idk_r.unitary, direcao_observ.unitary);
        if (r_escalar_dir_obs > 0) {
            var is = lamp.il * ks * Math.pow(r_escalar_dir_obs, n);
            var result = Math.round(amb_light + ilum_difusa + is);
            return result.toString(10);
        }
        else {
            var result = Math.round(amb_light + ilum_difusa);
            return result.toString(10);
        }
    }
    else {
        return amb_light.toString(10);
    }
}
var ZbufferPhong = /** @class */ (function () {
    function ZbufferPhong(width, height, vrp, lamp) {
        this.width = width;
        this.height = height;
        this.scanline = new Map();
        this.depthBuffer = Array.from({ length: height + 10 }, function () { return Array(width + 10).fill(-100000000); });
        this.colorBuffer = Array.from({ length: height + 10 }, function () { return Array(width + 10).fill('#000000'); });
        this.vrp = vrp;
        this.lamp = lamp;
        for (var i = 0; i < height + 10; i++) {
            for (var j = 0; j < width + 10; j++) {
                this.depthBuffer[i][j] = -1000000;
                this.colorBuffer[i][j] = '#000000';
            }
        }
        ;
    }
    ZbufferPhong.prototype.rasterizePolygon = function (face) {
        this.Scanline([face]);
    };
    ZbufferPhong.prototype.Scanline = function (faces) {
        this.scanline = new Map();
        for (var _i = 0, faces_3 = faces; _i < faces_3.length; _i++) {
            var face = faces_3[_i];
            for (var i = 0; i < face.dots.length; i++) {
                var Dx = void 0, Dy = void 0, Dz = void 0, Di = void 0, Dj = void 0, Dk = void 0, Tx = void 0, Tz = void 0, Ti = void 0, Tj = void 0, Tk = void 0;
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
                Di = end.x_phong - start.x_phong;
                Dj = end.y_phong - start.y_phong;
                Dk = end.z_phong - start.z_phong;
                Tx = Dx / Dy;
                Tz = Dz / Dy;
                Ti = Di / Dy;
                Tj = Dj / Dy;
                Tk = Dk / Dy;
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
                var i_phong = start.x_phong;
                var j_phong = start.y_phong;
                var k_phong = start.z_phong;
                for (var y = start_y; y <= end_y; y++) {
                    this.updateHash(y, x, z, i_phong, j_phong, k_phong);
                    x += Tx;
                    z += Tz;
                    i_phong += Ti;
                    j_phong += Tj;
                    k_phong += Tk;
                }
            }
        }
    };
    ZbufferPhong.prototype.updateHash = function (y, x, z, i_phong, j_phong, k_phong) {
        if (!this.scanline.has(y)) {
            this.scanline.set(y, []);
        }
        var listaDePontos = this.scanline.get(y);
        var novoPonto = new Dot(x, y, z, "rgb(".concat(0, ", ").concat(0, ", ").concat(0, ")"), 0, 0, 0, i_phong, j_phong, k_phong);
        listaDePontos.push(novoPonto);
    };
    ZbufferPhong.prototype.ZbufferPhong = function (amb_light, ks, kd, n, face_sru) {
        var _this = this;
        this.scanline.forEach(function (points, y) {
            points = points.sort(function (a, b) { return a.x - b.x; });
            for (var i = 0; i < points.length - 1; i += 2) {
                var next_i = (i + 1) % (points.length);
                if ((Math.floor(points[next_i].x) - Math.ceil(points[i].x)) > 0) {
                    var z1 = points[i].z;
                    var z2 = points[next_i].z;
                    var i_phong = points[i].x_phong;
                    var j_phong = points[i].y_phong;
                    var k_phong = points[i].z_phong;
                    var i_phong2 = points[next_i].x_phong;
                    var j_phong2 = points[next_i].y_phong;
                    var k_phong2 = points[next_i].z_phong;
                    var dz = (z2 - z1) / (points[next_i].x - points[i].x);
                    var di = (i_phong2 - i_phong) / (points[next_i].x - points[i].x);
                    var dj = (j_phong2 - j_phong) / (points[next_i].x - points[i].x);
                    var dk = (k_phong2 - k_phong) / (points[next_i].x - points[i].x);
                    var x1 = Math.ceil(points[i].x);
                    var x2 = Math.ceil(points[next_i].x);
                    var new_i = points[i].x_phong;
                    var new_j = points[i].y_phong;
                    var new_k = points[i].z_phong;
                    var start = x1, end = x2;
                    if (x1 > x2) {
                        start = x2;
                        end = x1;
                    }
                    var dx = points[i].x - x1;
                    z1 += dx * dz;
                    for (var x = start; x <= end; x++) {
                        _this.AtualizaBufferGourand(z1, new_i, new_j, new_k, x, Math.round(y), amb_light, ks, kd, n, face_sru);
                        z1 += dz;
                        new_i += di;
                        new_j += dj;
                        new_k += dk;
                    }
                }
            }
        });
    };
    ZbufferPhong.prototype.AtualizaBufferGourand = function (constant_z, i_phong, j_phong, k_phong, x, y, amb_light, ks, kd, n, face_sru) {
        if (constant_z > this.depthBuffer[y][x]) {
            this.depthBuffer[y][x] = constant_z;
            var r_phong = get_ilum(this.vrp, this.lamp, new Vet(i_phong, j_phong, k_phong), new Dot(x, y, constant_z), amb_light[0], ks[0], kd[0], n[0]);
            var g_phong = get_ilum(this.vrp, this.lamp, new Vet(i_phong, j_phong, k_phong), new Dot(x, y, constant_z), amb_light[1], ks[1], kd[1], n[1]);
            var b_phong = get_ilum(this.vrp, this.lamp, new Vet(i_phong, j_phong, k_phong), new Dot(x, y, constant_z), amb_light[2], ks[2], kd[2], n[2]);
            this.colorBuffer[y][x] = "rgb(".concat(r_phong, ", ").concat(g_phong, ", ").concat(b_phong, ")");
        }
    };
    return ZbufferPhong;
}());
