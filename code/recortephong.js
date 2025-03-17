/// <reference path="./recortecolor.ts" />
function RecortePhong(double_face, umin, umax, vmin, vmax) {
    umin = Number(umin);
    umax = Number(umax);
    vmin = Number(vmin);
    vmax = Number(vmax);
    var face = double_face.face;
    var face_SRU = double_face.face_SRU;
    var pontos = face.dots;
    var arestas = [];
    var pontos_SRU = face_SRU.dots;
    var arestas_SRU = [];
    for (var i = 0; i < pontos.length; i++) {
        if (i + 1 < pontos.length) {
            arestas.push(new Aresta(pontos[i], pontos[i + 1]));
        }
        else {
            arestas.push(new Aresta(pontos[i], pontos[0]));
        }
    }
    for (var i = 0; i < pontos_SRU.length; i++) {
        if (i + 1 < pontos_SRU.length) {
            arestas_SRU.push(new Aresta(pontos_SRU[i], pontos_SRU[i + 1]));
        }
        else {
            arestas_SRU.push(new Aresta(pontos_SRU[i], pontos_SRU[0]));
        }
    }
    var recorteEsquerda = pontos.some(function (ponto) { return ponto.x < umin; });
    //verificar recorte esquerda
    if (recorteEsquerda) {
        var novasArestas = [];
        var novasArestas_SRU = [];
        var novosPontos = [];
        var novosPontos_SRU = [];
        for (var i = 0; i < arestas.length; i++) {
            var aresta = arestas[i];
            var aresta_SRU = arestas_SRU[i];
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var p1_SRU = aresta_SRU.p1;
            var p2_SRU = aresta_SRU.p2;
            var u = void 0;
            if (p1.x < umin && p2.x >= umin) { //adentra recorte
                u = (umin - p1.x) / (p2.x - p1.x);
                var x_SRU = p1_SRU.x + u * (p2_SRU.x - p1_SRU.x);
                var y_SRU = p1_SRU.y + u * (p2_SRU.y - p1_SRU.y);
                var z_SRU = p1_SRU.z + u * (p2_SRU.z - p1_SRU.z);
                var x = umin;
                var y = p1.y + u * (p2.y - p1.y);
                var z = p1.z + u * (p2.z - p1.z);
                var i_1 = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                var j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                var k = p1.z_phong + u * (p2.z_phong - p1.z_phong);
                var Paux = new Dot(x, y, z, "red", 0, 0, 0, i_1, j, k);
                var Paux_SRU = new Dot(x_SRU, y_SRU, z_SRU, "red", 0, 0, 0, i_1, j, k);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos.push(p2);
                    novosPontos_SRU.push(p2_SRU);
                }
                else {
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                    novosPontos_SRU.push(Paux_SRU);
                    novosPontos_SRU.push(p2_SRU);
                }
            }
            if (p1.x >= umin && p2.x >= umin) { //os dois pontos estão dentro do recorte
                novosPontos.push(p2);
                novosPontos_SRU.push(p2_SRU);
            }
            if (p1.x >= umin && p2.x < umin) { //sai do recorte
                u = (umin - p1.x) / (p2.x - p1.x);
                var x = umin;
                var x_SRU = p1_SRU.x + u * (p2_SRU.x - p1_SRU.x);
                var y_SRU = p1_SRU.y + u * (p2_SRU.y - p1_SRU.y);
                var z_SRU = p1_SRU.z + u * (p2_SRU.z - p1_SRU.z);
                var y = p1.y + u * (p2.y - p1.y);
                var z = p1.z + u * (p2.z - p1.z);
                var i_2 = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                var j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                var k = p1.z_phong + u * (p2.z_phong - p1.z_phong);
                var Paux = new Dot(x, y, z, "red", 0, 0, 0, i_2, j, k);
                var Paux_SRU = new Dot(x_SRU, y_SRU, z_SRU, "red", 0, 0, 0, i_2, j, k);
                novosPontos.push(Paux);
                novosPontos_SRU.push(Paux_SRU);
            }
        }
        ;
        for (var i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
                novasArestas_SRU.push(new Aresta(novosPontos_SRU[i], novosPontos_SRU[i + 1]));
            }
            else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
                novasArestas_SRU.push(new Aresta(novosPontos_SRU[i], novosPontos_SRU[0]));
            }
        }
        arestas = novasArestas;
        arestas_SRU = novasArestas_SRU;
        pontos = novosPontos;
        pontos_SRU = novosPontos_SRU;
    }
    var recorteDireita = pontos.some(function (ponto) { return ponto.x > umax; });
    //verificar recorte direita
    if (recorteDireita) {
        var novasArestas = [];
        var novasArestas_SRU = [];
        var novosPontos = [];
        var novosPontos_SRU = [];
        for (var i = 0; i < arestas.length; i++) {
            var aresta = arestas[i];
            var aresta_SRU = arestas_SRU[i];
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var p1_SRU = aresta_SRU.p1;
            var p2_SRU = aresta_SRU.p2;
            var u = void 0;
            if (p1.x > umax && p2.x <= umax) { //adentra recorte
                u = (umax - p1.x) / (p2.x - p1.x);
                var x_SRU = p1_SRU.x + u * (p2_SRU.x - p1_SRU.x);
                var y_SRU = p1_SRU.y + u * (p2_SRU.y - p1_SRU.y);
                var z_SRU = p1_SRU.z + u * (p2_SRU.z - p1_SRU.z);
                var x = umax;
                var y = p1.y + u * (p2.y - p1.y);
                var z = p1.z + u * (p2.z - p1.z);
                var i_3 = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                var j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                var k = p1.z_phong + u * (p2.z_phong - p1.z_phong);
                var Paux = new Dot(x, y, z, "red", 0, 0, 0, i_3, j, k);
                var Paux_SRU = new Dot(x_SRU, y_SRU, z_SRU, "red", 0, 0, 0, i_3, j, k);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos.push(p2);
                    novosPontos_SRU.push(p2_SRU);
                }
                else {
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                    novosPontos_SRU.push(Paux_SRU);
                    novosPontos_SRU.push(p2_SRU);
                }
            }
            if (p1.x <= umax && p2.x <= umax) { //os dois pontos estão dentro do recorte
                novosPontos.push(p2);
                novosPontos_SRU.push(p2_SRU);
            }
            if (p1.x <= umax && p2.x > umax) { //sai do recorte
                u = (umax - p1.x) / (p2.x - p1.x);
                var x = umax;
                var x_SRU = p1_SRU.x + u * (p2_SRU.x - p1_SRU.x);
                var y_SRU = p1_SRU.y + u * (p2_SRU.y - p1_SRU.y);
                var z_SRU = p1_SRU.z + u * (p2_SRU.z - p1_SRU.z);
                var y = p1.y + u * (p2.y - p1.y);
                var z = p1.z + u * (p2.z - p1.z);
                var i_4 = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                var j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                var k = p1.z_phong + u * (p2.z_phong - p1.z_phong);
                var Paux = new Dot(x, y, z, "red", 0, 0, 0, i_4, j, k);
                var Paux_SRU = new Dot(x_SRU, y_SRU, z_SRU, "red", 0, 0, 0, i_4, j, k);
                novosPontos.push(Paux);
                novosPontos_SRU.push(Paux_SRU);
            }
        }
        ;
        for (var i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
                novasArestas_SRU.push(new Aresta(novosPontos_SRU[i], novosPontos_SRU[i + 1]));
            }
            else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
                novasArestas_SRU.push(new Aresta(novosPontos_SRU[i], novosPontos_SRU[0]));
            }
        }
        arestas = novasArestas;
        arestas_SRU = novasArestas_SRU;
        pontos = novosPontos;
        pontos_SRU = novosPontos_SRU;
    }
    var recorteInferior = pontos.some(function (ponto) { return ponto.y > vmax; });
    //verificar recorte inferior
    if (recorteInferior) {
        var novasArestas = [];
        var novasArestas_SRU = [];
        var novosPontos = [];
        var novosPontos_SRU = [];
        for (var i = 0; i < arestas.length; i++) {
            var aresta = arestas[i];
            var aresta_SRU = arestas_SRU[i];
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var p1_SRU = aresta_SRU.p1;
            var p2_SRU = aresta_SRU.p2;
            var u = void 0;
            if (p1.y > vmax && p2.y <= vmax) { //adentra recorte
                u = (vmax - p1.y) / (p2.y - p1.y);
                var y_SRU = p1_SRU.y + u * (p2_SRU.y - p1_SRU.y);
                var x_SRU = p1_SRU.x + u * (p2_SRU.x - p1_SRU.x);
                var z_SRU = p1_SRU.z + u * (p2_SRU.z - p1_SRU.z);
                var y = vmax;
                var x = p1.x + u * (p2.x - p1.x);
                var z = p1.z + u * (p2.z - p1.z);
                var i_5 = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                var j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                var k = p1.z_phong + u * (p2.z_phong - p1.z_phong);
                var Paux = new Dot(x, y, z, "red", 0, 0, 0, i_5, j, k);
                var Paux_SRU = new Dot(x_SRU, y_SRU, z_SRU, "red", 0, 0, 0, i_5, j, k);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos.push(p2);
                    novosPontos_SRU.push(p2_SRU);
                }
                else {
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                    novosPontos_SRU.push(Paux_SRU);
                    novosPontos_SRU.push(p2_SRU);
                }
            }
            if (p1.y <= vmax && p2.y <= vmax) { //os dois pontos estão dentro do recorte
                novosPontos.push(p2);
                novosPontos_SRU.push(p2_SRU);
            }
            if (p1.y <= vmax && p2.y > vmax) { //sai do recorte
                u = (vmax - p1.y) / (p2.y - p1.y);
                var y = vmax;
                var y_SRU = p1_SRU.y + u * (p2_SRU.y - p1_SRU.y);
                var x_SRU = p1_SRU.x + u * (p2_SRU.x - p1_SRU.x);
                var z_SRU = p1_SRU.z + u * (p2_SRU.z - p1_SRU.z);
                var x = p1.x + u * (p2.x - p1.x);
                var z = p1.z + u * (p2.z - p1.z);
                var i_6 = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                var j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                var k = p1.z_phong + u * (p2.z_phong - p1.z_phong);
                var Paux = new Dot(x, y, z, "red", 0, 0, 0, i_6, j, k);
                var Paux_SRU = new Dot(x_SRU, y_SRU, z_SRU, "red", 0, 0, 0, i_6, j, k);
                novosPontos.push(Paux);
                novosPontos_SRU.push(Paux_SRU);
            }
        }
        ;
        for (var i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
                novasArestas_SRU.push(new Aresta(novosPontos_SRU[i], novosPontos_SRU[i + 1]));
            }
            else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
                novasArestas_SRU.push(new Aresta(novosPontos_SRU[i], novosPontos_SRU[0]));
            }
        }
        arestas = novasArestas;
        arestas_SRU = novasArestas_SRU;
        pontos = novosPontos;
        pontos_SRU = novosPontos_SRU;
    }
    var recorteSuperior = pontos.some(function (ponto) { return ponto.y < vmin; });
    //verificar recorte superior
    if (recorteSuperior) {
        var novasArestas = [];
        var novasArestas_SRU = [];
        var novosPontos = [];
        var novosPontos_SRU = [];
        for (var i = 0; i < arestas.length; i++) {
            var aresta = arestas[i];
            var aresta_SRU = arestas_SRU[i];
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var p1_SRU = aresta_SRU.p1;
            var p2_SRU = aresta_SRU.p2;
            var u = void 0;
            if (p1.y < vmin && p2.y >= vmin) { //adentra recorte
                u = (vmin - p1.y) / (p2.y - p1.y);
                var y = vmin;
                var x = p1.x + u * (p2.x - p1.x);
                var z = p1.z + u * (p2.z - p1.z);
                var y_SRU = p1_SRU.y + u * (p2_SRU.y - p1_SRU.y);
                var x_SRU = p1_SRU.x + u * (p2_SRU.x - p1_SRU.x);
                var z_SRU = p1_SRU.z + u * (p2_SRU.z - p1_SRU.z);
                var i_7 = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                var j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                var k = p1.z_phong + u * (p2.z_phong - p1.z_phong);
                var Paux = new Dot(x, y, z, "red", 0, 0, 0, i_7, j, k);
                var Paux_SRU = new Dot(x_SRU, y_SRU, z_SRU, "red", 0, 0, 0, i_7, j, k);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos.push(p2);
                    novosPontos_SRU.push(p2_SRU);
                }
                else {
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                    novosPontos_SRU.push(Paux_SRU);
                    novosPontos_SRU.push(p2_SRU);
                }
            }
            if (p1.y >= vmin && p2.y >= vmin) { //os dois pontos estão dentro do recorte
                novosPontos.push(p2);
                novosPontos_SRU.push(p2_SRU);
            }
            if (p1.y >= vmin && p2.y < vmin) { //sai do recorte
                u = (vmin - p1.y) / (p2.y - p1.y);
                var y = vmin;
                var x = p1.x + u * (p2.x - p1.x);
                var z = p1.z + u * (p2.z - p1.z);
                var y_SRU = p1_SRU.y + u * (p2_SRU.y - p1_SRU.y);
                var x_SRU = p1_SRU.x + u * (p2_SRU.x - p1_SRU.x);
                var z_SRU = p1_SRU.z + u * (p2_SRU.z - p1_SRU.z);
                var i_8 = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                var j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                var k = p1.z_phong + u * (p2.z_phong - p1.z_phong);
                var Paux = new Dot(x, y, z, "red", 0, 0, 0, i_8, j, k);
                var Paux_SRU = new Dot(x_SRU, y_SRU, z_SRU, "red", 0, 0, 0, i_8, j, k);
                novosPontos.push(Paux);
                novosPontos_SRU.push(Paux_SRU);
            }
        }
        ;
        for (var i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
                novasArestas_SRU.push(new Aresta(novosPontos_SRU[i], novosPontos_SRU[i + 1]));
            }
            else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
                novasArestas_SRU.push(new Aresta(novosPontos_SRU[i], novosPontos_SRU[0]));
            }
        }
        arestas = novasArestas;
        pontos = novosPontos;
        arestas_SRU = novasArestas_SRU;
        pontos_SRU = novosPontos_SRU;
    }
    var face_srt = new Face(pontos, face.color, face.other_side_line_color, face.line_color);
    var face_sruzin = new Face(pontos_SRU, face.color, face.other_side_line_color, face.line_color);
    return new Double_Face(face_srt, face_sruzin);
}
