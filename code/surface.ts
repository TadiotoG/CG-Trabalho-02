/// <reference path= "./spline.ts" />

// import { get } from "lodash";

// import { random } from "lodash"

class Surface{
    control_points: Dot[][];
    resolution: [number, number];

    constructor(res: [number, number]){
        this.control_points = Array(res[0]).fill(null).map(() => Array(res[1]).fill(new Dot(4,5,6)))
        this.resolution = res;
        for(let i=0; i<res[0]; i++){
            for(let j=0; j<res[1]; j++){
                // console.log(i + " <- i     j ->" + j);
                // this.control_points[i][j].x = i;
                // this.control_points[i][j].y = j;
                // this.control_points[i][j].z = Math.random()*10;
                this.control_points[i][j] = new Dot(i*7, Math.random()*10, j*7);
                console.log(i + "," + j + " DOT = "+ "(" + this.control_points[i][j].x + ", " + this.control_points[i][j].y + ", " + this.control_points[i][j].z + ")")
            }
        }
        this.control_points[0][0].print_obj("Dots");
        this.control_points[0][1].print_obj("Dots");
        this.control_points[1][0].print_obj("Dots");
        this.control_points[1][1].print_obj("Dots");
        print_matriz(this.get_cp_as_mat(), "INFERNO")
    }

    print_all_cp(){
        for(let i=0; i<this.resolution[0]; i++){
            for(let j=0; j<this.resolution[1]; j++){
                this.control_points[i][j].print_obj("Dots");
            }
        }
    }

// Transforma os pontos em uma matriz normal para a conversao utilizando a matriz_SRU_SRT
    get_cp_as_mat(){
        let mat_aux: number[][] = Array(4).fill(null).map(() => Array(this.resolution[0] * this.resolution[1]).fill(2));

        for(let x = 0; x < this.resolution[0]; x++){
            for(let y = 0; y < this.resolution[1]; y++){
                mat_aux[0][x*this.resolution[0]+y] = this.control_points[x][y].x;
                mat_aux[1][x*this.resolution[0]+y] = this.control_points[x][y].y;
                mat_aux[2][x*this.resolution[0]+y] = this.control_points[x][y].z;
                mat_aux[3][x*this.resolution[0]+y] = 1;
                // alert(x+y)
            }
        }
        // print_matriz(mat_aux, "MINHA MATRIZINHA")
        // alert("ESTOPI")
        return mat_aux; 
    }
    

 // A estrutura utilizada para multiplicar a matriz (M_SRU_SRT), pede para que cada "Dot" seja uma coluna e o x, y, z e 1, sejam as linhas, a funcao abaixo faz com que dessa estrutura possamos converter novamente para uma matriz de dots "normal" (Dot[][])
    update_cp_with_mat(normal_mat: number[][]){
        for(let i=0; i<this.resolution[0]; i++){
            for(let j=0; j<this.resolution[1]; j++){
                this.control_points[i][j].x = normal_mat[0][i*this.resolution[0]+j];
                this.control_points[i][j].y = normal_mat[1][i*this.resolution[0]+j];
                this.control_points[i][j].z = normal_mat[2][i*this.resolution[0]+j];
            }
        }
    }
}