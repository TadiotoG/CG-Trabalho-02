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
    function Dot(new_x, new_y, new_z, col, r_gouraud, g_gouraud, b_gouraud) {
        if (col === void 0) { col = "red"; }
        if (r_gouraud === void 0) { r_gouraud = 0; }
        if (g_gouraud === void 0) { g_gouraud = 0; }
        if (b_gouraud === void 0) { b_gouraud = 0; }
        this.x = new_x;
        this.y = new_y;
        this.z = new_z;
        this.color = col;
        this.r_gouraud = r_gouraud;
        this.g_gouraud = g_gouraud;
        this.b_gouraud = b_gouraud;
    }
    Dot.prototype.print_obj = function (dot_name) {
        //console.log(dot_name + "-> (" + this.x + "," + this.y + "," + this.z + ")")
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
        //console.log(vet_name + "-> (" + this.x + "," + this.y + "," + this.z + ")");
        this.unitary.print_obj("Unitary ");
        //console.log();
    };
    return Vet;
}(Dot));
var Face = /** @class */ (function () {
    function Face(array_dots, col, other_side_col, cor_aresta) {
        if (col === void 0) { col = "black"; }
        if (other_side_col === void 0) { other_side_col = "red"; }
        if (cor_aresta === void 0) { cor_aresta = "blue"; }
        this.color_other_side = "red";
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
        this.color_other_side = other_side_col;
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
        // Pegamos três pontos da face
        var P0 = this.dots[0];
        var P1 = this.dots[1];
        var P2 = this.dots[2];
        // Criamos os vetores
        var v1 = new Vet(P1.x - P0.x, P1.y - P0.y, P1.z - P0.z);
        var v2 = new Vet(P2.x - P0.x, P2.y - P0.y, P2.z - P0.z);
        // Produto vetorial v1 x v2
        var normal_x = v1.y * v2.z - v1.z * v2.y;
        var normal_y = v1.z * v2.x - v1.x * v2.z;
        var normal_z = v1.x * v2.y - v1.y * v2.x;
        // Criamos o vetor normal
        var normal = new Vet(normal_x, normal_y, normal_z);
        // Normalizamos o vetor para que ele seja unitário
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
        // console.log("Cor da face -> ", this.color)
        var _this = this;
        //   this.cria_arestas();
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
        if (normal < 0) {
            ctx.fillStyle = this.color_other_side;
        }
        else {
            ctx.fillStyle = this.color;
        }
        // console.log("COLOR -> ", this.color)
        // ctx.fillStyle = this.color;
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
            this.draw_face(ctx);
        }
    };
    Face.prototype.draw_face = function (ctx) {
        for (var i = 0; i < this.dots.length; i++) {
            if (i === this.dots.length - 1) {
                this.draw_line(this.dots[i], this.dots[0], this.line_color, ctx);
            }
            else {
                // let h = 3;
                this.draw_line(this.dots[i], this.dots[i + 1], this.line_color, ctx);
            }
        }
    };
    ;
    Face.prototype.draw_line = function (dot0, dot1, color, ctx) {
        ctx.beginPath();
        ctx.moveTo(dot0.x, dot0.y);
        ctx.lineTo(dot1.x, dot1.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
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
        // print_matriz(this.mat_control_points, "Control Points");
        // print_matriz(this.matB, "Mat_b");
        // print_matriz(mat_t, "Mat_t");
        // this.centroide.print_obj("Centroide");
        var mat_return = mult_matriz(mat_t, aux);
        return new Dot(mat_return[0][0], mat_return[0][1], mat_return[0][2]);
        // return mat_return;
    };
    Spline.prototype.create_dots_to_the_entire_curve = function (t) {
        var list_dots = this.control_points;
        var quant = 1 / t;
        for (var i = 0; i < quant; i++) {
            // console.log("T = " + t*i)
            var new_one = this.calc_curve(t * i);
            // new_one.print_obj("Pontos");
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
// let H = new Dot(-7.5, -0.75, 2.25);
// let I = new Dot(-3.5, -4.75, 6.25);
// let J = new Dot(3.5, 4.25, -9.75);
// let K = new Dot(7.5, 1.25, 1.25);
// let control_dots: Array<Dot>; 
// control_dots = [H, I, J, K];
// let spline = new Spline(control_dots);
// print_matriz(get_ArrDots_as_mat(spline.control_points), "Spline");
// print_matriz(spline.calc_curve(0.1), "Result");
// Abaixo foram implementadas funções uteis para manipulação de matrizes ou vetores
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
    //console.log("------------- Matriz " + matriz_name + " -------------")
    aux_str = "";
    for (var i = 0; i < A.length; i++) {
        for (var j = 0; j < A[0].length; j++) {
            aux_str += A[i][j] + ", ";
        }
        //console.log(aux_str)
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
var ZbufferGourand = /** @class */ (function () {
    function ZbufferGourand(width, height) {
        this.width = width;
        this.height = height;
        this.scanline = new Map(); // Inicializa o HashMap
        this.depthBuffer = Array.from({ length: height }, function () { return Array(width).fill(100000000); });
        this.colorBuffer = Array.from({ length: height }, function () { return Array(width).fill('#FFFFFF'); });
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                this.depthBuffer[i][j] = 1000000;
            }
        }
        ;
    }
    ZbufferGourand.prototype.rasterizePolygon = function (face) {
        this.Scanline([face]);
    };
    ZbufferGourand.prototype.extractRGB = function (colorString) {
        var match = colorString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
            return {
                r: parseInt(match[1], 10),
                g: parseInt(match[2], 10),
                b: parseInt(match[3], 10)
            };
        }
        return { r: 0, g: 0, b: 0 }; // Retorna preto se a cor não for válida
    };
    ZbufferGourand.prototype.Scanline = function (faces) {
        var gambiarra = false;
        var y_original;
        var z_original;
        for (var _i = 0, faces_1 = faces; _i < faces_1.length; _i++) {
            var face = faces_1[_i];
            for (var i = 0; i < face.dots.length; i++) {
                var Dx = void 0, Dy = void 0, Dz = void 0, Tx = void 0, Tz = void 0;
                var next_i = (i + 1) % face.dots.length;
                if (i === 0) {
                    y_original = face.dots[0].y; //para ele nunca mudar de valor
                    z_original = face.dots[0].z;
                }
                //console.log(y_original);
                //console.log(next_i)
                if (face.dots[i].y === face.dots[next_i].y) {
                    continue;
                }
                //face.dots[i].x = Math.round(face.dots[i].x);
                var start = face.dots[i].y < face.dots[next_i].y ? face.dots[i] : face.dots[next_i];
                var end = face.dots[i].y < face.dots[next_i].y ? face.dots[next_i] : face.dots[i];
                if (!gambiarra) {
                    if (next_i == 0) { //para o caso de ser o ultimo ponto, ele não troca de valor dai
                        Dx = end.x - start.x;
                        Dy = end.y - y_original;
                        //console.log(end.z, z_original);
                        Dz = end.z - z_original;
                        Tx = Dx / Dy;
                        Tz = Dz / Dy;
                    }
                    else {
                        Dx = end.x - start.x;
                        Dy = end.y - start.y;
                        Dz = end.z - start.z;
                        Tx = Dx / Dy;
                        Tz = Dz / Dy;
                    }
                    //console.log(`Start = (${start.x}, ${start.y}, ${start.z}), End = (${end.x}, ${end.y}, ${end.z})`);  
                    gambiarra = true;
                }
                //console.log(`Dx = ${Dx.toFixed(3)}, Dy = ${Dy.toFixed(3)}, Dz = ${Dz.toFixed(3)}, Tx = ${Tx.toFixed(3)}, Tz = ${Tz.toFixed(3)}`);
                face.dots[i].y = Math.round(face.dots[i].y);
                var x = start.x;
                var z = start.z;
                //const rgb1 = this.extractRGB(start.color);
                for (var y = start.y; y < end.y; y++) {
                    // Adiciona ao HashMap de scanlines
                    this.updateHash(y, x, z, start.r_gouraud, start.g_gouraud, start.b_gouraud);
                    x += Tx;
                    z += Tz;
                }
                gambiarra = false;
            }
        }
        //console.log(this.scanline);
    };
    ZbufferGourand.prototype.updateHash = function (y, x, z, new_R, new_G, new_B) {
        if (!this.scanline.has(y)) {
            this.scanline.set(y, []);
        }
        var listaDePontos = this.scanline.get(y);
        //console.log(new_R, new_G, new_B);
        var novoPonto = new Dot(x, y, z, "rgb(".concat(0, ", ").concat(0, ", ").concat(0, ")"), new_R, new_G, new_B);
        listaDePontos.push(novoPonto);
    };
    ZbufferGourand.prototype.OrdenaScanline = function () {
        var _this = this;
        this.scanline.forEach(function (points, y) {
            //console.log(`Y = ${y}:`);
            points.sort(function (a, b) { return a.x - b.x; }); // Ordena pela coordenada x
            // Após a ordenação, podemos atualizar o scanline
            _this.scanline.set(y, points);
        });
    };
    ZbufferGourand.prototype.ZbufferGourand = function () {
        var _this = this;
        this.OrdenaScanline();
        this.scanline.forEach(function (points, y) {
            for (var i = 0; i < points.length; i += 2) {
                var next_i = (i + 1) % points.length;
                console.log(next_i);
                var z1 = points[i].z;
                var z2 = points[next_i].z;
                //console.log(points[i].x, points[i+1].x, points[i].z, points[i+1].z);
                var dz = (z2 - z1) / (points[next_i].x - points[i].x);
                // console.log(dz);
                var dR = (points[next_i].r_gouraud - points[i].r_gouraud) / (points[next_i].x - points[i].x);
                var dG = (points[next_i].g_gouraud - points[i].g_gouraud) / (points[next_i].x - points[i].x);
                var dB = (points[next_i].b_gouraud - points[i].b_gouraud) / (points[next_i].x - points[i].x);
                //console.log(dR, dG, dB);
                var x1 = Math.ceil(points[i].x);
                var x2 = Math.floor(points[next_i].x);
                var R = points[i].r_gouraud;
                var G = points[i].g_gouraud;
                var B = points[i].b_gouraud;
                for (var x = x1; x <= x2; x++) {
                    _this.AtualizaBufferGourand(z1, points[i].r_gouraud, points[i].g_gouraud, points[i].b_gouraud, x, y);
                    //console.log(points[i].r_gouraud, points[i].g_gouraud, points[i].b_gouraud);
                    z1 += dz;
                    R += dR;
                    G += dG;
                    B += dB;
                }
            }
        });
        //console.log(this.depthBuffer[0][150]);
        //console.log(this.scanline);
    };
    ZbufferGourand.prototype.AtualizaBufferGourand = function (constant_z, new_R, new_G, new_B, x, y) {
        //console.log(constant_z);
        if (constant_z < this.depthBuffer[y][x]) {
            this.depthBuffer[y][x] = constant_z;
            //console.log(this.depthBuffer[y][x]);
            this.colorBuffer[y][x] = "rgb(".concat(new_R, ", ").concat(new_G, ", ").concat(new_B, ")");
            console.log(this.colorBuffer[y][x]);
            //console.log(this.depthBuffer);
        }
    };
    return ZbufferGourand;
}());
var ZbufferConstante = /** @class */ (function () {
    function ZbufferConstante(width, height) {
        this.width = width;
        this.height = height;
        this.scanline = new Map(); // Inicializa o HashMap
        this.depthBuffer = Array.from({ length: height }, function () { return Array(width).fill(100000000); });
        this.colorBuffer = Array.from({ length: height }, function () { return Array(width).fill('#FFFFFF'); });
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                this.depthBuffer[i][j] = 1000000;
                this.colorBuffer[i][j] = '#FFFFFF';
            }
        }
        ;
    }
    ZbufferConstante.prototype.rasterizePolygon = function (face) {
        this.Scanline([face]);
    };
    ZbufferConstante.prototype.Scanline = function (faces) {
        console.log("Faces -> ", faces);
        var gambiarra = false;
        var y_original;
        var z_original;
        for (var _i = 0, faces_2 = faces; _i < faces_2.length; _i++) {
            var face = faces_2[_i];
            for (var i = 0; i < face.dots.length; i++) {
                // console.log("Pontos ", face.dots[i]);
                var Dx = void 0, Dy = void 0, Dz = void 0, Tx = void 0, Tz = void 0;
                var next_i = (i + 1) % face.dots.length;
                // console.log(next_i);
                /*      if(i===0){
                         y_original = face.dots[0].y;//para ele nunca mudar de valor
                         z_original = face.dots[0].z;
                     } */
                //console.log(y_original);
                //console.log(next_i)
                if (face.dots[i].y === face.dots[next_i].y) {
                    continue;
                }
                //face.dots[i].x = Math.round(face.dots[i].x);
                var start = void 0, end = void 0;
                // const start = face.dots[i].y < face.dots[next_i].y ? face.dots[i] : face.dots[next_i];
                // const end = face.dots[i].y < face.dots[next_i].y ? face.dots[next_i] : face.dots[i];
                if (face.dots[i].y < face.dots[next_i].y) {
                    start = face.dots[i];
                    end = face.dots[next_i];
                }
                else {
                    start = face.dots[next_i];
                    end = face.dots[i];
                }
                console.log("Start -> ", start, "End -> ", end);
                /*
                            if(!gambiarra){
                                
                                if(next_i == 0){//para o caso de ser o ultimo ponto, ele não troca de valor dai
                                    Dx = end.x - start.x;
                                    Dy = end.y - y_original;
                                    //console.log(end.z, z_original);
                                    Dz = end.z - z_original;
                                    
            
                                    Tx = Dx / Dy;
            
                                    Tz = Dz / Dy;
                                }else{
                                */
                Dx = end.x - start.x;
                Dy = end.y - start.y;
                Dz = end.z - start.z;
                Tx = Dx / Dy;
                Tz = Dz / Dy;
                //}
                //console.log(`Start = (${start.x}, ${start.y}, ${start.z}), End = (${end.x}, ${end.y}, ${end.z})`);  
                // gambiarra = true;
                //}
                //console.log(`Dx = ${Dx.toFixed(3)}, Dy = ${Dy.toFixed(3)}, Dz = ${Dz.toFixed(3)}, Tx = ${Tx.toFixed(3)}, Tz = ${Tz.toFixed(3)}`);
                var start_y = void 0;
                var end_y = void 0;
                if (face.dots[i].y < face.dots[next_i].y) {
                    start_y = Math.round(face.dots[i].y);
                    end_y = Math.round(face.dots[next_i].y);
                }
                else {
                    start_y = Math.round(face.dots[next_i].y);
                    end_y = Math.round(face.dots[i].y);
                }
                var x = start.x;
                var z = start.z;
                //const rgb1 = this.extractRGB(start.color);
                console.log("Start -> ", start_y, "End -> ", end_y);
                for (var y = start_y; y < end_y; y++) {
                    // Adiciona ao HashMap de scanlines
                    this.updateHash(y, x, z, start.color);
                    x += Tx;
                    z += Tz;
                }
                //gambiarra = false
            }
        }
        //console.log(this.scanline);
    };
    ZbufferConstante.prototype.updateHash = function (y, x, z, color) {
        if (!this.scanline.has(y)) {
            this.scanline.set(y, []);
        }
        var listaDePontos = this.scanline.get(y);
        //console.log(new_R, new_G, new_B);
        var novoPonto = new Dot(x, y, z, color);
        listaDePontos.push(novoPonto);
    };
    ZbufferConstante.prototype.ZbufferConstante = function () {
        // console.log("Scanline -> ", this.scanline);
        var _this = this;
        this.scanline.forEach(function (points, y) {
            console.log("Antes", points);
            points = points.sort(function (a, b) { return a.x - b.x; });
            console.log("depois", points);
            //console.log(points.length);
            for (var i = 0; i < points.length - 1; i += 2) {
                var next_i = (i + 1) % (points.length);
                // const next_i = i+1;
                //console.log(`L: ${face.dots.length}  I: ${i}  Next: ${next_i}` );
                var z1 = points[i].z;
                var z2 = points[next_i].z;
                //console.log(points[i].x, points[i+1].x, points[i].z, points[i+1].z);
                var dz = (z2 - z1) / (points[next_i].x - points[i].x);
                // console.log(dz);
                //console.log(dR, dG, dB);
                var x1 = Math.ceil(points[i].x);
                var x2 = Math.floor(points[next_i].x);
                var start = x1, end = x2;
                if (x1 > x2) {
                    // start = x2;
                    // end = x1;
                    console.log("Invertido");
                    // points.sort((a, b) => a.x - b.x);
                }
                var dx = points[i].x - x1;
                z1 += dx * dz;
                for (var x = start; x <= end; x++) {
                    //console.log(z1, x, y, points[i].color);
                    _this.AtualizaBufferConstante(z1, x, y, points[i].color);
                    //console.log(points[i].r_gouraud, points[i].g_gouraud, points[i].b_gouraud);
                    z1 += dz;
                }
            }
        });
    };
    /* OrdenaPontos(points: Dot[]): Dot[] {
        if (points.length <= 1) {
            return points; // Lista já está ordenada
        }
    
        const pivot = points[0]; // Escolhe o primeiro elemento como pivô
        const left: Dot[] = [];
        const right: Dot[] = [];
    
        // Divide a lista em duas partes
        for (let i = 1; i < points.length; i++) {
            if (points[i].x < pivot.x) {
                left.push(points[i]);
            } else {
                right.push(points[i]);
            }
        }
    
        // Recursivamente ordena as duas partes e concatena
        return [...this.OrdenaPontos(left), pivot, ...this.OrdenaPontos(right)];
    } */
    ZbufferConstante.prototype.AtualizaBufferConstante = function (constant_z, x, y, color) {
        if (constant_z < this.depthBuffer[y][x]) {
            this.depthBuffer[y][x] = constant_z;
            //console.log(this.depthBuffer[y][x]);
            //console.log(this.colorBuffer[y][x]);
            this.colorBuffer[y][x] = color;
            //console.log(this.depthBuffer);
        }
    };
    return ZbufferConstante;
}());
/* const face = new Face([
    new Dot(319.000, 160.774, -51.524, "rgb(118, 92, 0)"), // B'
    new Dot(190.427, 0.000, -48.792, "rgb(64, 90, 7)"),   // B''
    new Dot(149.864, 0.000, -46.762, "rgb(48, 0, 0)"),   // E''
    new Dot(151.303, 239.000, -41.331, "rgb(48, 0, 0)"), // E'
    new Dot(319.000, 239.000, -49.722, "rgb(117, 89, 6)") // A''
]);

const zBuffer = new ZbufferConstante(238, 304);
zBuffer.Scanline([face]);
zBuffer.ZbufferConstante(); */
function Recorte(face, umin, umax, vmin, vmax) {
    // console.log("Entrou")
    var pontos = face.dots;
    var arestas = [];
    for (var i = 0; i < pontos.length; i++) {
        if (i + 1 < pontos.length) {
            arestas.push(new Aresta(pontos[i], pontos[i + 1]));
        }
        else {
            arestas.push(new Aresta(pontos[i], pontos[0]));
        }
    }
    var recorteEsquerda = pontos.some(function (ponto) { return ponto.x < umin; });
    //verificar recorte esquerda
    if (recorteEsquerda) {
        var novasArestas = [];
        var novosPontos_1 = [];
        arestas.forEach(function (arestas) {
            var p1 = arestas.p1;
            var p2 = arestas.p2;
            var u;
            if (p1.x < umin && p2.x >= umin) { //adentra recorte
                u = (umin - p1.x) / (p2.x - p1.x);
                var x = umin;
                var y = p1.y + u * (p2.y - p1.y);
                var z = p1.z + u * (p2.z - p1.z);
                var Paux = new Dot(x, y, z);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos_1.push(p2);
                }
                else {
                    novosPontos_1.push(Paux);
                    novosPontos_1.push(p2);
                }
            }
            if (p1.x >= umin && p2.x >= umin) { //os dois pontos estão dentro do recorte
                novosPontos_1.push(p2);
            }
            if (p1.x >= umin && p2.x < umin) { //sai do recorte
                u = (umin - p1.x) / (p2.x - p1.x);
                var x = umin;
                var y = p1.y + u * (p2.y - p1.y);
                var z = p1.z + u * (p2.z - p1.z);
                var Paux = new Dot(x, y, z);
                novosPontos_1.push(Paux);
            }
        });
        for (var i = 0; i < novosPontos_1.length; i++) {
            if (i + 1 < novosPontos_1.length) {
                novasArestas.push(new Aresta(novosPontos_1[i], novosPontos_1[i + 1]));
            }
            else {
                novasArestas.push(new Aresta(novosPontos_1[i], novosPontos_1[0]));
            }
        }
        arestas = novasArestas;
        pontos = novosPontos_1;
    }
    var recorteDireita = pontos.some(function (ponto) { return ponto.x > umax; });
    //verificar recorte direita
    if (recorteDireita) {
        var novasArestas = [];
        var novosPontos_2 = [];
        arestas.forEach(function (aresta) {
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var u;
            if (p1.x > umax && p2.x < umax) { //adentra recorte
                u = (umax - p1.x) / (p2.x - p1.x);
                var x = umax;
                var y = p1.y + u * (p2.y - p1.y);
                var z = p1.z + u * (p2.z - p1.z);
                var Paux = new Dot(x, y, z);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos_2.push(p2);
                }
                else {
                    novosPontos_2.push(Paux);
                    novosPontos_2.push(p2);
                }
            }
            if (p1.x <= umax && p2.x <= umax) { //os dois pontos estão dentro do recorte
                novosPontos_2.push(p2);
            }
            if (p1.x < umax && p2.x > umax) { //sai do recorte
                u = (umax - p1.x) / (p2.x - p1.x);
                var x = umax;
                var y = p1.y + u * (p2.y - p1.y);
                var z = p1.z + u * (p2.z - p1.z);
                var Paux = new Dot(x, y, z);
                novosPontos_2.push(Paux);
            }
        });
        for (var i = 0; i < novosPontos_2.length; i++) {
            if (i + 1 < novosPontos_2.length) {
                novasArestas.push(new Aresta(novosPontos_2[i], novosPontos_2[i + 1]));
            }
            else {
                novasArestas.push(new Aresta(novosPontos_2[i], novosPontos_2[0]));
            }
        }
        arestas = novasArestas;
        pontos = novosPontos_2;
    }
    var recorteInferior = pontos.some(function (ponto) { return ponto.y > vmax; });
    //verificar recorte inferior
    if (recorteInferior) {
        var novosPontos_3 = [];
        var novasArestas = [];
        arestas.forEach(function (aresta) {
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var u;
            if (p1.y > vmax && p2.y <= vmax) { //adentra recorte
                u = (vmax - p1.y) / (p2.y - p1.y);
                var y = vmax;
                var x = p1.x + u * (p2.x - p1.x);
                var z = p1.z + u * (p2.z - p1.z);
                var Paux = new Dot(x, y, z);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos_3.push(p2);
                }
                else {
                    novosPontos_3.push(Paux);
                    novosPontos_3.push(p2);
                }
            }
            if (p1.y <= vmax && p2.y <= vmax) { //os dois pontos estão dentro do recorte
                novosPontos_3.push(p2);
            }
            if (p1.y <= vmax && p2.y > vmax) { //sai do recorte
                u = (vmax - p1.y) / (p2.y - p1.y);
                var y = vmax;
                var x = p1.x + u * (p2.x - p1.x);
                var z = p1.z + u * (p2.z - p1.z);
                var Paux = new Dot(x, y, z);
                novosPontos_3.push(Paux);
            }
        });
        for (var i = 0; i < novosPontos_3.length; i++) {
            if (i + 1 < novosPontos_3.length) {
                novasArestas.push(new Aresta(novosPontos_3[i], novosPontos_3[i + 1]));
            }
            else {
                novasArestas.push(new Aresta(novosPontos_3[i], novosPontos_3[0]));
            }
        }
        arestas = novasArestas;
        pontos = novosPontos_3;
    }
    var recorteSuperior = pontos.some(function (ponto) { return ponto.y < vmin; });
    //verificar recorte superior
    if (recorteSuperior) {
        var novosPontos_4 = [];
        var novasArestas = [];
        arestas.forEach(function (aresta) {
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var u;
            if (p1.y < vmin && p2.y >= vmin) { //adentra recorte
                u = (vmin - p1.y) / (p2.y - p1.y);
                var y = vmin;
                var x = p1.x + u * (p2.x - p1.x);
                var z = p1.z + u * (p2.z - p1.z);
                var Paux = new Dot(x, y, z);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos_4.push(p2);
                }
                else {
                    novosPontos_4.push(Paux);
                    novosPontos_4.push(p2);
                }
            }
            if (p1.y >= vmin && p2.y >= vmin) { //os dois pontos estão dentro do recorte
                novosPontos_4.push(p2);
            }
            if (p1.y >= vmin && p2.y < vmin) { //sai do recorte
                u = (vmin - p1.y) / (p2.y - p1.y);
                var y = vmin;
                var x = p1.x + u * (p2.x - p1.x);
                var z = p1.z + u * (p2.z - p1.z);
                var Paux = new Dot(x, y, z);
                novosPontos_4.push(Paux);
            }
        });
        for (var i = 0; i < novosPontos_4.length; i++) {
            if (i + 1 < novosPontos_4.length) {
                novasArestas.push(new Aresta(novosPontos_4[i], novosPontos_4[i + 1]));
            }
            else {
                novasArestas.push(new Aresta(novosPontos_4[i], novosPontos_4[0]));
            }
        }
        arestas = novasArestas;
        pontos = novosPontos_4;
    }
    return new Face(pontos, face.color, face.color_other_side, face.line_color);
}
function RecorteWithColor(face, umin, umax, vmin, vmax) {
    umin = Number(umin);
    umax = Number(umax);
    vmin = Number(vmin);
    vmax = Number(vmax);
    var pontos = face.dots;
    var arestas = [];
    for (var i = 0; i < pontos.length; i++) {
        if (i + 1 < pontos.length) {
            arestas.push(new Aresta(pontos[i], pontos[i + 1]));
        }
        else {
            arestas.push(new Aresta(pontos[i], pontos[0]));
        }
    }
    var recorteEsquerda = pontos.some(function (ponto) { return ponto.x < umin; });
    // Verificar recorte esquerda
    if (recorteEsquerda) {
        var novasArestas = [];
        var novosPontos_5 = [];
        arestas.forEach(function (aresta) {
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var u;
            if (p1.x < umin && p2.x >= umin) { // Adentra recorte
                u = (umin - p1.x) / (p2.x - p1.x);
                var x = umin;
                var y = p1.y + u * (p2.y - p1.y);
                var z = p1.z + u * (p2.z - p1.z);
                var color = interpolateColor(p1.color, p2.color, u);
                var Paux = new Dot(x, y, z, color);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos_5.push(p2);
                }
                else {
                    novosPontos_5.push(Paux);
                    novosPontos_5.push(p2);
                }
            }
            if (p1.x >= umin && p2.x >= umin) { // Os dois pontos estão dentro do recorte
                novosPontos_5.push(p2);
            }
            if (p1.x >= umin && p2.x < umin) { // Sai do recorte
                u = (umin - p1.x) / (p2.x - p1.x);
                var x = umin;
                var y = p1.y + u * (p2.y - p1.y);
                var z = p1.z + u * (p2.z - p1.z);
                var color = interpolateColor(p1.color, p2.color, u);
                var Paux = new Dot(x, y, z, color);
                novosPontos_5.push(Paux);
            }
        });
        for (var i = 0; i < novosPontos_5.length; i++) {
            if (i + 1 < novosPontos_5.length) {
                novasArestas.push(new Aresta(novosPontos_5[i], novosPontos_5[i + 1]));
            }
            else {
                novasArestas.push(new Aresta(novosPontos_5[i], novosPontos_5[0]));
            }
        }
        arestas = novasArestas;
        pontos = novosPontos_5;
    }
    var recorteDireita = pontos.some(function (ponto) { return ponto.x > umax; });
    // Verificar recorte direita
    if (recorteDireita) {
        var novasArestas = [];
        var novosPontos_6 = [];
        arestas.forEach(function (aresta) {
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var u;
            if (p1.x > umax && p2.x < umax) { // Adentra recorte
                u = (umax - p1.x) / (p2.x - p1.x);
                var x = umax;
                var y = p1.y + u * (p2.y - p1.y);
                var z = p1.z + u * (p2.z - p1.z);
                var color = interpolateColor(p1.color, p2.color, u);
                var Paux = new Dot(x, y, z, color);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos_6.push(p2);
                }
                else {
                    novosPontos_6.push(Paux);
                    novosPontos_6.push(p2);
                }
            }
            if (p1.x <= umax && p2.x <= umax) { // Os dois pontos estão dentro do recorte
                novosPontos_6.push(p2);
            }
            if (p1.x < umax && p2.x > umax) { // Sai do recorte
                u = (umax - p1.x) / (p2.x - p1.x);
                var x = umax;
                var y = p1.y + u * (p2.y - p1.y);
                var z = p1.z + u * (p2.z - p1.z);
                var color = interpolateColor(p1.color, p2.color, u);
                var Paux = new Dot(x, y, z, color);
                novosPontos_6.push(Paux);
            }
        });
        for (var i = 0; i < novosPontos_6.length; i++) {
            if (i + 1 < novosPontos_6.length) {
                novasArestas.push(new Aresta(novosPontos_6[i], novosPontos_6[i + 1]));
            }
            else {
                novasArestas.push(new Aresta(novosPontos_6[i], novosPontos_6[0]));
            }
        }
        arestas = novasArestas;
        pontos = novosPontos_6;
    }
    var recorteInferior = pontos.some(function (ponto) { return ponto.y > vmax; });
    // Verificar recorte inferior
    if (recorteInferior) {
        var novosPontos_7 = [];
        var novasArestas = [];
        arestas.forEach(function (aresta) {
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var u;
            if (p1.y > vmax && p2.y <= vmax) { // Adentra recorte
                u = (vmax - p1.y) / (p2.y - p1.y);
                var y = vmax;
                var x = p1.x + u * (p2.x - p1.x);
                var z = p1.z + u * (p2.z - p1.z);
                var color = interpolateColor(p1.color, p2.color, u);
                var Paux = new Dot(x, y, z, color);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos_7.push(p2);
                }
                else {
                    novosPontos_7.push(Paux);
                    novosPontos_7.push(p2);
                }
            }
            if (p1.y <= vmax && p2.y <= vmax) { // Os dois pontos estão dentro do recorte
                novosPontos_7.push(p2);
            }
            if (p1.y <= vmax && p2.y > vmax) { // Sai do recorte
                u = (vmax - p1.y) / (p2.y - p1.y);
                var y = vmax;
                var x = p1.x + u * (p2.x - p1.x);
                var z = p1.z + u * (p2.z - p1.z);
                var color = interpolateColor(p1.color, p2.color, u);
                var Paux = new Dot(x, y, z, color);
                novosPontos_7.push(Paux);
            }
        });
        for (var i = 0; i < novosPontos_7.length; i++) {
            if (i + 1 < novosPontos_7.length) {
                novasArestas.push(new Aresta(novosPontos_7[i], novosPontos_7[i + 1]));
            }
            else {
                novasArestas.push(new Aresta(novosPontos_7[i], novosPontos_7[0]));
            }
        }
        arestas = novasArestas;
        pontos = novosPontos_7;
    }
    var recorteSuperior = pontos.some(function (ponto) { return ponto.y < vmin; });
    // Verificar recorte superior
    if (recorteSuperior) {
        var novosPontos_8 = [];
        var novasArestas = [];
        arestas.forEach(function (aresta) {
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var u;
            if (p1.y < vmin && p2.y >= vmin) { // Adentra recorte
                u = (vmin - p1.y) / (p2.y - p1.y);
                var y = vmin;
                var x = p1.x + u * (p2.x - p1.x);
                var z = p1.z + u * (p2.z - p1.z);
                var color = interpolateColor(p1.color, p2.color, u);
                var Paux = new Dot(x, y, z, color);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos_8.push(p2);
                }
                else {
                    novosPontos_8.push(Paux);
                    novosPontos_8.push(p2);
                }
            }
            if (p1.y >= vmin && p2.y >= vmin) { // Os dois pontos estão dentro do recorte
                novosPontos_8.push(p2);
            }
            if (p1.y >= vmin && p2.y < vmin) { // Sai do recorte
                u = (vmin - p1.y) / (p2.y - p1.y);
                var y = vmin;
                var x = p1.x + u * (p2.x - p1.x);
                var z = p1.z + u * (p2.z - p1.z);
                var color = interpolateColor(p1.color, p2.color, u);
                var Paux = new Dot(x, y, z, color);
                novosPontos_8.push(Paux);
            }
        });
        for (var i = 0; i < novosPontos_8.length; i++) {
            if (i + 1 < novosPontos_8.length) {
                novasArestas.push(new Aresta(novosPontos_8[i], novosPontos_8[i + 1]));
            }
            else {
                novasArestas.push(new Aresta(novosPontos_8[i], novosPontos_8[0]));
            }
        }
        arestas = novasArestas;
        pontos = novosPontos_8;
    }
    return new Face(pontos, face.color, face.color_other_side, face.line_color);
}
function interpolateColor(color1, color2, t) {
    var c1 = color1.match(/\d+/g).map(Number);
    var c2 = color2.match(/\d+/g).map(Number);
    var r = Math.round(c1[0] + t * (c2[0] - c1[0]));
    var g = Math.round(c1[1] + t * (c2[1] - c1[1]));
    var b = Math.round(c1[2] + t * (c2[2] - c1[2]));
    return "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
}
var Lamp = /** @class */ (function () {
    function Lamp(intensidade_da_fonte, x, y, z) {
        this.il = intensidade_da_fonte;
        this.pos = new Dot(x, y, z);
    }
    return Lamp;
}());
