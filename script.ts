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

function A_minus_B(A: Dot, B: Dot) { // Subtracao entre 2 pontos ou vetores, resultando em um Vetor
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

class Camera {
    vrp: Dot;
    focal_point: Dot;
    vet_n: Vet;
    vet_v: Vet;
    vet_u: Vet;

    constructor(view_reference_point: Dot, focal_p: Dot){
        this.vrp = view_reference_point;
        this.focal_point = focal_p;

        this.vet_n = A_minus_B(this.vrp, this.focal_point);
        this.vet_n.print_obj("Vet n ");

        this.define_vector_v();
        this.vet_v.print_obj("Vet v ");

        this.vet_u = prod_vet(this.vet_v, this.vet_n);
        this.vet_u.print_obj("Vet u ");

    }

    private define_vector_v(){
        let y = new Vet(0, 1, 0);
        let y_ProdEsc_unitaryN = prod_escalar(y, this.vet_n.unitary);
        let aux_x: number = this.vet_n.unitary.x * y_ProdEsc_unitaryN;
        let aux_y: number = this.vet_n.unitary.y * y_ProdEsc_unitaryN;
        let aux_z: number = this.vet_n.unitary.z * y_ProdEsc_unitaryN;

        let aux = new Vet(aux_x, aux_y, aux_z);

        this.vet_v = A_minus_B(y, aux);
    }
}

class Universe { // Deve ser atraves dessa classe que a comunicacao com o front-end deve ser feita
    ctx: CanvasRenderingContext2D;

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

let camera = new Camera(vrp_camera, focal_point_camera)