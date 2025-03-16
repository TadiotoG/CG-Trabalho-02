/// <reference path="./gouraud.ts" />

class ZbufferGouraud {
    scanline: Map<number, Array<Dot>>; // HashMap para armazenar os valores
    width: number;
    height: number;
    depthBuffer: number[][];
    colorBuffer: string[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.scanline = new Map(); // Inicializa o HashMap
        this.depthBuffer = Array.from({ length: height+10 }, () => Array(width+10).fill(-100000000));
        this.colorBuffer = Array.from({ length: height+10 }, () => Array(width+10).fill('#000000'));
        for(let i=0; i<height+10; i++){
            for(let j=0; j<width+10; j++){
                this.depthBuffer[i][j] = -1000000;
                this.colorBuffer[i][j] = '#000000';
            }
        };
        // console.log("")
    }

    rasterizePolygon(face: Face) {
        this.Scanline([face]);
    }

    Scanline(faces: Array<Face>) {
        this.scanline = new Map();
        //console.log("Faces -> ", faces);
        for (const face of faces) {
        
           for (let i = 0; i < face.dots.length; i++) {
               let Dx, Dy, Dz, Dr, Db, Dg, Tx, Tz, Tr, Tg, Tb;
               const next_i = (i + 1) % face.dots.length;

               if (face.dots[i].y === face.dots[next_i].y) {
                   continue;
               }

               let start, end;

               if(face.dots[i].y < face.dots[next_i].y){
                   start = face.dots[i];
                   end = face.dots[next_i];
               }else{
                   start = face.dots[next_i];
                   end = face.dots[i];
                }

                Dx = end.x - start.x;
                Dy = end.y - start.y;
                Dz = end.z - start.z;

                Dr = end.r_gouraud - start.r_gouraud;
                Dg = end.g_gouraud - start.g_gouraud;
                Db = end.b_gouraud - start.b_gouraud;

                Tx = Dx / Dy;
                Tz = Dz / Dy;
                Tr = Dr / Dy;
                Tg = Dg / Dy;
                Tb = Db / Dy;

                let start_y;
                let end_y;
                
                if(face.dots[i].y < face.dots[next_i].y){
                    start_y = Math.ceil(face.dots[i].y);
                    end_y = Math.floor(face.dots[next_i].y);
                }else{
                    start_y = Math.ceil(face.dots[next_i].y);
                    end_y = Math.floor(face.dots[i].y);
                }
               
                let x = Math.round(start.x);
                let z = start.z;
                let r = start.r_gouraud;
                let g = start.g_gouraud;
                let b = start.b_gouraud;

                for (let y = start_y; y <= end_y; y++) {
                this.updateHash(y, x, z, r, g, b);

                x += Tx;
                z += Tz;
                r += Tr;
                g += Tg;
                b += Tb;
                }
            }
        }
    }

    updateHash(y: number, x: number, z: number, new_R: number, new_G: number, new_B: number,) {
        if (!this.scanline.has(y)) { 
            this.scanline.set(y, []);
        }

        let listaDePontos = this.scanline.get(y);
        let novoPonto = new Dot(x, y, z, `rgb(${0}, ${0}, ${0})`, new_R, new_G, new_B);

        listaDePontos!.push(novoPonto);
    }
    
    ZbufferGourand() {
        this.scanline.forEach((points, y) => {
            points = points.sort((a, b) => a.x - b.x);
            
            for (let i = 0; i < points.length-1; i += 2) {
                const next_i = (i + 1) % (points.length);

                if((Math.floor(points[next_i].x) - Math.ceil(points[i].x)) > 0){
                    let z1 = points[i].z;
                    let z2 = points[next_i].z;

                    // if(points[i].x > points[next_i].x){
                    //     z1 = points[next_i].z;
                    //     z2 = points[i].z;
                    // }
                    //console.log(points[i].x, points[i+1].x, points[i].z, points[i+1].z);
                    
                    const dz = (z2 - z1) / (points[next_i].x - points[i].x);
                    // console.log(dz);
                    
                    const dR = (points[next_i].r_gouraud - points[i].r_gouraud) / (points[next_i].x - points[i].x);
                    const dG = (points[next_i].g_gouraud - points[i].g_gouraud) / (points[next_i].x - points[i].x);
                    const dB = (points[next_i].b_gouraud - points[i].b_gouraud) / (points[next_i].x - points[i].x);
                    //console.log(dR, dG, dB);
                    
                    const x1 = Math.ceil(points[i].x);
                    const x2 = Math.ceil(points[next_i].x);

                    let R = points[i].r_gouraud;
                    let G = points[i].g_gouraud;
                    let B = points[i].b_gouraud;

                    let start = x1, end = x2;

                    if(x1 > x2){
                        start = x2;
                        end = x1;
                        console.log("Invertido ", x1, "  >   ", x2); // NUNCA DEVE SER PRINTADO

                        // points.sort((a, b) => a.x - b.x);
                    }

                    let dx = points[i].x - x1;
                    z1 += dx * dz;
                    
                    for (let x = start; x <= end; x++) {
                        // console.log(`x = ${x}   y = ${y}`)
                        this.AtualizaBufferGourand(z1, points[i].r_gouraud, points[i].g_gouraud, points[i].b_gouraud, x, Math.round(y));
                        //console.log(points[new_i].r_gouraud, points[new_i].g_gouraud, points[new_i].b_gouraud);
                        z1 += dz;
                        R += dR;
                        G += dG;
                        B += dB;
                    }
                }
            }
        });

        //console.log(this.depthBuffer[0][150]);
        

        //console.log(this.scanline);
    }

    

    AtualizaBufferGourand(constant_z: number, new_R: number, new_G: number, new_B: number, x: number, y: number){
         //console.log("tamanho", this.depthBuffer.length, this.depthBuffer[0].length);
        if (constant_z > this.depthBuffer[y][x]) {
            this.depthBuffer[y][x] = constant_z;
            //console.log(this.depthBuffer[y][x]);
            
            this.colorBuffer[y][x] = `rgb(${new_R}, ${new_G}, ${new_B})`;
            //console.log(this.depthBuffer);
        }
    }
}