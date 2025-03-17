/// <reference path="./recortecolor.ts" />

function RecortePhong (double_face: Double_Face, umin: number, umax: number, vmin: number, vmax: number) {
    umin = Number(umin);
    umax = Number(umax);
    vmin = Number(vmin);
    vmax = Number(vmax);

    let face = double_face.face;
    let face_SRU = double_face.face_SRU;

    let pontos = face.dots;
    let arestas: Aresta[] = [];

    let pontos_SRU = face_SRU.dots;
    let arestas_SRU: Aresta[] = [];

    for (let i = 0; i < pontos.length; i++) {
        if (i + 1 < pontos.length) {
            arestas.push(new Aresta(pontos[i], pontos[i + 1]));
        } else {
            arestas.push(new Aresta(pontos[i], pontos[0]));
        }}

    for (let i = 0; i < pontos_SRU.length; i++) {
        if (i + 1 < pontos_SRU.length) {
            arestas_SRU.push(new Aresta(pontos_SRU[i], pontos_SRU[i + 1]));
        } else {
            arestas_SRU.push(new Aresta(pontos_SRU[i], pontos_SRU[0]));
        }}

    let recorteEsquerda = pontos.some(ponto => ponto.x < umin);

    //verificar recorte esquerda
    if(recorteEsquerda){
        let novasArestas: Aresta[] = [];
        let novasArestas_SRU: Aresta[] = [];
        let novosPontos: Dot[] = [];
        let novosPontos_SRU: Dot[] = [];
        
        for (let i = 0; i < arestas.length; i++) {
            let aresta = arestas[i];
            let aresta_SRU = arestas_SRU[i];
    
            let p1 = aresta.p1;
            let p2 = aresta.p2;
    
            let p1_SRU = aresta_SRU.p1;
            let p2_SRU = aresta_SRU.p2;

            let u;
        
            if (p1.x < umin && p2.x >= umin) { //adentra recorte
                u = (umin - p1.x) / (p2.x - p1.x);
                let x_SRU = p1_SRU.x + u * (p2_SRU.x - p1_SRU.x);
                let y_SRU = p1_SRU.y + u * (p2_SRU.y - p1_SRU.y);
                let z_SRU = p1_SRU.z + u * (p2_SRU.z - p1_SRU.z);
                let x = umin;
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);
                let i = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                let j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                let k = p1.z_phong + u * (p2.z_phong - p1.z_phong);
                
                let Paux = new Dot(x, y, z, "red", 0, 0, 0, i, j, k);
                let Paux_SRU = new Dot(x_SRU, y_SRU, z_SRU, "red", 0, 0, 0, i, j, k);

                if(Paux.x == p2.x && Paux.y == p2.y){
                    novosPontos.push(p2);
                    novosPontos_SRU.push(p2_SRU);
                }else{
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                    novosPontos_SRU.push(Paux_SRU);
                    novosPontos_SRU.push(p2_SRU);
                }
                }

            if(p1.x >= umin && p2.x >= umin) {//os dois pontos estão dentro do recorte
                novosPontos.push(p2);
                novosPontos_SRU.push(p2_SRU);
            }

            if(p1.x >= umin && p2.x < umin) {//sai do recorte
                u = (umin - p1.x) / (p2.x - p1.x);
                let x = umin;
                let x_SRU = p1_SRU.x + u * (p2_SRU.x - p1_SRU.x);
                let y_SRU = p1_SRU.y + u * (p2_SRU.y - p1_SRU.y);
                let z_SRU = p1_SRU.z + u * (p2_SRU.z - p1_SRU.z);
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);
                let i = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                let j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                let k = p1.z_phong + u * (p2.z_phong - p1.z_phong);

                let Paux = new Dot(x, y, z, "red", 0, 0, 0, i, j, k);
                let Paux_SRU = new Dot(x_SRU, y_SRU, z_SRU, "red", 0, 0, 0, i, j, k);
                novosPontos.push(Paux);
                novosPontos_SRU.push(Paux_SRU);
            }
        };
        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
                novasArestas_SRU.push(new Aresta(novosPontos_SRU[i], novosPontos_SRU[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
                novasArestas_SRU.push(new Aresta(novosPontos_SRU[i], novosPontos_SRU[0]));
            }}

        arestas = novasArestas;
        arestas_SRU = novasArestas_SRU;
        pontos = novosPontos;
        pontos_SRU = novosPontos_SRU;
    }

    let recorteDireita = pontos.some(ponto => ponto.x > umax);

    //verificar recorte direita
    if(recorteDireita){
        let novasArestas: Aresta[] = [];
        let novasArestas_SRU: Aresta[] = [];
        let novosPontos: Dot[] = [];
        let novosPontos_SRU: Dot[] = [];

        for (let i = 0; i < arestas.length; i++) {
            let aresta = arestas[i];
            let aresta_SRU = arestas_SRU[i];
    
            let p1 = aresta.p1;
            let p2 = aresta.p2;
    
            let p1_SRU = aresta_SRU.p1;
            let p2_SRU = aresta_SRU.p2;

            let u;
        
            if (p1.x > umax && p2.x <= umax) {//adentra recorte
                u = (umax - p1.x) / (p2.x - p1.x);
                let x_SRU = p1_SRU.x + u * (p2_SRU.x - p1_SRU.x);
                let y_SRU = p1_SRU.y + u * (p2_SRU.y - p1_SRU.y);
                let z_SRU = p1_SRU.z + u * (p2_SRU.z - p1_SRU.z);
                let x = umax;
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);
                let i = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                let j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                let k = p1.z_phong + u * (p2.z_phong - p1.z_phong);

                let Paux = new Dot(x, y, z, "red", 0, 0, 0, i, j, k);
                let Paux_SRU = new Dot(x_SRU, y_SRU, z_SRU, "red", 0, 0, 0, i, j, k);
                if(Paux.x == p2.x && Paux.y == p2.y){
                    novosPontos.push(p2);
                    novosPontos_SRU.push(p2_SRU);
                }else{
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                    novosPontos_SRU.push(Paux_SRU);
                    novosPontos_SRU.push(p2_SRU);
                }
            }

            if(p1.x <= umax && p2.x <= umax) {//os dois pontos estão dentro do recorte
                novosPontos.push(p2);
                novosPontos_SRU.push(p2_SRU);
            }

            if(p1.x <= umax && p2.x > umax) {//sai do recorte
                u = (umax - p1.x) / (p2.x - p1.x);
                let x = umax;
                let x_SRU = p1_SRU.x + u * (p2_SRU.x - p1_SRU.x);
                let y_SRU = p1_SRU.y + u * (p2_SRU.y - p1_SRU.y);
                let z_SRU = p1_SRU.z + u * (p2_SRU.z - p1_SRU.z);
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);
                let i = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                let j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                let k = p1.z_phong + u * (p2.z_phong - p1.z_phong);

                let Paux = new Dot(x, y, z, "red", 0, 0, 0, i, j, k);
                let Paux_SRU = new Dot(x_SRU, y_SRU, z_SRU, "red", 0, 0, 0, i, j, k);
                novosPontos.push(Paux);
                novosPontos_SRU.push(Paux_SRU);
            }
        };

        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
                novasArestas_SRU.push(new Aresta(novosPontos_SRU[i], novosPontos_SRU[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
                novasArestas_SRU.push(new Aresta(novosPontos_SRU[i], novosPontos_SRU[0]));
            }}

        arestas = novasArestas;
        arestas_SRU = novasArestas_SRU;
        pontos = novosPontos;
        pontos_SRU = novosPontos_SRU;
    }

    let recorteInferior = pontos.some(ponto => ponto.y > vmax);
    //verificar recorte inferior
    if(recorteInferior){
        let novasArestas: Aresta[] = [];
        let novasArestas_SRU: Aresta[] = [];
        let novosPontos: Dot[] = [];
        let novosPontos_SRU: Dot[] = [];

        for (let i = 0; i < arestas.length; i++) {
            let aresta = arestas[i];
            let aresta_SRU = arestas_SRU[i];
    
            let p1 = aresta.p1;
            let p2 = aresta.p2;
    
            let p1_SRU = aresta_SRU.p1;
            let p2_SRU = aresta_SRU.p2;

            let u;
        
            if (p1.y > vmax && p2.y <= vmax) {//adentra recorte
                u = (vmax - p1.y) / (p2.y - p1.y);
                let y_SRU = p1_SRU.y + u * (p2_SRU.y - p1_SRU.y);
                let x_SRU = p1_SRU.x + u * (p2_SRU.x - p1_SRU.x);
                let z_SRU = p1_SRU.z + u * (p2_SRU.z - p1_SRU.z);
                let y = vmax;
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);
                let i = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                let j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                let k = p1.z_phong + u * (p2.z_phong - p1.z_phong);

                let Paux = new Dot(x, y, z, "red", 0, 0, 0, i, j, k);
                let Paux_SRU = new Dot(x_SRU, y_SRU, z_SRU, "red", 0, 0, 0, i, j, k);
                if(Paux.x == p2.x && Paux.y == p2.y){
                    novosPontos.push(p2);
                    novosPontos_SRU.push(p2_SRU);
                }else{
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                    novosPontos_SRU.push(Paux_SRU);
                    novosPontos_SRU.push(p2_SRU);
                }
            }

            if(p1.y <= vmax && p2.y <= vmax) {//os dois pontos estão dentro do recorte
                novosPontos.push(p2);
                novosPontos_SRU.push(p2_SRU);
            }

            if(p1.y <= vmax && p2.y > vmax) {//sai do recorte
                u = (vmax - p1.y) / (p2.y - p1.y);
                let y = vmax;
                let y_SRU = p1_SRU.y + u * (p2_SRU.y - p1_SRU.y);
                let x_SRU = p1_SRU.x + u * (p2_SRU.x - p1_SRU.x);
                let z_SRU = p1_SRU.z + u * (p2_SRU.z - p1_SRU.z);
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);
                let i = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                let j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                let k = p1.z_phong + u * (p2.z_phong - p1.z_phong);

                let Paux = new Dot(x, y, z, "red", 0, 0, 0, i, j, k);
                let Paux_SRU = new Dot(x_SRU, y_SRU, z_SRU, "red", 0, 0, 0, i, j, k);
                novosPontos.push(Paux);
                novosPontos_SRU.push(Paux_SRU);
            }
        };

        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
                novasArestas_SRU.push(new Aresta(novosPontos_SRU[i], novosPontos_SRU[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
                novasArestas_SRU.push(new Aresta(novosPontos_SRU[i], novosPontos_SRU[0]));
            }}

        arestas = novasArestas;
        arestas_SRU = novasArestas_SRU;
        pontos = novosPontos;
        pontos_SRU = novosPontos_SRU;
    }

    let recorteSuperior = pontos.some(ponto => ponto.y < vmin);
    //verificar recorte superior
    if(recorteSuperior){
        let novasArestas: Aresta[] = [];
        let novasArestas_SRU: Aresta[] = [];
        let novosPontos: Dot[] = [];
        let novosPontos_SRU: Dot[] = [];

        for (let i = 0; i < arestas.length; i++) {
            let aresta = arestas[i];
            let aresta_SRU = arestas_SRU[i];

            let p1 = aresta.p1;
            let p2 = aresta.p2;
    
            let p1_SRU = aresta_SRU.p1;
            let p2_SRU = aresta_SRU.p2;
            
            let u;
        
            if (p1.y < vmin && p2.y >= vmin) {//adentra recorte
                u = (vmin - p1.y) / (p2.y - p1.y);
                let y = vmin;  
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);
                let y_SRU = p1_SRU.y + u * (p2_SRU.y - p1_SRU.y);
                let x_SRU = p1_SRU.x + u * (p2_SRU.x - p1_SRU.x);
                let z_SRU = p1_SRU.z + u * (p2_SRU.z - p1_SRU.z);
                let i = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                let j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                let k = p1.z_phong + u * (p2.z_phong - p1.z_phong);

                let Paux = new Dot(x, y, z, "red", 0, 0, 0, i, j, k);
                let Paux_SRU = new Dot(x_SRU, y_SRU, z_SRU, "red", 0, 0, 0, i, j, k);
                if(Paux.x == p2.x && Paux.y == p2.y){
                    novosPontos.push(p2);
                    novosPontos_SRU.push(p2_SRU);
                    
                }else{
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                    novosPontos_SRU.push(Paux_SRU);
                    novosPontos_SRU.push(p2_SRU);
                }
            }

            if(p1.y >= vmin && p2.y >= vmin) {//os dois pontos estão dentro do recorte
                novosPontos.push(p2);
                novosPontos_SRU.push(p2_SRU);
            }

            if(p1.y >= vmin && p2.y < vmin) {//sai do recorte
                u = (vmin - p1.y) / (p2.y - p1.y);
                let y = vmin;
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);
                let y_SRU = p1_SRU.y + u * (p2_SRU.y - p1_SRU.y);
                let x_SRU = p1_SRU.x + u * (p2_SRU.x - p1_SRU.x);
                let z_SRU = p1_SRU.z + u * (p2_SRU.z - p1_SRU.z);
                let i = p1.x_phong + u * (p2.x_phong - p1.x_phong);
                let j = p1.y_phong + u * (p2.y_phong - p1.y_phong);
                let k = p1.z_phong + u * (p2.z_phong - p1.z_phong);

                let Paux = new Dot(x, y, z, "red", 0, 0, 0, i, j, k);
                let Paux_SRU = new Dot(x_SRU, y_SRU, z_SRU, "red", 0, 0, 0, i, j, k);
                novosPontos.push(Paux);
                novosPontos_SRU.push(Paux_SRU);
            }
        };

        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
                novasArestas_SRU.push(new Aresta(novosPontos_SRU[i], novosPontos_SRU[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
                novasArestas_SRU.push(new Aresta(novosPontos_SRU[i], novosPontos_SRU[0]));
            }}

        arestas = novasArestas;
        pontos = novosPontos;

        arestas_SRU = novasArestas_SRU;
        pontos_SRU = novosPontos_SRU;
    }
    let face_srt = new Face(pontos, face.color, face.other_side_line_color, face.line_color);
    let face_sruzin = new Face(pontos_SRU, face.color, face.other_side_line_color, face.line_color);
    return new Double_Face(face_srt, face_sruzin);
}