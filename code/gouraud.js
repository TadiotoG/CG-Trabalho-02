/// <reference path="./surface.ts" />
function define_vet_normal_vertices(LFD) {
    var limit_i = LFD.length;
    var limit_j = LFD[0].length;
    for (var i = 0; i < limit_i; i++) {
        for (var j = 0; j < limit_j; j++) {
            var vet_sum = new Vet(0, 0, 0);
            if (j != 0 && i != 0) {
                // Soma o vetor da face esquerda de cima
                var vet_aux = new Face([LFD[i - 1][j - 1], LFD[i][j - 1], LFD[i][j], LFD[i - 1][j]]).get_normal();
                vet_sum = VetA_plus_VetB(vet_sum, vet_aux);
            }
            if (j != (limit_j - 1) && i != 0) { // Soma o vetor da face da direita de cima
                var vet_aux = new Face([LFD[i - 1][j], LFD[i][j], LFD[i][j + 1], LFD[i - 1][j + 1]]).get_normal();
                vet_sum = VetA_plus_VetB(vet_sum, vet_aux);
            }
            if (j != 0 && i != (limit_i - 1)) { // Soma o vetor da face esquerda de baixo
                var vet_aux = new Face([LFD[i][j - 1], LFD[i + 1][j - 1], LFD[i + 1][j], LFD[i][j]]).get_normal();
                vet_sum = VetA_plus_VetB(vet_sum, vet_aux);
            }
            if (j != (limit_j - 1) && i != (limit_i - 1)) {
                // Soma o vetor da face de direita de baixo
                var vet_aux = new Face([LFD[i][j], LFD[i + 1][j], LFD[i + 1][j + 1], LFD[i][j + 1]]).get_normal();
                vet_sum = VetA_plus_VetB(vet_sum, vet_aux);
            }
            vet_sum.unitary = vet_sum.get_unitary_vector();
            LFD[i][j].gouraud = vet_sum;
        }
    }
}
function gouraud(face) {
    var ymin = Math.round(Math.min.apply(Math, face.dots.map(function (p) { return p.y; })));
    var ymax = Math.round(Math.max.apply(Math, face.dots.map(function (p) { return p.y; })));
    face.inters = Array.from({ length: ymax - ymin + 1 }, function () { return []; });
    face.arestas.forEach(function (aresta, i) {
        var _a;
        if (aresta[0].y === aresta[1].y)
            return;
        if (aresta[0].y > aresta[1].y) {
            _a = [aresta[1], aresta[0]], face.arestas[i][0] = _a[0], face.arestas[i][1] = _a[1];
        }
        var x1 = aresta[0].x, y1 = Math.ceil(aresta[0].y);
        var x2 = aresta[1].x, y2 = Math.floor(aresta[1].y);
        var coeficiente = (x2 - x1) / (y2 - y1);
        var x = x1;
        var index = Math.floor(y1 - ymin);
        for (var y = y1; y <= y2; y++) {
            if (!face.inters[index])
                face.inters[index] = [];
            face.inters[index++].push(Math.round(x));
            x += coeficiente;
        }
    });
    face.inters.forEach(function (line, i) {
        line.sort(function (a, b) { return a - b; });
        // this.draw(line, ymin + i, ctx, normal);
    });
}
function fillpoly(ctx, normal) {
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
}
