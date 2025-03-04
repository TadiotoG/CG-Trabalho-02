/// <reference path= "./surface.ts" />
/// <reference path= "./camera.ts" />
var canvas_width = 1000;
var canvas_height = 800;
var Universe = /** @class */ (function () {
    function Universe(ctx_out, cam) {
        var _this = this;
        this.surfaces = [];
        this.rotate_y = false;
        this.animate_world = function () {
            _this.ctx.fillStyle = "white";
            _this.ctx.fillRect(0, 0, canvas_width, canvas_height);
            for (var i = 0; i < _this.surfaces.length; i++) {
                _this.surfaces[i].create_faces(_this.matriz_SRU_SRT);
                _this.draw_whole_surface(_this.surfaces[i]);
                var new_matriz_obj = void 0;
                new_matriz_obj = mult_matriz(get_matriz_rot_y(0.002), _this.surfaces[i].get_outp_as_mat()); // Faz a animacao rotacionando o objeto no eixo y
                _this.surfaces[i].update_outp_with_mat(new_matriz_obj);
            }
            for (var i = 0; i < _this.surfaces.length; i++) {
                _this.draw_cp(_this.surfaces[i]);
                var new_matriz_obj = void 0;
                new_matriz_obj = mult_matriz(get_matriz_rot_y(0.002), _this.surfaces[i].get_cp_as_mat()); // Faz a animacao rotacionando o objeto no eixo y
                _this.surfaces[i].update_cp_with_mat(new_matriz_obj);
            }
            requestAnimationFrame(_this.animate_world);
        };
        this.ctx = ctx_out;
        this.camera = cam;
        this.matriz_SRU_SRT = this.camera.get_mat_SRU_SRT();
    }
    ;
    Universe.prototype.draw_whole_surface = function (surface) {
        for (var i = 0; i < surface.faces.length; i++) {
            surface.faces[i] = Recorte(surface.faces[i], 0, 950, 0, 800);
            this.draw_face(surface.faces[i]);
        }
    };
    ;
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
    // draw_cp(obj: Surface){
    //     let mat_control_p = obj.get_cp_as_mat();
    //     let points: number[][];
    //     points = mult_matriz(this.matriz_SRU_SRT, mat_control_p);
    //     // print_matriz(points, "POINTS")
    //     for(let i = 0; i < points[0].length; i++){
    //         this.draw_dot(points[0][i] / points[3][i], points[1][i] / points[3][i], "red"); // Divide pelo fator homogenio
    //     }
    // }
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
        this.ctx.fillStyle = A.color;
        this.ctx.arc(A.x, A.y, 2, 0, 360, false);
        this.ctx.fill();
    };
    ;
    Universe.prototype.add_surface = function (obj) {
        this.surfaces.push(obj);
        obj.create_faces(this.matriz_SRU_SRT);
        this.draw_whole_surface(obj);
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
    Universe.prototype.render = function (vrp) {
        // this.ctx.clearRect(0, 0, canvas_width, canvas_height);
        this.surfaces.forEach(function (surface) {
            console.log(surface.faces.length);
            surface.faces.sort(function (faceA, faceB) {
                var centroideA = get_centroide(faceA);
                var centroideB = get_centroide(faceB);
                var distanciaA = calc_distance(centroideA, vrp);
                var distanciaB = calc_distance(centroideB, vrp);
                return distanciaB - distanciaA;
            });
        });
        for (var _i = 0, _a = this.surfaces; _i < _a.length; _i++) {
            var surface = _a[_i];
            surface.callfp(this.ctx, vrp);
        }
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
