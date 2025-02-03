/// <reference path= "./surface.ts" />
/// <reference path= "./camera.ts" />
// class Obj_3D{
//     dots: Array<Dot>;
//     mat_dots: number[][];
//     color: string;
//     centroide: Dot;
//     constructor(new_color: string, dots_array: Array<Dot>){
//         this.color = new_color;
//         this.dots = [];
//         this.dots = dots_array;
//         this.mat_dots = this.get_mat_from_dots();
//         this.centroide = this.get_centroide();
//     }
//     get_mat_from_dots(): number[][]{
//         let mat_aux: number[][] = Array(4).fill(null).map(() => Array(this.dots.length).fill(0));
//         for(let i = 0; i < this.dots.length; i++){
//             mat_aux[0][i] = this.dots[i].x;
//             mat_aux[1][i] = this.dots[i].y;
//             mat_aux[2][i] = this.dots[i].z;
//             mat_aux[3][i] = 1;
//         }
//         return mat_aux;
//     }
//     get_centroide(): Dot{
//         let sum_x = 0;
//         let sum_y = 0;
//         let sum_z = 0;
//         for(let i=0; i < this.dots.length; i++){
//             sum_x += this.dots[i].x;
//             sum_y += this.dots[i].y;
//             sum_z += this.dots[i].z;
//         }
//         return new Dot(sum_x/this.dots.length, sum_y/this.dots.length, sum_z/this.dots.length);
//     }
//     update_centroide(): void {
//         this.centroide = this.get_centroide();
//     }
// }
var canvas_width = 800;
var canvas_height = 800;
var Universe = /** @class */ (function () {
    function Universe(ctx_out, cam) {
        var _this = this;
        this.splines = [];
        this.surfaces = [];
        this.animate_world = function () {
            _this.ctx.fillStyle = "white";
            _this.ctx.fillRect(0, 0, canvas_width, canvas_height);
            // for(let i = 0; i < this.splines.length; i++){   
            //     this.draw_spline_curve(this.splines[i]);
            //     let new_matriz_obj: number[][];
            //     new_matriz_obj = mult_matriz(get_matriz_rot_y(0.001), this.get_mat_from_list_of_dots(this.splines[i].control_points)); // Faz a animacao rotacionando o objeto no eixo y
            //     let new_dots = this.get_dots_from_mat(new_matriz_obj); // Precisa fazer isso, pq a matriz dos pontos de controle são diferentes da matriz dos vertices dos objetos
            //     this.splines[i].control_points = new_dots;
            //     this.splines[i].update_mat_control_points();
            // }
            // for(let i = 0; i < this.surfaces.length; i++){   
            //     this.draw_outp(this.surfaces[i]);
            //     let new_matriz_obj: number[][];
            //     new_matriz_obj = mult_matriz(get_matriz_rot_y(0.002), this.surfaces[i].get_outp_as_mat()); // Faz a animacao rotacionando o objeto no eixo y
            //     this.surfaces[i].update_outp_with_mat(new_matriz_obj);
            // }
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
    Universe.prototype.draw_whole_surface = function (surface) {
        for (var i = 0; i < surface.faces.length; i++) {
            this.draw_face(surface.faces[i]);
        }
    };
    Universe.prototype.draw_face = function (face) {
        ;
        // let points = mult_matriz(this.matriz_SRU_SRT, this.get_mat_from_list_of_dots(face.dots))
        // let dots_on_screen: Array<Dot>; // Pontos em coordenada de tela, após a conversao utilizando a matriz SRU_SRT
        // dots_on_screen = this.get_dots_from_mat(face.dots)
        for (var i = 0; i < face.dots.length; i++) {
            if (i === face.dots.length - 1) {
                this.draw_line(face.dots[i], face.dots[0], "black");
            }
            else {
                // let h = 3;
                this.draw_line(face.dots[i], face.dots[i + 1], "blue");
            }
        }
    };
    Universe.prototype.draw_line = function (dot0, dot1, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(dot0.x, dot0.y);
        this.ctx.lineTo(dot1.x, dot1.y);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        // this.ctx.beginPath();
        // this.ctx.moveTo(dot0.x, dot0.y);
        // this.ctx.lineTo(dot1.x, dot1.y);
        // this.ctx.strokeStyle = color;
        // this.ctx.lineWidth = 2;
        // this.ctx.stroke();
    };
    Universe.prototype.draw_outp = function (obj) {
        var mat_control_p = obj.get_outp_as_mat();
        var points;
        points = mult_matriz(this.matriz_SRU_SRT, mat_control_p);
        // print_matriz(points, "POINTS")
        for (var i = 0; i < points[0].length; i++) {
            this.draw_dot(points[0][i] / points[3][i], points[1][i] / points[3][i], "black"); // Divide pelo fator homogenio
        }
    };
    Universe.prototype.draw_cp = function (obj) {
        var mat_control_p = obj.get_cp_as_mat();
        var points;
        points = mult_matriz(this.matriz_SRU_SRT, mat_control_p);
        // print_matriz(points, "POINTS")
        for (var i = 0; i < points[0].length; i++) {
            this.draw_dot(points[0][i] / points[3][i], points[1][i] / points[3][i], "red"); // Divide pelo fator homogenio
        }
    };
    Universe.prototype.draw_dot = function (x, y, color) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.arc(x, y, 2, 0, 360, false);
        this.ctx.fill();
    };
    Universe.prototype.draw_spline_curve = function (obj) {
        var points;
        // points = mult_matriz(this.matriz_SRU_SRT, obj.mat_control_points);
        var curve_as_mat_dots = this.get_mat_from_list_of_dots(obj.create_dots_to_the_entire_curve(0.02));
        points = mult_matriz(this.matriz_SRU_SRT, curve_as_mat_dots);
        for (var i = 0; i < points[0].length; i++) {
            this.draw_dot(points[0][i] / points[3][i], points[1][i] / points[3][i], "black"); // Divide pelo fator homogenio
        }
    };
    Universe.prototype.add_obj_spline = function (obj) {
        this.splines.push(obj);
    };
    Universe.prototype.add_surface = function (obj) {
        this.surfaces.push(obj);
    };
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
    Universe.prototype.get_dots_from_mat = function (mat) {
        var list_d;
        list_d = [new Dot(mat[0][0], mat[1][0], mat[2][0])];
        for (var i = 1; i < mat.length; i++) {
            list_d.push(new Dot(mat[0][i], mat[1][i], mat[2][i]));
        }
        return list_d;
    };
    return Universe;
}());
