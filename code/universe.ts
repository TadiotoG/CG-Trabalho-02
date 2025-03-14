/// <reference path="./zbuffer.ts" />

let canvas_width = 1000;
let canvas_height = 800;

class Universe { // Deve ser atraves dessa classe que a comunicacao com o front-end deve ser feita
    ctx: CanvasRenderingContext2D;
    matriz_SRU_SRT: number[][];
    camera: Camera;
    surfaces: Array<Surface> = [];
    rotate_y: Boolean = false;
    lamp: Lamp;
    la: [number, number, number]; // Luz ambiente
    zbuffer: ZBuffer;
    width: number;
    height: number;

    constructor(ctx_out: CanvasRenderingContext2D, cam: Camera, lamp: Lamp, ambient_light: [number, number, number], z_buffer: ZBuffer, width: number, height: number){
        this.ctx = ctx_out;
        this.camera = cam;
        this.matriz_SRU_SRT = this.camera.get_mat_SRU_SRT();
        this.lamp = lamp;
        this.la = ambient_light;
        this.zbuffer = z_buffer;
        this.width = width;
        this.height = height;
    };

    update_all_face_colors_constant(){
        for(let i=0; i<this.surfaces.length; i++){
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
                // console.log("New color -> ", new_color);
                this.surfaces[i].double_faces[j].face.color = new_color;
            }
        }
    }

    call_gouraud(){
        for(let surf=0; surf<this.surfaces.length; surf++){
            define_vet_normal_vertices(this.surfaces[surf].outp);
            let amb_light_r = this.surfaces[surf].ka[0] * this.la[0];
            let amb_light_g = this.surfaces[surf].ka[1] * this.la[1];
            let amb_light_b = this.surfaces[surf].ka[2] * this.la[2];
            for(let i=0; i<this.surfaces[surf].outp.length; i++){
                for(let j=0; j<this.surfaces[surf].outp[0].length; j++){
                    let teste = (this.get_ilum(this.surfaces[surf].outp[i][j].gouraud, this.surfaces[surf].outp[i][j], amb_light_r, this.surfaces[surf].ks[0], this.surfaces[surf].kd[0], this.surfaces[surf].n));
                    this.surfaces[surf].outp[i][j].r_gouraud = Number(teste);
                    this.surfaces[surf].outp[i][j].g_gouraud = Number(this.get_ilum(this.surfaces[surf].outp[i][j].gouraud, this.surfaces[surf].outp[i][j], amb_light_g, this.surfaces[surf].ks[1], this.surfaces[surf].kd[1], this.surfaces[surf].n));
                    this.surfaces[surf].outp[i][j].b_gouraud = Number(this.get_ilum(this.surfaces[surf].outp[i][j].gouraud, this.surfaces[surf].outp[i][j], amb_light_b, this.surfaces[surf].ks[2], this.surfaces[surf].kd[2], this.surfaces[surf].n));
                }
            }
            this.surfaces[surf].create_faces(this.matriz_SRU_SRT);
        }
        console.log("Primeira face -> ", this.surfaces[0].double_faces)
    }

    get_ilum(vet_normal: Vet, centroide: Dot, amb_light_par: number, ks: number, kd: number, n: number){
        let amb_light = amb_light_par;
        // console.log("================================================");
        // console.log("Centroide face = ", face);
        // console.log("Lamp x = ", this.lamp.pos.x);
        let aux_x = this.lamp.pos.x - centroide.x;
        let aux_y = this.lamp.pos.y - centroide.y;
        let aux_z = this.lamp.pos.z - centroide.z;

        let vet_LampMinusCent = new Vet(aux_x, aux_y, aux_z);
        // vet_LampMinusCent.print_obj("Lamp - Centroide");

        let UN_times_UL = prod_escalar(vet_LampMinusCent.unitary, vet_normal.unitary)
        // console.log("UN times UL = ", UN_times_UL);
        // console.log("vet_normal = ", vet_normal.unitary);

        if(UN_times_UL){
            let ilum_difusa = this.lamp.il * kd * UN_times_UL;
            // console.log("Ilumincao difusa: ", ilum_difusa)

            aux_x = 2*UN_times_UL*vet_normal.unitary.x-vet_LampMinusCent.unitary.x;
            aux_y = 2*UN_times_UL*vet_normal.unitary.y-vet_LampMinusCent.unitary.y;
            aux_z = 2*UN_times_UL*vet_normal.unitary.z-vet_LampMinusCent.unitary.z;

            let idk_r = new Vet(aux_x, aux_y, aux_z);
            // idk_r.print_obj("Vet r")

            aux_x = this.camera.vrp.x-centroide.x;
            aux_y = this.camera.vrp.y-centroide.y;
            aux_z = this.camera.vrp.z-centroide.z;

            let direcao_observ = new Vet(aux_x, aux_y, aux_z);
            // direcao_observ.print_obj("Direcao observ");

            let r_escalar_dir_obs = prod_escalar(idk_r, direcao_observ.unitary);
            // console.log("R escalar dir ", r_escalar_dir_obs);

            let is = this.lamp.il*ks*r_escalar_dir_obs**n;
            // console.log("k ", ks, "    n -> ", n)
            // console.log("is -> ", is)
            // console.log(`${r_escalar_dir_obs} ** ${n} = ${r_escalar_dir_obs**n}`)
            // console.log("Cor = ", String((amb_light + ilum_difusa + is)));
            // console.log(`${amb_light} + ${ilum_difusa} + ${is}`);

            let result = 4*Math.round(amb_light + ilum_difusa + is);
            return result.toString(10);
        } else {
            return amb_light.toString(10);
        }
    }

    cut_surface_nocolor(surface: Surface){
        for(let i=0; i < surface.double_faces.length; i++){
            // console.log("Entrou assim -> ", surface.double_faces[i].face)
            surface.double_faces[i].face = Recorte(surface.double_faces[i].face, 0, this.width, 0, this.height);
            // console.log("Saiu assim -> ", surface.double_faces[i].face)
        }
    };

    cut_surface_withcolor(surface: Surface){
        for(let i=0; i < surface.double_faces.length; i++){
            surface.double_faces[i].face = RecorteWithColor(surface.double_faces[i].face, 0, this.width, 0, this.height);
            if(surface.double_faces[i].face.dots.length == 0){ // Caso o recorte retorne uma face sem pontos, a face é tirada da lista de faces
                surface.double_faces.splice(i);
                i--;
            }
        }
    };

    calc_zbuffer(){
        for(let i=0; i<this.surfaces.length; i++){
            for(let j=0; j<this.surfaces[i].double_faces.length; j++){
                this.zbuffer.rasterizePolygon(this.surfaces[i].double_faces[j].face);
            }
        }
        this.zbuffer.Zbuffer();
        // console.log("Executou ")
        for(let x=0; x<this.zbuffer.depthBuffer.length; x++){ // Fui ver se eu resolvi o teu problema, mas n consegui, isso aqui vai printar qualquer face que apareca no z buffer
            for(let z=0; z<this.zbuffer.depthBuffer[0].length; z++){
                this.ctx.fillStyle = this.zbuffer.colorBuffer[x][z];
                this.ctx.fillRect(z, x, 1, 1);
                
                    // console.log(`ZBuffer [${x}][${z}] = ${this.zbuffer.depthBuffer[x][z]}  e   ${this.zbuffer.colorBuffer[x][z]}`)
            }
        }
    }

    plot_zbuffer(){
        for(let i=0; i<this.zbuffer.colorBuffer.length; i++){
            for(let j=0; j<this.zbuffer.colorBuffer[0].length; j++){
                // console.log(`[${i}][${j}]`)
                this.ctx.fillStyle = this.zbuffer.colorBuffer[i][j];
                this.ctx.fillRect(j, i, 1, 1);
            }
        }
    }

    draw_face(face: Face){
        // let points = mult_matriz(this.matriz_SRU_SRT, this.get_mat_from_list_of_dots(face.dots))

        // let dots_on_screen: Array<Dot>; // Pontos em coordenada de tela, após a conversao utilizando a matriz SRU_SRT
        // dots_on_screen = this.get_dots_from_mat(face.dots)
        
        for (let i = 0; i < face.dots.length; i++){
            if ( i === face.dots.length-1){
                this.draw_line(face.dots[i], face.dots[0], "blue");
            } else {
                // let h = 3;
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
        // print_matriz(points, "POINTS")

        for(let i = 0; i < points[0].length; i++){
            this.draw_dot(new Dot(points[0][i] / points[3][i], points[1][i] / points[3][i], 0, "black")); // Divide pelo fator homogenio
        }
    };

    draw_cp(obj: Surface){
        // console.log("Antes obj.cp -> ", obj.control_points);
        obj.define_dots_screen(this.matriz_SRU_SRT);
        // console.log("Dots screen -> ", obj.control_points_screen)

        for(let i = 0; i < obj.control_points_screen.length; i++){
            for(let j = 0; j < obj.control_points_screen[0].length; j++){
                this.draw_dot(obj.control_points_screen[i][j]); // Divide pelo fator homogenio
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
            for(let j=0; j<this.surfaces[i].double_faces.length; j++){
                all_double_faces.push(this.surfaces[i].double_faces[j]);
            }
        }

        all_double_faces.sort((faceA, faceB) => {
            const centroideA = faceA.face_SRU.centroide;
            const centroideB = faceB.face_SRU.centroide;

            const distanciaA: number = calc_distance(centroideA, this.camera.vrp);
            const distanciaB: number = calc_distance(centroideB, this.camera.vrp);

            return distanciaB - distanciaA; // Ordenação decrescente
        });

        // console.log("Cor antes -> ", this.surfaces[0].double_faces[0].face.color)

        for (const doubleFace of all_double_faces) {
            // console.log("Pontos -> ", doubleFace.face_SRU.dots)
            // console.log("Normal -> ", doubleFace.face_SRU.get_normal())
            let vrp_minus_cent = new Vet(doubleFace.face_SRU.centroide.x - this.camera.vrp.x, doubleFace.face_SRU.centroide.y - this.camera.vrp.y, doubleFace.face_SRU.centroide.z - this.camera.vrp.z)
            // console.log("VRP - Centroide -> ", vrp_minus_cent)
            let normal = prod_escalar(doubleFace.face_SRU.get_normal().unitary, vrp_minus_cent.unitary);
            // console.log("Calculo da normal -> ", normal)
            doubleFace.face.fillpoly(this.ctx, normal);
        }

        // console.log("Cor depois -> ", this.surfaces[0].double_faces[0].face.color)
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
