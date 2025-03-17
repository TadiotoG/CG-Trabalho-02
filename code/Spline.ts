class Dot{ // Classe para pontos ou vertices
    x: number;
    y: number;
    z: number;
    color: string;
    vet_normal: Vet;
    r_gouraud: number;
    g_gouraud: number;
    b_gouraud: number;
    x_phong: number;
    y_phong: number;
    z_phong: number;

    constructor(new_x: number, new_y: number, new_z: number, col: string = `rgb(${255}, ${0}, ${0})`, r_gou: number = 0, g_gou: number = 0, b_gou: number = 0, x_phong: number=0, y_phong: number=0, z_phong: number=0){
        this.x = new_x;
        this.y = new_y;
        this.z = new_z;
        this.color = col;
        this.r_gouraud = r_gou;
        this.g_gouraud = g_gou;
        this.b_gouraud = b_gou;
        this.x_phong = x_phong;
        this.y_phong = y_phong;
        this.z_phong = z_phong;
    }

    print_obj(dot_name: string){
        console.log(dot_name + "-> (" + this.x + "," + this.y + "," + this.z + ")")
    }
}

class Vet extends Dot { 
    unitary: Dot; 

    constructor (new_x: number, new_y: number, new_z: number){
        super(new_x, new_y, new_z);
        this.unitary = this.get_unitary_vector()
    }

    get_unitary_vector(){
        let norma_A: number;
        norma_A = Math.sqrt(this.x**2 + this.y**2 + this.z**2);
        return new Dot(this.x/norma_A, this.y/norma_A, this.z/norma_A);
    }

    print_obj(vet_name: string){
        console.log(vet_name + "-> (" + this.x + "," + this.y + "," + this.z + ")");
        this.unitary.print_obj("Unitary ");
        console.log();
    }
}

class Face{
    dots: Array<Dot>;
    color: string;
    other_side_line_color: string;
    arestas: Array<[Dot, Dot]> = []; 
    inters: number[][] = [];
    inters_z: number[][] = [];
    arestac: number = 0;
    centroide: Dot;
    vet_normal: Vet;
    line_color: string;

    constructor(array_dots: Array<Dot>, col: string = "black", other_side_col: string = "red", cor_aresta: string = "blue"){
        this.dots = array_dots;
        this.cria_arestas();
        this.centroide = this.get_centroide();
        if(array_dots.length > 2){
            this.vet_normal = this.get_normal();
        }
        this.color = col;
        this.other_side_line_color = other_side_col;
        this.line_color = cor_aresta;
    }
    cria_arestas(): void {
        this.arestas = []; 
        this.dots.forEach((dot, i) => {
            const nextDot = this.dots[(i + 1) % (this.dots.length)]; 
            this.arestas.push([dot, nextDot]);
        });
    }

    get_centroide(){
        let sum_x: number = 0;
        let sum_y: number = 0;
        let sum_z: number = 0;
        for(let i=0; i<this.dots.length; i++){
            sum_x += this.dots[i].x;
            sum_y += this.dots[i].y;
            sum_z += this.dots[i].z;
        }
        return new Dot(sum_x/this.dots.length, sum_y/this.dots.length, sum_z/this.dots.length)
    }

    get_normal(): Vet {
        if (this.dots.length < 3) {
            throw new Error("Uma face precisa de pelo menos três pontos para calcular o vetor normal.");
        }
    
        
        let P0 = this.dots[0];
        let P1 = this.dots[1];
        let P2 = this.dots[2];

       
        let v1 = new Vet(P0.x - P1.x, P0.y - P1.y, P0.z - P1.z);
        let v2 = new Vet(P2.x - P1.x, P2.y - P1.y, P2.z - P1.z);
    
        
        let normal = prod_vet(v2, v1);
    
        
        return normal;
    }
    

    addAresta(dot1: Dot, dot2: Dot): void {
        this.arestas.push([dot1, dot2]);
    }

    swap_arestas(i: number): void {
        if (i >= 0 && i < this.arestas.length) {
            const [dot1, dot2] = this.arestas[i];
            this.arestas[i] = [dot2, dot1]; 
        }
    }

    fillpoly(ctx: CanvasRenderingContext2D, normal: number): void {
        
    
        const ymin = Math.round(Math.min(...this.dots.map(p => p.y)));
        const ymax = Math.round(Math.max(...this.dots.map(p => p.y)));
    
        this.inters = Array.from({ length: ymax - ymin +1}, () => []);
    
        this.arestas.forEach((aresta, i) => {
            if (aresta[0].y === aresta[1].y) return; 
            if (aresta[0].y > aresta[1].y) {
                [this.arestas[i][0], this.arestas[i][1]] = [aresta[1], aresta[0]];
            }
            
            const x1 = aresta[0].x, y1 = Math.ceil(aresta[0].y);
            const x2 = aresta[1].x, y2 = Math.floor(aresta[1].y);
            
            const coeficiente = (x2 - x1) / (y2 - y1);
            
            let x = x1;
            let index = Math.floor(y1 - ymin);
            
            for (let y = y1; y <= y2; y++) {
                if (!this.inters[index]) this.inters[index] = []; 
                this.inters[index++].push(Math.round(x));

                x += coeficiente;
            }
        });
    
        this.inters.forEach((line, i) => {
            line.sort((a, b) => a - b);
            this.draw(line, ymin + i, ctx, normal);
        });
    }

    draw(line: number[], y: number, ctx: CanvasRenderingContext2D, normal: number) {
        
        ctx.fillStyle = this.color;
        for (let i = 0; i < line.length; i += 2) {
            const x1 = Math.ceil(line[i]);
            const x2 = Math.floor(line[i + 1]);
            
            for (let x = x1; x <= x2; x++) {
                ctx.fillRect(x, y, 1, 1);
            }
        }
        let arestaCheckbox;
        arestaCheckbox = document.getElementById("aresta");

        if (arestaCheckbox && arestaCheckbox.checked) {
            this.draw_face(ctx, normal);
        }
    }

    draw_face(ctx: CanvasRenderingContext2D, normal: number){       
        for (let i = 0; i < this.dots.length; i++){
            if ( i === this.dots.length-1){
                this.draw_line(this.dots[i], this.dots[0], ctx, normal);
            } else {
                
                this.draw_line(this.dots[i], this.dots[i+1], ctx, normal);
            }
        }
    };

    draw_line(dot0: Dot, dot1: Dot, ctx: CanvasRenderingContext2D, normal: number){
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(dot0.x, dot0.y);
        ctx.lineTo(dot1.x, dot1.y);
        if(normal < 0){
            ctx.strokeStyle = this.line_color;
        } else {
            ctx.strokeStyle = this.other_side_line_color;
        }
        ctx.stroke();
    };
}

class Spline{
    control_points: Array<Dot>;
    mat_control_points: number[][];
    gap = 0.1;
    softness = 1/6;
    matB = [[-1*this.softness, 3*this.softness, -3*this.softness, 1*this.softness],
            [3*this.softness, -6*this.softness, 3*this.softness, 0*this.softness],
            [-3*this.softness, 0*this.softness, 3*this.softness, 0*this.softness],
            [1*this.softness, 4*this.softness, 1*this.softness, 0*this.softness]];
    centroide: Dot;
    
    constructor(arr: Array<Dot>){
        this.control_points = arr;
        this.centroide = this.get_centroide();
        this.mat_control_points = this.get_control_points_as_mat();
    }
    
    calc_curve(t: number){
        let mat_t = [[t**3, t**2, t, 1]]

        let aux = mult_matriz(this.matB, this.mat_control_points);
        
        let mat_return = mult_matriz(mat_t, aux);

        return new Dot(mat_return[0][0], mat_return[0][1], mat_return[0][2]);
        
    }

    create_dots_to_the_entire_curve(t: number){
        let list_dots = this.control_points;
        let quant = 1/t;

        for(let i=0; i < quant; i++){
            
            let new_one = this.calc_curve(t*i)
            
            list_dots.push(new_one);
        }

        return list_dots;
    }

    get_centroide(): Dot{
        let sum_x = 0;
        let sum_y = 0;
        let sum_z = 0;
        for(let i=0; i < this.control_points.length; i++){
            sum_x += this.control_points[i].x;
            sum_y += this.control_points[i].y;
            sum_z += this.control_points[i].z;
        }

        return new Dot(sum_x/this.control_points.length, sum_y/this.control_points.length, sum_z/this.control_points.length);
    }

    get_control_points_as_mat(){
        let mat_aux: number[][];
        mat_aux = [[this.control_points[0].x, this.control_points[0].y, this.control_points[0].z]]

        for(let i=1; i<this.control_points.length; i++){
            mat_aux.push([this.control_points[i].x, this.control_points[i].y, this.control_points[i].z])
        }
        return mat_aux;
    }

    update_mat_control_points(){
        this.mat_control_points = this.get_control_points_as_mat();
    }
}



function get_matriz_escala(x: number): number[][]{
    let mat_aux: number[][];
    mat_aux = ([[x, 0, 0, 0],
                [0, x, 0, 0],
                [0, 0, x, 0],
                [0, 0, 0, 1]])
    return mat_aux;
}

function get_matriz_translada(x: number, y: number, z: number): number[][]{
    let mat_aux: number[][];
    mat_aux = ([[1, 0, 0, x],
                [0, 1, 0, y],
                [0, 0, 1, z],
                [0, 0, 0, 1]])
    return mat_aux;
}

function get_matriz_rot_x(angle: number): number[][] {
    let mat_aux: number[][];
    mat_aux = ([[1, 0, 0, 0],
                [0, Math.cos(angle), -Math.sin(angle), 0],
                [0, Math.sin(angle), Math.cos(angle), 0],
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

function get_matriz_rot_z(angle: number): number[][] {
    let mat_aux: number[][];
    mat_aux = ([[Math.cos(angle), -Math.sin(angle), 0, 0],
                [Math.sin(angle), Math.cos(angle), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]])
    return mat_aux;
}

function VetA_minus_VetB(A: Dot, B: Dot) {
    let x: number, y: number, z: number;
    x = A.x - B.x;
    y = A.y - B.y;
    z = A.z - B.z;

    let C = new Vet(x, y, z);

    return C;
}

function VetA_plus_VetB(A: Dot, B: Dot) { 
    let x: number, y: number, z: number;
    x = A.x + B.x;
    y = A.y + B.y;
    z = A.z + B.z;

    let C = new Vet(x, y, z);

    return C;
}

function prod_escalar(A: Dot, B: Dot){ 
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

function distance_between_dots_screen(A: Dot, B: Dot){
    let aux_x: number = B.x - A.x;
    let aux_y: number = B.y - A.y;
    
    return Math.sqrt(aux_x**2 + aux_y**2);
}

class Aresta {
    p1: Dot;
    p2: Dot;
    Dx: number;
    Dy: number;
    Dz: number;
    tx: number;
    tz: number;

    constructor(p1: Dot, p2: Dot) {
        this.p1 = p1;
        this.p2 = p2;
        this.Dx = p2.x - p1.x;
        this.Dy = p2.y - p1.y;
        this.Dz = p2.z - p1.z;
        this.tx = this.Dx/this.Dy;
        this.tz = this.Dz/this.Dy; 
    }
}
class Lamp {
    il: number; 
    pos: Dot;

    constructor(intensidade_da_fonte: number, x: number, y: number, z: number){
        this.il = intensidade_da_fonte;
        this.pos = new Dot(x, y, z);
    }
}