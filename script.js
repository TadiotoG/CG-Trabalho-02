/// <reference path= "./spline.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function get_matriz_translada(x, y, z) {
    var mat_aux;
    mat_aux = ([[1, 0, 0, x],
        [0, 1, 0, y],
        [0, 0, 0, z],
        [0, 0, 0, 1]]);
    return mat_aux;
}
function get_matriz_rot_y(angle) {
    var mat_aux;
    mat_aux = ([[Math.cos(angle), 0, Math.sin(angle), 0],
        [0, 1, 0, 0],
        [-Math.sin(angle), 0, Math.cos(angle), 0],
        [0, 0, 0, 1]]);
    return mat_aux;
}
function VetA_minus_VetB(A, B) {
    var x, y, z;
    x = A.x - B.x;
    y = A.y - B.y;
    z = A.z - B.z;
    var C = new Vet(x, y, z);
    return C;
}
function prod_escalar(A, B) {
    return (A.x * B.x + A.y * B.y + A.z * B.z);
}
function prod_vet(A, B) {
    var prod_x = A.y * B.z - A.z * B.y;
    var prod_y = A.z * B.x - A.x * B.z;
    var prod_z = A.x * B.y - A.y * B.x;
    var C = new Vet(prod_x, prod_y, prod_z);
    return C;
}
function print_matriz(A, matriz_name) {
    // console.log("Matriz = [" + A[0][0] + "," + A[0][1])
    var aux_str;
    console.log("------------- Matriz " + matriz_name + " -------------");
    aux_str = "";
    for (var i = 0; i < A.length; i++) {
        for (var j = 0; j < A[0].length; j++) {
            aux_str += A[i][j] + ", ";
        }
        console.log(aux_str);
        aux_str = "";
    }
}
function mult_matriz(A, B) {
    if (A[0].length !== B.length) {
        throw new Error("O número de colunas de A deve ser igual ao número de linhas de B.");
    }
    var result = Array(A.length).fill(null).map(function () { return Array(B[0].length).fill(0); });
    for (var i = 0; i < A.length; i++) {
        for (var j = 0; j < B[0].length; j++) {
            for (var k = 0; k < B.length; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}
function get_ArrDots_as_mat(arr_dots) {
    var mat_aux = Array(4).fill(null).map(function () { return Array(arr_dots.length).fill(0); });
    for (var i = 0; i < arr_dots.length; i++) {
        mat_aux[0][i] = arr_dots[i].x;
        mat_aux[1][i] = arr_dots[i].y;
        mat_aux[2][i] = arr_dots[i].z;
        mat_aux[3][i] = 1;
    }
    return mat_aux;
}
var Dot = /** @class */ (function () {
    function Dot(new_x, new_y, new_z) {
        this.x = new_x;
        this.y = new_y;
        this.z = new_z;
    }
    Dot.prototype.print_obj = function (dot_name) {
        console.log(dot_name + "-> (" + this.x + "," + this.y + "," + this.z + ")");
    };
    return Dot;
}());
var Vet = /** @class */ (function (_super) {
    __extends(Vet, _super);
    function Vet(new_x, new_y, new_z) {
        var _this = _super.call(this, new_x, new_y, new_z) || this;
        _this.unitary = _this.get_unitary_vector();
        return _this;
    }
    Vet.prototype.get_unitary_vector = function () {
        var norma_A;
        norma_A = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
        return new Dot(this.x / norma_A, this.y / norma_A, this.z / norma_A);
    };
    Vet.prototype.print_obj = function (vet_name) {
        console.log(vet_name + "-> (" + this.x + "," + this.y + "," + this.z + ")");
        this.unitary.print_obj("Unitary ");
        console.log();
    };
    return Vet;
}(Dot));
var Obj_3D = /** @class */ (function () {
    function Obj_3D(new_color, dots_array) {
        this.color = new_color;
        this.dots = [];
        this.dots = dots_array;
        this.mat_dots = this.get_mat_from_dots();
        this.centroide = this.get_centroide();
    }
    Obj_3D.prototype.get_mat_from_dots = function () {
        var _this = this;
        var mat_aux = Array(4).fill(null).map(function () { return Array(_this.dots.length).fill(0); });
        for (var i = 0; i < this.dots.length; i++) {
            mat_aux[0][i] = this.dots[i].x;
            mat_aux[1][i] = this.dots[i].y;
            mat_aux[2][i] = this.dots[i].z;
            mat_aux[3][i] = 1;
        }
        return mat_aux;
    };
    Obj_3D.prototype.get_centroide = function () {
        var sum_x = 0;
        var sum_y = 0;
        var sum_z = 0;
        for (var i = 0; i < this.dots.length; i++) {
            sum_x += this.dots[i].x;
            sum_y += this.dots[i].y;
            sum_z += this.dots[i].z;
        }
        return new Dot(sum_x / this.dots.length, sum_y / this.dots.length, sum_z / this.dots.length);
    };
    Obj_3D.prototype.update_centroide = function () {
        this.centroide = this.get_centroide();
    };
    return Obj_3D;
}());
var Camera = /** @class */ (function () {
    function Camera(view_reference_point, focal_p, dp, min_x, min_y, max_x, max_y) {
        this.width = 100;
        this.height = 100;
        this.vrp = view_reference_point;
        this.focal_point = focal_p;
        this.dp = dp;
        this.x_min = min_x;
        this.y_min = min_y;
        this.x_max = max_x;
        this.y_max = max_y;
        this.calc_matrizes();
    }
    Camera.prototype.calc_matrizes = function () {
        this.vet_n = VetA_minus_VetB(this.vrp, this.focal_point);
        this.vet_n.print_obj("Vet n ");
        this.vet_v = this.define_vector_v();
        this.vet_v.print_obj("Vet v ");
        this.vet_u = prod_vet(this.vet_v, this.vet_n);
        this.vet_u.print_obj("Vet u ");
        this.matriz_SRU_SRC = ([
            [this.vet_u.unitary.x, this.vet_u.unitary.y, this.vet_u.unitary.z, 0],
            [this.vet_v.unitary.x, this.vet_v.unitary.y, this.vet_v.unitary.z, 0],
            [this.vet_n.unitary.x, this.vet_n.unitary.y, this.vet_n.unitary.z, 0],
            [0, 0, 0, 1]
        ]);
        print_matriz(this.matriz_SRU_SRC, "SRU_SRC");
        // this.matriz_persp = this.define_matriz_persp();// Projecao perspectiva, nao vai ser mais utilizado...
        // print_matriz(this.matriz_persp, "Persp");
        this.matriz_jp = this.define_matriz_jp();
        print_matriz(this.matriz_jp, "Jp");
    };
    Camera.prototype.define_vector_v = function () {
        var y = new Vet(0, 1, 0);
        var y_ProdEsc_unitaryN = prod_escalar(y, this.vet_n.unitary);
        var aux_x = this.vet_n.unitary.x * y_ProdEsc_unitaryN;
        var aux_y = this.vet_n.unitary.y * y_ProdEsc_unitaryN;
        var aux_z = this.vet_n.unitary.z * y_ProdEsc_unitaryN;
        var aux = new Vet(aux_x, aux_y, aux_z);
        var mat_aux;
        mat_aux = VetA_minus_VetB(y, aux);
        return mat_aux;
    };
    // private define_matriz_persp(): number[][]{ // Projecao perspectiva, nao vai ser mais utilizado...
    //     let mat_sru: number[][];
    //     let mat_src: number[][];
    //     let x_vp: number  = (this.vrp.x + (this.dp * (-this.vet_n.unitary.x)))
    //     let y_vp: number = (this.vrp.y + (this.dp * (-this.vet_n.unitary.y)))
    //     let z_vp: number = (this.vrp.z + (this.dp * (-this.vet_n.unitary.z)))
    //     mat_sru = ([[x_vp, this.vrp.x],
    //                 [y_vp, this.vrp.y],
    //                 [z_vp, this.vrp.z],
    //                 [1, 1]])
    //     mat_src = mult_matriz(this.matriz_SRU_SRC, mat_sru);
    //     // print_matriz(mat_src, "SRC");
    //     let new_z_vp = mat_src[2][0]
    //     let new_z_prp = mat_src[2][1]
    //     let mat_aux: number[][];// 
    //     mat_aux = ([[1, 0, 0, 0],
    //                 [0, 1, 0, 0],
    //                 [0, 0, -(new_z_vp / this.dp), new_z_vp * (new_z_prp/this.dp)],
    //                 [0, 0, -1/this.dp, new_z_prp/this.dp]
    //     ])
    //     return mat_aux;
    // }
    Camera.prototype.define_matriz_jp = function () {
        var u_min = this.x_min;
        var u_max = this.x_max;
        var v_min = this.y_min;
        var v_max = this.y_max;
        var x_max = this.width / 2;
        var x_min = -this.width / 2;
        var y_max = this.height / 2;
        var y_min = -this.height / 2;
        var aux_1 = -x_min * ((u_max - u_min) / (x_max - x_min)) + u_min;
        var aux_2 = y_min * ((v_max - v_min) / (y_max - y_min)) + v_max;
        var mat_aux;
        mat_aux = ([[(u_max - u_min) / (x_max - x_min), 0, 0, aux_1],
            [0, (v_min - v_max) / (y_max - y_min), 0, aux_2],
            [0, 0, 1, 0],
            [0, 0, 0, 1]]);
        return mat_aux;
    };
    Camera.prototype.get_mat_SRU_SRT = function () {
        var mat_aux;
        // mat_aux = mult_matriz(this.matriz_jp, this.matriz_persp);
        // mat_aux = mult_matriz(mat_aux, this.matriz_SRU_SRC);
        mat_aux = mult_matriz(this.matriz_jp, this.matriz_SRU_SRC);
        return mat_aux;
    };
    return Camera;
}());
var Universe = /** @class */ (function () {
    function Universe(ctx_out, cam) {
        var _this = this;
        this.objects = [];
        this.animate_world = function () {
            _this.ctx.fillStyle = "white";
            _this.ctx.fillRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < _this.objects.length; i++) {
                _this.draw_obj(_this.objects[i]);
                var new_matriz_obj = void 0;
                new_matriz_obj = mult_matriz(get_matriz_rot_y(0.007), _this.objects[i].mat_dots); // Faz a animacao rotacionando o objeto no eixo y
                _this.objects[i].mat_dots = new_matriz_obj;
            }
            requestAnimationFrame(_this.animate_world);
        };
        this.ctx = ctx_out;
        this.camera = cam;
        this.matriz_SRU_SRT = this.camera.get_mat_SRU_SRT();
    }
    Universe.prototype.draw_dot = function (x, y, color) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.arc(x, y, 2, 0, 360, false);
        this.ctx.fill();
    };
    Universe.prototype.draw_obj = function (obj) {
        var points;
        points = mult_matriz(this.matriz_SRU_SRT, obj.mat_dots);
        for (var i = 0; i < points[0].length; i++) {
            this.draw_dot(points[0][i] / points[3][i], points[1][i] / points[3][i], "black"); // Divide pelo fator homogenio
        }
    };
    Universe.prototype.add_obj = function (obj) {
        this.objects.push(obj);
    };
    return Universe;
}());
var canvas = document.createElement("canvas");
canvas.id = "canvas-giratorio";
canvas.style.backgroundColor = "white";
canvas.style.border = "1px solid black";
canvas.style.width = "1000px";
canvas.style.height = "800px";
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
ctx.imageSmoothingEnabled = false;
document.body.appendChild(canvas);
var vrp_camera = new Dot(30, 50, 300);
var focal_point_camera = new Dot(30, 20, 50);
var distance_point = 248.194;
var camera = new Camera(vrp_camera, focal_point_camera, distance_point, 0, 0, canvas.width, canvas.height);
// constructor(view_reference_point: Dot, focal_p: Dot, dp: number, wid: number, heig: number, min_x: number, min_y: number, max_x: number, max_y: number){
var uni = new Universe(ctx, camera);
// let A = new Dot(-10, -20, 10);
// let B = new Dot(10, -20, 10);
// let C = new Dot(7, 20, 10);
// let D = new Dot(-7, 20, 10);
// let E = new Dot(10, -20, -10);
// let F = new Dot(7, 20, -10);
// let G = new Dot(-7, 20, -10);
// let H = new Dot(-10, -20, -10);
// let pyramid_dots: Array<Dot>;
// pyramid_dots = [A, B, C, D, E, F, G, H];
// let pyramid = new Obj_3D("blue", pyramid_dots);
// uni.add_obj(pyramid);
var H = new Dot(-7.5, -0.75, 2.25);
var I = new Dot(-3.5, -4.75, 6.25);
var J = new Dot(3.5, 4.25, -9.75);
var K = new Dot(7.5, 1.25, 1.25);
var control_dots;
control_dots = [H, I, J, K];
var spline = new Spline(control_dots);
uni.add_obj(spline.create_obj(0.1));
uni.animate_world();
