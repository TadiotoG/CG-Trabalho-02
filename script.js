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
function A_minus_B(A, B) {
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
var Camera = /** @class */ (function () {
    function Camera(view_reference_point, focal_p) {
        this.vrp = view_reference_point;
        this.focal_point = focal_p;
        this.vet_n = A_minus_B(this.vrp, this.focal_point);
        this.vet_n.print_obj("Vet n ");
        this.define_vector_v();
        this.vet_v.print_obj("Vet v ");
        this.vet_u = prod_vet(this.vet_v, this.vet_n);
        this.vet_u.print_obj("Vet u ");
    }
    Camera.prototype.define_vector_v = function () {
        var y = new Vet(0, 1, 0);
        var y_ProdEsc_unitaryN = prod_escalar(y, this.vet_n.unitary);
        var aux_x = this.vet_n.unitary.x * y_ProdEsc_unitaryN;
        var aux_y = this.vet_n.unitary.y * y_ProdEsc_unitaryN;
        var aux_z = this.vet_n.unitary.z * y_ProdEsc_unitaryN;
        var aux = new Vet(aux_x, aux_y, aux_z);
        this.vet_v = A_minus_B(y, aux);
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
var camera = new Camera(vrp_camera, focal_point_camera);
