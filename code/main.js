/// <reference path= "./universe.ts" />
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
var dot_x;
var dot_y;
var dot_z;
get_values_from_html();
var vrp_camera = new Dot(cam_x, cam_y, cam_z);
var focal_point_camera = new Dot(0, 0, 0);
var distance_point = 240;
var camera = new Camera(vrp_camera, focal_point_camera, distance_point, 0, 0, canvas_width, canvas_height);
var uni = new Universe(ctx, camera);
create_world();
function create_world() {
    erase_canvas();
    var surface_01 = new Surface(4, 4, 3, 3, 30, 30);
    surface_01.generateSurface();
    uni.add_surface(surface_01);
}
function change_world() {
    erase_canvas();
    get_values_from_html();
    // console.log(`X = ${cam_x} Y = ${cam_y} Z = ${cam_z}`);
    var list_of_surfaces = uni.surfaces;
    vrp_camera = new Dot(cam_x, cam_y, cam_z);
    focal_point_camera = new Dot(0, 0, 0);
    distance_point = 240;
    camera = new Camera(vrp_camera, focal_point_camera, distance_point, 0, 0, canvas_width, canvas_height);
    uni = new Universe(ctx, camera);
    for (var i = 0; i < list_of_surfaces.length; i++) {
        uni.surfaces = list_of_surfaces;
        uni.surfaces[i].create_faces(uni.matriz_SRU_SRT);
        uni.draw_whole_surface(uni.surfaces[i]);
    }
}
function erase_canvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas_width, canvas_height);
}
function get_values_from_html() {
    var aux;
    aux = document.getElementById("cam_y"); // Pega o valor do input no html 
    cam_y = aux.value;
    aux = document.getElementById("cam_x");
    cam_x = aux.value;
    aux = document.getElementById("cam_z");
    cam_z = aux.value;
}
// uni.animate_world();
