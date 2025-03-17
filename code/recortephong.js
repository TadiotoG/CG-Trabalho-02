/// <reference path="./surface.ts" />
function RecortePhong(face, umin, umax, vmin, vmax) {
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
                var i = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                var j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                var k = p1.z_phong + u * (p2.z_phong - p1.z_phong);
                var Paux = new Dot(x, y, z, "red", 0, 0, 0, i, j, k);
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
                var i = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                var j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                var k = p1.z_phong + u * (p2.z_phong - p1.z_phong);
                var Paux = new Dot(x, y, z, "red", 0, 0, 0, i, j, k);
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
                var i = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                var j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                var k = p1.z_phong + u * (p2.z_phong - p1.z_phong);
                var Paux = new Dot(x, y, z, "red", 0, 0, 0, i, j, k);
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
                var i = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                var j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                var k = p1.z_phong + u * (p2.z_phong - p1.z_phong);
                var Paux = new Dot(x, y, z, "red", 0, 0, 0, i, j, k);
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
                var i = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                var j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                var k = p1.z_phong + u * (p2.z_phong - p1.z_phong);
                var Paux = new Dot(x, y, z, "red", 0, 0, 0, i, j, k);
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
                var i = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                var j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                var k = p1.z_phong + u * (p2.z_phong - p1.z_phong);
                var Paux = new Dot(x, y, z, "red", 0, 0, 0, i, j, k);
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
                var i = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                var j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                var k = p1.z_phong + u * (p2.z_phong - p1.z_phong);
                var Paux = new Dot(x, y, z, "red", 0, 0, 0, i, j, k);
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
                var i = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                var j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                var k = p1.z_phong + u * (p2.z_phong - p1.z_phong);
                var Paux = new Dot(x, y, z, "red", 0, 0, 0, i, j, k);
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
