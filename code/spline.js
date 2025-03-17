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
    function Dot(new_x, new_y, new_z, col, r_gou, g_gou, b_gou, x_phong, y_phong, z_phong) {
        if (col === void 0) { col = "rgb(".concat(255, ", ").concat(0, ", ").concat(0, ")"); }
        if (r_gou === void 0) { r_gou = 0; }
        if (g_gou === void 0) { g_gou = 0; }
        if (b_gou === void 0) { b_gou = 0; }
        if (x_phong === void 0) { x_phong = 0; }
        if (y_phong === void 0) { y_phong = 0; }
        if (z_phong === void 0) { z_phong = 0; }
        this.x = new_x;
        this.y = new_y;
        this.z = new_z;
        this.color = col;
        this.r_gouraud = r_gou;
        this.g_gouraud = g_gou;
        this.b_gouraud = b_gou;
        this.x_phong = x_phong;
        this.y_phong = y_phong;
        this.z_phong = z_phong;
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
var Face = /** @class */ (function () {
    function Face(array_dots, col, other_side_col, cor_aresta) {
        if (col === void 0) { col = "black"; }
        if (other_side_col === void 0) { other_side_col = "red"; }
        if (cor_aresta === void 0) { cor_aresta = "blue"; }
        this.arestas = [];
        this.inters = [];
        this.inters_z = [];
        this.arestac = 0;
        this.dots = array_dots;
        this.cria_arestas();
        this.centroide = this.get_centroide();
        if (array_dots.length > 2) {
            this.vet_normal = this.get_normal();
        }
        this.color = col;
        this.other_side_line_color = other_side_col;
        this.line_color = cor_aresta;
    }
    Face.prototype.cria_arestas = function () {
        var _this = this;
        this.arestas = [];
        this.dots.forEach(function (dot, i) {
            var nextDot = _this.dots[(i + 1) % (_this.dots.length)];
            _this.arestas.push([dot, nextDot]);
        });
    };
    Face.prototype.get_centroide = function () {
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
    Face.prototype.get_normal = function () {
        if (this.dots.length < 3) {
            throw new Error("Uma face precisa de pelo menos três pontos para calcular o vetor normal.");
        }
        var P0 = this.dots[0];
        var P1 = this.dots[1];
        var P2 = this.dots[2];
        var v1 = new Vet(P0.x - P1.x, P0.y - P1.y, P0.z - P1.z);
        var v2 = new Vet(P2.x - P1.x, P2.y - P1.y, P2.z - P1.z);
        var normal = prod_vet(v2, v1);
        return normal;
    };
    Face.prototype.addAresta = function (dot1, dot2) {
        this.arestas.push([dot1, dot2]);
    };
    Face.prototype.swap_arestas = function (i) {
        if (i >= 0 && i < this.arestas.length) {
            var _a = this.arestas[i], dot1 = _a[0], dot2 = _a[1];
            this.arestas[i] = [dot2, dot1];
        }
    };
    Face.prototype.fillpoly = function (ctx, normal) {
        var _this = this;
        var ymin = Math.round(Math.min.apply(Math, this.dots.map(function (p) { return p.y; })));
        var ymax = Math.round(Math.max.apply(Math, this.dots.map(function (p) { return p.y; })));
        this.inters = Array.from({ length: ymax - ymin + 1 }, function () { return []; });
        this.arestas.forEach(function (aresta, i) {
            var _a;
            if (aresta[0].y === aresta[1].y)
                return;
            if (aresta[0].y > aresta[1].y) {
                _a = [aresta[1], aresta[0]], _this.arestas[i][0] = _a[0], _this.arestas[i][1] = _a[1];
            }
            var x1 = aresta[0].x, y1 = Math.ceil(aresta[0].y);
            var x2 = aresta[1].x, y2 = Math.floor(aresta[1].y);
            var coeficiente = (x2 - x1) / (y2 - y1);
            var x = x1;
            var index = Math.floor(y1 - ymin);
            for (var y = y1; y <= y2; y++) {
                if (!_this.inters[index])
                    _this.inters[index] = [];
                _this.inters[index++].push(Math.round(x));
                x += coeficiente;
            }
        });
        this.inters.forEach(function (line, i) {
            line.sort(function (a, b) { return a - b; });
            _this.draw(line, ymin + i, ctx, normal);
        });
    };
    Face.prototype.draw = function (line, y, ctx, normal) {
        ctx.fillStyle = this.color;
        for (var i = 0; i < line.length; i += 2) {
            var x1 = Math.ceil(line[i]);
            var x2 = Math.floor(line[i + 1]);
            for (var x = x1; x <= x2; x++) {
                ctx.fillRect(x, y, 1, 1);
            }
        }
        var arestaCheckbox;
        arestaCheckbox = document.getElementById("aresta");
        if (arestaCheckbox && arestaCheckbox.checked) {
            this.draw_face(ctx, normal);
        }
    };
    Face.prototype.draw_face = function (ctx, normal) {
        for (var i = 0; i < this.dots.length; i++) {
            if (i === this.dots.length - 1) {
                this.draw_line(this.dots[i], this.dots[0], ctx, normal);
            }
            else {
                this.draw_line(this.dots[i], this.dots[i + 1], ctx, normal);
            }
        }
    };
    ;
    Face.prototype.draw_line = function (dot0, dot1, ctx, normal) {
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(dot0.x, dot0.y);
        ctx.lineTo(dot1.x, dot1.y);
        if (normal < 0) {
            ctx.strokeStyle = this.line_color;
        }
        else {
            ctx.strokeStyle = this.other_side_line_color;
        }
        ctx.stroke();
    };
    ;
    return Face;
}());
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
        var mat_return = mult_matriz(mat_t, aux);
        return new Dot(mat_return[0][0], mat_return[0][1], mat_return[0][2]);
    };
    Spline.prototype.create_dots_to_the_entire_curve = function (t) {
        var list_dots = this.control_points;
        var quant = 1 / t;
        for (var i = 0; i < quant; i++) {
            var new_one = this.calc_curve(t * i);
            list_dots.push(new_one);
        }
        return list_dots;
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
    Spline.prototype.update_mat_control_points = function () {
        this.mat_control_points = this.get_control_points_as_mat();
    };
    return Spline;
}());
function get_matriz_escala(x) {
    var mat_aux;
    mat_aux = ([[x, 0, 0, 0],
        [0, x, 0, 0],
        [0, 0, x, 0],
        [0, 0, 0, 1]]);
    return mat_aux;
}
function get_matriz_translada(x, y, z) {
    var mat_aux;
    mat_aux = ([[1, 0, 0, x],
        [0, 1, 0, y],
        [0, 0, 1, z],
        [0, 0, 0, 1]]);
    return mat_aux;
}
function get_matriz_rot_x(angle) {
    var mat_aux;
    mat_aux = ([[1, 0, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle), 0],
        [0, Math.sin(angle), Math.cos(angle), 0],
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
function get_matriz_rot_z(angle) {
    var mat_aux;
    mat_aux = ([[Math.cos(angle), -Math.sin(angle), 0, 0],
        [Math.sin(angle), Math.cos(angle), 0, 0],
        [0, 0, 1, 0],
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
function VetA_plus_VetB(A, B) {
    var x, y, z;
    x = A.x + B.x;
    y = A.y + B.y;
    z = A.z + B.z;
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
function distance_between_dots_screen(A, B) {
    var aux_x = B.x - A.x;
    var aux_y = B.y - A.y;
    return Math.sqrt(Math.pow(aux_x, 2) + Math.pow(aux_y, 2));
}
var Aresta = /** @class */ (function () {
    function Aresta(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.Dx = p2.x - p1.x;
        this.Dy = p2.y - p1.y;
        this.Dz = p2.z - p1.z;
        this.tx = this.Dx / this.Dy;
        this.tz = this.Dz / this.Dy;
    }
    return Aresta;
}());
var Lamp = /** @class */ (function () {
    function Lamp(intensidade_da_fonte, x, y, z) {
        this.il = intensidade_da_fonte;
        this.pos = new Dot(x, y, z);
    }
    return Lamp;
}());
