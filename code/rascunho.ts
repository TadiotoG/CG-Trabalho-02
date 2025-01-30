type Dot = {
    x: number;
    y: number;
    z: number;
  };
  
  const NI = 3;
  const NJ = 4;
  const TI = 3;
  const TJ = 3;
  const RESOLUTIONI = 30;
  const RESOLUTIONJ = 40;
  
  const inp: Dot[][] = Array.from({ length: NI + 1 }, () => 
    Array.from({ length: NJ + 1 }, () => ({ x: 0, y: 0, z: 0 }))
  );
  
  const knotsI: number[] = new Array(NI + TI + 1);
  const knotsJ: number[] = new Array(NJ + TJ + 1);
  const outp: Dot[][] = Array.from({ length: RESOLUTIONI }, () => 
    Array.from({ length: RESOLUTIONJ }, () => ({ x: 0, y: 0, z: 0 }))
  );
  
  function randomValue(): number {
    return (Math.random() * 2 - 1);
  }
  
  function initializeSurface(): void {
    for (let i = 0; i <= NI; i++) {
      for (let j = 0; j <= NJ; j++) {
        inp[i][j] = { x: i, y: j, z: randomValue() };
      }
    }
  }
  
  function SplineKnots(u: number[], n: number, t: number): void {
    for (let j = 0; j <= n + t; j++) {
      if (j < t) u[j] = 0;
      else if (j <= n) u[j] = j - t + 1;
      else u[j] = n - t + 2;
    }
  }
  
  function SplineBlend(k: number, t: number, u: number[], v: number): number {
    if (t === 1) {
      return u[k] <= v && v < u[k + 1] ? 1 : 0;
    }
    let value = 0;
    if (u[k + t - 1] !== u[k]) {
      value += (v - u[k]) / (u[k + t - 1] - u[k]) * SplineBlend(k, t - 1, u, v);
    }
    if (u[k + t] !== u[k + 1]) {
      value += (u[k + t] - v) / (u[k + t] - u[k + 1]) * SplineBlend(k + 1, t - 1, u, v);
    }
    return value;
  }
  
  function generateSurface(): void {
    let intervalI = 0;
    const incrementI = (NI - TI + 2) / (RESOLUTIONI - 1);
    const incrementJ = (NJ - TJ + 2) / (RESOLUTIONJ - 1);
    
    SplineKnots(knotsI, NI, TI);
    SplineKnots(knotsJ, NJ, TJ);
  
    for (let i = 0; i < RESOLUTIONI - 1; i++) {
      let intervalJ = 0;
      for (let j = 0; j < RESOLUTIONJ - 1; j++) {
        let x = 0, y = 0, z = 0;
        for (let ki = 0; ki <= NI; ki++) {
          for (let kj = 0; kj <= NJ; kj++) {
            const bi = SplineBlend(ki, TI, knotsI, intervalI);
            const bj = SplineBlend(kj, TJ, knotsJ, intervalJ);
            x += inp[ki][kj].x * bi * bj;
            y += inp[ki][kj].y * bi * bj;
            z += inp[ki][kj].z * bi * bj;
          }
        }
        outp[i][j] = { x, y, z };
        intervalJ += incrementJ;
      }
      intervalI += incrementI;
    }
  }
  
  function displaySurface(): void {
    console.log("LIST");
    console.log("{ = CQUAD");
    for (let i = 0; i < RESOLUTIONI - 1; i++) {
      for (let j = 0; j < RESOLUTIONJ - 1; j++) {
        console.log(
          `${outp[i][j].x} ${outp[i][j].y} ${outp[i][j].z} 1 1 1 1`,
          `${outp[i][j+1].x} ${outp[i][j+1].y} ${outp[i][j+1].z} 1 1 1 1`,
          `${outp[i+1][j+1].x} ${outp[i+1][j+1].y} ${outp[i+1][j+1].z} 1 1 1 1`,
          `${outp[i+1][j].x} ${outp[i+1][j].y} ${outp[i+1][j].z} 1 1 1 1`
        );
      }
    }
    console.log("}");
  }
  
  function main(): void {
    initializeSurface();
    generateSurface();
    displaySurface();
  }
  
  main();
  