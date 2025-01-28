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

let vrp_camera = new Dot(0, 0, 1);
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


let H = new Dot(-7.5, -0.75, 2.25);
let I = new Dot(-3.5, -4.75, 6.25);
let J = new Dot(3.5, 4.25, -9.75);
let K = new Dot(7.5, 1.25, 1.25);

let control_dots: Array<Dot>; 
control_dots = [H, I, J, K];

let spline = new Spline(control_dots);

uni.add_obj_spline(spline);
uni.animate_world();