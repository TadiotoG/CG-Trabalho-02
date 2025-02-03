/// <reference path= "./universe.ts" />

const canvas = document.createElement("canvas")
canvas.id = "canvas-giratorio"
canvas.style.backgroundColor = "white"
canvas.style.border = "1px solid black"
canvas.style.width = "1000px"
canvas.style.height = "800px"
var ctx = canvas.getContext("2d")
canvas.width = 800;
canvas.height = 800;
ctx.imageSmoothingEnabled = false;
document.body.appendChild(canvas);

let vrp_camera = new Dot(0, 0.7, 1);
let focal_point_camera = new Dot(0, 0, 0);
let distance_point = 240;

let camera = new Camera(vrp_camera, focal_point_camera, distance_point, 0, 0, canvas_width, canvas_height);
// constructor(view_reference_point: Dot, focal_p: Dot, dp: number, wid: number, heig: number, min_x: number, min_y: number, max_x: number, max_y: number){
let uni = new Universe(ctx, camera);

// let A = new Dot(-10, -20, 10);
// let B = new Dot(10, -20, 10);
// let C = new Dot(7, 20, 10);
// let D = new Dot(-7, 20, 10);
// let E = new Dot(10, -20, -10);
// let F = new Dot(7, 20, -10);
// let G = new Dot(-7, 20, -10);
// let H = new Dot(-10, -20, -10);

// let pyramid_dots: Array<Dot>;
// pyramid_dots = [A, B, C, D, E, F, G, H];

// let pyramid = new Obj_3D("blue", pyramid_dots);

// uni.add_obj(pyramid);


let A = new Dot(-7.5, -0.75, 2.25);
let B = new Dot(-3.5, -4.75, 6.25);
let C = new Dot(3.5, 4.25, -9.75);
let D = new Dot(7.5, 1.25, 1.25);

let E = new Dot(16, 10, -5);
let F = new Dot(16, 10, -20);

let control_dots: Array<Dot>;
let other_dots: Array<Dot>;
let control_dots_2: Array<Dot>; 
let control_dots_3: Array<Dot>; 
control_dots = [A, B, C, D];
control_dots_2 = [B, C, D, E];
control_dots_3 = [C, D, E, F];

other_dots = [B, D, A, C]

let spline = new Spline(control_dots);
let spline_2 = new Spline(control_dots_2);
let spline_3 = new Spline(control_dots_3);

let other = new Spline(other_dots);

let surface_01 = new Surface(4, 4, 3, 3, 30, 30);
// print_matriz(surface_01.get_cp_as_mat(), "Teste 01")

// uni.add_obj_spline(spline);

surface_01.generateSurface();
// print_matriz(surface_01.get_outp_as_mat(), "Teste 02")

// surface_01.displaySurface();
// uni.add_obj_spline(spline_2);
// uni.add_obj_spline(spline_3);
// uni.add_obj_spline(other);
uni.add_surface(surface_01);
uni.animate_world();