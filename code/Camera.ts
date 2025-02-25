/// <reference path= "Spline.ts" />

class Camera {
    vrp: Dot;
    focal_point: Dot;
    vet_n: Vet;
    vet_v: Vet;
    vet_u: Vet;
    dp: number;
    matriz_SRU_SRC: number[][];
    matriz_persp: number[][];
    matriz_jp: number[][];
    width: number = 100;
    height: number = 100;
    x_min: number;
    y_min: number;
    x_max: number;
    y_max: number;

    constructor(view_reference_point: Dot, focal_p: Dot, dp: number, min_x: number, min_y: number, max_x: number, max_y: number){
        this.vrp = view_reference_point;
        this.focal_point = focal_p;
        this.dp = dp;
        this.x_min = min_x;
        this.y_min = min_y;
        this.x_max = max_x;
        this.y_max = max_y;
        this.calc_matrizes();
    }

    calc_matrizes(){
        this.vet_n = VetA_minus_VetB(this.vrp, this.focal_point);
        // this.vet_n.print_obj("Vet n ");

        this.vet_v = this.define_vector_v();
        // this.vet_v.print_obj("Vet v ");

        this.vet_u = prod_vet(this.vet_v, this.vet_n);
        // this.vet_u.print_obj("Vet u ");

        this.matriz_SRU_SRC = ([
            [this.vet_u.unitary.x, this.vet_u.unitary.y, this.vet_u.unitary.z, 0],

            [this.vet_v.unitary.x, this.vet_v.unitary.y, this.vet_v.unitary.z, 0],

            [this.vet_n.unitary.x, this.vet_n.unitary.y, this.vet_n.unitary.z, 0],
            [0, 0, 0, 1]
        ])
        // print_matriz(this.matriz_SRU_SRC, "SRU_SRC")

        // this.matriz_persp = this.define_matriz_persp();// Projecao perspectiva, nao vai ser mais utilizado...
        // print_matriz(this.matriz_persp, "Persp");

        this.matriz_jp = this.define_matriz_jp();
        // print_matriz(this.matriz_jp, "Jp")
    }

    private define_vector_v(): Vet{
        let y = new Vet(0, 1, 0);
        let y_ProdEsc_unitaryN = prod_escalar(y, this.vet_n.unitary);
        let aux_x: number = this.vet_n.unitary.x * y_ProdEsc_unitaryN;
        let aux_y: number = this.vet_n.unitary.y * y_ProdEsc_unitaryN;
        let aux_z: number = this.vet_n.unitary.z * y_ProdEsc_unitaryN;

        let aux = new Vet(aux_x, aux_y, aux_z);

        let mat_aux: Vet;

        mat_aux = VetA_minus_VetB(y, aux);

        return mat_aux;
    }

    // private define_matriz_persp(): number[][]{ // Projecao perspectiva, nao vai ser mais utilizado...
    //     let mat_sru: number[][];
    //     let mat_src: number[][];

    //     let x_vp: number  = (this.vrp.x + (this.dp * (-this.vet_n.unitary.x)))
    //     let y_vp: number = (this.vrp.y + (this.dp * (-this.vet_n.unitary.y)))
    //     let z_vp: number = (this.vrp.z + (this.dp * (-this.vet_n.unitary.z)))

    //     mat_sru = ([[x_vp, this.vrp.x],
    //                 [y_vp, this.vrp.y],
    //                 [z_vp, this.vrp.z],
    //                 [1, 1]])

    //     mat_src = mult_matriz(this.matriz_SRU_SRC, mat_sru);
    //     // print_matriz(mat_src, "SRC");

    //     let new_z_vp = mat_src[2][0]
    //     let new_z_prp = mat_src[2][1]

    //     let mat_aux: number[][];// 
    //     mat_aux = ([[1, 0, 0, 0],
    //                 [0, 1, 0, 0],
    //                 [0, 0, -(new_z_vp / this.dp), new_z_vp * (new_z_prp/this.dp)],
    //                 [0, 0, -1/this.dp, new_z_prp/this.dp]
    //     ])
    //     return mat_aux;
    // }

    private define_matriz_jp(): number[][]{
        let u_min:number = this.x_min;
        let u_max:number = this.x_max;
        let v_min:number = this.y_min;
        let v_max:number = this.y_max;

        let x_max:number = this.width / 2;
        let x_min:number = -this.width / 2;

        let y_max:number = this.height / 2;
        let y_min:number = -this.height / 2;

        let aux_1:number = -x_min * ((u_max - u_min)/(x_max - x_min)) + u_min;
        let aux_2:number = y_min * ((v_max - v_min)/(y_max - y_min)) + v_max;

        let mat_aux: number[][];

        mat_aux = ([[(u_max - u_min)/(x_max - x_min), 0, 0, aux_1],
                            [0, (v_min - v_max) / (y_max - y_min), 0, aux_2],
                            [0, 0, 1, 0],
                            [0, 0, 0, 1]])
        
        return mat_aux;
    }

    get_mat_SRU_SRT(): number[][]{
        let mat_aux: number[][];

        // mat_aux = mult_matriz(this.matriz_jp, this.matriz_persp);
        // mat_aux = mult_matriz(mat_aux, this.matriz_SRU_SRC);

        mat_aux = mult_matriz(this.matriz_jp, this.matriz_SRU_SRC);
        // print_matriz(mat_aux, "Matriz_SRU_SRT")
        return mat_aux;
    }
}