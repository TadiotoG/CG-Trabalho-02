/// <reference path= "./spline.ts" />

class Aresta {
    p1: Dot;
    p2: Dot;

    constructor(p1: Dot, p2: Dot) {
        this.p1 = p1;
        this.p2 = p2;
    }
}


function Recorte (face: Face, umin, umax, vmin, vmax) {
    let pontos = face.dots;
    let arestas: Aresta[] = [];

    

    for (let i = 0; i < pontos.length; i++) {
        if (i + 1 < pontos.length) {
            arestas.push(new Aresta(pontos[i], pontos[i + 1]));
        } else {
            arestas.push(new Aresta(pontos[i], pontos[0]));
        }}


    let recorteEsquerda = pontos.some(ponto => ponto.x < umin);


    //verificar recorte esquerda
    if(recorteEsquerda){
        let novasArestas: Aresta[] = [];
        let novosPontos: Dot[] = [];

        arestas.forEach(arestas => {
            let p1 = arestas.p1;
            let p2 = arestas.p2;
            let u;
        
            if (p1.x < umin && p2.x >= umin) { //adentra recorte
                u = (umin - p1.x) / (p2.x - p1.x);
                let x = umin;
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);
                
                let Paux = new Dot(x, y, z);

                if(Paux.x == p2.x && Paux.y == p2.y){
                    novosPontos.push(p2);
                }else{
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                }
                }

            if(p1.x >= umin && p2.x >= umin) {//os dois pontos estão dentro do recorte
                novosPontos.push(p2);
            }

            if(p1.x >= umin && p2.x < umin) {//sai do recorte
                u = (umin - p1.x) / (p2.x - p1.x);
                let x = umin;
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Dot(x, y, z);
                novosPontos.push(Paux);
            }
        });
        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
            }}


        arestas = novasArestas;
        pontos = novosPontos;
    }



    let recorteDireita = pontos.some(ponto => ponto.x > umax);

    //verificar recorte direita
    if(recorteDireita){
        let novasArestas: Aresta[] = [];
        let novosPontos: Dot[] = [];

        arestas.forEach(aresta => {
            let p1 = aresta.p1;
            let p2 = aresta.p2;
            let u;
        
            if (p1.x > umax && p2.x < umax) {//adentra recorte

                u = (umax - p1.x) / (p2.x - p1.x);
                let x = umax;  
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Dot(x, y, z);
                if(Paux.x == p2.x && Paux.y == p2.y){
                    novosPontos.push(p2);
                }else{
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                }

            }

            if(p1.x <= umax && p2.x <= umax) {//os dois pontos estão dentro do recorte
                novosPontos.push(p2);
            }

            if(p1.x < umax && p2.x > umax) {//sai do recorte
                u = (umax - p1.x) / (p2.x - p1.x);
                let x = umax;
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Dot(x, y, z);
                novosPontos.push(Paux);
            }
        });

        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
            }}

        arestas = novasArestas;
        pontos = novosPontos;
    }

    let recorteInferior = pontos.some(ponto => ponto.y > vmax);
    //verificar recorte inferior
    if(recorteInferior){

        let novosPontos: Dot[] = []
        let novasArestas: Aresta[] = [];
        arestas.forEach(aresta => {
            let p1 = aresta.p1;
            let p2 = aresta.p2;
            let u;
        
            if (p1.y > vmax && p2.y <= vmax) {//adentra recorte
                u = (vmax - p1.y) / (p2.y - p1.y);
                let y = vmax;  
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Dot(x, y, z);
                if(Paux.x == p2.x && Paux.y == p2.y){
                    novosPontos.push(p2);

                    
                }else{
                    novosPontos.push(Paux);
                    novosPontos.push(p2);

                }
                
            }

            if(p1.y <= vmax && p2.y <= vmax) {//os dois pontos estão dentro do recorte
                novosPontos.push(p2);

            }

            if(p1.y <= vmax && p2.y > vmax) {//sai do recorte
                u = (vmax - p1.y) / (p2.y - p1.y);
                let y = vmax;
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Dot(x, y, z);
                novosPontos.push(Paux);



            }
        });
        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
            }}

        arestas = novasArestas;
        pontos = novosPontos;
    }
    let recorteSuperior = pontos.some(ponto => ponto.y < vmin);
    //verificar recorte superior
    if(recorteSuperior){
        let novosPontos: Dot[] = [];
        let novasArestas: Aresta[] = [];

        arestas.forEach(aresta => {
            let p1 = aresta.p1;
            let p2 = aresta.p2;
            let u;
        
            if (p1.y < vmin && p2.y >= vmin) {//adentra recorte
                u = (vmin - p1.y) / (p2.y - p1.y);
                let y = vmin;  
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Dot(x, y, z);
                if(Paux.x == p2.x && Paux.y == p2.y){
                    novosPontos.push(p2);
                    
                }else{
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                }

            }

            if(p1.y >= vmin && p2.y >= vmin) {//os dois pontos estão dentro do recorte
                novosPontos.push(p2);
 
            }

            if(p1.y >= vmin && p2.y < vmin) {//sai do recorte
                u = (vmin - p1.y) / (p2.y - p1.y);
                let y = vmin;
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Dot(x, y, z);
                novosPontos.push(Paux);


            }
        });

        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
            }}

        arestas = novasArestas;
        pontos = novosPontos;
    }
    console.log(pontos);
    return pontos;

}
