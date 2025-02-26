/// <reference path= "./spline.ts" />
// import { get } from "lodash";
// import { random } from "lodash"
var Surface = /** @class */ (function () {
    function Surface(star_x, star_y, star_z, ni, nj, ti, tj, resolutioni, resolutionj, control_points) {
        if (control_points === void 0) { control_points = [[new Dot(0, 0, 0)]]; }
        this.control_points = Array(ni).fill(null).map(function () { return Array(nj).fill(new Dot(0, 0, 0)); });
        this.control_points_screen = Array(ni).fill(null).map(function () { return Array(nj).fill(new Dot(0, 0, 0)); });
        this.outp = Array(resolutioni).fill(null).map(function () { return Array(resolutionj).fill(new Dot(0, 0, 0)); });
        this.ni = ni;
        this.nj = nj;
        this.ti = ti;
        this.tj = tj;
        this.resi = resolutioni;
        this.resj = resolutionj;
        var counter = 0;
        console.log("x = ".concat(star_x, "  y = ").concat(star_y, "   z = ").concat(star_z));
        for (var i = 0; i < ni; i++) {
            for (var j = 0; j < nj; j++) {
                counter++;
                this.control_points[i][j] = new Dot(i * 13 + star_x, Math.random() * 10 + star_y, j * 13 + star_z);
            }
        }
    }
    Surface.prototype.callfp = function (ctx, vrp) {
        for (var _i = 0, _a = this.faces; _i < _a.length; _i++) {
            var face = _a[_i];
            if (face.fillpoly) {
                face.fillpoly(ctx, vrp, vrp);
            }
            else {
                console.error("Erro: Método fillpoly não encontrado na face", face);
            }
        }
    };
    Surface.prototype.SplineKnots = function (u, n, t) {
        var j;
        // Primeiros 't' nós iguais a 0
        for (j = 0; j < t; j++) {
            u[j] = 0;
        }
        // Nós intermediários uniformemente distribuídos
        for (; j <= n; j++) {
            u[j] = j - t + 1;
        }
        // Últimos 't' nós iguais ao último valor válido
        for (; j <= n + t; j++) {
            u[j] = n - t + 1; // Alterado de "n - t + 2" para "n - t + 1" para evitar fechamento
        }
    };
    Surface.prototype.SplineBlend = function (k, t, u, v) {
        // console.log(`k=${k}, t=${t}, u[k]=${u[k]}, u[k+1]=${u[k+1]}, v=${v}`);
        if (t == 1) {
            return u[k] <= v && v < u[k + 1] ? 1 : 0;
        }
        var value = 0;
        if (u[k + t - 1] !== u[k]) {
            value += (v - u[k]) / (u[k + t - 1] - u[k]) * this.SplineBlend(k, t - 1, u, v);
        }
        if (u[k + t] !== u[k + 1]) {
            value += (u[k + t] - v) / (u[k + t] - u[k + 1]) * this.SplineBlend(k + 1, t - 1, u, v);
        }
        return value;
    };
    Surface.prototype.generateSurface = function () {
        var counter = 0;
        var intervalI = 0;
        var incrementI = (this.ni - this.ti + 1) / (this.resi - 1);
        var incrementJ = (this.nj - this.tj + 1) / (this.resj - 1);
        var knotsI = new Array(this.ni + this.ti);
        var knotsJ = new Array(this.nj + this.tj);
        this.SplineKnots(knotsI, this.ni, this.ti);
        this.SplineKnots(knotsJ, this.nj, this.tj);
        for (var i = 0; i < this.resi - 1; i++) {
            var intervalJ_1 = 0;
            for (var j = 0; j < this.resj - 1; j++) {
                var x = 0, y = 0, z = 0;
                for (var ki = 0; ki < this.ni; ki++) {
                    for (var kj = 0; kj < this.nj; kj++) {
                        var bi = this.SplineBlend(ki, this.ti, knotsI, intervalI);
                        var bj = this.SplineBlend(kj, this.tj, knotsJ, intervalJ_1);
                        x += this.control_points[ki][kj].x * bi * bj;
                        y += this.control_points[ki][kj].y * bi * bj;
                        z += this.control_points[ki][kj].z * bi * bj;
                    }
                }
                this.outp[i][j] = new Dot(x, y, z);
                intervalJ_1 += incrementJ;
            }
            intervalI += incrementI;
        }
        incrementI = (this.ni - this.ti + 1) / (this.resi - 1);
        intervalI = 0;
        for (var i = 0; i < this.resi - 1; i++) {
            this.outp[i][this.resj - 1] = new Dot(0, 0, 0);
            for (var ki = 0; ki < this.ni; ki++) {
                var bi = this.SplineBlend(ki, this.ti, knotsI, intervalI);
                this.outp[i][this.resj - 1].x += (this.control_points[ki][this.nj - 1].x * bi);
                this.outp[i][this.resj - 1].y += (this.control_points[ki][this.nj - 1].y * bi);
                this.outp[i][this.resj - 1].z += (this.control_points[ki][this.nj - 1].z * bi);
            }
            intervalI += incrementI;
        }
        this.outp[this.resi - 1][this.resj - 1] = new Dot(this.control_points[this.ni - 1][this.nj - 1].x, this.control_points[this.ni - 1][this.nj - 1].y, this.control_points[this.ni - 1][this.nj - 1].z);
        var intervalJ = 0;
        for (var j = 0; j < this.resj - 1; j++) {
            this.outp[this.resi - 1][j] = new Dot(0, 0, 0);
            for (var kj = 0; kj < this.nj; kj++) {
                var bj = this.SplineBlend(kj, this.tj, knotsJ, intervalJ);
                this.outp[this.resi - 1][j].x += (this.control_points[this.ni - 1][kj].x * bj);
                this.outp[this.resi - 1][j].y += (this.control_points[this.ni - 1][kj].y * bj);
                this.outp[this.resi - 1][j].z += (this.control_points[this.ni - 1][kj].z * bj);
            }
            intervalJ += incrementJ;
        }
        this.outp[this.resi - 1][this.resj - 1] = new Dot(this.control_points[this.ni - 1][this.nj - 1].x, this.control_points[this.ni - 1][this.nj - 1].y, this.control_points[this.ni - 1][this.nj - 1].z);
    };
    Surface.prototype.displaySurface = function () {
        console.log("LIST");
        console.log("{ = CQUAD");
        for (var i = 0; i < this.resi - 1; i++) {
            for (var j = 0; j < this.resj - 1; j++) {
                console.log("".concat(this.outp[i][j].x, " ").concat(this.outp[i][j].y, " ").concat(this.outp[i][j].z, " 1 1 1 1"), "".concat(this.outp[i][j + 1].x, " ").concat(this.outp[i][j + 1].y, " ").concat(this.outp[i][j + 1].z, " 1 1 1 1"), "".concat(this.outp[i + 1][j + 1].x, " ").concat(this.outp[i + 1][j + 1].y, " ").concat(this.outp[i + 1][j + 1].z, " 1 1 1 1"), "".concat(this.outp[i + 1][j].x, " ").concat(this.outp[i + 1][j].y, " ").concat(this.outp[i + 1][j].z, " 1 1 1 1"));
            }
        }
        console.log("}");
    };
    Surface.prototype.print_all_cp = function () {
        for (var i = 0; i < this.ni; i++) {
            for (var j = 0; j < this.nj; j++) {
                this.control_points[i][j].print_obj("Dots");
            }
        }
    };
    // Transforma os pontos em uma matriz normal para a conversao utilizando a matriz_SRU_SRT
    Surface.prototype.get_cp_as_mat = function () {
        var _this = this;
        var mat_aux = Array(4).fill(null).map(function () { return Array((_this.ni) * (_this.nj)).fill(0); });
        for (var x = 0; x < this.ni; x++) {
            for (var y = 0; y < this.nj; y++) {
                mat_aux[0][x * this.ni + y] = this.control_points[x][y].x;
                mat_aux[1][x * this.ni + y] = this.control_points[x][y].y;
                mat_aux[2][x * this.ni + y] = this.control_points[x][y].z;
                mat_aux[3][x * this.ni + y] = 1;
                // alert(x+y)
            }
        }
        // print_matriz(mat_aux, "MINHA MATRIZINHA")
        // alert("ESTOPI")
        return mat_aux;
    };
    Surface.prototype.get_outp_as_mat = function () {
        var _this = this;
        var mat_aux = Array(4).fill(null).map(function () { return Array(_this.resi * _this.resj).fill(0); });
        for (var x = 0; x < this.resi; x++) {
            for (var y = 0; y < this.resj; y++) {
                mat_aux[0][x * this.resi + y] = this.outp[x][y].x;
                mat_aux[1][x * this.resi + y] = this.outp[x][y].y;
                mat_aux[2][x * this.resi + y] = this.outp[x][y].z;
                mat_aux[3][x * this.resi + y] = 1;
            }
        }
        return mat_aux;
    };
    // A estrutura utilizada para multiplicar a matriz (M_SRU_SRT), pede para que cada "Dot" seja uma coluna e o x, y, z e 1, sejam as linhas, a funcao abaixo faz com que dessa estrutura possamos converter novamente para uma matriz de dots "normal" (Dot[][])
    Surface.prototype.update_cp_with_mat = function (normal_mat) {
        for (var i = 0; i < this.ni; i++) {
            for (var j = 0; j < this.nj; j++) {
                this.control_points[i][j].x = normal_mat[0][i * this.ni + j];
                this.control_points[i][j].y = normal_mat[1][i * this.ni + j];
                this.control_points[i][j].z = normal_mat[2][i * this.ni + j];
            }
        }
    };
    Surface.prototype.update_outp_with_mat = function (normal_mat) {
        for (var i = 0; i < this.resi; i++) {
            for (var j = 0; j < this.resj; j++) {
                this.outp[i][j].x = normal_mat[0][i * this.resi + j];
                this.outp[i][j].y = normal_mat[1][i * this.resi + j];
                this.outp[i][j].z = normal_mat[2][i * this.resi + j];
            }
        }
    };
    Surface.prototype.create_faces = function (matriz_SRU_SRT) {
        var ps = mult_matriz(matriz_SRU_SRT, this.get_outp_as_mat()); // ps = points_screen
        this.faces = [];
        for (var i = 0; i < this.resi - 1; i++) {
            for (var j = 0; j < this.resj - 1; j++) { // A matriz resultado esta em formato diferente do retornado pela operacao de mult de matriz, por isso essa conversao maluca
                var A = new Dot(ps[0][i * this.resj + j] / ps[3][i * this.resj + j], ps[1][i * this.resj + j] / ps[3][i * this.resj + j], ps[2][i * this.resj + j]);
                var B = new Dot(ps[0][i * this.resj + (j + 1)] / ps[3][i * this.resj + (j + 1)], ps[1][i * this.resj + (j + 1)] / ps[3][i * this.resj + (j + 1)], ps[2][i * this.resj + (j + 1)]);
                var C = new Dot(ps[0][(i + 1) * this.resj + (j + 1)] / ps[3][(i + 1) * this.resj + (j + 1)], ps[1][(i + 1) * this.resj + (j + 1)] / ps[3][(i + 1) * this.resj + (j + 1)], ps[2][(i + 1) * this.resj + (j + 1)]);
                var D = new Dot(ps[0][(i + 1) * this.resj + j] / ps[3][(i + 1) * this.resj + j], ps[1][(i + 1) * this.resj + j] / ps[3][(i + 1) * this.resj + j], ps[2][(i + 1) * this.resj + j]);
                var arr_dots = [A, B, C, D];
                this.faces.push(new Face(arr_dots));
            }
        }
    };
    Surface.prototype.define_dots_screen = function (matriz_SRU_SRT) {
        var cp = mult_matriz(matriz_SRU_SRT, this.get_cp_as_mat());
        for (var i = 0; i < this.ni; i++) {
            for (var j = 0; j < this.nj; j++) { // A matriz resultado esta em formato diferente do retornado pela operacao de mult de matriz, por isso essa conversao maluca
                var A = new Dot(cp[0][i * this.nj + j] / cp[3][i * this.nj + j], cp[1][i * this.nj + j] / cp[3][i * this.nj + j], cp[2][i * this.nj + j]);
                this.control_points_screen[i][j] = A;
            }
        }
    };
    Surface.prototype.find_closer_cp_to_dot = function (click) {
        var closer_i = -1;
        var closer_j = -1;
        var closer_dist = 1000;
        for (var i = 0; i < this.ni; i++) {
            for (var j = 0; j < this.nj; j++) {
                var new_dist = distance_between_dots_screen(this.control_points_screen[i][j], click);
                if (new_dist < closer_dist) {
                    closer_dist = new_dist;
                    closer_i = i;
                    closer_j = j;
                }
            }
        }
        ;
        return [closer_i, closer_j, closer_dist];
    };
    return Surface;
}());
