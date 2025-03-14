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
        this.depthBuffer = Array.from({ length: height }, () => Array(width).fill(100000000));
        this.colorBuffer = Array.from({ length: height }, () => Array(width).fill('#FFFFFF'));
        for(let i=0; i<height; i++){
            for(let j=0; j<width; j++){
                this.depthBuffer[i][j] = 1000000;
                this.colorBuffer[i][j] = '#FFFFFF';
            }
        };
    }

    rasterizePolygon(face: Face) {
        this.Scanline([face]);
    }
    Scanline(faces: Array<Face>) {
         console.log("Faces -> ", faces);
        let gambiarra = false;
        let y_original;
        let z_original;
        for (const face of faces) {

            for (let i = 0; i < face.dots.length; i++) {
                // console.log("Pontos ", face.dots[i]);
                let Dx, Dy, Dz, Tx, Tz;
                const next_i = (i + 1) % face.dots.length;
                // console.log(next_i);
                
                
           /*      if(i===0){
                    y_original = face.dots[0].y;//para ele nunca mudar de valor
                    z_original = face.dots[0].z;
                } */
                

                //console.log(y_original);
                //console.log(next_i)

                if (face.dots[i].y === face.dots[next_i].y) {
                    continue;
                }

                //face.dots[i].x = Math.round(face.dots[i].x);
                
                let start, end;

                // const start = face.dots[i].y < face.dots[next_i].y ? face.dots[i] : face.dots[next_i];
                // const end = face.dots[i].y < face.dots[next_i].y ? face.dots[next_i] : face.dots[i];

                if(face.dots[i].y < face.dots[next_i].y){
                    start = face.dots[i];
                    end = face.dots[next_i];
                }else{
                    start = face.dots[next_i];
                    end = face.dots[i];
                 }

                console.log("Start -> ", start, "End -> ", end);
	/* 
                if(!gambiarra){
                    
                    if(next_i == 0){//para o caso de ser o ultimo ponto, ele não troca de valor dai
                        Dx = end.x - start.x;
                        Dy = end.y - y_original;
                        //console.log(end.z, z_original);
                        Dz = end.z - z_original;
                        

                        Tx = Dx / Dy;

                        Tz = Dz / Dy;
                    }else{
                    */     
                        Dx = end.x - start.x;
                        Dy = end.y - start.y;
                        Dz = end.z - start.z;


                        Tx = Dx / Dy;

                        Tz = Dz / Dy;
                    //}
                    
                    //console.log(`Start = (${start.x}, ${start.y}, ${start.z}), End = (${end.x}, ${end.y}, ${end.z})`);  
                   // gambiarra = true;

                //}
                //console.log(`Dx = ${Dx.toFixed(3)}, Dy = ${Dy.toFixed(3)}, Dz = ${Dz.toFixed(3)}, Tx = ${Tx.toFixed(3)}, Tz = ${Tz.toFixed(3)}`);

                let start_y;
                let end_y;
                
                if(face.dots[i].y < face.dots[next_i].y){
                    start_y = Math.round(face.dots[i].y);
                    end_y = Math.round(face.dots[next_i].y);
                }else{
                    start_y = Math.round(face.dots[next_i].y);
                    end_y = Math.round(face.dots[i].y);
                 }
                
                
                let x = start.x;
                let z = start.z;
                //const rgb1 = this.extractRGB(start.color);
                console.log("Start -> ", start_y, "End -> ", end_y);
                for (let y=start_y; y < end_y; y++) {
                    // Adiciona ao HashMap de scanlines
                    this.updateHash(y, x, z, face.color);

                    x += Tx;
                    z += Tz;
                }
                //gambiarra = false
            }
        }
        //console.log(this.scanline);
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

            // console.log("Antes", points);
            points = points.sort((a, b) => a.x - b.x);
            
            // console.log("depois", points);
            //console.log(points.length);
            for (let i = 0; i < points.length-1; i += 2) {
                const next_i = (i + 1) % (points.length);
                // const next_i = i+1;
                //console.log(`L: ${face.dots.length}  I: ${i}  Next: ${next_i}` );
                let z1 = points[i].z;
                
                const z2 = points[next_i].z;
                //console.log(points[i].x, points[i+1].x, points[i].z, points[i+1].z);
                
                const dz = (z2 - z1) / (points[next_i].x - points[i].x);
                // console.log(dz);

                //console.log(dR, dG, dB);
                
                const x1 = Math.ceil(points[i].x);
                const x2 = Math.floor(points[next_i].x);

                
               let start = x1, end = x2;

                if(x1 > x2){
                    start = x2;
                    end = x1;
                    console.log("Invertido");

                    // points.sort((a, b) => a.x - b.x);
                }
                
                let dx = points[i].x - x1
                z1 += dx * dz;

                for (let x = start; x <= end; x++) {
                    //console.log(z1, x, y, points[i].color);
                    this.AtualizaBufferConstante(z1, x, y, points[i].color);
                    //console.log(points[i].r_gouraud, points[i].g_gouraud, points[i].b_gouraud);
                    z1 += dz;
                }
            }
        });
    }


    AtualizaBufferConstante(constant_z: number, x: number, y: number, color: string){
        
        if (constant_z < this.depthBuffer[y][x]) {
            this.depthBuffer[y][x] = constant_z;
            
            //console.log(this.depthBuffer[y][x]);
            //console.log(this.colorBuffer[y][x]);
            this.colorBuffer[y][x] = color;
            //console.log(this.depthBuffer);
        }
    }
}