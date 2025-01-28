/// <reference path= "camera.ts" />

// class Obj_3D{
//     dots: Array<Dot>;
//     mat_dots: number[][];
//     color: string;
//     centroide: Dot;

//     constructor(new_color: string, dots_array: Array<Dot>){
//         this.color = new_color;
//         this.dots = [];
//         this.dots = dots_array;
//         this.mat_dots = this.get_mat_from_dots();
//         this.centroide = this.get_centroide();
//     }

//     get_mat_from_dots(): number[][]{
//         let mat_aux: number[][] = Array(4).fill(null).map(() => Array(this.dots.length).fill(0));

//         for(let i = 0; i < this.dots.length; i++){
//             mat_aux[0][i] = this.dots[i].x;
//             mat_aux[1][i] = this.dots[i].y;
//             mat_aux[2][i] = this.dots[i].z;
//             mat_aux[3][i] = 1;
//         }

//         return mat_aux;
//     }

//     get_centroide(): Dot{
//         let sum_x = 0;
//         let sum_y = 0;
//         let sum_z = 0;
//         for(let i=0; i < this.dots.length; i++){
//             sum_x += this.dots[i].x;
//             sum_y += this.dots[i].y;
//             sum_z += this.dots[i].z;
//         }

//         return new Dot(sum_x/this.dots.length, sum_y/this.dots.length, sum_z/this.dots.length);
//     }

//     update_centroide(): void {
//         this.centroide = this.get_centroide();
//     }
// }

let canvas_width = 800;
let canvas_height = 800;

class Universe { // Deve ser atraves dessa classe que a comunicacao com o front-end deve ser feita
    ctx: CanvasRenderingContext2D;
    matriz_SRU_SRT: number[][];
    camera: Camera;
    objects: Array<Spline> = []; // TROCAR POR SPLINE

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
            new_matriz_obj = mult_matriz(get_matriz_rot_y(0.007), this.get_mat_from_list_of_dots(this.objects[i].control_points)); // Faz a animacao rotacionando o objeto no eixo y
            let new_dots = this.get_dots_from_mat(new_matriz_obj); // Precisa fazer isso, pq a matriz dos pontos de controle são diferentes da matriz dos vertices dos objetos
            this.objects[i].control_points = new_dots;
            this.objects[i].update_mat_control_points();
        }
        requestAnimationFrame(this.animate_world);
    }

    draw_dot(x, y, color){
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.arc(x, y, 2, 0, 360, false);
        this.ctx.fill();
    }

    draw_obj(obj: Spline){
        let points: number[][];
        // points = mult_matriz(this.matriz_SRU_SRT, obj.mat_control_points);

        let curve_as_mat_dots = this.get_mat_from_list_of_dots(obj.create_dots_to_the_entire_curve(0.01));

        points = mult_matriz(this.matriz_SRU_SRT, curve_as_mat_dots);

        for(let i = 0; i < points[0].length; i++){
            this.draw_dot(points[0][i] / points[3][i], points[1][i] / points[3][i], "black"); // Divide pelo fator homogenio
        }
    }

    add_obj_spline(obj: Spline){
        this.objects.push(obj);
    }

    get_mat_from_list_of_dots(arr_dots: Array<Dot>): number[][]{
        let mat_aux: number[][] = Array(4).fill(null).map(() => Array(arr_dots.length).fill(0));
        for(let i = 0; i < arr_dots.length; i++){
            mat_aux[0][i] = arr_dots[i].x;
            mat_aux[1][i] = arr_dots[i].y;
            mat_aux[2][i] = arr_dots[i].z;
            mat_aux[3][i] = 1;
        }
        return mat_aux;
    }

    get_dots_from_mat(mat: number[][]){
        let list_d: Array<Dot>;
        list_d = [new Dot(mat[0][0], mat[1][0], mat[2][0])]
        for(let i=1; i < mat.length; i++){
            list_d.push(new Dot(mat[0][i], mat[1][i], mat[2][i]));
        }
        return list_d;
    }
}