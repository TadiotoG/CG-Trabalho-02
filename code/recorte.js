var ViewPort = /** @class */ (function () {
    function ViewPort(umin, umax, vmin, vmax) {
        this.umin = umin;
        this.umax = umax;
        this.vmin = vmin;
        this.vmax = vmax;
    }
    return ViewPort;
}());
var Ponto = /** @class */ (function () {
    function Ponto(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    return Ponto;
}());
var Aresta = /** @class */ (function () {
    function Aresta(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
    return Aresta;
}());
var Face = /** @class */ (function () {
    function Face(pontos, arestas) {
        this.pontos = pontos;
        this.arestas = arestas;
    }
    return Face;
}());
function Recorte(face, viewPort) {
    var pontos = face.pontos;
    var arestas = face.arestas;
    var recorteEsquerda = pontos.some(function (ponto) { return ponto.x < viewPort.umin; });
    // console.log(arestas);
    //verificar recorte esquerda
    if (recorteEsquerda) {
        var novasArestas = [];
        var novosPontos_1 = [];
        arestas.forEach(function (aresta) {
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var u;
            if (p1.x < viewPort.umin && p2.x >= viewPort.umin) { //adentra recorte
                u = (viewPort.umin - p1.x) / (p2.x - p1.x);
                var x = viewPort.umin;
                var y = p1.y + u * (p2.y - p1.y);
                var z = p1.z + u * (p2.z - p1.z);
                var Paux = new Ponto(x, y, z);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos_1.push(p2);
                }
                else {
                    novosPontos_1.push(Paux);
                    novosPontos_1.push(p2);
                }
            }
            if (p1.x >= viewPort.umin && p2.x >= viewPort.umin) { //os dois pontos estão dentro do recorte
                novosPontos_1.push(p2);
            }
            if (p1.x >= viewPort.umin && p2.x < viewPort.umin) { //sai do recorte
                u = (viewPort.umin - p1.x) / (p2.x - p1.x);
                var x = viewPort.umin;
                var y = p1.y + u * (p2.y - p1.y);
                var z = p1.z + u * (p2.z - p1.z);
                var Paux = new Ponto(x, y, z);
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
        // console.log("pontos da esquerda");
        // console.log(novosPontos);
        // console.log("aresta da esquerda");
        // console.log(novasArestas);
        arestas = novasArestas;
        pontos = novosPontos_1;
    }
    var recorteDireita = pontos.some(function (ponto) { return ponto.x > viewPort.umax; });
    //verificar recorte direita
    if (recorteDireita) {
        var novasArestas = [];
        var novosPontos_2 = [];
        arestas.forEach(function (aresta) {
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var u;
            if (p1.x > viewPort.umax && p2.x < viewPort.umax) { //adentra recorte
                u = (viewPort.umax - p1.x) / (p2.x - p1.x);
                var x = viewPort.umax;
                var y = p1.y + u * (p2.y - p1.y);
                var z = p1.z + u * (p2.z - p1.z);
                var Paux = new Ponto(x, y, z);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos_2.push(p2);
                }
                else {
                    novosPontos_2.push(Paux);
                    novosPontos_2.push(p2);
                }
            }
            if (p1.x <= viewPort.umax && p2.x <= viewPort.umax) { //os dois pontos estão dentro do recorte
                novosPontos_2.push(p2);
            }
            if (p1.x < viewPort.umax && p2.x > viewPort.umax) { //sai do recorte
                u = (viewPort.umax - p1.x) / (p2.x - p1.x);
                var x = viewPort.umax;
                var y = p1.y + u * (p2.y - p1.y);
                var z = p1.z + u * (p2.z - p1.z);
                var Paux = new Ponto(x, y, z);
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
        // console.log("pontos da direita");
        // console.log(novosPontos);
        // console.log("aresta da direita");
        // console.log(novasArestas);
        arestas = novasArestas;
        pontos = novosPontos_2;
    }
    console.log(pontos, arestas);
    var recorteInferior = pontos.some(function (ponto) { return ponto.y > viewPort.vmax; });
    //verificar recorte inferior
    if (recorteInferior) {
        var novosPontos_3 = [];
        var novasArestas = [];
        arestas.forEach(function (aresta) {
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var u;
            if (p1.y > viewPort.vmax && p2.y <= viewPort.vmax) { //adentra recorte
                u = (viewPort.vmax - p1.y) / (p2.y - p1.y);
                var y = viewPort.vmax;
                var x = p1.x + u * (p2.x - p1.x);
                var z = p1.z + u * (p2.z - p1.z);
                var Paux = new Ponto(x, y, z);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos_3.push(p2);
                    console.log("adentra porém é igual");
                }
                else {
                    novosPontos_3.push(Paux);
                    novosPontos_3.push(p2);
                    console.log("adentra");
                }
            }
            if (p1.y <= viewPort.vmax && p2.y <= viewPort.vmax) { //os dois pontos estão dentro do recorte
                novosPontos_3.push(p2);
                console.log("2 dentro");
            }
            if (p1.y <= viewPort.vmax && p2.y > viewPort.vmax) { //sai do recorte
                u = (viewPort.vmax - p1.y) / (p2.y - p1.y);
                var y = viewPort.vmax;
                var x = p1.x + u * (p2.x - p1.x);
                var z = p1.z + u * (p2.z - p1.z);
                var Paux = new Ponto(x, y, z);
                novosPontos_3.push(Paux);
                console.log("sai");
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
        console.log("pontos da baixo");
        console.log(novosPontos_3);
        console.log("aresta da baixo");
        console.log(novasArestas);
        arestas = novasArestas;
        pontos = novosPontos_3;
    }
    var recorteSuperior = pontos.some(function (ponto) { return ponto.y < viewPort.vmin; });
    //verificar recorte superior
    if (recorteSuperior) {
        var novosPontos_4 = [];
        var novasArestas = [];
        var aux_1 = 0;
        arestas.forEach(function (aresta) {
            var p1 = aresta.p1;
            var p2 = aresta.p2;
            var u;
            if (p1.y < viewPort.vmin && p2.y >= viewPort.vmin) { //adentra recorte
                u = (viewPort.vmin - p1.y) / (p2.y - p1.y);
                var y = viewPort.vmin;
                var x = p1.x + u * (p2.x - p1.x);
                var z = p1.z + u * (p2.z - p1.z);
                var Paux = new Ponto(x, y, z);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos_4.push(p2);
                    console.log("adentra porém é igual" + aux_1);
                }
                else {
                    novosPontos_4.push(Paux);
                    novosPontos_4.push(p2);
                    console.log("adentra" + aux_1);
                }
                console.log(novosPontos_4);
                console.log("adentra");
                aux_1++;
            }
            if (p1.y >= viewPort.vmin && p2.y >= viewPort.vmin) { //os dois pontos estão dentro do recorte
                novosPontos_4.push(p2);
                console.log(novosPontos_4);
                console.log("dentro" + aux_1);
                aux_1++;
            }
            if (p1.y >= viewPort.vmin && p2.y < viewPort.vmin) { //sai do recorte
                u = (viewPort.vmin - p1.y) / (p2.y - p1.y);
                var y = viewPort.vmin;
                var x = p1.x + u * (p2.x - p1.x);
                var z = p1.z + u * (p2.z - p1.z);
                var Paux = new Ponto(x, y, z);
                novosPontos_4.push(Paux);
                console.log(novosPontos_4);
                console.log("sai" + aux_1);
                aux_1++;
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
        console.log("pontos da cima");
        console.log(novosPontos_4);
        console.log("aresta da cima");
        console.log(novasArestas);
        arestas = novasArestas;
        pontos = novosPontos_4;
    }
}
// Criação dos pontos
var pontoA = new Ponto(-59.425, 231.028, -52.703);
var pontoB = new Ponto(151.914, 340.497, -39.024);
var pontoE = new Ponto(149.5564, -51.1074, -47.9237);
// Criação das arestas com os pontos
var arestaAB = new Aresta(pontoA, pontoB);
var arestaBE = new Aresta(pontoB, pontoE);
var arestaEA = new Aresta(pontoE, pontoA);
// Criação da face com os pontos e arestas
var face = new Face([pontoA, pontoB, pontoE], [arestaAB, arestaBE, arestaEA]);
// Exemplo de uso da função Recorte
var viewPort = new ViewPort(0, 319, 0, 239);
Recorte(face, viewPort);
