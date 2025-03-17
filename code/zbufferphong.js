/// <reference path="./zbuffergouraud.ts" />
function get_ilum(vrp, lamp, vet_normal, centroide, amb_light_par, ks, kd, n) {
    var amb_light = amb_light_par;
    // console.log("Qual valor nao chega");
    amb_light_par = Number(amb_light_par);
    ks = Number(ks);
    kd = Number(kd);
    n = Number(n);
    lamp.il = Number(lamp.il);
    lamp.pos.x = Number(lamp.pos.x);
    lamp.pos.y = Number(lamp.pos.y);
    lamp.pos.z = Number(lamp.pos.z);
    var aux_x = lamp.pos.x - centroide.x;
    var aux_y = lamp.pos.y - centroide.y;
    var aux_z = lamp.pos.z - centroide.z;
    var test_vis = new Vet(centroide.x - vrp.x, centroide.y - vrp.y, centroide.z - vrp.z);
    if (prod_escalar(vet_normal.unitary, test_vis.unitary) < 0) {
        vet_normal = new Vet(-vet_normal.x, -vet_normal.y, -vet_normal.z);
    }
    var vet_LampMinusCent = new Vet(aux_x, aux_y, aux_z);
    var UN_times_UL = prod_escalar(vet_LampMinusCent.unitary, vet_normal.unitary);
    if (UN_times_UL > 0) {
        var ilum_difusa = lamp.il * kd * UN_times_UL;
        aux_x = 2 * UN_times_UL * vet_normal.unitary.x - vet_LampMinusCent.unitary.x;
        aux_y = 2 * UN_times_UL * vet_normal.unitary.y - vet_LampMinusCent.unitary.y;
        aux_z = 2 * UN_times_UL * vet_normal.unitary.z - vet_LampMinusCent.unitary.z;
        var idk_r = new Vet(aux_x, aux_y, aux_z);
        // idk_r.print_obj("Vet r")
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
        this.scanline = new Map(); // Inicializa o HashMap
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
        // console.log("")
    }
    // function get_ilum(vrp: Dot, lamp: Lamp, vet_normal: Vet, centroide: Dot, amb_light_par: number, ks: number, kd: number, n: number){
    ZbufferPhong.prototype.rasterizePolygon = function (double_face) {
        this.Scanline([double_face]);
    };
    ZbufferPhong.prototype.Scanline = function (dfaces) {
        this.scanline = new Map();
        //console.log("Faces -> ", faces);
        for (var _i = 0, dfaces_1 = dfaces; _i < dfaces_1.length; _i++) {
            var double_face = dfaces_1[_i];
            // console.log("Double face -> ", double_face)
            var face = double_face.face;
            var face_SRU = double_face.face_SRU;
            for (var i = 0; i < face.dots.length; i++) {
                var Dx = void 0, Dy = void 0, Dz = void 0, Di = void 0, Dj = void 0, Dk = void 0, Tx = void 0, Tz = void 0, Ti = void 0, Tj = void 0, Tk = void 0;
                var double_Dx = void 0, double_Dy = void 0, double_Dz = void 0, double_Tx = void 0, double_Ty = void 0, double_Tz = void 0;
                var next_i = (i + 1) % face.dots.length;
                if (face.dots[i].y === face.dots[next_i].y) {
                    continue;
                }
                var start = void 0, end = void 0;
                var double_start = void 0, double_end = void 0;
                if (face.dots[i].y < face.dots[next_i].y) {
                    start = face.dots[i];
                    end = face.dots[next_i];
                    double_start = face_SRU.dots[i];
                    double_end = face_SRU.dots[next_i];
                }
                else {
                    start = face.dots[next_i];
                    end = face.dots[i];
                    double_start = face_SRU.dots[next_i];
                    double_end = face_SRU.dots[i];
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
                double_Dx = double_end.x - double_start.x;
                double_Dy = double_end.y - double_start.y;
                double_Dz = double_end.z - double_start.z;
                Dz = double_end.z - double_start.z;
                double_Ty = double_Dy / Dy;
                double_Tx = double_Dx / Dy;
                double_Tz = double_Dz / Dy;
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
                var double_x = double_start.x;
                var double_z = double_start.z;
                var double_y = double_start.y;
                var i_phong = start.x_phong;
                var j_phong = start.y_phong;
                var k_phong = start.z_phong;
                for (var y = start_y; y <= end_y; y++) {
                    this.updateHash(double_y, double_x, double_z, y, x, z, i_phong, j_phong, k_phong);
                    double_x += double_Tx;
                    double_z += double_Tz;
                    double_y += double_Ty;
                    x += Tx;
                    z += Tz;
                    i_phong += Ti;
                    j_phong += Tj;
                    k_phong += Tk;
                }
            }
        }
    };
    ZbufferPhong.prototype.updateHash = function (double_y, double_x, double_z, y, x, z, i_phong, j_phong, k_phong) {
        if (!this.scanline.has(y)) {
            this.scanline.set(y, []);
        }
        var listaDePontos = this.scanline.get(y);
        var novoPonto = new Dot(x, y, z, "rgb(".concat(0, ", ").concat(0, ", ").concat(0, ")"), 0, 0, 0, i_phong, j_phong, k_phong);
        var double_novoPonto = new Dot(double_x, double_y, double_z, "rgb(".concat(0, ", ").concat(0, ", ").concat(0, ")"), 0, 0, 0, i_phong, j_phong, k_phong);
        listaDePontos.push([novoPonto, double_novoPonto]);
    };
    ZbufferPhong.prototype.ZbufferPhong = function (amb_light, ks, kd, n, face_sru) {
        var _this = this;
        this.scanline.forEach(function (points, y) {
            points = points.sort(function (a, b) { return a[0].x - b[0].x; });
            for (var i = 0; i < points.length - 1; i += 2) {
                var next_i = (i + 1) % (points.length);
                if ((Math.floor(points[next_i][0].x) - Math.ceil(points[i][0].x)) > 0) {
                    var z1 = points[i][0].z;
                    var z2 = points[next_i][0].z;
                    var i_phong = points[i][0].x_phong;
                    var j_phong = points[i][0].y_phong;
                    var k_phong = points[i][0].z_phong;
                    var i_phong2 = points[next_i][0].x_phong;
                    var j_phong2 = points[next_i][0].y_phong;
                    var k_phong2 = points[next_i][0].z_phong;
                    var double_x = points[i][1].x;
                    var double_y = points[i][1].y;
                    var double_z = points[i][1].z;
                    var double_x2 = points[next_i][1].x;
                    var double_y2 = points[next_i][1].y;
                    var double_z2 = points[next_i][1].z;
                    var dz = (z2 - z1) / (points[next_i][0].x - points[i][0].x);
                    var di = (i_phong2 - i_phong) / (points[next_i][0].x - points[i][0].x);
                    var dj = (j_phong2 - j_phong) / (points[next_i][0].x - points[i][0].x);
                    var dk = (k_phong2 - k_phong) / (points[next_i][0].x - points[i][0].x);
                    var double_dx = (double_x2 - double_x) / (points[next_i][1].x - points[i][1].x);
                    var double_dy = (double_y2 - double_y) / (points[next_i][1].y - points[i][1].y);
                    var double_dz = (double_z2 - double_z) / (points[next_i][1].z - points[i][1].z);
                    var x1 = Math.ceil(points[i][0].x);
                    var x2 = Math.ceil(points[next_i][0].x);
                    var new_i = points[i][0].x_phong;
                    var new_j = points[i][0].y_phong;
                    var new_k = points[i][0].z_phong;
                    var new_double_x = points[i][1].x;
                    var new_double_y = points[i][1].y;
                    var new_double_z = points[i][1].z;
                    var start = x1, end = x2;
                    var dx = points[i][0].x - x1;
                    z1 += dx * dz;
                    for (var x = start; x <= end; x++) {
                        _this.AtualizaBufferGourand(z1, new_i, new_j, new_k, x, Math.round(y), amb_light, ks, kd, n, new_double_x, new_double_y, new_double_z);
                        z1 += dz;
                        new_i += di;
                        new_j += dj;
                        new_k += dk;
                        new_double_x += double_dx;
                        new_double_y += double_dy;
                        new_double_z += double_dz;
                    }
                }
            }
        });
    };
    ZbufferPhong.prototype.AtualizaBufferGourand = function (constant_z, i_phong, j_phong, k_phong, x, y, amb_light, ks, kd, n, db_x, db_y, db_z) {
        console.log("x y z", db_x, "  ", db_y, "  ", db_z);
        if (constant_z > this.depthBuffer[y][x]) {
            this.depthBuffer[y][x] = constant_z;
            //console.log(this.depthBuffer[y][x]);
            console.log(ks, "  ---  ", kd, "  ---  ", n, "  ---  ", amb_light);
            var r_phong = get_ilum(new Dot(Number(this.vrp.x), Number(this.vrp.y), Number(this.vrp.z)), this.lamp, new Vet(i_phong, j_phong, k_phong), new Dot(db_x, db_y, db_z), amb_light[0], ks[0], kd[0], n);
            var g_phong = get_ilum(new Dot(Number(this.vrp.x), Number(this.vrp.y), Number(this.vrp.z)), this.lamp, new Vet(i_phong, j_phong, k_phong), new Dot(db_x, db_y, db_z), amb_light[1], ks[1], kd[1], n);
            var b_phong = get_ilum(new Dot(Number(this.vrp.x), Number(this.vrp.y), Number(this.vrp.z)), this.lamp, new Vet(i_phong, j_phong, k_phong), new Dot(db_x, db_y, db_z), amb_light[2], ks[2], kd[2], n);
            // console.log("Cor -> " + `rgb(${r_phong}, ${g_phong}, ${b_phong})`)
            this.colorBuffer[y][x] = "rgb(".concat(r_phong, ", ").concat(g_phong, ", ").concat(b_phong, ")");
            //console.log(this.depthBuffer);
        }
    };
    return ZbufferPhong;
}());
// function get_ilum(vrp: Dot, lamp: Lamp, vet_normal: Vet, centroide: Dot, amb_light_par: number, ks: number, kd: number, n: number){
