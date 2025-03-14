/// <reference path="./gouraud.ts" />
class ZBuffer {
    scanline: Map<number, Array<Dot>>; // HashMap para armazenar os valores
    width: number;
    height: number;
    depthBuffer: number[][];
    colorBuffer: string[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.depthBuffer = Array.from({ length: height }, () => Array(width).fill(Infinity));
        this.colorBuffer = Array.from({ length: height }, () => Array(width).fill('#FFFFFF'));
        this.scanline = new Map(); // Inicializa o HashMap
        for(let i=0; i<height; i++){
            for(let j=0; j<width; j++){
                this.depthBuffer[i][j] = 100000
            }
        };
    }

    rasterizePolygon(face: Face) {
        this.Scanline([face]);
    }

    Scanline(faces: Array<Face>) {
        for (const face of faces) {
            for (let i = 0; i < face.dots.length; i++) {
                const next_i = (i + 1) % face.dots.length;

                if (face.dots[i].y === face.dots[next_i].y) {
                    continue;
                }

                face.dots[i].x = Math.round(face.dots[i].x);
                face.dots[i].y = Math.round(face.dots[i].y);

                const start = face.dots[i].y < face.dots[next_i].y ? face.dots[i] : face.dots[next_i];
                const end = face.dots[i].y < face.dots[next_i].y ? face.dots[next_i] : face.dots[i];

                const Dx = end.x - start.x;
                const Dy = end.y - start.y;
                const Dz = end.z - start.z;

                const Tx = Dx / Dy;
                const Tz = Dz / Dy;

                let x = start.x;
                let z = start.z;

                for (let y = start.y; y < end.y; y++) {
                    // Adiciona ao HashMap de scanlines
                    this.updateHash(y, x, z, start.color); // NAO TEM CALCULO DE COR NENHUM AQUI 

                    x += Tx;
                    z += Tz;
                }
            }
        }
    }

    updateHash(y: number, x: number, z: number, color: string) {

        if (!this.scanline.has(y)) { 
            // Se 'y' não existe no HashMap, criamos uma nova lista vazia
            this.scanline.set(y, []);
        }
        
        let listaDePontos = this.scanline.get(y);

        let novoPonto = new Dot(x, y, z, color);

        listaDePontos!.push(novoPonto);
        
    }

    Zbuffer() {
        console.log("Scanlines 01 -> ", this.scanline);
        this.scanline.forEach((points, y) => {
        
            //console.log(`Y = ${y}:`);
            points.sort((a, b) => a.x - b.x); // Ordena pela coordenada x

            // Após a ordenação, podemos atualizar o scanline
            this.scanline.set(y, points);
        })
        // console.log("Scanlines -> ", this.scanline)

        this.scanline.forEach((points, y) => {
            for (let i = 0; i < points.length-1; i += 2) {
                const x1: number = Math.ceil(points[i].x);
                const x2: number = Math.floor(points[i + 1].x);

                let z1: number = points[i].z;
                const z2: number = points[i + 1].z;
                let R: number = points[i].r_gouraud;
                let G: number = points[i].g_gouraud;
                let B: number = points[i].b_gouraud;

                const dz: number = (z2 - z1) / (x2 - x1);
                const dR: number = (points[i + 1].r_gouraud - points[i].r_gouraud) / (x2 - x1);
                const dG: number = (points[i + 1].g_gouraud - points[i].g_gouraud) / (x2 - x1);
                const dB: number = (points[i + 1].b_gouraud - points[i].b_gouraud) / (x2 - x1);
                for (let x = x1; x <= x2; x++) {
                    // console.log("z1 -> ", z1)
                    this.AtualizaBuffer(z1, points[i].r_gouraud, points[i].g_gouraud, points[i].b_gouraud, Number(x), Number(y));
                    z1 += dz;
                    R += dR;
                    G += dG;
                    B += dB;
                }
            }
        });
        

        //console.log(this.scanline);
    }

    AtualizaBuffer(constant_z: number, new_R: number, new_G: number, new_B: number, x: number, y: number){
        // console.log("this.depthBuffer -> ", this.depthBuffer)
        // console.log("this.colorBuffer -> ", this.colorBuffer)
        // console.log("width -> ", this.width)
        // console.log("height -> ", this.height)
        // console.log("this.depthBuffer.length -> ", this.depthBuffer.length)
        // console.log("this.depthBuffer.length[0] -> ", this.depthBuffer[0].length)
        // console.log("Y -> ", typeof(y))
        // console.log("X -> ", typeof(x))
        // console.log("z1 -> ", constant_z, "    this.depthBuffer[y][x] -> ", this.depthBuffer[y][x])
        if (constant_z < this.depthBuffer[y][x]) {

            this.depthBuffer[y][x] = constant_z;
            this.colorBuffer[y][x] = `rgb(${new_R}, ${new_G}, ${new_B})`;
            console.log("Chega aqui?" + `rgb(${new_R}, ${new_G}, ${new_B})`)
        }
    }
}