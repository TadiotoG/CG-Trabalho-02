/// <reference path="./gouraud.ts" />
var ZbufferConstante = /** @class */ (function () {
    function ZbufferConstante(width, height) {
        this.width = width;
        this.height = height;
        this.scanline = new Map(); // Inicializa o HashMap
        this.depthBuffer = Array.from({ length: height }, function () { return Array(width).fill(100000000); });
        this.colorBuffer = Array.from({ length: height }, function () { return Array(width).fill('#FFFFFF'); });
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                this.depthBuffer[i][j] = 1000000;
                this.colorBuffer[i][j] = '#FFFFFF';
            }
        }
        ;
    }
    ZbufferConstante.prototype.rasterizePolygon = function (face) {
        this.Scanline([face]);
    };
    ZbufferConstante.prototype.Scanline = function (faces) {
        console.log("Faces -> ", faces);
        var gambiarra = false;
        var y_original;
        var z_original;
        for (var _i = 0, faces_1 = faces; _i < faces_1.length; _i++) {
            var face = faces_1[_i];
            for (var i = 0; i < face.dots.length; i++) {
                // console.log("Pontos ", face.dots[i]);
                var Dx = void 0, Dy = void 0, Dz = void 0, Tx = void 0, Tz = void 0;
                var next_i = (i + 1) % face.dots.length;
                // console.log(next_i);
                /*      if(i===0){
                         y_original = face.dots[0].y;//para ele nunca mudar de valor
                         z_original = face.dots[0].z;
                     } */
                //console.log(y_original);
                //console.log(next_i)
                if (face.dots[i].y === face.dots[next_i].y) {
                    continue;
                }
                //face.dots[i].x = Math.round(face.dots[i].x);
                var start = void 0, end = void 0;
                // const start = face.dots[i].y < face.dots[next_i].y ? face.dots[i] : face.dots[next_i];
                // const end = face.dots[i].y < face.dots[next_i].y ? face.dots[next_i] : face.dots[i];
                if (face.dots[i].y < face.dots[next_i].y) {
                    start = face.dots[i];
                    end = face.dots[next_i];
                }
                else {
                    start = face.dots[next_i];
                    end = face.dots[i];
                }
                console.log("Start -> ", start, "End -> ", end);
                /*
                            if(!gambiarra){
                                
                                if(next_i == 0){//para o caso de ser o ultimo ponto, ele não troca de valor dai
                                    Dx = end.x - start.x;
                                    Dy = end.y - y_original;
                                    //console.log(end.z, z_original);
                                    Dz = end.z - z_original;
                                    
            
                                    Tx = Dx / Dy;
            
                                    Tz = Dz / Dy;
                                }else{
                                */
                Dx = end.x - start.x;
                Dy = end.y - start.y;
                Dz = end.z - start.z;
                Tx = Dx / Dy;
                Tz = Dz / Dy;
                //}
                //console.log(`Start = (${start.x}, ${start.y}, ${start.z}), End = (${end.x}, ${end.y}, ${end.z})`);  
                // gambiarra = true;
                //}
                //console.log(`Dx = ${Dx.toFixed(3)}, Dy = ${Dy.toFixed(3)}, Dz = ${Dz.toFixed(3)}, Tx = ${Tx.toFixed(3)}, Tz = ${Tz.toFixed(3)}`);
                var start_y = void 0;
                var end_y = void 0;
                if (face.dots[i].y < face.dots[next_i].y) {
                    start_y = Math.round(face.dots[i].y);
                    end_y = Math.round(face.dots[next_i].y);
                }
                else {
                    start_y = Math.round(face.dots[next_i].y);
                    end_y = Math.round(face.dots[i].y);
                }
                var x = start.x;
                var z = start.z;
                //const rgb1 = this.extractRGB(start.color);
                console.log("Start -> ", start_y, "End -> ", end_y);
                for (var y = start_y; y < end_y; y++) {
                    // Adiciona ao HashMap de scanlines
                    this.updateHash(y, x, z, face.color);
                    x += Tx;
                    z += Tz;
                }
                //gambiarra = false
            }
        }
        //console.log(this.scanline);
    };
    ZbufferConstante.prototype.updateHash = function (y, x, z, color) {
        if (!this.scanline.has(y)) {
            this.scanline.set(y, []);
        }
        var listaDePontos = this.scanline.get(y);
        //console.log(new_R, new_G, new_B);
        var novoPonto = new Dot(x, y, z, color);
        listaDePontos.push(novoPonto);
    };
    ZbufferConstante.prototype.ZbufferConstante = function () {
        // console.log("Scanline -> ", this.scanline);
        var _this = this;
        this.scanline.forEach(function (points, y) {
            // console.log("Antes", points);
            points = points.sort(function (a, b) { return a.x - b.x; });
            // console.log("depois", points);
            //console.log(points.length);
            for (var i = 0; i < points.length - 1; i += 2) {
                var next_i = (i + 1) % (points.length);
                // const next_i = i+1;
                //console.log(`L: ${face.dots.length}  I: ${i}  Next: ${next_i}` );
                var z1 = points[i].z;
                var z2 = points[next_i].z;
                //console.log(points[i].x, points[i+1].x, points[i].z, points[i+1].z);
                var dz = (z2 - z1) / (points[next_i].x - points[i].x);
                // console.log(dz);
                //console.log(dR, dG, dB);
                var x1 = Math.ceil(points[i].x);
                var x2 = Math.floor(points[next_i].x);
                var start = x1, end = x2;
                if (x1 > x2) {
                    start = x2;
                    end = x1;
                    console.log("Invertido");
                    // points.sort((a, b) => a.x - b.x);
                }
                var dx = points[i].x - x1;
                z1 += dx * dz;
                for (var x = start; x <= end; x++) {
                    //console.log(z1, x, y, points[i].color);
                    _this.AtualizaBufferConstante(z1, x, y, points[i].color);
                    //console.log(points[i].r_gouraud, points[i].g_gouraud, points[i].b_gouraud);
                    z1 += dz;
                }
            }
        });
    };
    ZbufferConstante.prototype.AtualizaBufferConstante = function (constant_z, x, y, color) {
        if (constant_z < this.depthBuffer[y][x]) {
            this.depthBuffer[y][x] = constant_z;
            //console.log(this.depthBuffer[y][x]);
            //console.log(this.colorBuffer[y][x]);
            this.colorBuffer[y][x] = color;
            //console.log(this.depthBuffer);
        }
    };
    return ZbufferConstante;
}());
