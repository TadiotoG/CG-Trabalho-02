/// <reference path= "./script.ts" />
var Spline = /** @class */ (function () {
    function Spline(arr) {
        this.gap = 0.1;
        this.softness = 1 / 6;
        this.matB = [[-1 * this.softness, 3 * this.softness, -3 * this.softness, 1 * this.softness],
            [3 * this.softness, -6 * this.softness, 3 * this.softness, 0 * this.softness],
            [-3 * this.softness, 0 * this.softness, 3 * this.softness, 0 * this.softness],
            [1 * this.softness, 4 * this.softness, 1 * this.softness, 0 * this.softness]];
        this.control_points = arr;
        this.centroide = this.get_centroide();
        this.mat_control_points = this.get_control_points_as_mat();
    }
    Spline.prototype.calc_curve = function (t) {
        var mat_t = [[Math.pow(t, 3), Math.pow(t, 2), t, 1]];
        var aux = mult_matriz(this.matB, this.mat_control_points);
        // print_matriz(this.mat_control_points, "Control Points");
        // print_matriz(this.matB, "Mat_b");
        // print_matriz(mat_t, "Mat_t");
        // this.centroide.print_obj("Centroide");
        var mat_return = mult_matriz(mat_t, aux);
        return new Dot(mat_return[0][0], mat_return[0][1], mat_return[0][2]);
        // return mat_return;
    };
    Spline.prototype.create_obj = function (t) {
        var list_dots = this.control_points;
        var quant = 1 / t;
        for (var i = 0; i < quant; i++) {
            // console.log("T = " + t*i)
            var new_one = this.calc_curve(t * i);
            // new_one.print_obj("Pontos");
            list_dots.push(new_one);
        }
        return new Obj_3D("blue", list_dots);
    };
    Spline.prototype.get_centroide = function () {
        var sum_x = 0;
        var sum_y = 0;
        var sum_z = 0;
        for (var i = 0; i < this.control_points.length; i++) {
            sum_x += this.control_points[i].x;
            sum_y += this.control_points[i].y;
            sum_z += this.control_points[i].z;
        }
        return new Dot(sum_x / this.control_points.length, sum_y / this.control_points.length, sum_z / this.control_points.length);
    };
    Spline.prototype.get_control_points_as_mat = function () {
        var mat_aux;
        mat_aux = [[this.control_points[0].x, this.control_points[0].y, this.control_points[0].z]];
        for (var i = 1; i < this.control_points.length; i++) {
            mat_aux.push([this.control_points[i].x, this.control_points[i].y, this.control_points[i].z]);
        }
        return mat_aux;
    };
    return Spline;
}());
// let H = new Dot(-7.5, -0.75, 2.25);
// let I = new Dot(-3.5, -4.75, 6.25);
// let J = new Dot(3.5, 4.25, -9.75);
// let K = new Dot(7.5, 1.25, 1.25);
// let control_dots: Array<Dot>; 
// control_dots = [H, I, J, K];
// let spline = new Spline(control_dots);
// print_matriz(get_ArrDots_as_mat(spline.control_points), "Spline");
// print_matriz(spline.calc_curve(0.1), "Result");
