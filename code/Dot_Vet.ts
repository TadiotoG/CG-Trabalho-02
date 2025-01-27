class Dot{ // Classe para pontos ou vertices
    x: number;
    y: number;
    z: number;

    constructor(new_x: number, new_y: number, new_z: number){
        this.x = new_x;
        this.y = new_y;
        this.z = new_z;
    }

    print_obj(dot_name: string){
        console.log(dot_name + "-> (" + this.x + "," + this.y + "," + this.z + ")")
    }
}

class Vet extends Dot { // Adicionei esta classe para que assim que declarado o vetor, tenhamos ja calculado seus possiveis diferentes atributos, como o vetor unitario...
    unitary: Dot; // Vetor unitario deve ser um Dot, pq se definirmos como um Vet, na sua construcao sera calculado o seu vetor unitario, criando um looping recursivo e infinito...

    constructor (new_x: number, new_y: number, new_z: number){
        super(new_x, new_y, new_z);
        this.unitary = this.get_unitary_vector()
    }

    get_unitary_vector(){
        let norma_A: number;
        norma_A = Math.sqrt(this.x**2 + this.y**2 + this.z**2)
        return new Dot(this.x/norma_A, this.y/norma_A, this.z/norma_A)
    }

    print_obj(vet_name: string){
        console.log(vet_name + "-> (" + this.x + "," + this.y + "," + this.z + ")")
        this.unitary.print_obj("Unitary ")
        console.log()
    }
}