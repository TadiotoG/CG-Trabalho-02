/// <reference path= "./spline.ts" />
import * as fs from 'fs';

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

    render(faces: Face[]) {
        this.initializeBuffers();
        for (const face of faces) {
            this.rasterizePolygon(face);
        }
    }

    rasterizePolygon(face: Face) {
        let pontos = face.dots;
        let edges: Aresta[] = [];
        const activeEdges: Aresta[] = [];

        for (let i = 0; i < pontos.length; i++) {
            if (i + 1 < pontos.length) {
                edges.push(new Aresta(pontos[i], pontos[i + 1]));
            } else {
                edges.push(new Aresta(pontos[i], pontos[0]));
            }}

        // Find ymin and ymax of the face
        let ymin = Infinity;
        let ymax = -Infinity;
        for (const vertex of face.dots) {
            if (vertex.y < ymin) ymin = vertex.y;
            if (vertex.y > ymax) ymax = vertex.y;
        }
        const logFile = 'scanline_log.txt';
        const logStream = fs.createWriteStream(logFile, { flags: 'a' });

        // Process each scanline from ymin to ymax
        for (let y = ymin; y <= ymax; y++) {
            // Update active edges
            activeEdges.length = 0;
            for (const edge of edges) {
                if ((edge.p1.y <= y && edge.p2.y > y) || (edge.p2.y <= y && edge.p1.y > y)) {
                    activeEdges.push(edge);
                }
            }

            // Sort active edges by x
            activeEdges.sort((a, b) => a.p1.x + a.tx * (y - a.p1.y) - (b.p1.x + b.tx * (y - b.p1.y)));

            // Fill pixels between pairs of intersections
            for (let i = 0; i < activeEdges.length; i += 2) {
                const edge1 = activeEdges[i];
                const edge2 = activeEdges[i + 1];

                let x1 = edge1.p1.x + edge1.tx * (y - edge1.p1.y);
                let z1 = edge1.p1.z + edge1.tz * (y - edge1.p1.y);
                let x2 = edge2.p1.x + edge2.tx * (y - edge2.p1.y);
                let z2 = edge2.p1.z + edge2.tz * (y - edge2.p1.y);

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
                    this.updateBuffer(x, y, z, face.color);
                }
            }
        }
        logStream.end();
    }
}

// Example usage
function createTestPolygons(): Face[] {
    // Crie alguns polígonos de teste
    const polygons: Face[] = [
        new Face([
            new Dot(85, 192, -32.570),
            new Dot(93, 251, -22.807),
            new Dot(125, 107, -21.815)
        ])
    ];
    return polygons;
}

function main() {
    const width = 400;
    const height = 300;
    const zBuffer = new ZBuffer(width, height);
    const polygons = createTestPolygons();

    zBuffer.render(polygons);

    console.log('Rendering complete. Check the scanline_log.txt file for details.');
}

main();