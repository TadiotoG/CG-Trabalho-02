/// <reference path= "./spline.ts" />

// import { get } from "lodash";

// import { random } from "lodash"

class Z_Pixel {
    color: string;
    dist: number;

    constructor(col: string = "white", distancia: number = 100000){
        this.color = col;
        this.dist = distancia;
    }
}

class Z_Buffer{
    buffer: Z_Pixel[][]; // Para cada pixel da tela, teremos sua profundidade e sua cor
    width_screen: number;
    height_screen: number;

    constructor(width: number, height: number){
        this.width_screen = width;
        this.height_screen = height;
        this.buffer = Array(this.width_screen).fill(null).map(() => Array(this.height_screen).fill(new Z_Pixel("white", 100000)))
    }

    update_face_const(face: Face){  
        const ymin = Math.round(Math.min(...face.dots.map(p => p.y)));
        const ymax = Math.round(Math.max(...face.dots.map(p => p.y)));
    
        face.inters = Array.from({ length: ymax - ymin +1}, () => []);
        face.inters_z = Array.from({ length: ymax - ymin +1}, () => []);
    
        face.arestas.forEach((aresta, i) => {
            if (aresta[0].y === aresta[1].y) return; 
            if (aresta[0].y > aresta[1].y) {
                [face.arestas[i][0], face.arestas[i][1]] = [aresta[1], aresta[0]];
            }
            
            const x1 = aresta[0].x, y1 = aresta[0].y;
            const x2 = aresta[1].x, y2 = aresta[1].y;

            const z1 = aresta[0].z;
            const z2 = aresta[1].z;
            
            const coeficiente = (x2 - x1) / (y2 - y1);
            const coeficiente_z = (z2 - z1) / (y2 - y1);
            
            let x = x1;
            let z = z1;
            let index = Math.floor(y1 - ymin);
            
            for (let y = y1; y <= y2; y++) {
                if (!face.inters[index]) face.inters[index] = []; 
                face.inters_z[index].push(Math.round(z));
                face.inters[index++].push(Math.round(x));

                x += coeficiente;
                z += coeficiente_z;
            }
        });
    
        for(let i=0; i<face.inters.length; i++){
            this.save_line(face, i, ymin + i);
        };
    }

    save_line(face: Face, line_index: number, y: number) {
        for (let i = 0; i < face.inters[line_index].length; i += 2) {
            const x1 = Math.ceil(face.inters[line_index][i]);
            const x2 = Math.floor(face.inters[line_index][i + 1]);

            const z1 = Math.ceil(face.inters_z[line_index][i]);
            const z2 = Math.floor(face.inters_z[line_index][i + 1]);

            const inc_z = (z2 - z1) / (x2 - x1);
            
            for (let x = x1; x <= x2; x++) {
                let my_z = z1 + inc_z
                if(this.buffer[x][y].dist > my_z){
                    this.buffer[x][y] = new Z_Pixel(face.color, my_z)
                }
            }
        }
    }
}

function testZBuffer() {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.width = 500;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const zBuffer = new Z_Buffer(canvas.width, canvas.height);
    
    // Criando dois quadrados, um mais próximo e outro mais distante
    const face1 = new Face([
        new Dot(0, 0, 5),
        new Dot(0, 100, 5),
        new Dot(100, 100, 5),
        new Dot(100, 0, 5),
    ]);
    face1.color = "blue";
    
    const face2 = new Face([
        new Dot(0, 0, 9),
        new Dot(0, 100, 0),
        new Dot(100, 100, 0),
        new Dot(100, 0, 10),
    ]);
    face2.color = "red";

    // Aplicando o algoritmo de Z-Buffer
    zBuffer.update_face_const(face1);
    zBuffer.update_face_const(face2);

    // Renderizando a cena a partir do Z-Buffer
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            ctx.fillStyle = zBuffer.buffer[x][y].color;
            ctx.fillRect(x, y, 1, 1);
            
        }
    }
    // console.log("Buffer -> ", zBuffer.buffer)
}

testZBuffer();

