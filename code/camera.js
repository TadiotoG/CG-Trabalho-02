/// <reference path="./spline.ts" />
var Camera = /** @class */ (function () {
    function Camera(view_reference_point, focal_p, dp, min_x, min_y, max_x, max_y, flag) {
        if (flag === void 0) { flag = false; }
        this.width = 100;
        this.height = 100;
        this.vrp = view_reference_point;
        this.focal_point = focal_p;
        this.dp = dp;
        this.x_min = min_x;
        this.y_min = min_y;
        this.x_max = max_x;
        this.y_max = max_y;
        this.flag_persp = flag;
        this.calc_matrizes();
    }
    Camera.prototype.calc_matrizes = function () {
        this.vet_n = VetA_minus_VetB(this.vrp, this.focal_point);
        // this.vet_n.print_obj("Vet n ");
        this.vet_v = this.define_vector_v();
        // this.vet_v.print_obj("Vet v ");
        this.vet_u = prod_vet(this.vet_v, this.vet_n);
        // this.vet_u.print_obj("Vet u ");
        // this.matriz_SRU_SRC = ([
        //     [this.vet_u.unitary.x, this.vet_u.unitary.y, this.vet_u.unitary.z, 0],
        //     [this.vet_v.unitary.x, this.vet_v.unitary.y, this.vet_v.unitary.z, 0],
        //     [this.vet_n.unitary.x, this.vet_n.unitary.y, this.vet_n.unitary.z, 0],
        //     [0, 0, 0, 1]
        // ])
        var mat_R = ([
            [this.vet_u.unitary.x, this.vet_u.unitary.y, this.vet_u.unitary.z, 0],
            [this.vet_v.unitary.x, this.vet_v.unitary.y, this.vet_v.unitary.z, 0],
            [this.vet_n.unitary.x, this.vet_n.unitary.y, this.vet_n.unitary.z, 0],
            [0, 0, 0, 1]
        ]);
        var mat_T = ([
            [1, 0, 0, this.vrp.x],
            [0, 1, 0, this.vrp.y],
            [0, 0, 1, this.vrp.z],
            [0, 0, 0, 1]
        ]);
        this.matriz_SRU_SRC = mult_matriz(mat_R, mat_T);
        // print_matriz(this.matriz_SRU_SRC, "SRU_SRC")=
        if (this.flag_persp) {
            this.matriz_persp = this.define_matriz_persp(); // Projecao perspectiva, nao vai ser mais utilizado...
        }
        // print_matriz(this.matriz_persp, "Persp");
        this.matriz_jp = this.define_matriz_jp();
        // print_matriz(this.matriz_jp, "Jp")
    };
    Camera.prototype.define_vector_v = function () {
        var y = new Vet(0, 1, 0);
        var y_ProdEsc_unitaryN = prod_escalar(y, this.vet_n.unitary);
        var aux_x = this.vet_n.unitary.x * y_ProdEsc_unitaryN;
        var aux_y = this.vet_n.unitary.y * y_ProdEsc_unitaryN;
        var aux_z = this.vet_n.unitary.z * y_ProdEsc_unitaryN;
        var aux = new Vet(aux_x, aux_y, aux_z);
        var mat_aux;
        mat_aux = VetA_minus_VetB(y, aux);
        return mat_aux;
    };
    Camera.prototype.define_matriz_persp = function () {
        var mat_sru;
        var mat_src;
        var x_vp = (this.vrp.x + (this.dp * (-this.vet_n.unitary.x)));
        var y_vp = (this.vrp.y + (this.dp * (-this.vet_n.unitary.y)));
        var z_vp = (this.vrp.z + (this.dp * (-this.vet_n.unitary.z)));
        mat_sru = ([[x_vp, this.vrp.x],
            [y_vp, this.vrp.y],
            [z_vp, this.vrp.z],
            [1, 1]]);
        mat_src = mult_matriz(this.matriz_SRU_SRC, mat_sru);
        // print_matriz(mat_src, "SRC");
        var new_z_vp = mat_src[2][0];
        var new_z_prp = mat_src[2][1];
        var mat_aux; // 
        mat_aux = ([[1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, -(new_z_vp / this.dp), new_z_vp * (new_z_prp / this.dp)],
            [0, 0, -1 / this.dp, new_z_prp / this.dp]
        ]);
        return mat_aux;
    };
    Camera.prototype.define_matriz_jp = function () {
        var u_min = this.x_min;
        var u_max = this.x_max;
        var v_min = this.y_min;
        var v_max = this.y_max;
        var x_max = this.width / 2;
        var x_min = -this.width / 2;
        var y_max = this.height / 2;
        var y_min = -this.height / 2;
        var aux_1 = -x_min * ((u_max - u_min) / (x_max - x_min)) + u_min;
        var aux_2 = y_min * ((v_max - v_min) / (y_max - y_min)) + v_max;
        var mat_aux;
        mat_aux = ([[(u_max - u_min) / (x_max - x_min), 0, 0, aux_1],
            [0, (v_min - v_max) / (y_max - y_min), 0, aux_2],
            [0, 0, 1, 0],
            [0, 0, 0, 1]]);
        return mat_aux;
    };
    Camera.prototype.get_mat_SRU_SRT = function () {
        var mat_aux;
        if (this.flag_persp) {
            mat_aux = mult_matriz(this.matriz_persp, this.matriz_SRU_SRC);
            mat_aux = mult_matriz(this.matriz_jp, mat_aux);
        }
        else {
            mat_aux = mult_matriz(this.matriz_jp, this.matriz_SRU_SRC);
        }
        return mat_aux;
    };
    return Camera;
}());
