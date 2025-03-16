/// <reference path="./gouraud.ts" />

class ZbufferConstante {
    scanline: Map<number, Array<Dot>>; // HashMap para armazenar os valores
    width: number;
    height: number;
    depthBuffer: number[][];
    colorBuffer: string[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.scanline = new Map(); // Inicializa o HashMap
        this.depthBuffer = Array.from({ length: height }, () => Array(width).fill(-100000000));
        this.colorBuffer = Array.from({ length: height }, () => Array(width).fill('#000000'));
        for(let i=0; i<height; i++){
            for(let j=0; j<width; j++){
                this.depthBuffer[i][j] = -100000000;
                this.colorBuffer[i][j] = '#000000';
            }
        };
    }

    rasterizePolygon(face: Face) {
        this.Scanline([face]);
    }
    Scanline(faces: Array<Face>) {
        
        this.scanline = new Map();
        // console.log("Faces -> ", faces);
        for (const face of faces) {

            for (let i = 0; i < face.dots.length; i++) {
                // console.log("Pontos ", face.dots[i]);
                let Dx, Dy, Dz, Tx, Tz;
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

                // console.log("Start -> ", start, "End -> ", end);
                Dx = end.x - start.x;
                Dy = end.y - start.y;
                Dz = end.z - start.z;

                Tx = Dx / Dy;
                Tz = Dz / Dy;

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
                //const rgb1 = this.extractRGB(start.color);
                // console.log("Start -> ", start_y, "End -> ", end_y);
                for (let y=start_y; y <= end_y; y++) {
                    // Adiciona ao HashMap de scanlines
                    this.updateHash(y, x, z, face.color);
                    // if(i == 2 && next_i == 3){
                        // console.log("Ate aqui vai ", y, "  HASH -> ", this.scanline)
                    // }

                    x += Tx;
                    z += Tz;
                }
            }
        }
    }

    updateHash(y: number, x: number, z: number, color: string) {
        if (!this.scanline.has(y)) { 
            this.scanline.set(y, []);
        }
        
        let listaDePontos = this.scanline.get(y);
        //console.log(new_R, new_G, new_B);
        let novoPonto = new Dot(x, y, z, color);

        listaDePontos!.push(novoPonto);
    }

    ZbufferConstante(){
       // console.log("Scanline -> ", this.scanline);

        this.scanline.forEach((points, y) => {
            points = points.sort((a, b) => a.x - b.x);
            
            // console.log("depois", points);
            //console.log(points.length);
            for (let i = 0; i < points.length-1; i += 2) {
                const next_i = (i + 1) % (points.length);
                if((Math.floor(points[next_i].x) - Math.ceil(points[i].x)) > 0){
                    // const next_i = i+1;
                    //console.log(`L: ${face.dots.length}  I: ${i}  Next: ${next_i}` );
                    let z1 = points[i].z;
                    let z2 = points[next_i].z;
                    //console.log(points[i].x, points[i+1].x, points[i].z, points[i+1].z);
                    
                    const dz = (z2 - z1) / (points[next_i].x - points[i].x);
                    // console.log(dz);

                    //console.log(dR, dG, dB);
                    
                    const x1 = Math.ceil(points[i].x);
                    const x2 = Math.ceil(points[next_i].x);

                    let start = x1, end = x2;
                    
                    let dx = points[i].x - x1;
                    // let dx = points[i].x - x1;
                    z1 += dx * dz;

                    for (let x = start; x <= end; x++) {
                        //console.log(z1, x, y, points[i].color);
                        this.AtualizaBufferConstante(z1, x, Math.round(y), points[i].color);
                        //console.log(points[i].r_gouraud, points[i].g_gouraud, points[i].b_gouraud);
                        z1 += dz;
                    }
                }
                // else {
                //     this.AtualizaBufferConstante(points[i].z, points[i].x, y, "green");
                // }
            }
        });
    }


    AtualizaBufferConstante(constant_z: number, x: number, y: number, color: string){
        // console.log("Z -> ", constant_z)
        if (constant_z > this.depthBuffer[y][x]) {
            
            // console.log("Constant_z -> ", constant_z)
            this.depthBuffer[y][x] = constant_z;
            
            //console.log(this.depthBuffer[y][x]);
            //console.log(this.colorBuffer[y][x]);
            this.colorBuffer[y][x] = color;
            //console.log(this.depthBuffer);
        }
    }
}