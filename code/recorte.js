/// <reference path="gouraud.ts" />
function Recorte(face, umin, umax, vmin, vmax) {
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
    if (recorteEsquerda) {
        var novasArestas = [];
        var novosPontos_1 = [];
        arestas.forEach(function (arestas) {
            var p1 = arestas.p1;
            var p2 = arestas.p2;
            var u;
            if (p1.x < umin && p2.x >= umin) {
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
            if (p1.x >= umin && p2.x >= umin) {
                novosPontos_1.push(p2);
            }
            if (p1.x >= umin && p2.x < umin) {
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
    if (recorteDireita) {
        var novasArestas = [];
        var novosPontos_2 = [];
        arestas.forEach(function (aresta) {
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var u;
            if (p1.x > umax && p2.x < umax) {
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
            if (p1.x <= umax && p2.x <= umax) {
                novosPontos_2.push(p2);
            }
            if (p1.x < umax && p2.x > umax) {
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
    if (recorteInferior) {
        var novosPontos_3 = [];
        var novasArestas = [];
        arestas.forEach(function (aresta) {
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var u;
            if (p1.y > vmax && p2.y <= vmax) {
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
            if (p1.y <= vmax && p2.y <= vmax) {
                novosPontos_3.push(p2);
            }
            if (p1.y <= vmax && p2.y > vmax) {
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
    if (recorteSuperior) {
        var novosPontos_4 = [];
        var novasArestas = [];
        arestas.forEach(function (aresta) {
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var u;
            if (p1.y < vmin && p2.y >= vmin) {
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
            if (p1.y >= vmin && p2.y >= vmin) {
                novosPontos_4.push(p2);
            }
            if (p1.y >= vmin && p2.y < vmin) {
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
