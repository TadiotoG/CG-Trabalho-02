/// <reference path= "./spline.ts" />
// import { get } from "lodash";
// import { random } from "lodash"
var Surface = /** @class */ (function () {
    function Surface(res) {
        this.control_points = Array(res[0]).fill(null).map(function () { return Array(res[1]).fill(new Dot(4, 5, 6)); });
        this.resolution = res;
        for (var i = 0; i < res[0]; i++) {
            for (var j = 0; j < res[1]; j++) {
                // console.log(i + " <- i     j ->" + j);
                // this.control_points[i][j].x = i;
                // this.control_points[i][j].y = j;
                // this.control_points[i][j].z = Math.random()*10;
                this.control_points[i][j] = new Dot(i * 14, Math.random() * 10, j * 14);
                // console.log(i + "," + j + " DOT = "+ "(" + this.control_points[i][j].x + ", " + this.control_points[i][j].y + ", " + this.control_points[i][j].z + ")")
            }
        }
        // this.control_points[0][0].print_obj("Dots");
        // this.control_points[0][1].print_obj("Dots");
        // this.control_points[1][0].print_obj("Dots");
        // this.control_points[1][1].print_obj("Dots");
        // print_matriz(this.get_cp_as_mat(), "INFERNO")
    }
    Surface.prototype.create_splines = function (arr_spline) {
        var i, j;
        i = 0;
        j = 0;
        while (i < this.resolution[0] - 1) {
            j = 0;
            while (j < this.resolution[1] - 1) {
                var arr_dots = void 0;
                arr_dots = [this.control_points[i][j], this.control_points[i + 1][j], this.control_points[i][j + 1], this.control_points[i + 1][j + 1]];
                arr_spline.push(new Spline(arr_dots));
                if (j != this.resolution[1] - 2) {
                    arr_dots = [this.control_points[i + 1][j], this.control_points[i][j + 1], this.control_points[i + 1][j + 1], this.control_points[i][j + 2]];
                    arr_spline.push(new Spline(arr_dots));
                }
                j++;
            }
            i++;
        }
        i = 0;
        j = 0;
        while (j < this.resolution[1] - 1) {
            i = 0;
            while (i < this.resolution[0] - 1) {
                var arr_dots = void 0;
                arr_dots = [this.control_points[i][j], this.control_points[i][j + 1], this.control_points[i + 1][j], this.control_points[i + 1][j + 1]];
                arr_spline.push(new Spline(arr_dots));
                if (i != this.resolution[0] - 2) {
                    arr_dots = [this.control_points[i][j + 1], this.control_points[i + 1][j], this.control_points[i + 1][j + 1], this.control_points[i + 2][j]];
                    arr_spline.push(new Spline(arr_dots));
                }
                i++;
            }
            j++;
        }
    };
    Surface.prototype.print_all_cp = function () {
        for (var i = 0; i < this.resolution[0]; i++) {
            for (var j = 0; j < this.resolution[1]; j++) {
                this.control_points[i][j].print_obj("Dots");
            }
        }
    };
    // Transforma os pontos em uma matriz normal para a conversao utilizando a matriz_SRU_SRT
    Surface.prototype.get_cp_as_mat = function () {
        var _this = this;
        var mat_aux = Array(4).fill(null).map(function () { return Array(_this.resolution[0] * _this.resolution[1]).fill(2); });
        for (var x = 0; x < this.resolution[0]; x++) {
            for (var y = 0; y < this.resolution[1]; y++) {
                mat_aux[0][x * this.resolution[0] + y] = this.control_points[x][y].x;
                mat_aux[1][x * this.resolution[0] + y] = this.control_points[x][y].y;
                mat_aux[2][x * this.resolution[0] + y] = this.control_points[x][y].z;
                mat_aux[3][x * this.resolution[0] + y] = 1;
                // alert(x+y)
            }
        }
        // print_matriz(mat_aux, "MINHA MATRIZINHA")
        // alert("ESTOPI")
        return mat_aux;
    };
    // A estrutura utilizada para multiplicar a matriz (M_SRU_SRT), pede para que cada "Dot" seja uma coluna e o x, y, z e 1, sejam as linhas, a funcao abaixo faz com que dessa estrutura possamos converter novamente para uma matriz de dots "normal" (Dot[][])
    Surface.prototype.update_cp_with_mat = function (normal_mat) {
        for (var i = 0; i < this.resolution[0]; i++) {
            for (var j = 0; j < this.resolution[1]; j++) {
                this.control_points[i][j].x = normal_mat[0][i * this.resolution[0] + j];
                this.control_points[i][j].y = normal_mat[1][i * this.resolution[0] + j];
                this.control_points[i][j].z = normal_mat[2][i * this.resolution[0] + j];
            }
        }
    };
    return Surface;
}());
