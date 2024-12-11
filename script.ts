class Dot{ // Classe para pontos ou vertices
    x: number;
    y: number;
    z: number;

    constructor(new_x: number, new_y: number, new_z: number){
        this.x = new_x;
        this.y = new_y;
        this.z = new_z;
    }

    print_obj(dot_name: string){
        console.log(dot_name + "-> (" + this.x + "," + this.y + "," + this.z + ")")
    }
}

class Vet extends Dot { // Adicionei esta classe para que assim que declarado o vetor, tenhamos ja calculado seus possiveis diferentes atributos, como o vetor unitario...
    unitary: Dot; // Vetor unitario deve ser um Dot, pq se definirmos como um Vet, na sua construcao sera calculado o seu vetor unitario, criando um looping recursivo e infinito...

    constructor (new_x: number, new_y: number, new_z: number){
        super(new_x, new_y, new_z);
        this.unitary = this.get_unitary_vector()
    }

    get_unitary_vector(){
        let norma_A: number;
        norma_A = Math.sqrt(this.x**2 + this.y**2 + this.z**2)
        return new Dot(this.x/norma_A, this.y/norma_A, this.z/norma_A)
    }

    print_obj(vet_name: string){
        console.log(vet_name + "-> (" + this.x + "," + this.y + "," + this.z + ")")
        this.unitary.print_obj("Unitary ")
        console.log()
    }
}

class Obj_3D{
    dots: Array<Dot>;
    color: string;

    constructor(new_color: string, dots_array: Array<Dot>){
        this.color = new_color;
        this.dots = [];
        this.dots = dots_array;
    }
}

function VetA_minus_VetB(A: Dot, B: Dot) { // Subtracao entre 2 pontos ou vetores, resultando em um Vetor
    let x: number, y: number, z: number;
    x = A.x - B.x;
    y = A.y - B.y;
    z = A.z - B.z;

    let C = new Vet(x, y, z);

    return C;
}

function prod_escalar(A: Dot, B: Dot){ // Passagem de parametros utilizando Dot, pois como Dot é a classe pai, utilizando a classe filho tambem funciona (polimorfismo), isso serve para que caso seja necessario fazer prod_escalar de Dot com Vet, funcionara...
    return (A.x * B.x + A.y * B.y + A.z * B.z);
}

function prod_vet(A: Dot, B: Dot){
    let prod_x = A.y * B.z - A.z * B.y;
    let prod_y = A.z * B.x - A.x * B.z;
    let prod_z = A.x * B.y - A.y * B.x;

    let C = new Vet(prod_x, prod_y, prod_z);
    return C;
}

function print_matriz(A: number [][], matriz_name: string){
    // console.log("Matriz = [" + A[0][0] + "," + A[0][1])
    let aux_str: string;
    console.log("------------- Matriz " + matriz_name + " -------------")
    aux_str = ""
    for(let i = 0; i < A.length; i++){
        for(let j = 0; j < A[0].length; j++){
            aux_str += A[i][j] + ", "
        }
        console.log(aux_str)
        aux_str = ""
    }
}

function mult_matriz(A: number[][], B: number[][]): number[][] {
    if (A[0].length !== B.length) {
        throw new Error("O número de colunas de A deve ser igual ao número de linhas de B.");
    }

    //let result: number[][];
    let result: number[][] = Array(A.length).fill(null).map(() => Array(B[0].length).fill(0));

    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B[0].length; j++) {
            for (let k = 0; k < B.length; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    return result;
}

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
    width: number;
    height: number;
    x_min: number;
    y_min: number;
    x_max: number;
    y_max: number;

    constructor(view_reference_point: Dot, focal_p: Dot, dp: number, wid: number, heig: number, min_x: number, min_y: number, max_x: number, max_y: number){
        this.vrp = view_reference_point;
        this.focal_point = focal_p;
        this.dp = dp;
        this.x_min = min_x;
        this.y_min = min_y;
        this.x_max = max_x;
        this.y_max = max_y;
        this.width = wid;
        this.height = heig;

        this.vet_n = VetA_minus_VetB(this.vrp, this.focal_point);
        this.vet_n.print_obj("Vet n ");

        this.define_vector_v();
        this.vet_v.print_obj("Vet v ");

        this.vet_u = prod_vet(this.vet_v, this.vet_n);
        this.vet_u.print_obj("Vet u ");

        this.matriz_SRU_SRC = ([
            [this.vet_u.unitary.x, this.vet_u.unitary.y, this.vet_u.unitary.z, -prod_escalar(this.vrp, this.vet_u.unitary)],

            [this.vet_v.unitary.x, this.vet_v.unitary.y, this.vet_v.unitary.z, -prod_escalar(this.vrp, this.vet_v.unitary)],

            [this.vet_n.unitary.x, this.vet_n.unitary.y, this.vet_n.unitary.z, -prod_escalar(this.vrp, this.vet_n.unitary)],
            [0, 0, 0, 1]
        ])
        print_matriz(this.matriz_SRU_SRC, "SRU_SRC")
        this.define_matriz_pesp();
        print_matriz(this.matriz_persp, "Persp");

        this.define_matriz_jp();
    }

    private define_vector_v(){
        let y = new Vet(0, 1, 0);
        let y_ProdEsc_unitaryN = prod_escalar(y, this.vet_n.unitary);
        let aux_x: number = this.vet_n.unitary.x * y_ProdEsc_unitaryN;
        let aux_y: number = this.vet_n.unitary.y * y_ProdEsc_unitaryN;
        let aux_z: number = this.vet_n.unitary.z * y_ProdEsc_unitaryN;

        let aux = new Vet(aux_x, aux_y, aux_z);

        this.vet_v = VetA_minus_VetB(y, aux);
    }

    private define_matriz_pesp(){
        let mat_sru: number[][];
        let mat_src: number[][];

        let x_vp: number  = (this.vrp.x + (this.dp * (-this.vet_n.unitary.x)))
        let y_vp: number = (this.vrp.y + (this.dp * (-this.vet_n.unitary.y)))
        let z_vp: number = (this.vrp.z + (this.dp * (-this.vet_n.unitary.z)))

        mat_sru = ([[x_vp, this.vrp.x],
                    [y_vp, this.vrp.y],
                    [z_vp, this.vrp.z],
                    [1, 1]])

        mat_src = mult_matriz(this.matriz_SRU_SRC, mat_sru);
        print_matriz(mat_src, "SRC");

        let new_z_vp = mat_src[2][0]
        let new_z_prp = mat_src[2][1]

        this.matriz_persp = ([[1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, -(new_z_vp / this.dp), new_z_vp * (new_z_prp/this.dp)],
            [0, 0, -1/this.dp, new_z_prp/this.dp]
        ])
    }

    private define_matriz_jp(){
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

        console.log("Teste = " + this.height)

        this.matriz_jp = ([[(u_max - u_min)/(x_max - x_min), 0, 0, aux_1],
                            [0, (v_min - v_max) / (y_max - y_min), 0, aux_2],
                            [0, 0, 1, 0],
                            [0, 0, 0, 1]])

        print_matriz(this.matriz_jp, "JP");
    }

    get_this_fucking_matriz(){
        let mat_aux: number[][];

        mat_aux = mult_matriz(this.matriz_jp, this.matriz_persp);
        mat_aux = mult_matriz(mat_aux, this.matriz_SRU_SRC);
        
        print_matriz(mat_aux, "Final");
        return mat_aux;
    }
}

class Universe { // Deve ser atraves dessa classe que a comunicacao com o front-end deve ser feita
    ctx: CanvasRenderingContext2D;
    matriz_SRU_SRT: number[][];

    constructor(ctx_out: CanvasRenderingContext2D, width_limit: number, height_limit: number){
        this.ctx = ctx_out;
    }

    animate_world = () => {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        requestAnimationFrame(this.animate_world);
    }

    draw_it() {
        this.ctx.beginPath();
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(100, 100, 100, 100);
        this.ctx.stroke();
    };

    draw_dot(x, y, color){
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.arc(x, y, 2, 0, 360, false);
        this.ctx.fill();
    }

    test_drawing(cam: Camera, matriz: number[][]){
        let points: number[][];
        
        this.matriz_SRU_SRT = cam.get_this_fucking_matriz();

        points = mult_matriz(this.matriz_SRU_SRT, matriz);
        // print_matriz(points, "Pontos")

        for(let i = 0; i < points[0].length; i++){
            this.draw_dot(points[0][i] / points[3][i], points[1][i] / points[3][i], "black");
        }
    }
}

const canvas = document.createElement("canvas")
canvas.id = "canvas-giratorio"
canvas.style.backgroundColor = "white"
canvas.style.border = "1px solid black"
canvas.style.width = "1000px"
canvas.style.height = "800px"
var ctx = canvas.getContext("2d")
canvas.width = 1000;
canvas.height = 800;
ctx.imageSmoothingEnabled = false;
document.body.appendChild(canvas);

let uni = new Universe(ctx, canvas.width, canvas.height);

let vrp_camera = new Dot(25, 15, 80);
let focal_point_camera = new Dot(20, 10, 25);
let distance_point = 20;

let camera = new Camera(vrp_camera, focal_point_camera, distance_point, 16, 12, 0, 0, 319, 239);

let A = new Dot(21.2, 0.7, 42.3);
let B = new Dot(34.1, 3.4, 27.2);
let C = new Dot(18.8, 5.6, 14.6);
let E = new Dot(20, 20.9, 31.6);

let pyramid_dots: Array<Dot>;
pyramid_dots = [A, B, C, E];

let matriz_teste:number [][];
matriz_teste = ([[21.2, 34.1, 18.8, 20],
                [0.7, 3.4, 5.6, 20.9],
                [42.3, 27.2, 14.6, 31.6],
                [1, 1, 1, 1]])

uni.test_drawing(camera, matriz_teste);

let pyramid = new Obj_3D("blue", pyramid_dots);