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
            LFD[i][j].vet_normal = vet_sum;
        }
    }
}
function define_vet_normal_phong(LFD) {
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
            LFD[i][j].x_phong = vet_sum.x;
            LFD[i][j].y_phong = vet_sum.y;
            LFD[i][j].z_phong = vet_sum.z;
        }
    }
}
