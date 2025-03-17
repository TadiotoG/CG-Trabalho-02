/// <reference path="./zbufferphong.ts" />

let canvas_width = 1000;
let canvas_height = 800;

class Universe { 
    ctx: CanvasRenderingContext2D;
    matriz_SRU_SRT: number[][];
    camera: Camera;
    surfaces: Array<Surface> = [];
    rotate_y: Boolean = false;
    lamp: Lamp;
    la: [number, number, number]; 
    zbuffer_const: ZbufferConstante;
    zbuffer_gouraud: ZbufferGouraud;
    zbuffer_phong: ZbufferPhong;
    width: number;
    height: number;

    constructor(ctx_out: CanvasRenderingContext2D, cam: Camera, lamp: Lamp, ambient_light: [number, number, number], zbuffer_const: ZbufferConstante, zbuffer_gouraud: ZbufferGouraud, zbuffer_phong: ZbufferPhong, width: number, height: number){
        this.ctx = ctx_out;
        this.camera = cam;
        this.matriz_SRU_SRT = this.camera.get_mat_SRU_SRT();
        this.lamp = lamp;
        this.la = ambient_light;
        this.zbuffer_const = zbuffer_const;
        this.zbuffer_gouraud = zbuffer_gouraud;
        this.zbuffer_phong = zbuffer_phong;
        this.width = width;
        this.height = height;
    };

    update_all_face_colors_constant(){
        for(let i=0; i<this.surfaces.length; i++){
            if(this.surfaces[i].cuted == false){
                let amb_light_r = this.surfaces[i].ka[0] * this.la[0];
                let amb_light_g = this.surfaces[i].ka[1] * this.la[1];
                let amb_light_b = this.surfaces[i].ka[2] * this.la[2];
                for(let j=0; j<this.surfaces[i].double_faces.length; j++){
                    let new_color = "rgb(";                                                         // Ka: number=0.4, Kd: number=0.6, Ks: number=0.5, N: number=2.15
                    new_color += this.get_ilum(this.surfaces[i].double_faces[j].face_SRU.vet_normal, this.surfaces[i].double_faces[j].face_SRU.centroide, amb_light_r, this.surfaces[i].ks[0], this.surfaces[i].kd[0], this.surfaces[i].n);
                    new_color += ",";
                    new_color += this.get_ilum(this.surfaces[i].double_faces[j].face_SRU.vet_normal, this.surfaces[i].double_faces[j].face_SRU.centroide, amb_light_g, this.surfaces[i].ks[1], this.surfaces[i].kd[1], this.surfaces[i].n);
                    new_color += ",";
                    new_color += this.get_ilum(this.surfaces[i].double_faces[j].face_SRU.vet_normal, this.surfaces[i].double_faces[j].face_SRU.centroide, amb_light_b, this.surfaces[i].ks[2], this.surfaces[i].kd[2], this.surfaces[i].n);
                    new_color += ")";
                    
                    this.surfaces[i].double_faces[j].face.color = new_color;
                    
                }
            }
        }
    }

    call_gouraud(){
        for(let surf=0; surf<this.surfaces.length; surf++){
            if(this.surfaces[surf].cuted == false){
                define_vet_normal_vertices(this.surfaces[surf].outp);
                let amb_light_r = this.surfaces[surf].ka[0] * this.la[0];
                let amb_light_g = this.surfaces[surf].ka[1] * this.la[1];
                let amb_light_b = this.surfaces[surf].ka[2] * this.la[2];
                for(let i=0; i<this.surfaces[surf].outp.length; i++){
                    for(let j=0; j<this.surfaces[surf].outp[0].length; j++){
                        let teste = (this.get_ilum(this.surfaces[surf].outp[i][j].vet_normal, this.surfaces[surf].outp[i][j], amb_light_r, this.surfaces[surf].ks[0], this.surfaces[surf].kd[0], this.surfaces[surf].n));
                        this.surfaces[surf].outp[i][j].r_gouraud = Number(teste);
                        this.surfaces[surf].outp[i][j].g_gouraud = Number(this.get_ilum(this.surfaces[surf].outp[i][j].vet_normal, this.surfaces[surf].outp[i][j], amb_light_g, this.surfaces[surf].ks[1], this.surfaces[surf].kd[1], this.surfaces[surf].n));
                        this.surfaces[surf].outp[i][j].b_gouraud = Number(this.get_ilum(this.surfaces[surf].outp[i][j].vet_normal, this.surfaces[surf].outp[i][j], amb_light_b, this.surfaces[surf].ks[2], this.surfaces[surf].kd[2], this.surfaces[surf].n));
                    }
                }
                this.surfaces[surf].create_faces(this.matriz_SRU_SRT);
            }
        }
        
    }

    

    get_ilum(vet_normal: Vet, centroide: Dot, amb_light_par: number, ks: number, kd: number, n: number){
        let amb_light = amb_light_par;
        
        let aux_x = this.lamp.pos.x - centroide.x;
        let aux_y = this.lamp.pos.y - centroide.y;
        let aux_z = this.lamp.pos.z - centroide.z;

        let test_vis = new Vet(centroide.x - this.camera.vrp.x, centroide.y - this.camera.vrp.y, centroide.z - this.camera.vrp.z)
        if(prod_escalar(vet_normal.unitary, test_vis.unitary) < 0){
            vet_normal = new Vet(-vet_normal.x, -vet_normal.y, -vet_normal.z)
        }

        vet_normal.unitary = vet_normal.get_unitary_vector();

        let vet_LampMinusCent = new Vet(aux_x, aux_y, aux_z);
        

        let UN_escalar_UL = prod_escalar(vet_LampMinusCent.unitary, vet_normal.unitary)
        

        if(UN_escalar_UL > 0){
            let ilum_difusa = this.lamp.il * kd * UN_escalar_UL;
           

            aux_x = 2*UN_escalar_UL*vet_normal.unitary.x-vet_LampMinusCent.unitary.x;
            aux_y = 2*UN_escalar_UL*vet_normal.unitary.y-vet_LampMinusCent.unitary.y;
            aux_z = 2*UN_escalar_UL*vet_normal.unitary.z-vet_LampMinusCent.unitary.z;

            let idk_r = new Vet(aux_x, aux_y, aux_z);
            

            aux_x = this.camera.vrp.x-centroide.x;
            aux_y = this.camera.vrp.y-centroide.y;
            aux_z = this.camera.vrp.z-centroide.z;

            let direcao_observ = new Vet(aux_x, aux_y, aux_z);
           

            let r_escalar_dir_obs = prod_escalar(idk_r.unitary, direcao_observ.unitary);
            
            if(r_escalar_dir_obs > 0){

                let is = this.lamp.il*ks*r_escalar_dir_obs**n;
                

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

    cut_surface_nocolor(surface: Surface){
        for(let i=0; i < surface.double_faces.length; i++){
            
            surface.double_faces[i].face = Recorte(surface.double_faces[i].face, 0, this.width, 0, this.height);
            if(surface.double_faces[i].face.dots.length == 0){ 
                surface.double_faces.splice(i, 1);
                i--;
            }
            
        }
    };

    cut_surface_withcolor(surface: Surface){
        
        for(let i=0; i < surface.double_faces.length; i++){
            surface.double_faces[i].face = RecorteWithColor(surface.double_faces[i].face, 0, this.width, 0, this.height);
            if(surface.double_faces[i].face.dots.length == 0){ 
                surface.double_faces.splice(i, 1);
                i--;
            }
        }
       

    };

    cut_surface_phong(surface: Surface){
        for(let i=0; i < surface.double_faces.length; i++){
            surface.double_faces[i].face = RecortePhong(surface.double_faces[i].face, 0, this.width, 0, this.height);
            if(surface.double_faces[i].face.dots.length == 0){ 
                surface.double_faces.splice(i, 1);
                i--;
            }
        }
    };

    calc_zbuffer_phong(){
        
        for(let i=0; i<this.surfaces.length; i++){
            if(this.surfaces[i].cuted == false){
                let amb_light_r = this.surfaces[i].ka[0] * this.la[0];
                let amb_light_g = this.surfaces[i].ka[1] * this.la[1];
                let amb_light_b = this.surfaces[i].ka[2] * this.la[2];
                for(let j=0; j<this.surfaces[i].double_faces.length; j++){
                    this.zbuffer_phong.rasterizePolygon(this.surfaces[i].double_faces[j].face);
                    this.zbuffer_phong.ZbufferPhong([amb_light_r, amb_light_g, amb_light_b], this.surfaces[i].ks, this.surfaces[i].ks, this.surfaces[i].n, this.surfaces[i].double_faces[j].face_SRU);
                }
            }
        };
    }

 
    calc_zbuffer_gouraud(){
        
        for(let i=0; i<this.surfaces.length; i++){
            if(this.surfaces[i].cuted == false){
                for(let j=0; j<this.surfaces[i].double_faces.length; j++){
                    this.zbuffer_gouraud.rasterizePolygon(this.surfaces[i].double_faces[j].face);
                    this.zbuffer_gouraud.ZbufferGourand();
                }
            }
        };
    }

    calc_zbuffer_const(){
        
        for(let i=0; i<this.surfaces.length; i++){
            if(this.surfaces[i].cuted == false){
                for(let j=0; j<this.surfaces[i].double_faces.length; j++){
                    this.zbuffer_const.rasterizePolygon(this.surfaces[i].double_faces[j].face);
                    this.zbuffer_const.ZbufferConstante();
                }
            }
        }
        
    }

    plot_zbuffer_const(){
        for(let i=0; i<this.zbuffer_const.colorBuffer.length; i++){
            for(let j=0; j<this.zbuffer_const.colorBuffer[0].length; j++){
                
                this.ctx.fillStyle = this.zbuffer_const.colorBuffer[i][j];
                this.ctx.fillRect(j, i, 1, 1);
            }
        }
    }

    plot_zbuffer_phong(){
        for(let i=0; i<this.zbuffer_phong.colorBuffer.length; i++){
            for(let j=0; j<this.zbuffer_phong.colorBuffer[0].length; j++){
                
                this.ctx.fillStyle = this.zbuffer_phong.colorBuffer[i][j];
                this.ctx.fillRect(j, i, 1, 1);
            }
        }
    }

    plot_zbuffer_gouraud(){
        for(let i=0; i<this.zbuffer_gouraud.colorBuffer.length; i++){
            for(let j=0; j<this.zbuffer_gouraud.colorBuffer[0].length; j++){
                
                this.ctx.fillStyle = this.zbuffer_gouraud.colorBuffer[i][j];
                this.ctx.fillRect(j, i, 1, 1);
            }
        }
    }
    draw_face(face: Face){
        
        
        for (let i = 0; i < face.dots.length; i++){
            if ( i === face.dots.length-1){
                this.draw_line(face.dots[i], face.dots[0], "blue");
            } else {
              
                this.draw_line(face.dots[i], face.dots[i+1], "blue");
            }
        }
    };

    draw_line(dot0: Dot, dot1: Dot, color: string){
        this.ctx.beginPath();
        this.ctx.moveTo(dot0.x, dot0.y);
        this.ctx.lineTo(dot1.x, dot1.y);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    };

    draw_outp(obj: Surface){
        let mat_control_p = obj.get_outp_as_mat();

        let points: number[][];

        points = mult_matriz(this.matriz_SRU_SRT, mat_control_p);
    

        for(let i = 0; i < points[0].length; i++){
            this.draw_dot(new Dot(points[0][i] / points[3][i], points[1][i] / points[3][i], 0, "black")); 
        }
    };

    draw_cp(obj: Surface){
        
        obj.define_dots_screen(this.matriz_SRU_SRT);
        

        for(let i = 0; i < obj.control_points_screen.length; i++){
            for(let j = 0; j < obj.control_points_screen[0].length; j++){
                this.draw_dot(obj.control_points_screen[i][j]); 
            }
        }
    };

    draw_dot(A: Dot){
        this.ctx.beginPath();
        this.ctx.fillStyle = "grey";
        this.ctx.arc(A.x, A.y, 2, 0, 360, false);
        this.ctx.fill();
    };

    add_surface(obj: Surface){
        this.surfaces.push(obj);
        obj.create_faces(this.matriz_SRU_SRT);
    };

    get_mat_from_list_of_dots(arr_dots: Array<Dot>): number[][]{
        let mat_aux: number[][] = Array(4).fill(null).map(() => Array(arr_dots.length).fill(0));
        for(let i = 0; i < arr_dots.length; i++){
            mat_aux[0][i] = arr_dots[i].x;
            mat_aux[1][i] = arr_dots[i].y;
            mat_aux[2][i] = arr_dots[i].z;
            mat_aux[3][i] = 1;
        }
        return mat_aux;
    };

    get_dots_from_mat(mat: number[][]){
        let list_d: Array<Dot>;
        list_d = [new Dot(mat[0][0], mat[1][0], mat[2][0])]
        for(let i=1; i < mat.length; i++){
            list_d.push(new Dot(mat[0][i], mat[1][i], mat[2][i]));
        }
        return list_d;
    };

    multiply_and_update_cp(index: number, mat: number[][]){
        let new_matriz_obj = mult_matriz(mat, this.surfaces[index].get_cp_as_mat()); 
        this.surfaces[index].update_cp_with_mat(new_matriz_obj);
    }

    render() {
        let all_double_faces = [];

        for(let i=0; i<this.surfaces.length; i++){
            if(this.surfaces[i].cuted == false){
                for(let j=0; j<this.surfaces[i].double_faces.length; j++){
                    all_double_faces.push(this.surfaces[i].double_faces[j]);
                }
            }
        }

        all_double_faces.sort((faceA, faceB) => {
            const centroideA = faceA.face_SRU.centroide;
            const centroideB = faceB.face_SRU.centroide;

            const distanciaA: number = calc_distance(centroideA, this.camera.vrp);
            const distanciaB: number = calc_distance(centroideB, this.camera.vrp);

            return distanciaB - distanciaA; 
        });


        for (const doubleFace of all_double_faces) {
            
            let vrp_minus_cent = new Vet(doubleFace.face_SRU.centroide.x - this.camera.vrp.x, doubleFace.face_SRU.centroide.y - this.camera.vrp.y, doubleFace.face_SRU.centroide.z - this.camera.vrp.z)
           
            let normal = prod_escalar(doubleFace.face_SRU.get_normal().unitary, vrp_minus_cent.unitary);
            
            doubleFace.face.fillpoly(this.ctx, normal);
        }

       
    }
}

function calc_distance(centroide: Dot, VRP: Dot): number {
    return Math.sqrt(
        (VRP.x - centroide.x) ** 2 +
        (VRP.y - centroide.y) ** 2 +
        (VRP.z - centroide.z) ** 2
    );
}

function get_centroide(face: Face): Dot {
    if (!face.dots || face.dots.length === 0) {
        console.error("Erro: Face não contém pontos válidos", face);
        return new Dot(0, 0, 0); 
    }

    let sum_x = 0, sum_y = 0, sum_z = 0;
    let num_pontos = face.dots.length;

    for (let i = 0; i < num_pontos; i++) {
        sum_x += face.dots[i].x;
        sum_y += face.dots[i].y;
        sum_z += face.dots[i].z;
    }

    return new Dot(sum_x / num_pontos, sum_y / num_pontos, sum_z / num_pontos);
}
