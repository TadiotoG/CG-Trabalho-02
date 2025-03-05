/// <reference path= "./spline.ts" />
// import { get } from "lodash";
// import { random } from "lodash"
var Z_Pixel = /** @class */ (function () {
    function Z_Pixel(col, distancia) {
        if (col === void 0) { col = "white"; }
        if (distancia === void 0) { distancia = 100000; }
        this.color = col;
        this.dist = distancia;
    }
    return Z_Pixel;
}());
var Z_Buffer = /** @class */ (function () {
    function Z_Buffer(width, height) {
        var _this = this;
        this.width_screen = width;
        this.height_screen = height;
        this.buffer = Array(this.width_screen).fill(null).map(function () { return Array(_this.height_screen).fill(new Z_Pixel("white", 100000)); });
    }
    Z_Buffer.prototype.update_face_const = function (face) {
        var ymin = Math.round(Math.min.apply(Math, face.dots.map(function (p) { return p.y; })));
        var ymax = Math.round(Math.max.apply(Math, face.dots.map(function (p) { return p.y; })));
        face.inters = Array.from({ length: ymax - ymin + 1 }, function () { return []; });
        face.inters_z = Array.from({ length: ymax - ymin + 1 }, function () { return []; });
        face.arestas.forEach(function (aresta, i) {
            var _a;
            if (aresta[0].y === aresta[1].y)
                return;
            if (aresta[0].y > aresta[1].y) {
                _a = [aresta[1], aresta[0]], face.arestas[i][0] = _a[0], face.arestas[i][1] = _a[1];
            }
            var x1 = aresta[0].x, y1 = aresta[0].y;
            var x2 = aresta[1].x, y2 = aresta[1].y;
            var z1 = aresta[0].z;
            var z2 = aresta[1].z;
            var coeficiente = (x2 - x1) / (y2 - y1);
            var coeficiente_z = (z2 - z1) / (y2 - y1);
            var x = x1;
            var z = z1;
            var index = Math.floor(y1 - ymin);
            for (var y = y1; y <= y2; y++) {
                if (!face.inters[index])
                    face.inters[index] = [];
                face.inters_z[index].push(Math.round(z));
                face.inters[index++].push(Math.round(x));
                x += coeficiente;
                z += coeficiente_z;
            }
        });
        for (var i = 0; i < face.inters.length; i++) {
            this.save_line(face, i, ymin + i);
        }
        ;
    };
    Z_Buffer.prototype.save_line = function (face, line_index, y) {
        for (var i = 0; i < face.inters[line_index].length; i += 2) {
            var x1 = Math.ceil(face.inters[line_index][i]);
            var x2 = Math.floor(face.inters[line_index][i + 1]);
            var z1 = Math.ceil(face.inters_z[line_index][i]);
            var z2 = Math.floor(face.inters_z[line_index][i + 1]);
            var inc_z = (z2 - z1) / (x2 - x1);
            for (var x = x1; x <= x2; x++) {
                var my_z = z1 + inc_z;
                if (this.buffer[x][y].dist > my_z) {
                    this.buffer[x][y] = new Z_Pixel(face.color, my_z);
                }
            }
        }
    };
    return Z_Buffer;
}());
function testZBuffer() {
    var canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.width = 500;
    canvas.height = 500;
    var ctx = canvas.getContext("2d");
    if (!ctx)
        return;
    var zBuffer = new Z_Buffer(canvas.width, canvas.height);
    // Criando dois quadrados, um mais próximo e outro mais distante
    var face1 = new Face([
        new Dot(0, 0, 5),
        new Dot(0, 100, 5),
        new Dot(100, 100, 5),
        new Dot(100, 0, 5),
    ]);
    face1.color = "blue";
    var face2 = new Face([
        new Dot(0, 0, 9),
        new Dot(0, 100, 0),
        new Dot(100, 100, 0),
        new Dot(100, 0, 10),
    ]);
    face2.color = "red";
    // Aplicando o algoritmo de Z-Buffer
    zBuffer.update_face_const(face1);
    zBuffer.update_face_const(face2);
    // Renderizando a cena a partir do Z-Buffer
    for (var x = 0; x < canvas.width; x++) {
        for (var y = 0; y < canvas.height; y++) {
            ctx.fillStyle = zBuffer.buffer[x][y].color;
            ctx.fillRect(x, y, 1, 1);
        }
    }
    // console.log("Buffer -> ", zBuffer.buffer)
}
testZBuffer();
