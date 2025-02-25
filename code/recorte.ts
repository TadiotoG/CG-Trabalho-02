class ViewPort {
    umin: number;
    umax: number;
    vmin: number;
    vmax: number;

    constructor(umin: number, umax: number, vmin: number, vmax: number) {
        this.umin = umin;
        this.umax = umax;
        this.vmin = vmin;
        this.vmax = vmax;
    }
}

class Ponto {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Aresta {
    p1: Ponto;
    p2: Ponto;

    constructor(p1: Ponto, p2: Ponto) {
        this.p1 = p1;
        this.p2 = p2;
    }
}

class Face1 {
    pontos: Ponto[];
    arestas: Aresta[];

    constructor(pontos: Ponto[], arestas: Aresta[]) {
        this.pontos = pontos;
        this.arestas = arestas;
    }
}

function Recorte (face: Face1, viewPort: ViewPort) {
    let pontos = face.pontos;
    let arestas = face.arestas;

    let recorteEsquerda = pontos.some(ponto => ponto.x < viewPort.umin);

    // console.log(arestas);

    //verificar recorte esquerda
    if(recorteEsquerda){
        let novasArestas: Aresta[] = [];
        let novosPontos: Ponto[] = [];
        arestas.forEach(aresta => {
            let p1 = aresta.p1;
            let p2 = aresta.p2;
            let u;
        
            if (p1.x < viewPort.umin && p2.x >= viewPort.umin) { //adentra recorte
                u = (viewPort.umin - p1.x) / (p2.x - p1.x);
                let x = viewPort.umin;
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);
                
                let Paux = new Ponto(x, y, z);

                if(Paux.x == p2.x && Paux.y == p2.y){
                    novosPontos.push(p2);
                }else{
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                }
                }

            if(p1.x >= viewPort.umin && p2.x >= viewPort.umin) {//os dois pontos estão dentro do recorte
                novosPontos.push(p2);
            }

            if(p1.x >= viewPort.umin && p2.x < viewPort.umin) {//sai do recorte
                u = (viewPort.umin - p1.x) / (p2.x - p1.x);
                let x = viewPort.umin;
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Ponto(x, y, z);
                novosPontos.push(Paux);
            }
        });
        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
            }}
        // console.log("pontos da esquerda");
        // console.log(novosPontos);
        // console.log("aresta da esquerda");
        // console.log(novasArestas);

        arestas = novasArestas;
        pontos = novosPontos;
    }

    let recorteDireita = pontos.some(ponto => ponto.x > viewPort.umax);

    //verificar recorte direita
    if(recorteDireita){
        let novasArestas: Aresta[] = [];
        let novosPontos: Ponto[] = [];
        arestas.forEach(aresta => {
            let p1 = aresta.p1;
            let p2 = aresta.p2;
            let u;
        
            if (p1.x > viewPort.umax && p2.x < viewPort.umax) {//adentra recorte

                u = (viewPort.umax - p1.x) / (p2.x - p1.x);
                let x = viewPort.umax;  
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Ponto(x, y, z);
                if(Paux.x == p2.x && Paux.y == p2.y){
                    novosPontos.push(p2);
                }else{
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                }

            }

            if(p1.x <= viewPort.umax && p2.x <= viewPort.umax) {//os dois pontos estão dentro do recorte
                novosPontos.push(p2);
            }

            if(p1.x < viewPort.umax && p2.x > viewPort.umax) {//sai do recorte
                u = (viewPort.umax - p1.x) / (p2.x - p1.x);
                let x = viewPort.umax;
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Ponto(x, y, z);
                novosPontos.push(Paux);
            }
        });

        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
            }}
        // console.log("pontos da direita");
        // console.log(novosPontos);
        // console.log("aresta da direita");
        // console.log(novasArestas);
        arestas = novasArestas;
        pontos = novosPontos;
    }

    console.log(pontos, arestas);
    let recorteInferior = pontos.some(ponto => ponto.y > viewPort.vmax);
    //verificar recorte inferior
    if(recorteInferior){

        let novosPontos: Ponto[] = []
        let novasArestas: Aresta[] = [];
        arestas.forEach(aresta => {
            let p1 = aresta.p1;
            let p2 = aresta.p2;
            let u;
        
            if (p1.y > viewPort.vmax && p2.y <= viewPort.vmax) {//adentra recorte
                u = (viewPort.vmax - p1.y) / (p2.y - p1.y);
                let y = viewPort.vmax;  
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Ponto(x, y, z);
                if(Paux.x == p2.x && Paux.y == p2.y){
                    novosPontos.push(p2);
                    console.log("adentra porém é igual");
                    
                }else{
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                    console.log("adentra");
                }
                
            }

            if(p1.y <= viewPort.vmax && p2.y <= viewPort.vmax) {//os dois pontos estão dentro do recorte
                novosPontos.push(p2);
                console.log("2 dentro"); 
            }

            if(p1.y <= viewPort.vmax && p2.y > viewPort.vmax) {//sai do recorte
                u = (viewPort.vmax - p1.y) / (p2.y - p1.y);
                let y = viewPort.vmax;
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Ponto(x, y, z);
                novosPontos.push(Paux);
                console.log("sai");


            }
        });
        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
            }}
        console.log("pontos da baixo");
        console.log(novosPontos);    
        console.log("aresta da baixo");
        console.log(novasArestas);
        arestas = novasArestas;
        pontos = novosPontos;
    }
    let recorteSuperior = pontos.some(ponto => ponto.y < viewPort.vmin);
    //verificar recorte superior
    if(recorteSuperior){
        let novosPontos: Ponto[] = [];
        let novasArestas: Aresta[] = [];
        let aux = 0;
        arestas.forEach(aresta => {
            let p1 = aresta.p1;
            let p2 = aresta.p2;
            let u;
        
            if (p1.y < viewPort.vmin && p2.y >= viewPort.vmin) {//adentra recorte
                u = (viewPort.vmin - p1.y) / (p2.y - p1.y);
                let y = viewPort.vmin;  
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Ponto(x, y, z);
                if(Paux.x == p2.x && Paux.y == p2.y){
                    novosPontos.push(p2);
                    console.log("adentra porém é igual" + aux);
                    
                }else{
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                    console.log("adentra" + aux);
                }
                console.log(novosPontos);
                console.log("adentra");
                aux++;
            }

            if(p1.y >= viewPort.vmin && p2.y >= viewPort.vmin) {//os dois pontos estão dentro do recorte
                novosPontos.push(p2);
                console.log(novosPontos);
                console.log("dentro" + aux);
                aux++;   
            }

            if(p1.y >= viewPort.vmin && p2.y < viewPort.vmin) {//sai do recorte
                u = (viewPort.vmin - p1.y) / (p2.y - p1.y);
                let y = viewPort.vmin;
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Ponto(x, y, z);
                novosPontos.push(Paux);
                console.log(novosPontos);
                console.log("sai" + aux);
                aux++;

            }
        });

        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
            }}
        console.log("pontos da cima");
        console.log(novosPontos);
        console.log("aresta da cima");
        console.log(novasArestas);
        arestas = novasArestas;
        pontos = novosPontos;
    }

}

// Criação dos pontos
let pontoA = new Ponto(-59.425, 231.028, -52.703);
let pontoB = new Ponto(151.914, 340.497, -39.024);
let pontoE = new Ponto(149.5564, -51.1074, -47.9237);

// Criação das arestas com os pontos
let arestaAB = new Aresta(pontoA, pontoB);
let arestaBE = new Aresta(pontoB, pontoE);
let arestaEA = new Aresta(pontoE, pontoA);

// Criação da face com os pontos e arestas
let face = new Face1([pontoA, pontoB, pontoE], [arestaAB, arestaBE, arestaEA]);

// Exemplo de uso da função Recorte
let viewPort = new ViewPort(0, 319, 0, 239);
Recorte(face, viewPort);