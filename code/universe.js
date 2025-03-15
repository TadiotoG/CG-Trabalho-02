/// <reference path="./zbufferconst.ts" />
/// <reference path="./zbuffergouraud.ts" />
var canvas_width = 1000;
var canvas_height = 800;
var Universe = /** @class */ (function () {
    function Universe(ctx_out, cam, lamp, ambient_light, zbuffer_const, zbuffer_gouraud, width, height) {
        this.surfaces = [];
        this.rotate_y = false;
        this.ctx = ctx_out;
        this.camera = cam;
        this.matriz_SRU_SRT = this.camera.get_mat_SRU_SRT();
        this.lamp = lamp;
        this.la = ambient_light;
        this.zbuffer_const = zbuffer_const;
        this.zbuffer_gouraud = zbuffer_gouraud;
        this.width = width;
        this.height = height;
    }
    ;
    Universe.prototype.update_all_face_colors_constant = function () {
        for (var i = 0; i < this.surfaces.length; i++) {
            var amb_light_r = this.surfaces[i].ka[0] * this.la[0];
            var amb_light_g = this.surfaces[i].ka[1] * this.la[1];
            var amb_light_b = this.surfaces[i].ka[2] * this.la[2];
            for (var j = 0; j < this.surfaces[i].double_faces.length; j++) {
                var new_color = "rgb("; // Ka: number=0.4, Kd: number=0.6, Ks: number=0.5, N: number=2.15
                new_color += this.get_ilum(this.surfaces[i].double_faces[j].face_SRU.vet_normal, this.surfaces[i].double_faces[j].face_SRU.centroide, amb_light_r, this.surfaces[i].ks[0], this.surfaces[i].kd[0], this.surfaces[i].n);
                new_color += ",";
                new_color += this.get_ilum(this.surfaces[i].double_faces[j].face_SRU.vet_normal, this.surfaces[i].double_faces[j].face_SRU.centroide, amb_light_g, this.surfaces[i].ks[1], this.surfaces[i].kd[1], this.surfaces[i].n);
                new_color += ",";
                new_color += this.get_ilum(this.surfaces[i].double_faces[j].face_SRU.vet_normal, this.surfaces[i].double_faces[j].face_SRU.centroide, amb_light_b, this.surfaces[i].ks[2], this.surfaces[i].kd[2], this.surfaces[i].n);
                new_color += ")";
                // console.log("New color -> ", new_color);
                this.surfaces[i].double_faces[j].face.color = new_color;
                // console.log("NEW COLOR -> ", new_color);
            }
        }
    };
    Universe.prototype.call_gouraud = function () {
        for (var surf = 0; surf < this.surfaces.length; surf++) {
            define_vet_normal_vertices(this.surfaces[surf].outp);
            var amb_light_r = this.surfaces[surf].ka[0] * this.la[0];
            var amb_light_g = this.surfaces[surf].ka[1] * this.la[1];
            var amb_light_b = this.surfaces[surf].ka[2] * this.la[2];
            for (var i = 0; i < this.surfaces[surf].outp.length; i++) {
                for (var j = 0; j < this.surfaces[surf].outp[0].length; j++) {
                    var teste = (this.get_ilum(this.surfaces[surf].outp[i][j].gouraud, this.surfaces[surf].outp[i][j], amb_light_r, this.surfaces[surf].ks[0], this.surfaces[surf].kd[0], this.surfaces[surf].n));
                    this.surfaces[surf].outp[i][j].r_gouraud = Number(teste);
                    this.surfaces[surf].outp[i][j].g_gouraud = Number(this.get_ilum(this.surfaces[surf].outp[i][j].gouraud, this.surfaces[surf].outp[i][j], amb_light_g, this.surfaces[surf].ks[1], this.surfaces[surf].kd[1], this.surfaces[surf].n));
                    this.surfaces[surf].outp[i][j].b_gouraud = Number(this.get_ilum(this.surfaces[surf].outp[i][j].gouraud, this.surfaces[surf].outp[i][j], amb_light_b, this.surfaces[surf].ks[2], this.surfaces[surf].kd[2], this.surfaces[surf].n));
                }
            }
            this.surfaces[surf].create_faces(this.matriz_SRU_SRT);
        }
        // console.log("Primeira face -> ", this.surfaces[0].double_faces)
    };
    Universe.prototype.get_ilum = function (vet_normal, centroide, amb_light_par, ks, kd, n) {
        var amb_light = amb_light_par;
        // console.log("================================================");
        // console.log("Centroide face = ", face);
        // console.log("Lamp x = ", this.lamp.pos.x);
        var aux_x = this.lamp.pos.x - centroide.x;
        var aux_y = this.lamp.pos.y - centroide.y;
        var aux_z = this.lamp.pos.z - centroide.z;
        var test_vis = new Vet(centroide.x - this.camera.vrp.x, centroide.y - this.camera.vrp.y, centroide.z - this.camera.vrp.z);
        if (prod_escalar(vet_normal.unitary, test_vis.unitary) < 0) {
            vet_normal = new Vet(-vet_normal.x, -vet_normal.y, -vet_normal.z);
        }
        var vet_LampMinusCent = new Vet(aux_x, aux_y, aux_z);
        // vet_LampMinusCent.print_obj("Lamp - Centroide");
        var UN_escalar_UL = prod_escalar(vet_LampMinusCent.unitary, vet_normal.unitary);
        // console.log("UN escalar UL = ", UN_escalar_UL);
        // console.log("vet_normal = ", vet_normal.unitary);
        if (UN_escalar_UL > 0) {
            var ilum_difusa = this.lamp.il * kd * UN_escalar_UL;
            // console.log("Ilumincao difusa: ", ilum_difusa)
            aux_x = 2 * UN_escalar_UL * vet_normal.unitary.x - vet_LampMinusCent.unitary.x;
            aux_y = 2 * UN_escalar_UL * vet_normal.unitary.y - vet_LampMinusCent.unitary.y;
            aux_z = 2 * UN_escalar_UL * vet_normal.unitary.z - vet_LampMinusCent.unitary.z;
            var idk_r = new Vet(aux_x, aux_y, aux_z);
            // idk_r.print_obj("Vet r")
            aux_x = this.camera.vrp.x - centroide.x;
            aux_y = this.camera.vrp.y - centroide.y;
            aux_z = this.camera.vrp.z - centroide.z;
            var direcao_observ = new Vet(aux_x, aux_y, aux_z);
            // direcao_observ.print_obj("Direcao observ");
            var r_escalar_dir_obs = prod_escalar(idk_r.unitary, direcao_observ.unitary);
            // console.log("R escalar dir ", r_escalar_dir_obs);
            if (r_escalar_dir_obs > 0) {
                var is = this.lamp.il * ks * Math.pow(r_escalar_dir_obs, n);
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
    };
    Universe.prototype.cut_surface_nocolor = function (surface) {
        for (var i = 0; i < surface.double_faces.length; i++) {
            // console.log("Entrou assim -> ", surface.double_faces[i].face)
            surface.double_faces[i].face = Recorte(surface.double_faces[i].face, 0, this.width, 0, this.height);
            if (surface.double_faces[i].face.dots.length == 0) { // Caso o recorte retorne uma face sem pontos, a face é tirada da lista de faces
                surface.double_faces.splice(i);
                i--;
            }
            // console.log("Saiu assim -> ", surface.double_faces[i].face)
        }
    };
    ;
    Universe.prototype.cut_surface_withcolor = function (surface) {
        for (var i = 0; i < surface.double_faces.length; i++) {
            surface.double_faces[i].face = RecorteWithColor(surface.double_faces[i].face, 0, this.width, 0, this.height);
            if (surface.double_faces[i].face.dots.length == 0) { // Caso o recorte retorne uma face sem pontos, a face é tirada da lista de faces
                surface.double_faces.splice(i);
                i--;
            }
        }
    };
    ;
    Universe.prototype.calc_zbuffer_const = function () {
        for (var i = 0; i < this.surfaces.length; i++) {
            for (var j = 0; j < this.surfaces[i].double_faces.length; j++) {
                this.zbuffer_const.rasterizePolygon(this.surfaces[i].double_faces[j].face);
                this.zbuffer_const.ZbufferConstante();
            }
        }
        // console.log("Executou ")
        // for(let x=0; x<this.zbuffer.depthBuffer.length; x++){ // Fui ver se eu resolvi o teu problema, mas n consegui, isso aqui vai printar qualquer face que apareca no z buffer
        //     for(let z=0; z<this.zbuffer.depthBuffer[0].length; z++){
        //         this.ctx.fillStyle = this.zbuffer.colorBuffer[x][z];
        //         this.ctx.fillRect(z, x, 1, 1);
        //             // console.log(`ZBuffer [${x}][${z}] = ${this.zbuffer.depthBuffer[x][z]}  e   ${this.zbuffer.colorBuffer[x][z]}`)
        //     }
        // }
    };
    Universe.prototype.calc_zbuffer_gouraud = function () {
        // console.log("Teste cores -> ", this.surfaces[0].double_faces[0].face);
        for (var i = 0; i < this.surfaces.length; i++) {
            for (var j = 0; j < this.surfaces[i].double_faces.length; j++) {
                this.zbuffer_gouraud.rasterizePolygon(this.surfaces[i].double_faces[j].face);
                this.zbuffer_gouraud.ZbufferGourand();
            }
        }
        ;
        // console.log("Executou ")
        // for(let x=0; x<this.zbuffer.depthBuffer.length; x++){ // Fui ver se eu resolvi o teu problema, mas n consegui, isso aqui vai printar qualquer face que apareca no z buffer
        //     for(let z=0; z<this.zbuffer.depthBuffer[0].length; z++){
        //         this.ctx.fillStyle = this.zbuffer.colorBuffer[x][z];
        //         this.ctx.fillRect(z, x, 1, 1);
        //             // console.log(`ZBuffer [${x}][${z}] = ${this.zbuffer.depthBuffer[x][z]}  e   ${this.zbuffer.colorBuffer[x][z]}`)
        //     }
        // }
    };
    Universe.prototype.plot_zbuffer_const = function () {
        for (var i = 0; i < this.zbuffer_const.colorBuffer.length; i++) {
            for (var j = 0; j < this.zbuffer_const.colorBuffer[0].length; j++) {
                // console.log(`[${i}][${j}]`)
                this.ctx.fillStyle = this.zbuffer_const.colorBuffer[i][j];
                this.ctx.fillRect(j, i, 1, 1);
            }
        }
    };
    Universe.prototype.plot_zbuffer_gouraud = function () {
        for (var i = 0; i < this.zbuffer_gouraud.colorBuffer.length; i++) {
            for (var j = 0; j < this.zbuffer_gouraud.colorBuffer[0].length; j++) {
                // console.log(`[${i}][${j}]`)
                this.ctx.fillStyle = this.zbuffer_gouraud.colorBuffer[i][j];
                this.ctx.fillRect(j, i, 1, 1);
            }
        }
    };
    Universe.prototype.draw_face = function (face) {
        // let points = mult_matriz(this.matriz_SRU_SRT, this.get_mat_from_list_of_dots(face.dots))
        // let dots_on_screen: Array<Dot>; // Pontos em coordenada de tela, após a conversao utilizando a matriz SRU_SRT
        // dots_on_screen = this.get_dots_from_mat(face.dots)
        for (var i = 0; i < face.dots.length; i++) {
            if (i === face.dots.length - 1) {
                this.draw_line(face.dots[i], face.dots[0], "blue");
            }
            else {
                // let h = 3;
                this.draw_line(face.dots[i], face.dots[i + 1], "blue");
            }
        }
    };
    ;
    Universe.prototype.draw_line = function (dot0, dot1, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(dot0.x, dot0.y);
        this.ctx.lineTo(dot1.x, dot1.y);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    };
    ;
    Universe.prototype.draw_outp = function (obj) {
        var mat_control_p = obj.get_outp_as_mat();
        var points;
        points = mult_matriz(this.matriz_SRU_SRT, mat_control_p);
        // print_matriz(points, "POINTS")
        for (var i = 0; i < points[0].length; i++) {
            this.draw_dot(new Dot(points[0][i] / points[3][i], points[1][i] / points[3][i], 0, "black")); // Divide pelo fator homogenio
        }
    };
    ;
    Universe.prototype.draw_cp = function (obj) {
        // console.log("Antes obj.cp -> ", obj.control_points);
        obj.define_dots_screen(this.matriz_SRU_SRT);
        // console.log("Dots screen -> ", obj.control_points_screen)
        for (var i = 0; i < obj.control_points_screen.length; i++) {
            for (var j = 0; j < obj.control_points_screen[0].length; j++) {
                this.draw_dot(obj.control_points_screen[i][j]); // Divide pelo fator homogenio
            }
        }
    };
    ;
    Universe.prototype.draw_dot = function (A) {
        this.ctx.beginPath();
        this.ctx.fillStyle = "grey";
        this.ctx.arc(A.x, A.y, 2, 0, 360, false);
        this.ctx.fill();
    };
    ;
    Universe.prototype.add_surface = function (obj) {
        this.surfaces.push(obj);
        obj.create_faces(this.matriz_SRU_SRT);
    };
    ;
    Universe.prototype.get_mat_from_list_of_dots = function (arr_dots) {
        var mat_aux = Array(4).fill(null).map(function () { return Array(arr_dots.length).fill(0); });
        for (var i = 0; i < arr_dots.length; i++) {
            mat_aux[0][i] = arr_dots[i].x;
            mat_aux[1][i] = arr_dots[i].y;
            mat_aux[2][i] = arr_dots[i].z;
            mat_aux[3][i] = 1;
        }
        return mat_aux;
    };
    ;
    Universe.prototype.get_dots_from_mat = function (mat) {
        var list_d;
        list_d = [new Dot(mat[0][0], mat[1][0], mat[2][0])];
        for (var i = 1; i < mat.length; i++) {
            list_d.push(new Dot(mat[0][i], mat[1][i], mat[2][i]));
        }
        return list_d;
    };
    ;
    Universe.prototype.multiply_and_update_cp = function (index, mat) {
        var new_matriz_obj = mult_matriz(mat, this.surfaces[index].get_cp_as_mat());
        this.surfaces[index].update_cp_with_mat(new_matriz_obj);
    };
    Universe.prototype.render = function () {
        var _this = this;
        var all_double_faces = [];
        for (var i = 0; i < this.surfaces.length; i++) {
            for (var j = 0; j < this.surfaces[i].double_faces.length; j++) {
                all_double_faces.push(this.surfaces[i].double_faces[j]);
            }
        }
        all_double_faces.sort(function (faceA, faceB) {
            var centroideA = faceA.face_SRU.centroide;
            var centroideB = faceB.face_SRU.centroide;
            var distanciaA = calc_distance(centroideA, _this.camera.vrp);
            var distanciaB = calc_distance(centroideB, _this.camera.vrp);
            return distanciaB - distanciaA; // Ordenação decrescente
        });
        // console.log("Cor antes -> ", this.surfaces[0].double_faces[0].face.color)
        for (var _i = 0, all_double_faces_1 = all_double_faces; _i < all_double_faces_1.length; _i++) {
            var doubleFace = all_double_faces_1[_i];
            // console.log("Pontos -> ", doubleFace.face_SRU.dots)
            // console.log("Normal -> ", doubleFace.face_SRU.get_normal())
            var vrp_minus_cent = new Vet(doubleFace.face_SRU.centroide.x - this.camera.vrp.x, doubleFace.face_SRU.centroide.y - this.camera.vrp.y, doubleFace.face_SRU.centroide.z - this.camera.vrp.z);
            // console.log("VRP - Centroide -> ", vrp_minus_cent)
            var normal = prod_escalar(doubleFace.face_SRU.get_normal().unitary, vrp_minus_cent.unitary);
            // console.log("Calculo da normal -> ", normal)
            doubleFace.face.fillpoly(this.ctx, normal);
        }
        // console.log("Cor depois -> ", this.surfaces[0].double_faces[0].face.color)
    };
    return Universe;
}());
function calc_distance(centroide, VRP) {
    return Math.sqrt(Math.pow((VRP.x - centroide.x), 2) +
        Math.pow((VRP.y - centroide.y), 2) +
        Math.pow((VRP.z - centroide.z), 2));
}
function get_centroide(face) {
    if (!face.dots || face.dots.length === 0) {
        console.error("Erro: Face não contém pontos válidos", face);
        return new Dot(0, 0, 0);
    }
    var sum_x = 0, sum_y = 0, sum_z = 0;
    var num_pontos = face.dots.length;
    for (var i = 0; i < num_pontos; i++) {
        sum_x += face.dots[i].x;
        sum_y += face.dots[i].y;
        sum_z += face.dots[i].z;
    }
    return new Dot(sum_x / num_pontos, sum_y / num_pontos, sum_z / num_pontos);
}
