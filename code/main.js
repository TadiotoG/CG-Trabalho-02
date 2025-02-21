/// <reference path= "./universe.ts" />
function call_create_surface() {
    var aux;
    aux = document.getElementById("new_surface");
    aux.style = "display: flex;";
}
function window_create_s_disappears() {
    var aux;
    aux = document.getElementById("new_surface");
    aux.style = "display: none;";
}
function create_surface() {
    get_values_new_surface();
    var surface_01 = new Surface(star_x, star_y, star_z, amount_cp_i, amount_cp_j, 3, 3, res_i, res_j);
    surface_01.generateSurface();
    uni.add_surface(surface_01);
    uni.draw_cp(surface_01);
    window_create_s_disappears();
}
function change_world() {
    erase_canvas();
    get_values_to_cam();
    // console.log(`X = ${cam_x} Y = ${cam_y} Z = ${cam_z}`);
    var list_of_surfaces = uni.surfaces;
    vrp_camera = new Dot(cam_x, cam_y, cam_z);
    focal_point_camera = new Dot(focal_x, focal_y, focal_z);
    distance_point = 240;
    camera = new Camera(vrp_camera, focal_point_camera, distance_point, 0, 0, canvas_width, canvas_height);
    uni = new Universe(ctx, camera);
    for (var i = 0; i < list_of_surfaces.length; i++) {
        uni.surfaces = list_of_surfaces;
        uni.surfaces[i].create_faces(uni.matriz_SRU_SRT);
        uni.draw_whole_surface(uni.surfaces[i]);
        uni.draw_cp(uni.surfaces[i]);
    }
}
function erase_canvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas_width, canvas_height);
}
function get_values_to_cam() {
    var aux;
    aux = document.getElementById("cam_y"); // Pega o valor do input no html 
    cam_y = aux.value;
    aux = document.getElementById("cam_x");
    cam_x = aux.value;
    aux = document.getElementById("cam_z");
    cam_z = aux.value;
    aux = document.getElementById("focal_x");
    focal_x = aux.value;
    aux = document.getElementById("focal_y");
    focal_y = aux.value;
    aux = document.getElementById("focal_z");
    focal_z = aux.value;
    aux = document.getElementById("distance_point");
    distance_point = aux.value;
}
function get_values_new_surface() {
    var aux;
    aux = document.getElementById("surface_begin_x"); // Pega o valor do input no html 
    star_x = Number(aux.value);
    aux = document.getElementById("surface_begin_y");
    star_y = Number(aux.value);
    aux = document.getElementById("surface_begin_z");
    star_z = Number(aux.value);
    aux = document.getElementById("cp_i");
    amount_cp_i = Number(aux.value);
    aux = document.getElementById("cp_j");
    amount_cp_j = Number(aux.value);
    aux = document.getElementById("res_i");
    res_i = Number(aux.value);
    aux = document.getElementById("res_j");
    res_j = Number(aux.value);
}
var canvas = document.createElement("canvas");
canvas.id = "canvas-giratorio";
canvas.style.backgroundColor = "white";
canvas.style.border = "1px solid black";
canvas.style.width = "1000px";
canvas.style.height = "800px";
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 800;
ctx.imageSmoothingEnabled = false;
var main = document.getElementById("main");
main.appendChild(canvas);
var cam_x;
var cam_y;
var cam_z;
var focal_x;
var focal_y;
var focal_z;
var distance_point;
get_values_to_cam();
var vrp_camera = new Dot(cam_x, cam_y, cam_z);
var focal_point_camera = new Dot(focal_x, focal_y, focal_z);
var distance_point = 240;
var camera = new Camera(vrp_camera, focal_point_camera, distance_point, 0, 0, canvas_width, canvas_height);
var uni = new Universe(ctx, camera);
var star_x;
var star_y;
var star_z;
var amount_cp_i;
var amount_cp_j;
var res_i;
var res_j;
create_surface();
