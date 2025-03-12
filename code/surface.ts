/// <reference path="./spline.ts" />

// import { get } from "lodash";

// import { random } from "lodash"

class Double_Face{
    face: Face;
    face_SRU: Face;

    constructor(normal_face: Face, face_sru: Face){
        this.face = normal_face;
        this.face_SRU = face_sru;
    }
}

class Surface{
    control_points: Dot[][];
    control_points_screen: Dot[][]; // Pontos de controle em coordenadas de tela
    ni: number;
    nj: number;
    ti: number;
    tj: number;
    resi: number;
    resj: number;
    outp: Dot[][];
    // faces: Array<Face>;
    // faces_SRU: Array<Face>;
    double_faces: Array<Double_Face>;
    ka: [number, number, number]; // Material, utilizado no sombreamento
    kd: [number, number, number]; // Material, utilizado no sombreamento
    ks: [number, number, number]; // Material, utilizado no sombreamento
    n: number; // Material, utilizado no sombreamento
    face_color: string;
    other_side_color: string;
    line_color: string;

    constructor(star_x: number, star_y: number, star_z: number, ni: number, nj: number, ti:number, tj:number, resolutioni: number, resolutionj: number, Ka: [number, number, number], Kd: [number, number, number], Ks: [number, number, number], N: number=2.15, face_col: string = "black", other_side_col: string = "red", cor_aresta: string = "blue", cp: Dot[][] = [[new Dot(123, 123, 123)]]){
        this.control_points = Array(ni).fill(null).map(() => Array(nj).fill(new Dot(0,0,0)))
        this.control_points_screen = Array(ni).fill(null).map(() => Array(nj).fill(new Dot(0,0,0)))
        this.outp = Array(resolutioni).fill(null).map(() => Array(resolutionj).fill(new Dot(0,0,0)))
        this.ni = ni;
        this.nj = nj;
        this.ti = ti;
        this.tj = tj;
        this.resi = resolutioni;
        this.resj = resolutionj;
        let counter = 0;
        this.ka = Ka;
        this.kd = Kd;   
        this.ks = Ks;
        this.n = N;
        this.face_color = face_col;
        this.other_side_color = other_side_col;
        this.line_color = cor_aresta;
        this.double_faces = [];

        // console.log(`x = ${star_x}  y = ${star_y}   z = ${star_z}`);
        if(cp.length == 1){
            for(let i=0; i<ni; i++){
                for(let j=0; j<nj; j++){
                    counter++;
                    this.control_points[i][j] = new Dot(i*13+star_x, Math.random()*10+star_y, j*13+star_z);
                }
            }
        } else {
            this.control_points = cp;
        }
        this.generateSurface();
    }

    // callfp(ctx: CanvasRenderingContext2D, vrp: Dot) {
    //     this.faces.forEach((face, i) => {

    //         let normal = prod_escalar(this.faces_SRU[i].get_normal().unitary, new Vet(vrp.x, vrp.y, vrp.z).unitary);

    //         face.fillpoly(ctx, vrp, vrp, normal);
    //     })
    // }

    SplineKnots(u: number[], n: number, t: number): void {
      let j: number;
  
      // Primeiros 't' nós iguais a 0
      for (j = 0; j < t; j++) {
          u[j] = 0;
      }
  
      // Nós intermediários uniformemente distribuídos
      for (; j <= n; j++) {
          u[j] = j - t + 1;
      }
  
      // Últimos 't' nós iguais ao último valor válido
      for (; j <= n + t; j++) {
          u[j] = n - t + 1; // Alterado de "n - t + 2" para "n - t + 1" para evitar fechamento
      }
    }

    SplineBlend(k: number, t: number, u: number[], v: number): number {
        // console.log(`k=${k}, t=${t}, u[k]=${u[k]}, u[k+1]=${u[k+1]}, v=${v}`);
        if (t == 1) {
          return u[k] <= v && v < u[k + 1] ? 1 : 0;
        }
        let value = 0;
        if (u[k + t - 1] !== u[k]) {
          value += (v - u[k]) / (u[k + t - 1] - u[k]) * this.SplineBlend(k, t - 1, u, v);
        }
        if (u[k + t] !== u[k + 1]) {
          value += (u[k + t] - v) / (u[k + t] - u[k + 1]) * this.SplineBlend(k + 1, t - 1, u, v);
        }
        return value;
    }

    generateSurface(): void {
        let intervalI = 0;
        let incrementI = (this.ni - this.ti + 1) / (this.resi - 1);
        let incrementJ = (this.nj - this.tj + 1) / (this.resj - 1);

        let knotsI: number[] = new Array(this.ni + this.ti);
        let knotsJ: number[] = new Array(this.nj + this.tj);
        
        this.SplineKnots(knotsI, this.ni, this.ti);
        this.SplineKnots(knotsJ, this.nj, this.tj);
      
        for (let i = 0; i < this.resi - 1; i++) {
          let intervalJ = 0;
          for (let j = 0; j < this.resj - 1; j++) {
            let x = 0, y = 0, z = 0;
            for (let ki = 0; ki < this.ni; ki++) {
              for (let kj = 0; kj < this.nj; kj++) {
                const bi = this.SplineBlend(ki, this.ti, knotsI, intervalI);
                const bj = this.SplineBlend(kj, this.tj, knotsJ, intervalJ);
                x += this.control_points[ki][kj].x * bi * bj;
                y += this.control_points[ki][kj].y * bi * bj;
                z += this.control_points[ki][kj].z * bi * bj;
              }
            }             
            this.outp[i][j] = new Dot(x, y, z);
            intervalJ += incrementJ;
          }
          intervalI += incrementI;
        }
        incrementI = (this.ni - this.ti + 1) / (this.resi - 1);
        intervalI = 0;
        for (let i = 0; i < this.resi-1; i++) {
            this.outp[i][this.resj - 1] = new Dot(0, 0, 0);
            for (let ki = 0; ki < this.ni; ki++) {
                let bi = this.SplineBlend(ki, this.ti, knotsI, intervalI);
                this.outp[i][this.resj - 1].x += (this.control_points[ki][this.nj-1].x * bi);
                this.outp[i][this.resj - 1].y += (this.control_points[ki][this.nj-1].y * bi);
                this.outp[i][this.resj - 1].z += (this.control_points[ki][this.nj-1].z * bi);
            }
            intervalI += incrementI
        }
        this.outp[this.resi-1][this.resj - 1] = new Dot(this.control_points[this.ni-1][this.nj-1].x, this.control_points[this.ni-1][this.nj-1].y, this.control_points[this.ni-1][this.nj-1].z);

        let intervalJ = 0;
        for (let j = 0; j < this.resj-1; j++) {
            this.outp[this.resi - 1][j] = new Dot(0, 0, 0);
            for (let kj = 0; kj < this.nj; kj++) {
                let bj = this.SplineBlend(kj, this.tj, knotsJ, intervalJ);
                this.outp[this.resi - 1][j].x += (this.control_points[this.ni-1][kj].x * bj);
                this.outp[this.resi - 1][j].y += (this.control_points[this.ni-1][kj].y * bj);
                this.outp[this.resi - 1][j].z += (this.control_points[this.ni-1][kj].z * bj);
            }
            intervalJ += incrementJ;
        }
        this.outp[this.resi - 1][this.resj-1] = new Dot(this.control_points[this.ni-1][this.nj-1].x, this.control_points[this.ni-1][this.nj-1].y, this.control_points[this.ni-1][this.nj-1].z);
        
      }

      displaySurface(): void {
        console.log("LIST");
        console.log("{ = CQUAD");
        for (let i = 0; i < this.resi - 1; i++) {
          for (let j = 0; j < this.resj - 1; j++) {
            console.log(
              `${this.outp[i][j].x} ${this.outp[i][j].y} ${this.outp[i][j].z} 1 1 1 1`,
              `${this.outp[i][j+1].x} ${this.outp[i][j+1].y} ${this.outp[i][j+1].z} 1 1 1 1`,
              `${this.outp[i+1][j+1].x} ${this.outp[i+1][j+1].y} ${this.outp[i+1][j+1].z} 1 1 1 1`,
              `${this.outp[i+1][j].x} ${this.outp[i+1][j].y} ${this.outp[i+1][j].z} 1 1 1 1`
            );
          }
        }
        console.log("}");
      }

    print_all_cp(){
        for(let i=0; i<this.ni; i++){
            for(let j=0; j<this.nj; j++){
                this.control_points[i][j].print_obj("Dots");
            }
        }
    }

// Transforma os pontos em uma matriz normal para a conversao utilizando a matriz_SRU_SRT
    get_cp_as_mat(){
        let mat_aux: number[][] = Array(4).fill(null).map(() => Array((this.ni) * (this.nj)).fill(0));

        for(let x = 0; x < this.ni; x++){
            for(let y = 0; y < this.nj; y++){
                // console.log(`[${x}][${y}] = ${this.control_points[x][y].x}`)
                mat_aux[0][x*this.nj+y] = this.control_points[x][y].x;
                mat_aux[1][x*this.nj+y] = this.control_points[x][y].y;
                mat_aux[2][x*this.nj+y] = this.control_points[x][y].z;
                mat_aux[3][x*this.nj+y] = 1;
                // alert(x+y)
            }
        }
        // print_matriz(mat_aux, "MINHA MATRIZINHA")
        // alert("ESTOPI")
        return mat_aux; 
    }

    get_outp_as_mat(){
        let mat_aux: number[][] = Array(4).fill(null).map(() => Array(this.resi * this.resj).fill(0));

        for(let x = 0; x < this.resi; x++){
            for(let y = 0; y < this.resj; y++){
                mat_aux[0][x*this.resj+y] = this.outp[x][y].x;
                mat_aux[1][x*this.resj+y] = this.outp[x][y].y;
                mat_aux[2][x*this.resj+y] = this.outp[x][y].z;
                mat_aux[3][x*this.resj+y] = 1;
            }
        }
        return mat_aux; 
    }
    

 // A estrutura utilizada para multiplicar a matriz (M_SRU_SRT), pede para que cada "Dot" seja uma coluna e o x, y, z e 1, sejam as linhas, a funcao abaixo faz com que dessa estrutura possamos converter novamente para uma matriz de dots "normal" (Dot[][])
    update_cp_with_mat(normal_mat: number[][]){
        for(let i=0; i<this.ni; i++){
            for(let j=0; j<this.nj; j++){
                this.control_points[i][j].x = normal_mat[0][i*this.nj+j];
                this.control_points[i][j].y = normal_mat[1][i*this.nj+j];
                this.control_points[i][j].z = normal_mat[2][i*this.nj+j];
            }
        }
    }

    update_outp_with_mat(normal_mat: number[][]){
        for(let i=0; i<this.resi; i++){
            for(let j=0; j<this.resj; j++){
                this.outp[i][j].x = normal_mat[0][i*this.resj+j];
                this.outp[i][j].y = normal_mat[1][i*this.resj+j];
                this.outp[i][j].z = normal_mat[2][i*this.resj+j];
            }
        }
    }

    // update_faces_SRU(){
    //     this.faces_SRU = []
    //     for(let i=0; i<this.resi-1; i++){
    //         for(let j=0; j<this.resj-1; j++){
    //             let A = new Dot(this.outp[i][j].x, this.outp[i][j].y, this.outp[i][j].z)

    //             let B = new Dot(this.outp[i+1][j].x, this.outp[i+1][j].y, this.outp[i+1][j].z)

    //             let C = new Dot(this.outp[i+1][j+1].x, this.outp[i+1][j+1].y, this.outp[i+1][j+1].z)

    //             let D = new Dot(this.outp[i][j+1].x, this.outp[i][j+1].y, this.outp[i][j+1].z)

    //             let arr_dots = [A, D, C, B]
    //             this.faces_SRU.push(new Face(arr_dots, this.face_color, this.other_side_color, this.line_color));
    //         }
    //     }
    // }

    create_faces(matriz_SRU_SRT: number[][]){ // Essa funcao foi projetada para ser chamada no momento de plotar, para que tenhamos as coordenadas de tela de cada vértice/face, pois se pegassemos diretamente os pontos sem a conversao SRU_SRT, teriamos as coordenadas de mundo, o que nao traria informações uteis
        let ps = mult_matriz(matriz_SRU_SRT, this.get_outp_as_mat()) // ps = points_screen
        this.double_faces = [];

        for(let i=0; i<this.resi-1; i++){
            for(let j=0; j<this.resj-1; j++){ // A matriz resultado esta em formato diferente do retornado pela operacao de mult de matriz, por isso essa conversao maluca
                let A = new Dot(ps[0][i*this.resj+j]/ps[3][i*this.resj+j], ps[1][i*this.resj+j]/ps[3][i*this.resj+j], ps[2][i*this.resj+j])

                let B = new Dot(ps[0][i*this.resj+(j+1)]/ps[3][i*this.resj+(j+1)], ps[1][i*this.resj+(j+1)]/ps[3][i*this.resj+(j+1)], ps[2][i*this.resj+(j+1)])

                let C = new Dot(ps[0][(i+1)*this.resj+(j+1)]/ps[3][(i+1)*this.resj+(j+1)], ps[1][(i+1)*this.resj+(j+1)]/ps[3][(i+1)*this.resj+(j+1)], ps[2][(i+1)*this.resj+(j+1)])

                let D = new Dot(ps[0][(i+1)*this.resj+j]/ps[3][(i+1)*this.resj+j], ps[1][(i+1)*this.resj+j]/ps[3][(i+1)*this.resj+j], ps[2][(i+1)*this.resj+j])

                let A_2 = new Dot(this.outp[i][j].x, this.outp[i][j].y, this.outp[i][j].z)

                let B_2 = new Dot(this.outp[i][j+1].x, this.outp[i][j+1].y, this.outp[i][j+1].z)

                let C_2 = new Dot(this.outp[i+1][j+1].x, this.outp[i+1][j+1].y, this.outp[i+1][j+1].z)

                let D_2 = new Dot(this.outp[i+1][j].x, this.outp[i+1][j].y, this.outp[i+1][j].z)

                let arr_dots = [A, B, C, D];
                let arr_dots_2 = [A_2, B_2, C_2, D_2];
                this.double_faces.push(new Double_Face(new Face(arr_dots, this.face_color, this.other_side_color, this.line_color), new Face(arr_dots_2, this.face_color, this.other_side_color, this.line_color))); // Cria a face em coordenada de tela e de SRU ao mesmo tempo
            }
        }
    }

    // create_faces(matriz_SRU_SRT: number[][]){ // Essa funcao foi projetada para ser chamada no momento de plotar, para que tenhamos as coordenadas de tela de cada vértice/face, pois se pegassemos diretamente os pontos sem a conversao SRU_SRT, teriamos as coordenadas de mundo, o que nao traria informações uteis
    //     let ps = mult_matriz(matriz_SRU_SRT, this.get_outp_as_mat()) // ps = points_screen
    //     this.faces = [];

    //     for(let i=0; i<this.resi-1; i++){
    //         for(let j=0; j<this.resj-1; j++){ // A matriz resultado esta em formato diferente do retornado pela operacao de mult de matriz, por isso essa conversao maluca
    //             let A = new Dot(ps[0][i*this.resj+j]/ps[3][i*this.resj+j], ps[1][i*this.resj+j]/ps[3][i*this.resj+j], ps[2][i*this.resj+j])

    //             let B = new Dot(ps[0][i*this.resj+(j+1)]/ps[3][i*this.resj+(j+1)], ps[1][i*this.resj+(j+1)]/ps[3][i*this.resj+(j+1)], ps[2][i*this.resj+(j+1)])

    //             let C = new Dot(ps[0][(i+1)*this.resj+(j+1)]/ps[3][(i+1)*this.resj+(j+1)], ps[1][(i+1)*this.resj+(j+1)]/ps[3][(i+1)*this.resj+(j+1)], ps[2][(i+1)*this.resj+(j+1)])

    //             let D = new Dot(ps[0][(i+1)*this.resj+j]/ps[3][(i+1)*this.resj+j], ps[1][(i+1)*this.resj+j]/ps[3][(i+1)*this.resj+j], ps[2][(i+1)*this.resj+j])

    //             let arr_dots = [A, B, C, D]
    //             this.faces.push(new Face(arr_dots, this.face_color, this.other_side_color, this.line_color));
    //         }
    //     }
    // }

    define_dots_screen(matriz_SRU_SRT: number[][]){
        // console.log("Get cp as mat -> ", this.get_cp_as_mat())
        let cp = mult_matriz(matriz_SRU_SRT, this.get_cp_as_mat());

        for(let i=0; i<this.ni; i++){
            for(let j=0; j<this.nj; j++){ // A matriz resultado esta em formato diferente do retornado pela operacao de mult de matriz, por isso essa conversao maluca
                let A = new Dot(cp[0][i*this.nj+j]/cp[3][i*this.nj+j], cp[1][i*this.nj+j]/cp[3][i*this.nj+j], cp[2][i*this.nj+j])
                this.control_points_screen[i][j] = A;
            }
        }
    }

    find_closer_cp_to_dot(click: Dot){
        let closer_i = -1;
        let closer_j = -1;
        let closer_dist = 1000;

        for(let i=0; i<this.ni; i++){
            for(let j=0; j<this.nj; j++){
                let new_dist = distance_between_dots_screen(this.control_points_screen[i][j], click);
                if(new_dist < closer_dist){
                    closer_dist = new_dist;
                    closer_i = i;
                    closer_j = j;
                }
            }
        };
        if(closer_dist > 30){
            closer_dist = 100000;
            closer_i = -1;
            closer_j = -1;
        }
        return [closer_i, closer_j, closer_dist]
    }
}