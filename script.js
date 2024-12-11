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
    }
    return Obj_3D;
}());
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
    //let result: number[][];
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
var Camera = /** @class */ (function () {
    function Camera(view_reference_point, focal_p, dp, wid, heig, min_x, min_y, max_x, max_y) {
        this.vrp = view_reference_point;
        this.focal_point = focal_p;
        this.dp = dp;
        this.x_min = min_x;
        this.y_min = min_y;
        this.x_max = max_x;
        this.y_max = max_y;
        this.width = wid;
        this.height = heig;
        this.vet_n = VetA_minus_VetB(this.vrp, this.focal_point);
        this.vet_n.print_obj("Vet n ");
        this.define_vector_v();
        this.vet_v.print_obj("Vet v ");
        this.vet_u = prod_vet(this.vet_v, this.vet_n);
        this.vet_u.print_obj("Vet u ");
        this.matriz_SRU_SRC = ([
            [this.vet_u.unitary.x, this.vet_u.unitary.y, this.vet_u.unitary.z, -prod_escalar(this.vrp, this.vet_u.unitary)],
            [this.vet_v.unitary.x, this.vet_v.unitary.y, this.vet_v.unitary.z, -prod_escalar(this.vrp, this.vet_v.unitary)],
            [this.vet_n.unitary.x, this.vet_n.unitary.y, this.vet_n.unitary.z, -prod_escalar(this.vrp, this.vet_n.unitary)],
            [0, 0, 0, 1]
        ]);
        print_matriz(this.matriz_SRU_SRC, "SRU_SRC");
        this.define_matriz_pesp();
        print_matriz(this.matriz_persp, "Persp");
        this.define_matriz_jp();
    }
    Camera.prototype.define_vector_v = function () {
        var y = new Vet(0, 1, 0);
        var y_ProdEsc_unitaryN = prod_escalar(y, this.vet_n.unitary);
        var aux_x = this.vet_n.unitary.x * y_ProdEsc_unitaryN;
        var aux_y = this.vet_n.unitary.y * y_ProdEsc_unitaryN;
        var aux_z = this.vet_n.unitary.z * y_ProdEsc_unitaryN;
        var aux = new Vet(aux_x, aux_y, aux_z);
        this.vet_v = VetA_minus_VetB(y, aux);
    };
    Camera.prototype.define_matriz_pesp = function () {
        var mat_sru;
        var mat_src;
        var x_vp = (this.vrp.x + (this.dp * (-this.vet_n.unitary.x)));
        var y_vp = (this.vrp.y + (this.dp * (-this.vet_n.unitary.y)));
        var z_vp = (this.vrp.z + (this.dp * (-this.vet_n.unitary.z)));
        mat_sru = ([[x_vp, this.vrp.x],
            [y_vp, this.vrp.y],
            [z_vp, this.vrp.z],
            [1, 1]]);
        mat_src = mult_matriz(this.matriz_SRU_SRC, mat_sru);
        print_matriz(mat_src, "SRC");
        var new_z_vp = mat_src[2][0];
        var new_z_prp = mat_src[2][1];
        this.matriz_persp = ([[1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, -(new_z_vp / this.dp), new_z_vp * (new_z_prp / this.dp)],
            [0, 0, -1 / this.dp, new_z_prp / this.dp]
        ]);
    };
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
        console.log("Teste = " + this.height);
        this.matriz_jp = ([[(u_max - u_min) / (x_max - x_min), 0, 0, aux_1],
            [0, (v_min - v_max) / (y_max - y_min), 0, aux_2],
            [0, 0, 1, 0],
            [0, 0, 0, 1]]);
        print_matriz(this.matriz_jp, "JP");
    };
    Camera.prototype.get_this_fucking_matriz = function () {
        var mat_aux;
        mat_aux = mult_matriz(this.matriz_jp, this.matriz_persp);
        mat_aux = mult_matriz(mat_aux, this.matriz_SRU_SRC);
        print_matriz(mat_aux, "Final");
        return mat_aux;
    };
    return Camera;
}());
var Universe = /** @class */ (function () {
    function Universe(ctx_out, width_limit, height_limit) {
        var _this = this;
        this.animate_world = function () {
            _this.ctx.fillStyle = "white";
            _this.ctx.fillRect(0, 0, canvas.width, canvas.height);
            requestAnimationFrame(_this.animate_world);
        };
        this.ctx = ctx_out;
    }
    Universe.prototype.draw_it = function () {
        this.ctx.beginPath();
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(100, 100, 100, 100);
        this.ctx.stroke();
    };
    ;
    Universe.prototype.draw_dot = function (x, y, color) {
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.arc(x, y, 2, 0, 360, false);
        this.ctx.fill();
    };
    Universe.prototype.test_drawing = function (cam, matriz) {
        var points;
        this.matriz_SRU_SRT = cam.get_this_fucking_matriz();
        points = mult_matriz(this.matriz_SRU_SRT, matriz);
        // print_matriz(points, "Pontos")
        for (var i = 0; i < points[0].length; i++) {
            this.draw_dot(points[0][i] / points[3][i], points[1][i] / points[3][i], "black");
        }
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
canvas.width = 1000;
canvas.height = 800;
ctx.imageSmoothingEnabled = false;
document.body.appendChild(canvas);
var uni = new Universe(ctx, canvas.width, canvas.height);
var vrp_camera = new Dot(25, 15, 80);
var focal_point_camera = new Dot(20, 10, 25);
var distance_point = 20;
var camera = new Camera(vrp_camera, focal_point_camera, distance_point, 16, 12, 0, 0, 319, 239);
var A = new Dot(21.2, 0.7, 42.3);
var B = new Dot(34.1, 3.4, 27.2);
var C = new Dot(18.8, 5.6, 14.6);
var E = new Dot(20, 20.9, 31.6);
var pyramid_dots;
pyramid_dots = [A, B, C, E];
var matriz_teste;
matriz_teste = ([[21.2, 34.1, 18.8, 20],
    [0.7, 3.4, 5.6, 20.9],
    [42.3, 27.2, 14.6, 31.6],
    [1, 1, 1, 1]]);
uni.test_drawing(camera, matriz_teste);
var pyramid = new Obj_3D("blue", pyramid_dots);
