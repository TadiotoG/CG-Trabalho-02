/// <reference path="./universe.ts" />
// Todas as funcoes call, sao os gatilhos disponiveis no front, que chamam funcoes do back
function call_create_surface() {
    var aux;
    aux = document.getElementById("new_surface");
    aux.style = "display: flex;";
}
function call_alter_properties() {
    alter_prop = true;
    translada_surface = false;
    selecting_dot = false;
    remove_surf = false;
    escala_surface = false;
    rotaciona_surface = false;
    msg_click_appears();
}
function call_translada_surface() {
    translada_surface = true;
    selecting_dot = false;
    remove_surf = false;
    escala_surface = false;
    rotaciona_surface = false;
    alter_prop = false;
    msg_click_appears();
}
function call_escala_surface() {
    escala_surface = true;
    translada_surface = false;
    selecting_dot = false;
    remove_surf = false;
    rotaciona_surface = false;
    alter_prop = false;
    msg_click_appears();
}
function call_rotaciona_surface() {
    rotaciona_surface = true;
    translada_surface = false;
    selecting_dot = false;
    escala_surface = false;
    remove_surf = false;
    alter_prop = false;
    msg_click_appears();
}
function call_change_dot() {
    selecting_dot = true;
    translada_surface = false;
    remove_surf = false;
    escala_surface = false;
    rotaciona_surface = false;
    alter_prop = false;
    msg_click_appears();
}
function call_remove_surf() {
    remove_surf = true;
    translada_surface = false;
    selecting_dot = false;
    escala_surface = false;
    rotaciona_surface = false;
    alter_prop = false;
    msg_click_appears();
}
function open_wind_change_dot() {
    var aux;
    aux = document.getElementById("change_dot");
    aux.style = "display: flex;";
}
function open_wind_trans_surface() {
    var aux;
    aux = document.getElementById("trans_surf");
    aux.style = "display: flex;";
}
function open_wind_escala_surface() {
    var aux;
    aux = document.getElementById("escala_surf");
    aux.style = "display: flex;";
}
function open_wind_rotaciona_surface() {
    var aux;
    aux = document.getElementById("rotaciona_surf");
    aux.style = "display: flex;";
}
function open_wind_alter_prop() {
    var aux;
    aux = document.getElementById("wind_alter_prop");
    aux.style = "display: flex;";
}
function open_window_change_dot() {
    var aux;
    aux = document.getElementById("change_dot");
    aux.style = "display: flex;";
}
function window_translada_s_disappears() {
    var aux;
    aux = document.getElementById("trans_surf");
    aux.style = "display: none;";
}
function window_rotaciona_s_disappears() {
    var aux;
    aux = document.getElementById("rotaciona_surf");
    aux.style = "display: none;";
}
function window_alter_prop_disappears() {
    var aux;
    aux = document.getElementById("wind_alter_prop");
    aux.style = "display: none;";
}
function window_escala_s_disappears() {
    var aux;
    aux = document.getElementById("escala_surf");
    aux.style = "display: none;";
}
function window_create_s_disappears() {
    var aux;
    aux = document.getElementById("new_surface");
    aux.style = "display: none;";
}
function window_change_dot_disappears() {
    var aux;
    aux = document.getElementById("change_dot");
    aux.style = "display: none;";
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
    aux = document.getElementById("lamp_x");
    lamp_x = aux.value;
    aux = document.getElementById("lamp_y");
    lamp_y = aux.value;
    aux = document.getElementById("lamp_z");
    lamp_z = aux.value;
    aux = document.getElementById("lamp_intensidade");
    lamp_intensidade = aux.value;
    aux = document.getElementById("window_width");
    wind_width = aux.value;
    aux = document.getElementById("window_height");
    wind_height = aux.value;
    aux = document.getElementById("amb_light_r");
    luz_ambiente[0] = aux.value;
    aux = document.getElementById("amb_light_g");
    luz_ambiente[1] = aux.value;
    aux = document.getElementById("amb_light_b");
    luz_ambiente[2] = aux.value;
    // let perspCheckBox;
    // perspCheckBox = document.getElementById("persp");
    // if (perspCheckBox && perspCheckBox.checked) {
    //     flag_persp = true;
    // } else {
    //     flag_persp = false;
    // }
    canvas.style.width = wind_width.toString(10) + "px";
    canvas.style.height = wind_height.toString(10) + "px";
    canvas.width = wind_width;
    canvas.height = wind_height;
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
    aux = document.getElementById("ka_verm");
    ka[0] = aux.value;
    aux = document.getElementById("ka_verde");
    ka[1] = aux.value;
    aux = document.getElementById("ka_azul");
    ka[2] = aux.value;
    aux = document.getElementById("ks_verm");
    ks[0] = aux.value;
    aux = document.getElementById("ks_verde");
    ks[1] = aux.value;
    aux = document.getElementById("ks_azul");
    ks[2] = aux.value;
    aux = document.getElementById("kd_verm");
    kd[0] = aux.value;
    aux = document.getElementById("kd_verde");
    kd[1] = aux.value;
    aux = document.getElementById("kd_azul");
    kd[2] = aux.value;
    aux = document.getElementById("face_color");
    face_color = aux.value;
    aux = document.getElementById("other_side_color");
    other_side_color = aux.value;
    aux = document.getElementById("aresta_color");
    cor_aresta = aux.value;
}
function get_values_alter_prop() {
    var aux;
    aux = document.getElementById("alter_prop_res_i");
    res_i = Number(aux.value);
    aux = document.getElementById("alter_prop_res_j");
    res_j = Number(aux.value);
    aux = document.getElementById("alter_prop_ka_verm");
    ka[0] = aux.value;
    aux = document.getElementById("alter_prop_ka_verde");
    ka[1] = aux.value;
    aux = document.getElementById("alter_prop_ka_azul");
    ka[2] = aux.value;
    aux = document.getElementById("alter_prop_ks_verm");
    ks[0] = aux.value;
    aux = document.getElementById("alter_prop_ks_verde");
    ks[1] = aux.value;
    aux = document.getElementById("alter_prop_ks_azul");
    ks[2] = aux.value;
    aux = document.getElementById("alter_prop_kd_verm");
    kd[0] = aux.value;
    aux = document.getElementById("alter_prop_kd_verde");
    kd[1] = aux.value;
    aux = document.getElementById("alter_prop_kd_azul");
    kd[2] = aux.value;
    aux = document.getElementById("alter_face_color");
    face_color = aux.value;
    aux = document.getElementById("alter_other_side_color");
    other_side_color = aux.value;
    aux = document.getElementById("alter_aresta_color");
    cor_aresta = aux.value;
}
function msg_click_appears() {
    var mensagem;
    mensagem = document.getElementById("mensagem_clique"); // Pega o valor do input no html 
    mensagem.style = "transition: opacity 0.4s ease-in-out;";
    mensagem.style.opacity = "1"; // Torna visível
    setTimeout(function () {
        mensagem.style = "transition: opacity 4s ease-in-out;";
        mensagem.style.opacity = "0"; // Desvanece após 5 segundos
    }, 400);
}
function alter_cp_by_click(universe, A) {
    var vet_aux;
    vet_aux = get_dot_and_surface_by_click(universe, A);
    if (vet_aux[1] == -1) {
        alert("Não foi encontrado nenhum ponto de controle próximo ao local clicado!");
    }
    else {
        aux_surf = vet_aux[0];
        aux_dot_x = vet_aux[1];
        aux_dot_y = vet_aux[2];
        var aux = void 0;
        aux = document.getElementById("change_dot_x");
        aux.value = Math.round(universe.surfaces[aux_surf].control_points[aux_dot_x][aux_dot_y].x);
        aux = document.getElementById("change_dot_y");
        aux.value = Math.round(universe.surfaces[aux_surf].control_points[aux_dot_x][aux_dot_y].y);
        aux = document.getElementById("change_dot_z");
        aux.value = Math.round(universe.surfaces[aux_surf].control_points[aux_dot_x][aux_dot_y].z);
        open_wind_change_dot(); // Abre a janela de alteracao das coordenadas de ponto de controle
    }
    selecting_dot = false;
}
function remove_surface_by_click(universe, A) {
    var vet_aux = get_dot_and_surface_by_click(universe, A);
    if (vet_aux[1] == -1) {
        alert("Não foi encontrado nenhuma superfície próximo ao local clicado!");
    }
    else {
        universe.surfaces.splice(vet_aux[0], 1); // Remove a superficie na pos vet_aux[0]
        change_world();
    }
    remove_surf = false;
}
function translada_surface_by_click(universe, A) {
    var vet_aux = get_dot_and_surface_by_click(universe, A);
    if (vet_aux[1] == -1) {
        alert("Não foi encontrado nenhuma superfície próximo ao local clicado!");
    }
    else {
        aux_surf = vet_aux[0];
        aux_dot_x = vet_aux[1];
        aux_dot_y = vet_aux[2];
        open_wind_trans_surface();
    }
    translada_surface = false;
}
function escala_surface_by_click(universe, A) {
    var vet_aux = get_dot_and_surface_by_click(universe, A);
    if (vet_aux[1] == -1) { // Se o usuario clicar nao clicar próximo o suficiente
        alert("Não foi encontrado nenhuma superfície próximo ao local clicado!");
    }
    else {
        aux_surf = vet_aux[0];
        aux_dot_x = vet_aux[1];
        aux_dot_y = vet_aux[2];
        open_wind_escala_surface();
    }
    escala_surface = false;
}
function rotaciona_surface_by_click(universe, A) {
    var vet_aux = get_dot_and_surface_by_click(universe, A);
    if (vet_aux[1] == -1) {
        alert("Não foi encontrado nenhuma superfície próximo ao local clicado!");
    }
    else {
        aux_surf = vet_aux[0];
        aux_dot_x = vet_aux[1];
        aux_dot_y = vet_aux[2];
        open_wind_rotaciona_surface();
    }
    rotaciona_surface = false;
}
function alter_prop_by_click(universe, A) {
    var vet_aux = get_dot_and_surface_by_click(universe, A);
    if (vet_aux[1] == -1) {
        alert("Não foi encontrado nenhuma superfície próximo ao local clicado!");
    }
    else {
        aux_surf = vet_aux[0];
        aux_dot_x = vet_aux[1];
        aux_dot_y = vet_aux[2];
        var aux = void 0;
        aux = document.getElementById("alter_prop_ka_verm");
        aux.value = (universe.surfaces[aux_surf].ka[0]);
        aux = document.getElementById("alter_prop_ka_verde");
        aux.value = (universe.surfaces[aux_surf].ka[1]);
        aux = document.getElementById("alter_prop_ka_azul");
        aux.value = (universe.surfaces[aux_surf].ka[2]);
        aux = document.getElementById("alter_prop_kd_verm");
        aux.value = (universe.surfaces[aux_surf].kd[0]);
        aux = document.getElementById("alter_prop_kd_verde");
        aux.value = (universe.surfaces[aux_surf].kd[1]);
        aux = document.getElementById("alter_prop_kd_azul");
        aux.value = (universe.surfaces[aux_surf].kd[2]);
        aux = document.getElementById("alter_prop_ks_verm");
        aux.value = (universe.surfaces[aux_surf].ks[0]);
        aux = document.getElementById("alter_prop_ks_verde");
        aux.value = (universe.surfaces[aux_surf].ks[1]);
        aux = document.getElementById("alter_prop_ks_azul");
        aux.value = (universe.surfaces[aux_surf].ks[2]);
        open_wind_alter_prop();
    }
    alter_prop = false;
}
function alter_prop_func() {
    console.log("Quantas superficies -> " + uni.surfaces.length);
    get_values_alter_prop();
    var aux;
    aux = uni.surfaces[aux_surf];
    console.log("Passo 0 -> " + uni.surfaces.length);
    uni.surfaces.splice(aux_surf, 1);
    console.log("Passo 1 -> " + uni.surfaces.length);
    uni.add_surface(aux);
    console.log("Passo 2 -> " + uni.surfaces.length);
    aux_surf = uni.surfaces.length - 1;
    var new_surface = new Surface(0, 0, 0, uni.surfaces[aux_surf].ni, uni.surfaces[aux_surf].nj, 3, 3, res_i, res_j, ka, kd, ks, n, face_color, other_side_color, cor_aresta, uni.surfaces[aux_surf].control_points);
    uni.surfaces.splice(aux_surf, 1);
    console.log("Passo 3 -> " + uni.surfaces.length);
    uni.add_surface(new_surface);
    console.log("Passo 4 -> " + uni.surfaces.length);
    change_world();
    // window_alter_prop_disappears();
    console.log("QUantas superficies depois -> " + uni.surfaces.length);
}
function change_dot() {
    var aux;
    aux = document.getElementById("change_dot_x");
    var my_x = aux.value;
    aux = document.getElementById("change_dot_y");
    var my_y = aux.value;
    aux = document.getElementById("change_dot_z");
    var my_z = aux.value;
    uni.surfaces[aux_surf].control_points[aux_dot_x][aux_dot_y] = new Dot(my_x, my_y, my_z);
    window_change_dot_disappears();
    uni.surfaces[aux_surf].generateSurface();
    change_world();
}
function create_surface() {
    get_values_new_surface();
    var surface_01 = new Surface(star_x, star_y, star_z, amount_cp_i, amount_cp_j, 3, 3, res_i, res_j, ka, kd, ks, n, face_color, other_side_color, cor_aresta);
    uni.add_surface(surface_01);
    change_world();
    window_create_s_disappears();
}
function translada_surf() {
    var aux_x;
    aux_x = document.getElementById("trans_surf_x");
    var my_x = Number(aux_x.value);
    var aux_y;
    aux_y = document.getElementById("trans_surf_y");
    var my_y = Number(aux_y.value);
    var aux_z;
    aux_z = document.getElementById("trans_surf_z");
    var my_z = Number(aux_z.value);
    uni.multiply_and_update_cp(aux_surf, get_matriz_translada(my_x, my_y, my_z));
    window_translada_s_disappears();
    uni.surfaces[aux_surf].generateSurface();
    change_world();
    aux_x.value = 0;
    aux_y.value = 0;
    aux_z.value = 0;
}
function escala_surf() {
    var aux;
    aux = document.getElementById("escala");
    var my_x = Number(aux.value);
    uni.multiply_and_update_cp(aux_surf, get_matriz_escala(my_x));
    window_escala_s_disappears();
    uni.surfaces[aux_surf].generateSurface();
    change_world();
    aux.value = 1;
}
function rotaciona_surf() {
    var aux_x;
    aux_x = document.getElementById("rotaciona_surf_x");
    var my_x = Number(aux_x.value);
    var aux_y;
    aux_y = document.getElementById("rotaciona_surf_y");
    var my_y = Number(aux_y.value);
    var aux_z;
    aux_z = document.getElementById("rotaciona_surf_z");
    var my_z = Number(aux_z.value);
    var mat_comp = mult_matriz(get_matriz_rot_x(my_x), get_matriz_rot_y(my_y));
    mat_comp = mult_matriz(get_matriz_rot_z(my_z), mat_comp);
    uni.multiply_and_update_cp(aux_surf, mat_comp);
    window_rotaciona_s_disappears();
    uni.surfaces[aux_surf].generateSurface();
    change_world();
    aux_x.value = 0;
    aux_y.value = 0;
    aux_z.value = 0;
}
function get_dot_and_surface_by_click(universe, A) {
    var x_closer = -1; // Salva qual ponto é na coordenada x,y
    var y_closer = -1;
    var which_surf = -1; // Salva em qual superficie esta o ponto mais perto
    var closer_dist = 10000; // Salva a menor distancia
    for (var i = 0; i < universe.surfaces.length; i++) {
        universe.surfaces[i].define_dots_screen(universe.matriz_SRU_SRT);
        var pos = universe.surfaces[i].find_closer_cp_to_dot(A);
        if (pos[2] < closer_dist) {
            which_surf = i;
            x_closer = pos[0];
            y_closer = pos[1];
            closer_dist = pos[2];
        }
    }
    return [which_surf, x_closer, y_closer];
}
function change_world() {
    erase_canvas();
    get_values_to_cam();
    get_shading();
    // console.log(`X = ${cam_x} Y = ${cam_y} Z = ${cam_z}`);
    var my_lamp = new Lamp(lamp_intensidade, lamp_x, lamp_y, lamp_z);
    var list_of_surfaces = uni.surfaces;
    vrp_camera = new Dot(cam_x, cam_y, cam_z);
    focal_point_camera = new Dot(focal_x, focal_y, focal_z);
    distance_point = 240;
    // camera = new Camera(vrp_camera, focal_point_camera, distance_point, 0, 0, canvas_width, canvas_height, flag_persp);
    camera = new Camera(vrp_camera, focal_point_camera, distance_point, 0, 0, canvas_width, canvas_height);
    zbuffer = new ZBuffer(wind_width, wind_height);
    uni = new Universe(ctx, camera, my_lamp, luz_ambiente, zbuffer, wind_width, wind_height);
    for (var i = 0; i < list_of_surfaces.length; i++) {
        uni.surfaces = list_of_surfaces;
        uni.surfaces[i].create_faces(uni.matriz_SRU_SRT);
        // uni.cut_surface_nocolor(uni.surfaces[i]);
        uni.surfaces[i].update_faces_SRU();
    }
    if (shading() == "const") {
        uni.update_all_face_colors_constant();
        uni.calc_zbuffer();
        uni.plot_zbuffer();
    }
    else {
        uni.render(vrp_camera);
    }
    var ControlPointsCheckbox;
    ControlPointsCheckbox = document.getElementById("check_control_p");
    if (ControlPointsCheckbox && ControlPointsCheckbox.checked) {
        for (var i = 0; i < list_of_surfaces.length; i++) {
            uni.draw_cp(uni.surfaces[i]);
        }
    }
}
function erase_canvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, wind_width, wind_height);
}
function get_shading() {
    shading = function () {
        var selectedRadio = document.querySelector('input[name="shading"]:checked');
        return selectedRadio ? selectedRadio.value : null;
    };
}
var canvas = document.createElement("canvas");
canvas.id = "canvas-giratorio";
canvas.style.backgroundColor = "white";
canvas.style.border = "1px solid black";
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
var el;
el = document.querySelector("canvas");
el.addEventListener("click", function (e) {
    var rect = e.target.getBoundingClientRect();
    var x = Math.floor(e.clientX - rect.left);
    var y = Math.floor(e.clientY - rect.top);
    if (selecting_dot) { // Esse emaranhado de ifs, dao conta de qual funcionalidade envolvendo selecao por click esta sendo feita
        alter_cp_by_click(uni, new Dot(x, y, 0));
    }
    else if (remove_surf) {
        remove_surface_by_click(uni, new Dot(x, y, 0));
    }
    else if (translada_surface) {
        translada_surface_by_click(uni, new Dot(x, y, 0));
    }
    else if (escala_surface) {
        escala_surface_by_click(uni, new Dot(x, y, 0));
    }
    else if (rotaciona_surface) {
        rotaciona_surface_by_click(uni, new Dot(x, y, 0));
    }
    else if (alter_prop) {
        alter_prop_by_click(uni, new Dot(x, y, 0));
    }
    ;
});
var main = document.getElementById("main");
main.appendChild(canvas);
var translada_surface = false; // Quando essa var for true, vai ser possível clicar na tela e selecionar com base nos pontos de controle e alterar uma propriedade da superficie
var escala_surface = false; // Quando essa var for true, vai ser possível clicar na tela e selecionar com base nos pontos de controle e alterar uma propriedade da superficie
var rotaciona_surface = false; // Quando essa var for true, vai ser possível clicar na tela e selecionar com base nos pontos de controle e alterar uma propriedade da superficie
var selecting_dot = false; // Quando essa var for true, vai ser possível clicar na tela e selecionar com base nos pontos de controle e alterar uma propriedade da superficie
var remove_surf = false; // Quando essa var for true, vai ser possível clicar na tela e selecionar com base nos pontos de controle e alterar uma propriedade da superficie
var alter_prop = false; // Quando essa var for true, vai ser possível clicar na tela e selecionar com base nos pontos de controle e alterar uma propriedade da superficie
var aux_surf; // Variavel usada como memoria na hora de alterar a coord de um ponto de controle
var aux_dot_x; // Variavel usada como memoria na hora de alterar a coord de um ponto de controle
var aux_dot_y; // Variavel usada como memoria na hora de alterar a coord de um ponto de controle
var cam_x;
var cam_y;
var cam_z;
var focal_x;
var focal_y;
var focal_z;
var lamp_x;
var lamp_y;
var lamp_z;
var lamp_intensidade;
var wind_width;
var wind_height;
var luz_ambiente;
luz_ambiente = [0, 0, 0]; // Luz ambiente RGB
// ka kd e ks dos materias sobre RGB
var ka;
ka = [0.4, 0.4, 0.4];
var kd;
kd = [0.7, 0.7, 0.7];
var ks;
ks = [0.5, 0.5, 0.5];
var n;
var face_color; // Cor das faces para o pintor
var other_side_color; // Cor do lado de baixo das faces para pintor
var cor_aresta;
var shading;
var flag_persp;
get_shading();
get_values_to_cam();
var zbuffer = new ZBuffer(wind_width, wind_height);
var vrp_camera = new Dot(cam_x, cam_y, cam_z);
var focal_point_camera = new Dot(focal_x, focal_y, focal_z);
var distance_point = 240;
// var camera = new Camera(vrp_camera, focal_point_camera, distance_point, 0, 0, wind_width, wind_height, flag_persp);
var camera = new Camera(vrp_camera, focal_point_camera, distance_point, 0, 0, wind_width, wind_height);
var uni = new Universe(ctx, camera, new Lamp(lamp_intensidade, lamp_x, lamp_y, lamp_z), luz_ambiente, zbuffer, wind_width, wind_height);
var star_x;
var star_y;
var star_z;
var amount_cp_i;
var amount_cp_j;
var res_i;
var res_j;
create_surface();
var ControlPointsCheckbox;
ControlPointsCheckbox = document.getElementById("check_control_p");
if (ControlPointsCheckbox && ControlPointsCheckbox.checked) {
    uni.draw_cp(uni.surfaces[0]);
}
change_world();
