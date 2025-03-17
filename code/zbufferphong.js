function get_ilum(vrp, lamp, vet_normal, centroide, amb_light_par, ks, kd, n) {
    var amb_light = amb_light_par;
    // console.log("================================================");
    // console.log("Centroide face = ", face);
    // console.log("Lamp x = ", lamp.pos.x);
    var aux_x = lamp.pos.x - centroide.x;
    var aux_y = lamp.pos.y - centroide.y;
    var aux_z = lamp.pos.z - centroide.z;
    var test_vis = new Vet(centroide.x - this.camera.vrp.x, centroide.y - this.camera.vrp.y, centroide.z - this.camera.vrp.z);
    if (prod_escalar(vet_normal.unitary, test_vis.unitary) < 0) {
        vet_normal = new Vet(-vet_normal.x, -vet_normal.y, -vet_normal.z);
    }
    var vet_LampMinusCent = new Vet(aux_x, aux_y, aux_z);
    // vet_LampMinusCent.print_obj("Lamp - Centroide");
    var UN_times_UL = prod_escalar(vet_LampMinusCent.unitary, vet_normal.unitary);
    // console.log("vet_normal = ", vet_normal.unitary);
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
        // direcao_observ.print_obj("Direcao observ");
        var r_escalar_dir_obs = prod_escalar(idk_r.unitary, direcao_observ.unitary);
        // console.log("r.s -> ", r_escalar_dir_obs)
        if (r_escalar_dir_obs > 0) {
            // console.log("R escalar dir ", r_escalar_dir_obs);
            var is = lamp.il * ks * Math.pow(r_escalar_dir_obs, n);
            // console.log("k ", ks, "    n -> ", n)
            // console.log("is -> ", is)
            // console.log(`${r_escalar_dir_obs} ** ${n} = ${r_escalar_dir_obs**n}`)
            // console.log("Cor = ", String((amb_light + ilum_difusa + is)));
            // console.log(`${amb_light} + ${ilum_difusa} + ${is}`);
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
    function ZbufferPhong(width, height) {
        this.width = width;
        this.height = height;
        this.scanline = new Map(); // Inicializa o HashMap
        this.depthBuffer = Array.from({ length: height + 10 }, function () { return Array(width + 10).fill(-100000000); });
        this.colorBuffer = Array.from({ length: height + 10 }, function () { return Array(width + 10).fill('#000000'); });
        for (var i = 0; i < height + 10; i++) {
            for (var j = 0; j < width + 10; j++) {
                this.depthBuffer[i][j] = -1000000;
                this.colorBuffer[i][j] = '#000000';
            }
        }
        ;
        // console.log("")
    }
    ZbufferPhong.prototype.rasterizePolygon = function (face) {
        this.Scanline([face]);
    };
    ZbufferPhong.prototype.Scanline = function (faces) {
        this.scanline = new Map();
        //console.log("Faces -> ", faces);
        for (var _i = 0, faces_1 = faces; _i < faces_1.length; _i++) {
            var face = faces_1[_i];
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
    ZbufferPhong.prototype.updateHash = function (y, x, z, new_R, new_G, new_B) {
        if (!this.scanline.has(y)) {
            this.scanline.set(y, []);
        }
        var listaDePontos = this.scanline.get(y);
        var novoPonto = new Dot(x, y, z, "rgb(".concat(0, ", ").concat(0, ", ").concat(0, ")"), 0, 0, 0, new_R, new_G, new_B);
        listaDePontos.push(novoPonto);
    };
    ZbufferPhong.prototype.ZbufferPhong = function () {
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
                    // if(points[i].x > points[next_i].x){
                    //     z1 = points[next_i].z;
                    //     z2 = points[i].z;
                    // }
                    //console.log(points[i].x, points[i+1].x, points[i].z, points[i+1].z);
                    var dz = (z2 - z1) / (points[next_i].x - points[i].x);
                    var di = (i_phong2 - i_phong) / (points[next_i].x - points[i].x);
                    var dj = (j_phong2 - j_phong) / (points[next_i].x - points[i].x);
                    var dk = (k_phong2 - k_phong) / (points[next_i].x - points[i].x);
                    // console.log(dz);
                    //console.log(dR, dG, dB);
                    var x1 = Math.ceil(points[i].x);
                    var x2 = Math.ceil(points[next_i].x);
                    var R = points[i].x_phong;
                    var G = points[i].y_phong;
                    var B = points[i].z_phong;
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
                        _this.AtualizaBufferGourand(z1, R, G, B, x, Math.round(y));
                        //console.log(points[new_i].r_gouraud, points[new_i].g_gouraud, points[new_i].b_gouraud);
                        z1 += dz;
                        R += di;
                        G += dj;
                        B += dk;
                    }
                }
            }
        });
        //console.log(this.depthBuffer[0][150]);
        //console.log(this.scanline);
    };
    ZbufferPhong.prototype.AtualizaBufferGourand = function (constant_z, new_R, new_G, new_B, x, y) {
        //console.log("tamanho", this.depthBuffer.length, this.depthBuffer[0].length);
        if (constant_z > this.depthBuffer[y][x]) {
            this.depthBuffer[y][x] = constant_z;
            //console.log(this.depthBuffer[y][x]);
            this.colorBuffer[y][x] = "rgb(".concat(new_R, ", ").concat(new_G, ", ").concat(new_B, ")");
            //console.log(this.depthBuffer);
        }
    };
    return ZbufferPhong;
}());
