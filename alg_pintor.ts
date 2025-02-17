type Dot = { x: number; y: number; z: number };

type Edge = { x1: number; y1: number; x2: number; y2: number };

function VetA_minus_VetB(a: Dot, b: Dot): Dot {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function prod_vet(a: Dot, b: Dot): Dot {
    return {
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x,
    };
}

function prod_escalar(a: Dot, b: Dot): number {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

function get_unitary_vector(v: Dot): Dot {
    const magnitude = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
    return { x: v.x / magnitude, y: v.y / magnitude, z: v.z / magnitude };
}

function face_visibility(vertices: Dot[], VRP: Dot, centroide: Dot): boolean {
    const A = VetA_minus_VetB(vertices[0], vertices[1]);
    const B = VetA_minus_VetB(vertices[2], vertices[1]);
    
    const N = get_unitary_vector(prod_vet(B, A));
    const O = get_unitary_vector(VetA_minus_VetB(VRP, centroide));
    
    return prod_escalar(O, N) > 0;
}

function calc_distance(centroide: Dot, VRP: Dot): number {
    return Math.sqrt(
        (VRP.x - centroide.x) ** 2 +
        (VRP.y - centroide.y) ** 2 +
        (VRP.z - centroide.z) ** 2
    );
}

class Poly {
    points: Dot[] = [];
    color: string = "rgb(0, 0, 0)";
    arestas: Edge[] = [];
    inters: number[][] = [];
    arestac: number = 0;
    
    addPoint(x: number, y: number, z: number = 0): void {
        this.points.push({ x, y, z });
    }

    containsPoint(x: number, y: number): boolean {
        let inside = false;
        let j = this.points.length - 1;
        
        for (let i = 0; i < this.points.length; i++) {
            const xi = this.points[i].x, yi = this.points[i].y;
            const xj = this.points[j].x, yj = this.points[j].y;

            const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
            j = i;
        }
        
        return inside;
    }

    addAresta(x1: number, y1: number, x2: number, y2: number): void {
        this.arestas.push({ x1, y1, x2, y2 });
    }
    
    cria_arestas(): void {
        this.points.forEach((point, i) => {
            const nextPoint = this.points[(i + 1) % this.points.length];
            this.addAresta(point.x, point.y, nextPoint.x, nextPoint.y);
        });
    }

    swap_arestas(i: number): void {
        [this.arestas[i].x1, this.arestas[i].x2] = [this.arestas[i].x2, this.arestas[i].x1];
        [this.arestas[i].y1, this.arestas[i].y2] = [this.arestas[i].y2, this.arestas[i].y1];
    }

    draw(line: number[], y: number, context: CanvasRenderingContext2D, color: string): void {
        context.fillStyle = color;

        for (let i = 0; i < line.length; i += 2) {
            const x1 = Math.ceil(line[i]);
            const x2 = Math.floor(line[i + 1]);

            for (let x = x1; x <= x2; x++) {
                context.fillRect(x, y, 1, 1);
            }
        }
    }

    fillpoly(ctx: CanvasRenderingContext2D, VRP: Dot, centroide: Dot): void {
        let color = this.color;

        const ymin = Math.min(...this.points.map(p => p.y));
        const ymax = Math.max(...this.points.map(p => p.y));

        this.inters = Array.from({ length: ymax - ymin + 1 }, () => []);

        this.arestas.forEach((aresta, i) => {
            if (aresta.y1 === aresta.y2) return;
            if (aresta.y1 > aresta.y2) this.swap_arestas(i);

            const { x1, y1, x2, y2 } = this.arestas[i];
            const coeficiente = (x2 - x1) / (y2 - y1);

            let x = x1;
            let index = Math.floor(y1 - ymin);

            for (let y = y1; y < y2; y++) {
                this.inters[index++].push(x);
                x += coeficiente;
            }
        });

        this.inters.forEach((line, i) => {
            line.sort((a, b) => a - b);
            this.draw(line, ymin + i, ctx, color);
        });
    }
}