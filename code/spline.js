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
    function Dot(new_x, new_y, new_z, col) {
        if (col === void 0) { col = "red"; }
        this.x = new_x;
        this.y = new_y;
        this.z = new_z;
        this.color = col;
        this.r_gouraud = 0;
        this.g_gouraud = 255;
        this.b_gouraud = 0;
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
        // Pegamos três pontos da face
        var P0 = this.dots[0];
        var P1 = this.dots[1];
        var P2 = this.dots[2];
        // Criamos os vetores
        var v1 = new Vet(P0.x - P1.x, P0.y - P1.y, P0.z - P1.z);
        var v2 = new Vet(P2.x - P1.x, P2.y - P1.y, P2.z - P1.z);
        // Produto vetorial v1 x v2
        // Criamos o vetor normal
        var normal = prod_vet(v2, v1);
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
        // console.log("COLOR -> ", this.color)
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
                // let h = 3;
                this.draw_line(this.dots[i], this.dots[i + 1], ctx, normal);
            }
        }
    };
    ;
    Face.prototype.draw_line = function (dot0, dot1, ctx, normal) {
        ctx.beginPath();
        ctx.moveTo(dot0.x, dot0.y);
        ctx.lineTo(dot1.x, dot1.y);
        if (normal < 0) {
            ctx.strokeStyle = this.line_color;
        }
        else {
            ctx.strokeStyle = this.other_side_line_color;
        }
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
// class ZBuffer {
//     width: number;
//     height: number;
//     depthBuffer: number[][];
//     colorBuffer: string[][];
//     constructor(width: number, height: number) {
//         this.width = width;
//         this.height = height;
//         this.depthBuffer = Array.from({ length: height }, () => Array(width).fill(Infinity));
//         this.colorBuffer = Array.from({ length: height }, () => Array(width).fill('#FFFFFF')); // Default background color
//     }
//     initializeBuffers() {
//         for (let y = 0; y < this.height; y++) {
//             for (let x = 0; x < this.width; x++) {
//                 this.depthBuffer[y][x] = Infinity;
//                 this.colorBuffer[y][x] = '#FFFFFF'; // Default background color
//                 // console.log("Z buffer -> ", this.depthBuffer[y][x]);
//             }
//         }
//     }
//     updateBuffer(x: number, y: number, z: number, color: string) {
//         // console.log(` y = ${y}    x = ${(x)}`);
//         // console.log("depth buffer len ", this.depthBuffer.length, "    [0] -> ", this.depthBuffer[0][0])
//         // console.log("This. depth -> ", this.depthBuffer[Math.round(y)][x])
//         if (z < this.depthBuffer[Math.ceil(y)][x]) {
//             this.depthBuffer[Math.ceil(y)][x] = z;
//             this.colorBuffer[Math.ceil(y)][x] = color;
//         }
//     }
//     render(faces: Face[]) {//Quem faz tudo acontecer é essa função, ela que chama as outras funções para fazer o rasterize
//         this.initializeBuffers();//O parametro que ela usa são todas as faces do objeto (DA PRA MUDAR, NÃO PRECISA SER TODAS AS FACES)
//         for (const face of faces) {
//             this.rasterizePolygon(face);
//         }
//     }
//     rasterizePolygon(face: Face) {
//         let pontos = face.dots;
//         let edges: Aresta[] = [];
//         const activeEdges: Aresta[] = [];
//         for (let i = 0; i < pontos.length; i++) {
//             if (i + 1 < pontos.length) {
//                 edges.push(new Aresta(pontos[i], pontos[i + 1]));
//             } else {
//                 edges.push(new Aresta(pontos[i], pontos[0]));
//             }}
//         // Find ymin and ymax of the face
//         let ymin = Infinity;
//         let ymax = -Infinity;
//         for (const vertex of face.dots) {
//             if (vertex.y < ymin) ymin = vertex.y;
//             if (vertex.y > ymax) ymax = vertex.y;
//         }
//         // Process each scanline from ymin to ymax
//         for (let y = ymin; y <= ymax; y++) {
//             // Update active edges
//             activeEdges.length = 0;
//             for (const edge of edges) {
//                 if ((edge.p1.y <= y && edge.p2.y > y) || (edge.p2.y <= y && edge.p1.y > y)) {
//                     activeEdges.push(edge);
//                 }
//             }
//             // Sort active edges by x
//             activeEdges.sort((a, b) => a.p1.x + a.tx * (y - a.p1.y) - (b.p1.x + b.tx * (y - b.p1.y)));
//             // Fill pixels between pairs of intersections
//             for (let i = 0; i < activeEdges.length; i += 2) {
//                 const edge1 = activeEdges[i];
//                 const edge2 = activeEdges[i + 1];
//                 let x1 = edge1.p1.x + edge1.tx * (y - edge1.p1.y);
//                 let z1 = edge1.p1.z + edge1.tz * (y - edge1.p1.y);
//                 let x2 = edge2.p1.x + edge2.tx * (y - edge2.p1.y);
//                 let z2 = edge2.p1.z + edge2.tz * (y - edge2.p1.y);
//                 if (x1 > x2) {
//                     [x1, x2] = [x2, x1];
//                     [z1, z2] = [z2, z1];
//                 }
//                 // Log the values for each scanline
//                 const tz = (x2 - x1 === 0) ? 0 : ((z2 - z1) / (x2 - x1)).toFixed(6);
//                 for (let x = Math.ceil(x1); x <= Math.floor(x2); x++) {
//                     const t = (x - x1) / (x2 - x1);
//                     const z = z1 + t * (z2 - z1);
//                     this.updateBuffer(x, y, z, face.color);
//                 }
//             }
//         }
//     }
// }
function Recorte(face, umin, umax, vmin, vmax) {
    umin = Number(umin);
    umax = Number(umax);
    vmin = Number(vmin);
    vmax = Number(vmax);
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
    return new Face(pontos, face.color, face.other_side_line_color, face.line_color);
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
    return new Face(pontos, face.color, face.other_side_line_color, face.line_color);
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
