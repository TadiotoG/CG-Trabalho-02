import * as fs from 'fs';

class Vertex {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Edge {
    start: Vertex;
    end: Vertex;
    dx: number;
    dy: number;
    dz: number;
    tx: number;
    tz: number;

    constructor(start: Vertex, end: Vertex) {
        this.start = start;
        this.end = end;
        this.dx = end.x - start.x;
        this.dy = end.y - start.y;
        this.dz = end.z - start.z;
        this.tx = this.dx / this.dy;
        this.tz = this.dz / this.dy;
    }
}

class Polygon {
    vertices: Vertex[];
    color: string;

    constructor(vertices: Vertex[], color: string) {
        this.vertices = vertices;
        this.color = color;
    }

    getEdges(): Edge[] {
        const edges: Edge[] = [];
        for (let i = 0; i < this.vertices.length; i++) {
            const start = this.vertices[i];
            const end = this.vertices[(i + 1) % this.vertices.length];
            edges.push(new Edge(start, end));
        }
        return edges;
    }
}

class ZBuffer {
    width: number;
    height: number;
    depthBuffer: number[][];
    colorBuffer: string[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.depthBuffer = Array.from({ length: height }, () => Array(width).fill(Infinity));
        this.colorBuffer = Array.from({ length: height }, () => Array(width).fill('#000000')); // Default background color
    }

    initializeBuffers() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.depthBuffer[y][x] = Infinity;
                this.colorBuffer[y][x] = '#000000'; // Default background color
            }
        }
    }

    updateBuffer(x: number, y: number, z: number, color: string) {
        if (z < this.depthBuffer[y][x]) {
            this.depthBuffer[y][x] = z;
            this.colorBuffer[y][x] = color;
        }
    }

    render(polygons: Polygon[]) {
        this.initializeBuffers();
        for (const polygon of polygons) {
            this.rasterizePolygon(polygon);
        }
    }

    rasterizePolygon(polygon: Polygon) {
        const edges = polygon.getEdges();
        const activeEdges: Edge[] = [];

        // Find ymin and ymax of the polygon
        let ymin = Infinity;
        let ymax = -Infinity;
        for (const vertex of polygon.vertices) {
            if (vertex.y < ymin) ymin = vertex.y;
            if (vertex.y > ymax) ymax = vertex.y;
        }

        // Prepare to write to file
        const logFile = 'scanline_log.txt';
        const logStream = fs.createWriteStream(logFile, { flags: 'a' });

        // Process each scanline from ymin to ymax
        for (let y = ymin; y <= ymax; y++) {
            // Update active edges
            activeEdges.length = 0;
            for (const edge of edges) {
                if ((edge.start.y <= y && edge.end.y > y) || (edge.end.y <= y && edge.start.y > y)) {
                    activeEdges.push(edge);
                }
            }

            // Sort active edges by x
            activeEdges.sort((a, b) => a.start.x + a.tx * (y - a.start.y) - (b.start.x + b.tx * (y - b.start.y)));

            // Fill pixels between pairs of intersections
            for (let i = 0; i < activeEdges.length; i += 2) {
                const edge1 = activeEdges[i];
                const edge2 = activeEdges[i + 1];

                let x1 = edge1.start.x + edge1.tx * (y - edge1.start.y);
                let z1 = edge1.start.z + edge1.tz * (y - edge1.start.y);
                let x2 = edge2.start.x + edge2.tx * (y - edge2.start.y);
                let z2 = edge2.start.z + edge2.tz * (y - edge2.start.y);

                if (x1 > x2) {
                    [x1, x2] = [x2, x1];
                    [z1, z2] = [z2, z1];
                }

                // Log the values for each scanline
                
                const tz = (x2 - x1 === 0) ? 0 : ((z2 - z1) / (x2 - x1)).toFixed(6);
                logStream.write(`Scanline: ${y}, Edge1: (${x1.toFixed(3)}, ${z1.toFixed(3)}), Edge2: (${x2.toFixed(3)}, ${z2.toFixed(3)}), Xi: ${Math.ceil(x1)}, Xf: ${Math.floor(x2)}, Tz: ${tz}\n`);


                for (let x = Math.ceil(x1); x <= Math.floor(x2); x++) {
                    const t = (x - x1) / (x2 - x1);
                    const z = z1 + t * (z2 - z1);
                    this.updateBuffer(x, y, z, polygon.color);
                }
            }
        }

        // Close the log stream
        logStream.end();
    }
}

// Example usage
function createTestPolygons(): Polygon[] {
    // Crie alguns polígonos de teste
    const polygons: Polygon[] = [
        new Polygon([
            new Vertex(85, 192, -32.570),
            new Vertex(93, 251, -22.807),
            new Vertex(125, 107, -21.815)
        ], '#FF0000'), // Vermelho
    ];
    return polygons;
}

console.log(Polygon.prototype.getEdges);

function main() {
    const width = 400;
    const height = 300;
    const zBuffer = new ZBuffer(width, height);
    const polygons = createTestPolygons();

    zBuffer.render(polygons);

    console.log('Rendering complete. Check the scanline_log.txt file for details.');
}

main();