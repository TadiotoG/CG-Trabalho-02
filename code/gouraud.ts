/// <reference path="./surface.ts" />

function define_vet_normal_vertices(LFD: Dot[][]){ // LFD -> list of dots
    let limit_i: number = LFD.length;
    let limit_j: number = LFD[0].length;

    for(let i=0; i<limit_i; i++){
        for(let j=0; j<limit_j; j++){
            let vet_sum: Vet = new Vet(0,0,0);
            if(j != 0 && i != 0){
                // Soma o vetor da face esquerda de cima
                let vet_aux = new Face([LFD[i-1][j-1], LFD[i][j-1], LFD[i][j], LFD[i-1][j]]).get_normal()
                vet_sum = VetA_plus_VetB(vet_sum, vet_aux); 
            }
            if(j != (limit_j-1) && i != 0){// Soma o vetor da face da direita de cima
                let vet_aux = new Face([LFD[i-1][j], LFD[i][j], LFD[i][j+1], LFD[i-1][j+1]]).get_normal()
                vet_sum = VetA_plus_VetB(vet_sum, vet_aux);
            }
            if(j != 0 && i != (limit_i-1)){// Soma o vetor da face esquerda de baixo
                let vet_aux = new Face([LFD[i][j-1], LFD[i+1][j-1], LFD[i+1][j], LFD[i][j]]).get_normal()
                vet_sum = VetA_plus_VetB(vet_sum, vet_aux);
            }
            if(j != (limit_j-1) && i != (limit_i-1)){
                // Soma o vetor da face de direita de baixo
                let vet_aux = new Face([LFD[i][j], LFD[i+1][j], LFD[i+1][j+1], LFD[i][j+1]]).get_normal()
                vet_sum = VetA_plus_VetB(vet_sum, vet_aux);
            }
            vet_sum.unitary = vet_sum.get_unitary_vector();
            LFD[i][j].vet_normal = vet_sum;
        }
    }
}
