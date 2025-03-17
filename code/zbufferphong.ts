function get_ilum(vrp: Dot, lamp: Lamp, vet_normal: Vet, centroide: Dot, amb_light_par: number, ks: number, kd: number, n: number){
    let amb_light = amb_light_par;
    // console.log("================================================");
    // console.log("Centroide face = ", face);
    // console.log("Lamp x = ", lamp.pos.x);
    let aux_x = lamp.pos.x - centroide.x;
    let aux_y = lamp.pos.y - centroide.y;
    let aux_z = lamp.pos.z - centroide.z;

    let test_vis = new Vet(centroide.x - this.camera.vrp.x, centroide.y - this.camera.vrp.y, centroide.z - this.camera.vrp.z)
    if(prod_escalar(vet_normal.unitary, test_vis.unitary) < 0){
        vet_normal = new Vet(-vet_normal.x, -vet_normal.y, -vet_normal.z)
    }

    let vet_LampMinusCent = new Vet(aux_x, aux_y, aux_z);
    // vet_LampMinusCent.print_obj("Lamp - Centroide");

    let UN_times_UL = prod_escalar(vet_LampMinusCent.unitary, vet_normal.unitary)
    // console.log("vet_normal = ", vet_normal.unitary);

    if(UN_times_UL > 0){
        let ilum_difusa = lamp.il * kd * UN_times_UL;

        aux_x = 2*UN_times_UL*vet_normal.unitary.x-vet_LampMinusCent.unitary.x;
        aux_y = 2*UN_times_UL*vet_normal.unitary.y-vet_LampMinusCent.unitary.y;
        aux_z = 2*UN_times_UL*vet_normal.unitary.z-vet_LampMinusCent.unitary.z;

        let idk_r = new Vet(aux_x, aux_y, aux_z);
        // idk_r.print_obj("Vet r")

        aux_x = vrp.x-centroide.x;
        aux_y = vrp.y-centroide.y;
        aux_z = vrp.z-centroide.z;

        let direcao_observ = new Vet(aux_x, aux_y, aux_z);
        // direcao_observ.print_obj("Direcao observ");

        let r_escalar_dir_obs = prod_escalar(idk_r.unitary, direcao_observ.unitary);
        // console.log("r.s -> ", r_escalar_dir_obs)
        if(r_escalar_dir_obs > 0){
            // console.log("R escalar dir ", r_escalar_dir_obs);

            let is = lamp.il*ks*r_escalar_dir_obs**n;
            // console.log("k ", ks, "    n -> ", n)
            // console.log("is -> ", is)
            // console.log(`${r_escalar_dir_obs} ** ${n} = ${r_escalar_dir_obs**n}`)
            // console.log("Cor = ", String((amb_light + ilum_difusa + is)));
            // console.log(`${amb_light} + ${ilum_difusa} + ${is}`);

            let result = Math.round(amb_light + ilum_difusa + is);
            return result.toString(10);
        } else {
            let result = Math.round(amb_light + ilum_difusa);
            return result.toString(10);
        }
        
    } else {
        return amb_light.toString(10);
    }
}