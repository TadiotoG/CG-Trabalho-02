

// function prod_escalar(A, B){ // Passagem de parametros utilizando Dot, pois como Dot é a classe pai, utilizando a classe filho tambem funciona (polimorfismo), isso serve para que caso seja necessario fazer prod_escalar de Dot com Vet, funcionara...
//     return (A.x * B.x + A.y * B.y + A.z * B.z);
// }

// function prod_vet(A, B){
//     let prod_x = A.y * B.z - A.z * B.y;
//     let prod_y = A.z * B.x - A.x * B.z;
//     let prod_z = A.x * B.y - A.y * B.x;

//     let C = new Vet(prod_x, prod_y, prod_z);
//     return C;
// }


// class Lamp {
//     il; // Intensidade da fonte luminosa
//     pos;

//     constructor(intensidade_da_fonte, x, y, z){
//         this.il = intensidade_da_fonte;
//         this.pos = new Dot(x, y, z);
//     }
// }

// class Dot{ // Classe para pontos ou vertices
//     x;
//     y;
//     z;
//     color;
//     gouraud;
//     r_gouraud;
//     g_gouraud;
//     b_gouraud;

//     constructor(new_x, new_y, new_z, col = "red", r_gou = 0, g_gou = 0, b_gou = 0){
//         this.x = new_x;
//         this.y = new_y;
//         this.z = new_z;
//         this.color = col;
//         this.r_gouraud = r_gou;
//         this.g_gouraud = g_gou;
//         this.b_gouraud = b_gou;
//     }

//     print_obj(dot_name){
//         console.log(dot_name + "-> (" + this.x + "," + this.y + "," + this.z + ")")
//     }
// }

// class Vet extends Dot { // Adicionei esta classe para que assim que declarado o vetor, tenhamos ja calculado seus possiveis diferentes atributos, como o vetor unitario...
//     unitary; // Vetor unitario deve ser um Dot, pq se definirmos como um Vet, na sua construcao sera calculado o seu vetor unitario, criando um looping recursivo e infinito...

//     constructor (new_x, new_y, new_z){
//         super(new_x, new_y, new_z);
//         this.unitary = this.get_unitary_vector()
//     }

//     get_unitary_vector(){
//         let norma_A;
//         norma_A = Math.sqrt(this.x**2 + this.y**2 + this.z**2);
//         return new Dot(this.x/norma_A, this.y/norma_A, this.z/norma_A);
//     }

//     print_obj(vet_name){
//         console.log(vet_name + "-> (" + this.x + "," + this.y + "," + this.z + ")");
//         this.unitary.print_obj("Unitary ");
//         console.log();
//     }
// }


// function test_ilum(){
//     let vet_normal = new Vet(0.669, 0.378, 0.639);
//     let centroide = new Dot(25.1, 8.333, 33.700);
//     let amb_light = 48;
//     let lamp = new Lamp(150, 70, 20, 35);
//     let ka = 0.4;
//     let kd = 0.7;
//     let ks = 0.5;
//     let n = 2.15;
//     let vrp = new Dot(25, 15, 80);
//     console.log("Result -> ", get_ilum(vrp, lamp, vet_normal, centroide, amb_light, ks, kd, n));
// };
// //  get_ilum(vet_normal, centroide: Dot, amb_light_par: number, ks: number, kd: number, n: number)

// function get_ilum(vrp, lamp, vet_normal, centroide, amb_light_par, ks, kd, n){
//     let amb_light = amb_light_par;
//     // console.log("================================================");
//     // console.log("Centroide face = ", face);
//     // console.log("Lamp x = ", lamp.pos.x);
//     let aux_x = lamp.pos.x - centroide.x;
//     let aux_y = lamp.pos.y - centroide.y;
//     let aux_z = lamp.pos.z - centroide.z;

//     // let test_vis = new Vet(centroide.x - this.camera.vrp.x, centroide.y - this.camera.vrp.y, centroide.z - this.camera.vrp.z)
//     // if(prod_escalar(vet_normal.unitary, test_vis.unitary) < 0){
//     //     vet_normal = new Vet(-vet_normal.x, -vet_normal.y, -vet_normal.z)
//     // }

//     let vet_LampMinusCent = new Vet(aux_x, aux_y, aux_z);
//     // vet_LampMinusCent.print_obj("Lamp - Centroide");

//     let UN_times_UL = prod_escalar(vet_LampMinusCent.unitary, vet_normal.unitary)
//     console.log("UN times UL ", UN_times_UL, "  <  0");
//     // console.log("vet_normal = ", vet_normal.unitary);

//     if(UN_times_UL > 0){
//         let ilum_difusa = lamp.il * kd * UN_times_UL;
//         console.log("Ilumincao difusa: ", ilum_difusa)

//         aux_x = 2*UN_times_UL*vet_normal.unitary.x-vet_LampMinusCent.unitary.x;
//         aux_y = 2*UN_times_UL*vet_normal.unitary.y-vet_LampMinusCent.unitary.y;
//         aux_z = 2*UN_times_UL*vet_normal.unitary.z-vet_LampMinusCent.unitary.z;

//         let idk_r = new Vet(aux_x, aux_y, aux_z);
//         // idk_r.print_obj("Vet r")

//         aux_x = vrp.x-centroide.x;
//         aux_y = vrp.y-centroide.y;
//         aux_z = vrp.z-centroide.z;

//         let direcao_observ = new Vet(aux_x, aux_y, aux_z);
//         // direcao_observ.print_obj("Direcao observ");

//         let r_escalar_dir_obs = prod_escalar(idk_r.unitary, direcao_observ.unitary);
//         console.log("r.s -> ", r_escalar_dir_obs)
//         if(r_escalar_dir_obs > 0){
//             // console.log("R escalar dir ", r_escalar_dir_obs);

//             let is = lamp.il*ks*r_escalar_dir_obs**n;
//             // console.log("k ", ks, "    n -> ", n)
//             // console.log("is -> ", is)
//             // console.log(`${r_escalar_dir_obs} ** ${n} = ${r_escalar_dir_obs**n}`)
//             // console.log("Cor = ", String((amb_light + ilum_difusa + is)));
//             // console.log(`${amb_light} + ${ilum_difusa} + ${is}`);

//             let result = Math.round(amb_light + ilum_difusa + is);
//             return result.toString(10);
//         } else {
//             let result = Math.round(amb_light + ilum_difusa);
//             return result.toString(10);
//         }
        
//     } else {
//         console.log("UN times UL ", UN_times_UL, "  <  0");
//         return amb_light.toString(10);
//     }
// }

// test_ilum();