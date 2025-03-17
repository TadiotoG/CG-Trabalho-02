/// <reference path="./spline.ts" />

function get_ilum(vrp: Dot, lamp: Lamp, vet_normal: Vet, centroide: Dot, amb_light_par: number, ks: number, kd: number, n: number){
    let amb_light = amb_light_par;
    // console.log("================================================");
    // console.log("Centroide face = ", face);
    // console.log("Lamp x = ", lamp.pos.x);
    let aux_x = lamp.pos.x - centroide.x;
    let aux_y = lamp.pos.y - centroide.y;
    let aux_z = lamp.pos.z - centroide.z;

    let test_vis = new Vet(centroide.x - vrp.x, centroide.y - vrp.y, centroide.z - vrp.z)
    if(prod_escalar(vet_normal.unitary, test_vis.unitary) < 0){
        vet_normal = new Vet(-vet_normal.x, -vet_normal.y, -vet_normal.z)
    }

    let vet_LampMinusCent = new Vet(aux_x, aux_y, aux_z);
    vet_LampMinusCent.print_obj("Lamp - Centroide");

    let UN_times_UL = prod_escalar(vet_LampMinusCent.unitary, vet_normal.unitary)
    console.log("vet_normal = ", vet_normal.unitary);

    if(UN_times_UL > 0){
        let ilum_difusa = lamp.il * kd * UN_times_UL;

        aux_x = 2*UN_times_UL*vet_normal.unitary.x-vet_LampMinusCent.unitary.x;
        aux_y = 2*UN_times_UL*vet_normal.unitary.y-vet_LampMinusCent.unitary.y;
        aux_z = 2*UN_times_UL*vet_normal.unitary.z-vet_LampMinusCent.unitary.z;

        let idk_r = new Vet(aux_x, aux_y, aux_z);
        // idk_r.print_obj("Vet r")

        aux_x = vrp.x-centroide.x;
        aux_y = vrp.y-centroide.y;
        aux_z = vrp.z-centroide.z;

        let direcao_observ = new Vet(aux_x, aux_y, aux_z);
        // direcao_observ.print_obj("Direcao observ");

        let r_escalar_dir_obs = prod_escalar(idk_r.unitary, direcao_observ.unitary);
        // console.log("r.s -> ", r_escalar_dir_obs)
        if(r_escalar_dir_obs > 0){
            // console.log("R escalar dir ", r_escalar_dir_obs);

            let is = lamp.il*ks*r_escalar_dir_obs**n;
            // console.log("k ", ks, "    n -> ", n)
            // console.log("is -> ", is)
            // console.log(`${r_escalar_dir_obs} ** ${n} = ${r_escalar_dir_obs**n}`)
            // console.log("Cor = ", String((amb_light + ilum_difusa + is)));
            // console.log(`${amb_light} + ${ilum_difusa} + ${is}`);

            let result = Math.round(amb_light + ilum_difusa + is);
            return result.toString(10);
        } else {
            let result = Math.round(amb_light + ilum_difusa);
            return result.toString(10);
        }
        
    } else {
        return amb_light.toString(10);
    }
}

class ZbufferPhong {
    scanline: Map<number, Array<Dot>>; // HashMap para armazenar os valores
    width: number;
    height: number;
    depthBuffer: number[][];
    colorBuffer: string[][];
    vrp: Dot;
    lamp: Lamp;


    constructor(width: number, height: number, vrp: Dot, lamp: Lamp) {
        this.width = width;
        this.height = height;
        this.scanline = new Map(); // Inicializa o HashMap
        this.depthBuffer = Array.from({ length: height+10 }, () => Array(width+10).fill(-100000000));
        this.colorBuffer = Array.from({ length: height+10 }, () => Array(width+10).fill('#000000'));
        this.vrp = vrp;
        this.lamp = lamp;
        for(let i=0; i<height+10; i++){
            for(let j=0; j<width+10; j++){
                this.depthBuffer[i][j] = -1000000;
                this.colorBuffer[i][j] = '#000000';
            }
        };
        // console.log("")
    }

    // function get_ilum(vrp: Dot, lamp: Lamp, vet_normal: Vet, centroide: Dot, amb_light_par: number, ks: number, kd: number, n: number){

    rasterizePolygon(face: Face) {
        this.Scanline([face]);
    }

    Scanline(faces: Array<Face>) {
        this.scanline = new Map();
        //console.log("Faces -> ", faces);
        for (const face of faces) {
        
           for (let i = 0; i < face.dots.length; i++) {
               let Dx, Dy, Dz, Di, Dj, Dk, Tx, Tz, Ti, Tj, Tk;
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

                Di = end.x_phong - start.x_phong;
                Dj = end.y_phong - start.y_phong;
                Dk = end.z_phong - start.z_phong;

                Tx = Dx / Dy;
                Tz = Dz / Dy;
                Ti = Di / Dy;
                Tj = Dj / Dy;
                Tk = Dk / Dy;

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
                let i_phong = start.x_phong;
                let j_phong = start.y_phong;
                let k_phong = start.z_phong;

                for (let y = start_y; y <= end_y; y++) {
                this.updateHash(y, x, z, i_phong, j_phong, k_phong);

                x += Tx;
                z += Tz;
                i_phong += Ti;
                j_phong += Tj;
                k_phong += Tk;
                }
            }
        }
    }

    updateHash(y: number, x: number, z: number, i_phong: number, j_phong: number, k_phong: number,) {
        if (!this.scanline.has(y)) { 
            this.scanline.set(y, []);
        }

        let listaDePontos = this.scanline.get(y);
        let novoPonto = new Dot(x, y, z, `rgb(${0}, ${0}, ${0})`, 0, 0, 0, i_phong, j_phong, k_phong);

        listaDePontos!.push(novoPonto);
    }
    
    ZbufferPhong(amb_light: [number, number, number], ks: [number, number, number], kd: [number, number, number], n: number, face_sru: Face) {
        this.scanline.forEach((points, y) => {
            points = points.sort((a, b) => a.x - b.x);
            
            for (let i = 0; i < points.length-1; i += 2) {
                const next_i = (i + 1) % (points.length);

                if((Math.floor(points[next_i].x) - Math.ceil(points[i].x)) > 0){
                    let z1 = points[i].z;
                    let z2 = points[next_i].z;
                    let i_phong = points[i].x_phong;
                    let j_phong = points[i].y_phong;
                    let k_phong = points[i].z_phong;
                    let i_phong2 = points[next_i].x_phong;
                    let j_phong2 = points[next_i].y_phong;
                    let k_phong2 = points[next_i].z_phong;

                    // if(points[i].x > points[next_i].x){
                    //     z1 = points[next_i].z;
                    //     z2 = points[i].z;
                    // }
                    //console.log(points[i].x, points[i+1].x, points[i].z, points[i+1].z);
                    
                    const dz = (z2 - z1) / (points[next_i].x - points[i].x);
                    const di = (i_phong2 - i_phong) / (points[next_i].x - points[i].x);
                    const dj = (j_phong2 - j_phong) / (points[next_i].x - points[i].x);
                    const dk = (k_phong2 - k_phong) / (points[next_i].x - points[i].x);

                    // console.log(dz);
                    //console.log(dR, dG, dB);
                    
                    const x1 = Math.ceil(points[i].x);
                    const x2 = Math.ceil(points[next_i].x);

                    let new_i = points[i].x_phong;
                    let new_j = points[i].y_phong;
                    let new_k = points[i].z_phong;

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
                        this.AtualizaBufferGourand(z1, new_i, new_j, new_k, x, Math.round(y), amb_light, ks, kd, n, face_sru);
                        //console.log(points[new_i].r_gouraud, points[new_i].g_gouraud, points[new_i].b_gouraud);
                        z1 += dz;
                        new_i += di;
                        new_j += dj;
                        new_k += dk;
                    }
                }
            }
        });

        //console.log(this.depthBuffer[0][150]);
        

        //console.log(this.scanline);
    }

    AtualizaBufferGourand(constant_z: number, i_phong: number, j_phong: number, k_phong: number, x: number, y: number, amb_light: [number, number, number], ks: [number, number, number], kd: [number, number, number], n: number, face_sru: Face){
         //console.log("tamanho", this.depthBuffer.length, this.depthBuffer[0].length);
        if (constant_z > this.depthBuffer[y][x]) {
            this.depthBuffer[y][x] = constant_z;
            //console.log(this.depthBuffer[y][x]);
            let r_phong = get_ilum(this.vrp, this.lamp, new Vet(i_phong, j_phong, k_phong), new Dot(x, y, constant_z), amb_light[0], ks[0], kd[0], n[0])
            let g_phong = get_ilum(this.vrp, this.lamp, new Vet(i_phong, j_phong, k_phong), new Dot(x, y, constant_z), amb_light[1], ks[1], kd[1], n[1])
            let b_phong = get_ilum(this.vrp, this.lamp, new Vet(i_phong, j_phong, k_phong), new Dot(x, y, constant_z), amb_light[2], ks[2], kd[2], n[2])
            
            this.colorBuffer[y][x] = `rgb(${r_phong}, ${g_phong}, ${b_phong})`;
            //console.log(this.depthBuffer);
        }
    }
}