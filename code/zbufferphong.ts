/// <reference path="./zbuffergouraud.ts" />

function get_ilum(vrp: Dot, lamp: Lamp, vet_normal: Vet, centroide: Dot, amb_light_par: number, ks: number, kd: number, n: number){
    let amb_light = amb_light_par;
    // console.log("Qual valor nao chega");
    amb_light_par = Number(amb_light_par);
    ks = Number(ks);
    kd = Number(kd);
    n = Number(n);
    lamp.il = Number(lamp.il)
    lamp.pos.x = Number(lamp.pos.x)
    lamp.pos.y = Number(lamp.pos.y)
    lamp.pos.z = Number(lamp.pos.z)
    let aux_x = lamp.pos.x - centroide.x;
    let aux_y = lamp.pos.y - centroide.y;
    let aux_z = lamp.pos.z - centroide.z;

    let test_vis = new Vet(centroide.x - vrp.x, centroide.y - vrp.y, centroide.z - vrp.z)
    if(prod_escalar(vet_normal.unitary, test_vis.unitary) < 0){
        vet_normal = new Vet(-vet_normal.x, -vet_normal.y, -vet_normal.z)
    }
    let vet_LampMinusCent = new Vet(aux_x, aux_y, aux_z);

    let UN_times_UL = prod_escalar(vet_LampMinusCent.unitary, vet_normal.unitary)

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

        let r_escalar_dir_obs = prod_escalar(idk_r.unitary, direcao_observ.unitary);
        if(r_escalar_dir_obs > 0){

            let is = lamp.il*ks*r_escalar_dir_obs**n;

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
    scanline: Map<number, Array<[Dot, Dot]>>; // HashMap para armazenar os valores
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

    rasterizePolygon(double_face: Double_Face) {
        this.Scanline([double_face]);
    }

    Scanline(dfaces: Array<Double_Face>) {
        this.scanline = new Map();
        //console.log("Faces -> ", faces);
        for (const double_face of dfaces) {
            // console.log("Double face -> ", double_face)
            let face = double_face.face;
            let face_SRU = double_face.face_SRU;
        
           for (let i = 0; i < face.dots.length; i++) {
               let Dx, Dy, Dz, Di, Dj, Dk, Tx, Tz, Ti, Tj, Tk;
               let double_Dx, double_Dy, double_Dz, double_Tx, double_Ty, double_Tz;
               const next_i = (i + 1) % face.dots.length;

               if (face.dots[i].y === face.dots[next_i].y) {
                   continue;
               }

               let start, end;
               let double_start, double_end;

               if(face.dots[i].y < face.dots[next_i].y){
                   start = face.dots[i];
                   end = face.dots[next_i];
                   double_start = face_SRU.dots[i];
                   double_end = face_SRU.dots[next_i];
               }else{
                   start = face.dots[next_i];
                   end = face.dots[i];
                   double_start = face_SRU.dots[next_i];
                   double_end = face_SRU.dots[i];
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

                double_Dx = double_end.x - double_start.x;
                double_Dy = double_end.y - double_start.y;
                double_Dz = double_end.z - double_start.z;
                Dz = double_end.z - double_start.z;

                double_Ty = double_Dy / Dy;
                double_Tx = double_Dx / Dy;
                double_Tz = double_Dz / Dy;

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

                let double_x = double_start.x;
                let double_z = double_start.z;
                let double_y = double_start.y;

                let i_phong = start.x_phong;
                let j_phong = start.y_phong;
                let k_phong = start.z_phong;

                for (let y = start_y; y <= end_y; y++) {
                this.updateHash(double_y, double_x, double_z, y, x, z, i_phong, j_phong, k_phong);
                double_x += double_Tx;
                double_z += double_Tz;
                double_y += double_Ty;

                x += Tx;
                z += Tz;
                i_phong += Ti;
                j_phong += Tj;
                k_phong += Tk;
                }
            }
        }
    }

    updateHash(double_y: number, double_x: number, double_z: number, y: number, x: number, z: number, i_phong: number, j_phong: number, k_phong: number,) {
        if (!this.scanline.has(y)) { 
            this.scanline.set(y, []);
        }

        let listaDePontos = this.scanline.get(y);
        let novoPonto = new Dot(x, y, z, `rgb(${0}, ${0}, ${0})`, 0, 0, 0, i_phong, j_phong, k_phong);
        let double_novoPonto = new Dot(double_x, double_y, double_z, `rgb(${0}, ${0}, ${0})`, 0, 0, 0, i_phong, j_phong, k_phong);

        listaDePontos!.push([novoPonto, double_novoPonto]);
    }
    
    ZbufferPhong(amb_light: [number, number, number], ks: [number, number, number], kd: [number, number, number], n: number, face_sru: Face) {
        this.scanline.forEach((points, y) => {
            points = points.sort((a, b) => a[0].x - b[0].x);
            
            for (let i = 0; i < points.length-1; i += 2) {
                const next_i = (i + 1) % (points.length);

                if((Math.floor(points[next_i][0].x) - Math.ceil(points[i][0].x)) > 0){
                    let z1 = points[i][0].z;
                    let z2 = points[next_i][0].z;
                    let i_phong = points[i][0].x_phong;
                    let j_phong = points[i][0].y_phong;
                    let k_phong = points[i][0].z_phong;
                    let i_phong2 = points[next_i][0].x_phong;
                    let j_phong2 = points[next_i][0].y_phong;
                    let k_phong2 = points[next_i][0].z_phong;

                    let double_x = points[i][1].x;
                    let double_y = points[i][1].y;
                    let double_z = points[i][1].z;
                    let double_x2 = points[next_i][1].x;
                    let double_y2 = points[next_i][1].y;
                    let double_z2 = points[next_i][1].z;
                    
                    const dz = (z2 - z1) / (points[next_i][0].x - points[i][0].x);
                    const di = (i_phong2 - i_phong) / (points[next_i][0].x - points[i][0].x);
                    const dj = (j_phong2 - j_phong) / (points[next_i][0].x - points[i][0].x);
                    const dk = (k_phong2 - k_phong) / (points[next_i][0].x - points[i][0].x);

                    const double_dx = (double_x2 - double_x) / (points[next_i][1].x - points[i][1].x);
                    const double_dy = (double_y2 - double_y) / (points[next_i][1].y - points[i][1].y);
                    const double_dz = (double_z2 - double_z) / (points[next_i][1].z - points[i][1].z);
                    
                    const x1 = Math.ceil(points[i][0].x);
                    const x2 = Math.ceil(points[next_i][0].x);

                    let new_i = points[i][0].x_phong;
                    let new_j = points[i][0].y_phong;
                    let new_k = points[i][0].z_phong;

                    let new_double_x = points[i][1].x;
                    let new_double_y = points[i][1].y;
                    let new_double_z = points[i][1].z;

                    let start = x1, end = x2;

                    let dx = points[i][0].x - x1;
                    z1 += dx * dz;
                    
                    for (let x = start; x <= end; x++) {
                        this.AtualizaBufferGourand(z1, new_i, new_j, new_k, x, Math.round(y), amb_light, ks, kd, n, new_double_x, new_double_y, new_double_z);
                        z1 += dz;
                        new_i += di;
                        new_j += dj;
                        new_k += dk;
                        new_double_x += double_dx;
                        new_double_y += double_dy;
                        new_double_z += double_dz;
                    }
                }
            }
        });
    }

    AtualizaBufferGourand(constant_z: number, i_phong: number, j_phong: number, k_phong: number, x: number, y: number, amb_light: [number, number, number], ks: [number, number, number], kd: [number, number, number], n: number, db_x: number, db_y: number, db_z: number){
         console.log("x y z", db_x, "  ", db_y, "  ", db_z)
        if (constant_z > this.depthBuffer[y][x]) {
            this.depthBuffer[y][x] = constant_z;
            //console.log(this.depthBuffer[y][x]);
            console.log(ks, "  ---  " , kd, "  ---  " , n, "  ---  " , amb_light)
            let r_phong = get_ilum(new Dot(Number(this.vrp.x), Number(this.vrp.y), Number(this.vrp.z)), this.lamp, new Vet(i_phong, j_phong, k_phong), new Dot(db_x, db_y, db_z), amb_light[0], ks[0], kd[0], n)
            let g_phong = get_ilum(new Dot(Number(this.vrp.x), Number(this.vrp.y), Number(this.vrp.z)), this.lamp, new Vet(i_phong, j_phong, k_phong), new Dot(db_x, db_y, db_z), amb_light[1], ks[1], kd[1], n)
            let b_phong = get_ilum(new Dot(Number(this.vrp.x), Number(this.vrp.y), Number(this.vrp.z)), this.lamp, new Vet(i_phong, j_phong, k_phong), new Dot(db_x, db_y, db_z), amb_light[2], ks[2], kd[2], n)

            // console.log("Cor -> " + `rgb(${r_phong}, ${g_phong}, ${b_phong})`)
            
            this.colorBuffer[y][x] = `rgb(${r_phong}, ${g_phong}, ${b_phong})`;
            //console.log(this.depthBuffer);
        }
    }
}

// function get_ilum(vrp: Dot, lamp: Lamp, vet_normal: Vet, centroide: Dot, amb_light_par: number, ks: number, kd: number, n: number){