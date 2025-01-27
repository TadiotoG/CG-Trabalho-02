/// <reference path= "./Dot_Vet.ts" />

function get_matriz_translada(x: number, y: number, z: number): number[][]{
    let mat_aux: number[][];
    mat_aux = ([[1, 0, 0, x],
                [0, 1, 0, y],
                [0, 0, 0, z],
                [0, 0, 0, 1]])
    return mat_aux;
}

function get_matriz_rot_y(angle: number): number[][] {
    let mat_aux: number[][];
    mat_aux = ([[Math.cos(angle), 0, Math.sin(angle), 0],
                [0, 1, 0, 0],
                [-Math.sin(angle), 0, Math.cos(angle), 0],
                [0, 0, 0, 1]])
    return mat_aux;
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

function get_ArrDots_as_mat(arr_dots: Array<Dot>): number[][]{
    let mat_aux: number[][] = Array(4).fill(null).map(() => Array(arr_dots.length).fill(0));

    for(let i = 0; i < arr_dots.length; i++){
        mat_aux[0][i] = arr_dots[i].x;
        mat_aux[1][i] = arr_dots[i].y;
        mat_aux[2][i] = arr_dots[i].z;
        mat_aux[3][i] = 1;
    }
    return mat_aux;
}

class Obj_3D{
    dots: Array<Dot>;
    mat_dots: number[][];
    color: string;
    centroide: Dot;

    constructor(new_color: string, dots_array: Array<Dot>){
        this.color = new_color;
        this.dots = [];
        this.dots = dots_array;
        this.mat_dots = this.get_mat_from_dots();
        this.centroide = this.get_centroide();
    }

    get_mat_from_dots(): number[][]{
        let mat_aux: number[][] = Array(4).fill(null).map(() => Array(this.dots.length).fill(0));

        for(let i = 0; i < this.dots.length; i++){
            mat_aux[0][i] = this.dots[i].x;
            mat_aux[1][i] = this.dots[i].y;
            mat_aux[2][i] = this.dots[i].z;
            mat_aux[3][i] = 1;
        }

        return mat_aux;
    }

    get_centroide(): Dot{
        let sum_x = 0;
        let sum_y = 0;
        let sum_z = 0;
        for(let i=0; i < this.dots.length; i++){
            sum_x += this.dots[i].x;
            sum_y += this.dots[i].y;
            sum_z += this.dots[i].z;
        }

        return new Dot(sum_x/this.dots.length, sum_y/this.dots.length, sum_z/this.dots.length);
    }

    update_centroide(): void {
        this.centroide = this.get_centroide();
    }
}

let canvas_width = 800;
let canvas_height = 800;

class Universe { // Deve ser atraves dessa classe que a comunicacao com o front-end deve ser feita
    ctx: CanvasRenderingContext2D;
    matriz_SRU_SRT: number[][];
    camera: Camera;
    objects: Array<Obj_3D> = []; // TROCAR POR SPLINE

    constructor(ctx_out: CanvasRenderingContext2D, cam: Camera){
        this.ctx = ctx_out;
        this.camera = cam;
        this.matriz_SRU_SRT = this.camera.get_mat_SRU_SRT();
    }

    animate_world = () => {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, canvas_width, canvas_height);
        for(let i = 0; i < this.objects.length; i++){   
            this.draw_obj(this.objects[i]);
            let new_matriz_obj: number[][];
            new_matriz_obj = mult_matriz(get_matriz_rot_y(0.007), this.objects[i].mat_dots); // Faz a animacao rotacionando o objeto no eixo y
            this.objects[i].mat_dots = new_matriz_obj;
        }
        requestAnimationFrame(this.animate_world);
    }

    draw_dot(x, y, color){
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.arc(x, y, 2, 0, 360, false);
        this.ctx.fill();
    }

    draw_obj(obj: Obj_3D){
        let points: number[][];
        points = mult_matriz(this.matriz_SRU_SRT, obj.mat_dots);

        for(let i = 0; i < points[0].length; i++){
            this.draw_dot(points[0][i] / points[3][i], points[1][i] / points[3][i], "black"); // Divide pelo fator homogenio
        }
    }

    add_obj(obj: Obj_3D){
        this.objects.push(obj);
    }
}