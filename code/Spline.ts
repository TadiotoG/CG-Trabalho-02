class Dot{ // Classe para pontos ou vertices
    x: number;
    y: number;
    z: number;
    color: string;
    gouraud: Vet;
    r_gouraud: number;
    g_gouraud: number;
    b_gouraud: number;

    constructor(new_x: number, new_y: number, new_z: number, col: string = "red"){
        this.x = new_x;
        this.y = new_y;
        this.z = new_z;
        this.color = col;
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
    color_other_side: string = "red";
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
        this.color_other_side = other_side_col;
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
    
        // Pegamos três pontos da face
        let P0 = this.dots[0];
        let P1 = this.dots[1];
        let P2 = this.dots[2];

        // Criamos os vetores
        let v1 = new Vet(P1.x - P0.x, P1.y - P0.y, P1.z - P0.z);
        let v2 = new Vet(P2.x - P0.x, P2.y - P0.y, P2.z - P0.z);
    
        // Produto vetorial v1 x v2
        let normal_x = v1.y * v2.z - v1.z * v2.y;
        let normal_y = v1.z * v2.x - v1.x * v2.z;
        let normal_z = v1.x * v2.y - v1.y * v2.x;
    
        // Criamos o vetor normal
        let normal = new Vet(normal_x, normal_y, normal_z);
    
        // Normalizamos o vetor para que ele seja unitário
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
        // console.log("Cor da face -> ", this.color)

     //   this.cria_arestas();
    
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
        if(normal < 0){
            ctx.fillStyle = this.color_other_side;
        } else {
            ctx.fillStyle = this.color;
        }

        // console.log("COLOR -> ", this.color)
        // ctx.fillStyle = this.color;
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
            this.draw_face(ctx);
        }
    }

    draw_face(ctx: CanvasRenderingContext2D){       
        for (let i = 0; i < this.dots.length; i++){
            if ( i === this.dots.length-1){
                this.draw_line(this.dots[i], this.dots[0], this.line_color, ctx);
            } else {
                // let h = 3;
                this.draw_line(this.dots[i], this.dots[i+1], this.line_color, ctx);
            }
        }
    };

    draw_line(dot0: Dot, dot1: Dot, color, ctx: CanvasRenderingContext2D){
        ctx.beginPath();
        ctx.moveTo(dot0.x, dot0.y);
        ctx.lineTo(dot1.x, dot1.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
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
        // print_matriz(this.mat_control_points, "Control Points");
        // print_matriz(this.matB, "Mat_b");
        // print_matriz(mat_t, "Mat_t");
        // this.centroide.print_obj("Centroide");
        let mat_return = mult_matriz(mat_t, aux);

        return new Dot(mat_return[0][0], mat_return[0][1], mat_return[0][2]);
        // return mat_return;
    }

    create_dots_to_the_entire_curve(t: number){
        let list_dots = this.control_points;
        let quant = 1/t;

        for(let i=0; i < quant; i++){
            // console.log("T = " + t*i)
            let new_one = this.calc_curve(t*i)
            // new_one.print_obj("Pontos");
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

// let H = new Dot(-7.5, -0.75, 2.25);
// let I = new Dot(-3.5, -4.75, 6.25);
// let J = new Dot(3.5, 4.25, -9.75);
// let K = new Dot(7.5, 1.25, 1.25);

// let control_dots: Array<Dot>; 
// control_dots = [H, I, J, K];

// let spline = new Spline(control_dots);

// print_matriz(get_ArrDots_as_mat(spline.control_points), "Spline");

// print_matriz(spline.calc_curve(0.1), "Result");

// Abaixo foram implementadas funções uteis para manipulação de matrizes ou vetores

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

class ZBuffer {
    scanline: Map<number, Array<Dot>>; // HashMap para armazenar os valores
    width: number;
    height: number;
    depthBuffer: number[][];
    colorBuffer: string[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.scanline = new Map(); // Inicializa o HashMap
        this.depthBuffer = Array.from({ length: height }, () => Array(width).fill(100000000));
        this.colorBuffer = Array.from({ length: height }, () => Array(width).fill('#FFFFFF'));
    }

    rasterizePolygon(face: Face) {
        this.Scanline([face]);
    }

    Scanline(faces: Array<Face>) {
        let gambiarra = false;
        let y_original;
        let z_original;
        for (const face of faces) {
            for (let i = 0; i < face.dots.length; i++) {
                let Dx, Dy, Dz, Tx, Tz;
                const next_i = (i + 1) % face.dots.length;
                
                
                if(i===0){
                    y_original = face.dots[0].y;//para ele nunca mudar de valor
                    z_original = face.dots[0].z;
                }
                

                //console.log(y_original);
                //console.log(next_i)

                if (face.dots[i].y === face.dots[next_i].y) {
                    continue;
                }

                //face.dots[i].x = Math.round(face.dots[i].x);
                
                

                const start = face.dots[i].y < face.dots[next_i].y ? face.dots[i] : face.dots[next_i];
                const end = face.dots[i].y < face.dots[next_i].y ? face.dots[next_i] : face.dots[i];
                if(!gambiarra){
                    
                    if(next_i == 0){//para o caso de ser o ultimo ponto, ele não troca de valor dai
                        Dx = end.x - start.x;
                        Dy = end.y - y_original;
                        Dz = end.z - z_original;
                        

                        Tx = Dx / Dy;

                        Tz = Dz / Dy;
                    }else{
                        
                        Dx = end.x - start.x;
                        Dy = end.y - start.y;
                        Dz = end.z - start.z;


                        Tx = Dx / Dy;

                        Tz = Dz / Dy;
                    }

                    gambiarra = true;

                }
                console.log(`Dx = ${Dx.toFixed(3)}, Dy = ${Dy.toFixed(3)}, Dz = ${Dz.toFixed(3)}, Tx = ${Tx.toFixed(3)}, Tz = ${Tz.toFixed(3)}`);

                face.dots[i].y = Math.round(face.dots[i].y);

                let x = start.x;
                let z = start.z;

                for (let y = start.y; y < end.y; y++) {
                    // Adiciona ao HashMap de scanlines
                    this.updateHash(y, x, z, start.color);

                    x += Tx;
                    z += Tz;
                }
                gambiarra = false
            }
        }
        //console.log(this.scanline);
    }

    updateHash(y: number, x: number, z: number, color: string) {

        if (!this.scanline.has(y)) { 
            this.scanline.set(y, []);
        }
        
        let listaDePontos = this.scanline.get(y);

        let novoPonto = new Dot(x, y, z, color);

        listaDePontos!.push(novoPonto);
        
    }

    Zbuffer() {

        this.scanline.forEach((points, y) => {
        
            //console.log(`Y = ${y}:`);
            points.sort((a, b) => a.x - b.x); // Ordena pela coordenada x

            // Após a ordenação, podemos atualizar o scanline
            this.scanline.set(y, points);
        })

        this.scanline.forEach((points, y) => {
            
            
            for (let i = 0; i < points.length; i += 2) {
                const next_i = (i + 1) % face.dots.length;
                let z1 = points[i].z;
                
                const z2 = points[next_i].z;
                //console.log(points[i].x, points[i+1].x, points[i].z, points[i+1].z);
                
                const dz = (z2 - z1) / (points[next_i].x - points[i].x);
                // console.log(dz);
                
                const dR = (points[next_i].r_gouraud - points[i].r_gouraud) / (points[next_i].x - points[i].x);
                const dG = (points[next_i].g_gouraud - points[i].g_gouraud) / (points[next_i].x - points[i].x);
                const dB = (points[next_i].b_gouraud - points[i].b_gouraud) / (points[next_i].x - points[i].x);
                
                const x1 = Math.ceil(points[i].x);
                const x2 = Math.floor(points[next_i].x);

                
                let R = points[i].r_gouraud;
                let G = points[i].g_gouraud;
                let B = points[i].b_gouraud;

                


                for (let x = x1; x <= x2; x++) {
                    this.AtualizaBuffer(z1, points[i].r_gouraud, points[i].g_gouraud, points[i].b_gouraud, x, y);
                    z1 += dz;
                    R += dR;
                    G += dG;
                    B += dB;
                }
            }
        });

        //console.log(this.depthBuffer[0][150]);
        

        //console.log(this.scanline);
    }

    AtualizaBuffer(constant_z: number, new_R: number, new_G: number, new_B: number, x: number, y: number){
        //console.log(constant_z);
        if (constant_z < this.depthBuffer[y][x]) {
            this.depthBuffer[y][x] = constant_z;
            //console.log(this.depthBuffer[y][x]);
            
            this.colorBuffer[y][x] = `rgb(${new_R}, ${new_G}, ${new_B})`;
            //console.log(this.colorBuffer[y][x]);
            //console.log(this.depthBuffer);
        }
    }
}


 const face = new Face([
    new Dot(319.000, 160.774, -51.524, "rgb(118, 92, 0)"), // B'
    new Dot(190.427, 0.000, -48.792, "rgb(64, 90, 7)"),   // B''
    new Dot(149.864, 0.000, -46.762, "rgb(48, 0, 0)"),   // E''
    new Dot(151.303, 239.000, -41.331, "rgb(48, 0, 0)"), // E'
    new Dot(319.000, 239.000, -49.722, "rgb(117, 89, 6)") // A''
]);

const zBuffer = new ZBuffer(238, 304);
zBuffer.Scanline([face]);
zBuffer.Zbuffer();
//console.log(zBuffer.scanline)



function Recorte (face: Face, umin: number, umax: number, vmin: number, vmax: number) {


    // console.log("Entrou")
    let pontos = face.dots;
    let arestas: Aresta[] = [];

    for (let i = 0; i < pontos.length; i++) {
        if (i + 1 < pontos.length) {
            arestas.push(new Aresta(pontos[i], pontos[i + 1]));
        } else {
            arestas.push(new Aresta(pontos[i], pontos[0]));
        }}

    let recorteEsquerda = pontos.some(ponto => ponto.x < umin);

    //verificar recorte esquerda
    if(recorteEsquerda){
        let novasArestas: Aresta[] = [];
        let novosPontos: Dot[] = [];

        arestas.forEach(arestas => {
            let p1 = arestas.p1;
            let p2 = arestas.p2;
            let u;
        
            if (p1.x < umin && p2.x >= umin) { //adentra recorte
                u = (umin - p1.x) / (p2.x - p1.x);
                let x = umin;
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);
                
                let Paux = new Dot(x, y, z);

                if(Paux.x == p2.x && Paux.y == p2.y){
                    novosPontos.push(p2);
                }else{
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                }
                }

            if(p1.x >= umin && p2.x >= umin) {//os dois pontos estão dentro do recorte
                novosPontos.push(p2);
            }

            if(p1.x >= umin && p2.x < umin) {//sai do recorte
                u = (umin - p1.x) / (p2.x - p1.x);
                let x = umin;
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Dot(x, y, z);
                novosPontos.push(Paux);
            }
        });
        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
            }}

        arestas = novasArestas;
        pontos = novosPontos;
    }

    let recorteDireita = pontos.some(ponto => ponto.x > umax);

    //verificar recorte direita
    if(recorteDireita){
        let novasArestas: Aresta[] = [];
        let novosPontos: Dot[] = [];

        arestas.forEach(aresta => {
            let p1 = aresta.p1;
            let p2 = aresta.p2;
            let u;
        
            if (p1.x > umax && p2.x < umax) {//adentra recorte

                u = (umax - p1.x) / (p2.x - p1.x);
                let x = umax;
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Dot(x, y, z);
                if(Paux.x == p2.x && Paux.y == p2.y){
                    novosPontos.push(p2);
                }else{
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                }

            }

            if(p1.x <= umax && p2.x <= umax) {//os dois pontos estão dentro do recorte
                novosPontos.push(p2);
            }

            if(p1.x < umax && p2.x > umax) {//sai do recorte
                u = (umax - p1.x) / (p2.x - p1.x);
                let x = umax;
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Dot(x, y, z);
                novosPontos.push(Paux);
            }
        });

        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
            }}

        arestas = novasArestas;
        pontos = novosPontos;
    }

    let recorteInferior = pontos.some(ponto => ponto.y > vmax);
    //verificar recorte inferior
    if(recorteInferior){

        let novosPontos: Dot[] = []
        let novasArestas: Aresta[] = [];
        arestas.forEach(aresta => {
            let p1 = aresta.p1;
            let p2 = aresta.p2;
            let u;
        
            if (p1.y > vmax && p2.y <= vmax) {//adentra recorte
                u = (vmax - p1.y) / (p2.y - p1.y);
                let y = vmax;  
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Dot(x, y, z);
                if(Paux.x == p2.x && Paux.y == p2.y){
                    novosPontos.push(p2);
                }else{
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                }
            }

            if(p1.y <= vmax && p2.y <= vmax) {//os dois pontos estão dentro do recorte
                novosPontos.push(p2);

            }

            if(p1.y <= vmax && p2.y > vmax) {//sai do recorte
                u = (vmax - p1.y) / (p2.y - p1.y);
                let y = vmax;
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Dot(x, y, z);
                novosPontos.push(Paux);
            }
        });
        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
            }}

        arestas = novasArestas;
        pontos = novosPontos;
    }
    let recorteSuperior = pontos.some(ponto => ponto.y < vmin);
    //verificar recorte superior
    if(recorteSuperior){
        let novosPontos: Dot[] = [];
        let novasArestas: Aresta[] = [];

        arestas.forEach(aresta => {
            let p1 = aresta.p1;
            let p2 = aresta.p2;
            let u;
        
            if (p1.y < vmin && p2.y >= vmin) {//adentra recorte
                u = (vmin - p1.y) / (p2.y - p1.y);
                let y = vmin;  
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Dot(x, y, z);
                if(Paux.x == p2.x && Paux.y == p2.y){
                    novosPontos.push(p2);
                    
                }else{
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                }
            }

            if(p1.y >= vmin && p2.y >= vmin) {//os dois pontos estão dentro do recorte
                novosPontos.push(p2);
            }

            if(p1.y >= vmin && p2.y < vmin) {//sai do recorte
                u = (vmin - p1.y) / (p2.y - p1.y);
                let y = vmin;
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);

                let Paux = new Dot(x, y, z);
                novosPontos.push(Paux);
            }
        });

        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
            }}

        arestas = novasArestas;
        pontos = novosPontos;
    }
    return new Face(pontos, face.color, face.color_other_side, face.line_color);
}

function RecorteWithColor(face: Face, umin: number, umax: number, vmin: number, vmax: number): Face {
    umin = Number(umin);
    umax = Number(umax);
    vmin = Number(vmin);
    vmax = Number(vmax);

    let pontos = face.dots;
    let arestas: Aresta[] = [];

    for (let i = 0; i < pontos.length; i++) {
        if (i + 1 < pontos.length) {
            arestas.push(new Aresta(pontos[i], pontos[i + 1]));
        } else {
            arestas.push(new Aresta(pontos[i], pontos[0]));
        }
    }

    let recorteEsquerda = pontos.some(ponto => ponto.x < umin);

    // Verificar recorte esquerda
    if (recorteEsquerda) {
        let novasArestas: Aresta[] = [];
        let novosPontos: Dot[] = [];

        arestas.forEach(aresta => {
            let p1 = aresta.p1;
            let p2 = aresta.p2;
            let u;

            if (p1.x < umin && p2.x >= umin) { // Adentra recorte
                u = (umin - p1.x) / (p2.x - p1.x);
                let x = umin;
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);
                let color = interpolateColor(p1.color, p2.color, u);

                let Paux = new Dot(x, y, z, color);

                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos.push(p2);
                } else {
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                }
            }

            if (p1.x >= umin && p2.x >= umin) { // Os dois pontos estão dentro do recorte
                novosPontos.push(p2);
            }

            if (p1.x >= umin && p2.x < umin) { // Sai do recorte
                u = (umin - p1.x) / (p2.x - p1.x);
                let x = umin;
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);
                let color = interpolateColor(p1.color, p2.color, u);

                let Paux = new Dot(x, y, z, color);
                novosPontos.push(Paux);
            }
        });

        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
            }
        }

        arestas = novasArestas;
        pontos = novosPontos;
    }

    let recorteDireita = pontos.some(ponto => ponto.x > umax);

    // Verificar recorte direita
    if (recorteDireita) {
        let novasArestas: Aresta[] = [];
        let novosPontos: Dot[] = [];

        arestas.forEach(aresta => {
            let p1 = aresta.p1;
            let p2 = aresta.p2;
            let u;

            if (p1.x > umax && p2.x < umax) { // Adentra recorte
                u = (umax - p1.x) / (p2.x - p1.x);
                let x = umax;
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);
                let color = interpolateColor(p1.color, p2.color, u);

                let Paux = new Dot(x, y, z, color);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos.push(p2);
                } else {
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                }
            }

            if (p1.x <= umax && p2.x <= umax) { // Os dois pontos estão dentro do recorte
                novosPontos.push(p2);
            }

            if (p1.x < umax && p2.x > umax) { // Sai do recorte
                u = (umax - p1.x) / (p2.x - p1.x);
                let x = umax;
                let y = p1.y + u * (p2.y - p1.y);
                let z = p1.z + u * (p2.z - p1.z);
                let color = interpolateColor(p1.color, p2.color, u);

                let Paux = new Dot(x, y, z, color);
                novosPontos.push(Paux);
            }
        });

        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
            }
        }

        arestas = novasArestas;
        pontos = novosPontos;
    }

    let recorteInferior = pontos.some(ponto => ponto.y > vmax);

    // Verificar recorte inferior
    if (recorteInferior) {
        let novosPontos: Dot[] = [];
        let novasArestas: Aresta[] = [];

        arestas.forEach(aresta => {
            let p1 = aresta.p1;
            let p2 = aresta.p2;
            let u;

            if (p1.y > vmax && p2.y <= vmax) { // Adentra recorte
                u = (vmax - p1.y) / (p2.y - p1.y);
                let y = vmax;
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);
                let color = interpolateColor(p1.color, p2.color, u);

                let Paux = new Dot(x, y, z, color);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos.push(p2);
                } else {
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                }
            }

            if (p1.y <= vmax && p2.y <= vmax) { // Os dois pontos estão dentro do recorte
                novosPontos.push(p2);
            }

            if (p1.y <= vmax && p2.y > vmax) { // Sai do recorte
                u = (vmax - p1.y) / (p2.y - p1.y);
                let y = vmax;
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);
                let color = interpolateColor(p1.color, p2.color, u);

                let Paux = new Dot(x, y, z, color);
                novosPontos.push(Paux);
            }
        });

        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
            }
        }

        arestas = novasArestas;
        pontos = novosPontos;
    }

    let recorteSuperior = pontos.some(ponto => ponto.y < vmin);

    // Verificar recorte superior
    if (recorteSuperior) {
        let novosPontos: Dot[] = [];
        let novasArestas: Aresta[] = [];

        arestas.forEach(aresta => {
            let p1 = aresta.p1;
            let p2 = aresta.p2;
            let u;

            if (p1.y < vmin && p2.y >= vmin) { // Adentra recorte
                u = (vmin - p1.y) / (p2.y - p1.y);
                let y = vmin;
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);
                let color = interpolateColor(p1.color, p2.color, u);

                let Paux = new Dot(x, y, z, color);
                if (Paux.x == p2.x && Paux.y == p2.y) {
                    novosPontos.push(p2);
                } else {
                    novosPontos.push(Paux);
                    novosPontos.push(p2);
                }
            }

            if (p1.y >= vmin && p2.y >= vmin) { // Os dois pontos estão dentro do recorte
                novosPontos.push(p2);
            }

            if (p1.y >= vmin && p2.y < vmin) { // Sai do recorte
                u = (vmin - p1.y) / (p2.y - p1.y);
                let y = vmin;
                let x = p1.x + u * (p2.x - p1.x);
                let z = p1.z + u * (p2.z - p1.z);
                let color = interpolateColor(p1.color, p2.color, u);

                let Paux = new Dot(x, y, z, color);
                novosPontos.push(Paux);
            }
        });

        for (let i = 0; i < novosPontos.length; i++) {
            if (i + 1 < novosPontos.length) {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[i + 1]));
            } else {
                novasArestas.push(new Aresta(novosPontos[i], novosPontos[0]));
            }
        }

        arestas = novasArestas;
        pontos = novosPontos;
    }

    return new Face(pontos, face.color, face.color_other_side, face.line_color);
}

function interpolateColor(color1: string, color2: string, t: number): string {
    const c1 = color1.match(/\d+/g).map(Number);
    const c2 = color2.match(/\d+/g).map(Number);

    const r = Math.round(c1[0] + t * (c2[0] - c1[0]));
    const g = Math.round(c1[1] + t * (c2[1] - c1[1]));
    const b = Math.round(c1[2] + t * (c2[2] - c1[2]));

    return `rgb(${r}, ${g}, ${b})`;
}

class Lamp {
    il: number; // Intensidade da fonte luminosa
    pos: Dot;

    constructor(intensidade_da_fonte: number, x: number, y: number, z: number){
        this.il = intensidade_da_fonte;
        this.pos = new Dot(x, y, z);
    }
}