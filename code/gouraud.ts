/// <reference path="./surface.ts" />

function define_vet_normal_vertices(LFD: Dot[][]){ // LFD list of dots
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
            LFD[i][j].gouraud = vet_sum;
        }
    }
}

function gouraud(face: Face){
    const ymin = Math.round(Math.min(...face.dots.map(p => p.y)));
    const ymax = Math.round(Math.max(...face.dots.map(p => p.y)));

    face.inters = Array.from({ length: ymax - ymin +1}, () => []);

    face.arestas.forEach((aresta, i) => {
        if (aresta[0].y === aresta[1].y) return; 
        if (aresta[0].y > aresta[1].y) {
            [face.arestas[i][0], face.arestas[i][1]] = [aresta[1], aresta[0]];
        }
        
        const x1 = aresta[0].x, y1 = Math.ceil(aresta[0].y);
        const x2 = aresta[1].x, y2 = Math.floor(aresta[1].y);
        
        const coeficiente = (x2 - x1) / (y2 - y1);
        
        let x = x1;
        let index = Math.floor(y1 - ymin);
        
        for (let y = y1; y <= y2; y++) {
            if (!face.inters[index]) face.inters[index] = []; 
            face.inters[index++].push(Math.round(x));

            x += coeficiente;
        }
    });

    face.inters.forEach((line, i) => {
        line.sort((a, b) => a - b);
        // this.draw(line, ymin + i, ctx, normal);
    });
}

function fillpoly(ctx: CanvasRenderingContext2D, normal: number): void {
    // console.log("Cor da face -> ", this.color)

 //   this.cria_arestas();

    const ymin = Math.round(Math.min(...this.dots.map(p => p.y)));
    const ymax = Math.round(Math.max(...this.dots.map(p => p.y)));

    this.inters = Array.from({ length: ymax - ymin +1}, () => []);

    this.arestas.forEach((aresta, i) => {
        if (aresta[0].y === aresta[1].y) return; 
        if (aresta[0].y > aresta[1].y) {
            [this.arestas[i][0], this.arestas[i][1]] = [aresta[1], aresta[0]];
        }
        
        const x1 = aresta[0].x, y1 = Math.ceil(aresta[0].y);
        const x2 = aresta[1].x, y2 = Math.floor(aresta[1].y);
        
        const coeficiente = (x2 - x1) / (y2 - y1);
        
        let x = x1;
        let index = Math.floor(y1 - ymin);
        
        for (let y = y1; y <= y2; y++) {
            if (!this.inters[index]) this.inters[index] = []; 
            this.inters[index++].push(Math.round(x));

            x += coeficiente;
        }
    });

    this.inters.forEach((line, i) => {
        line.sort((a, b) => a - b);
        this.draw(line, ymin + i, ctx, normal);
    });
}