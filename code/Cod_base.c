#define NI 3 // RESOLUCAO DOS PONTOS DE CONTROLE
#define NJ 4
Dot inp[NI+1][NJ+1];
#define TI 3 // GRAU
#define TJ 3
int knotsI[NI+TI+1]; // VETORES DE NÓS PARA INTERPOLAR
int knotsJ[NJ+TJ+1];
#define RESOLUTIONI 30 // NUMERO DE PONTOS GERADOS NO FINAL DA MALHA
#define RESOLUTIONJ 40
Dot outp[RESOLUTIONI][RESOLUTIONJ];

int main(argc,argv)
int argc;
char **argv;
{
   int i,j,ki,kj;
   double intervalI,incrementI;
   double intervalJ,incrementJ;
   double bi,bj;

   /* Create a random surface */
   srandom(1111);
   for (i=0;i<=NI;i++) {
      for (j=0;j<=NJ;j++) {
         inp[i][j].x = i;
         inp[i][j].y = j;
         inp[i][j].z = (random() % 10000) / 5000.0 - 1;
      }
   }

   /* Step size along the curve (3 - 3 + 2) / (30 - 1)*/
   incrementI = (NI - TI + 2) / ((double)RESOLUTIONI - 1);
   incrementJ = (NJ - TJ + 2) / ((double)RESOLUTIONJ - 1);

   /* Calculate the knots */
   SplineKnots(knotsI,NI,TI); // Criou 6 pontos = [0,0,0,1,2,2,2]
   SplineKnots(knotsJ,NJ,TJ); // Criou 7 pontos = [0,0,0,1,1,2,2,2]

   intervalI = 0;
   for (i=0;i<RESOLUTIONI-1;i++) {// ate 30
      intervalJ = 0;
      for (j=0;j<RESOLUTIONJ-1;j++) {// ate 40
         outp[i][j].x = 0;
         outp[i][j].y = 0;
         outp[i][j].z = 0;
         for (ki=0;ki<=NI;ki++) { // ate quant_pc = 3 
            for (kj=0;kj<=NJ;kj++) { // ate 4
               bi = SplineBlend(ki,TI,knotsI,intervalI);
               bj = SplineBlend(kj,TJ,knotsJ,intervalJ);
               outp[i][j].x += (inp[ki][kj].x * bi * bj);
               outp[i][j].y += (inp[ki][kj].y * bi * bj);
               outp[i][j].z += (inp[ki][kj].z * bi * bj);
            }
         }
         intervalJ += incrementJ;
      }
      intervalI += incrementI;
   }
   intervalI = 0;
   for (i=0;i<RESOLUTIONI-1;i++) {
      outp[i][RESOLUTIONJ-1].x = 0;
      outp[i][RESOLUTIONJ-1].y = 0;
      outp[i][RESOLUTIONJ-1].z = 0;
      for (ki=0;ki<=NI;ki++) {
          bi = SplineBlend(ki,TI,knotsI,intervalI);
          outp[i][RESOLUTIONJ-1].x += (inp[ki][NJ].x * bi);
          outp[i][RESOLUTIONJ-1].y += (inp[ki][NJ].y * bi);
          outp[i][RESOLUTIONJ-1].z += (inp[ki][NJ].z * bi);
      }
      intervalI += incrementI;
   }
   outp[i][RESOLUTIONJ-1] = inp[NI][NJ];
   intervalJ = 0;
   for (j=0;j<RESOLUTIONJ-1;j++) {
      outp[RESOLUTIONI-1][j].x = 0;
      outp[RESOLUTIONI-1][j].y = 0;
      outp[RESOLUTIONI-1][j].z = 0;
      for (kj=0;kj<=NJ;kj++) {
          bj = SplineBlend(kj,TJ,knotsJ,intervalJ);
          outp[RESOLUTIONI-1][j].x += (inp[NI][kj].x * bj);
          outp[RESOLUTIONI-1][j].y += (inp[NI][kj].y * bj);
          outp[RESOLUTIONI-1][j].z += (inp[NI][kj].z * bj);
      }
      intervalJ += incrementJ;
   }
   outp[RESOLUTIONI-1][j] = inp[NI][NJ];

   printf("LIST\n");

   /* Display the surface, in this case in OOGL format for GeomView */
   printf("{ = CQUAD\n");
   for (i=0;i<RESOLUTIONI-1;i++) {
      for (j=0;j<RESOLUTIONJ-1;j++) {
        printf("%g %g %g 1 1 1 1\n",
            outp[i][j].x,    outp[i][j].y,    outp[i][j].z);
        printf("%g %g %g 1 1 1 1\n",
            outp[i][j+1].x,  outp[i][j+1].y,  outp[i][j+1].z);
        printf("%g %g %g 1 1 1 1\n",
            outp[i+1][j+1].x,outp[i+1][j+1].y,outp[i+1][j+1].z);
        printf("%g %g %g 1 1 1 1\n",
            outp[i+1][j].x,  outp[i+1][j].y,  outp[i+1][j].z);
      }
   }
   printf("}\n");

   /* Control point polygon */
   for (i=0;i<NI;i++) {
      for (j=0;j<NJ;j++) {
         printf("{ = SKEL 4 1  \n");
         printf("%g %g %g \n",inp[i][j].x,inp[i][j].y,inp[i][j].z);
         printf("%g %g %g \n",inp[i][j+1].x,inp[i][j+1].y,inp[i][j+1].z);
         printf("%g %g %g \n",inp[i+1][j+1].x,inp[i+1][j+1].y,inp[i+1][j+1].z);
         printf("%g %g %g \n",inp[i+1][j].x,inp[i+1][j].y,inp[i+1][j].z);
         printf("5 0 1 2 3 0\n");
         printf("}\n");
      }
   }
}


// Outra parte


void SplinePoint(int *u,int n,int t,double v,Dot *control,Dot *output)
{
   int k;
   double b;

   output->x = 0;
   output->y = 0;
   output->z = 0;

   for (k=0;k<=n;k++) {
      b = SplineBlend(k,t,u,v);
      output->x += control[k].x * b;
      output->y += control[k].y * b;
      output->z += control[k].z * b;
   }
}

/*
   Calculate the blending value, this is done recursively.
   
   If the numerator and denominator are 0 the expression is 0.
   If the deonimator is 0 the expression is 0
*/
double SplineBlend(int k,int t,int *u,double v)
{
   double value;

   if (t == 1) {
      if ((u[k] <= v) && (v < u[k+1]))
         value = 1;
      else
         value = 0;
   } else {
      if ((u[k+t-1] == u[k]) && (u[k+t] == u[k+1]))
         value = 0;
      else if (u[k+t-1] == u[k]) 
         value = (u[k+t] - v) / (u[k+t] - u[k+1]) * SplineBlend(k+1,t-1,u,v);
      else if (u[k+t] == u[k+1])
         value = (v - u[k]) / (u[k+t-1] - u[k]) * SplineBlend(k,t-1,u,v);
     else
         value = (v - u[k]) / (u[k+t-1] - u[k]) * SplineBlend(k,t-1,u,v) + 
                 (u[k+t] - v) / (u[k+t] - u[k+1]) * SplineBlend(k+1,t-1,u,v);
   }
   return(value);
}

/*
   The positions of the subintervals of v and breakpoints, the position
   on the curve are called knots. Breakpoints can be uniformly defined
   by setting u[j] = j, a more useful series of breakpoints are defined
   by the function below. This set of breakpoints localises changes to
   the vicinity of the control point being modified.
*/                      // 3      3
void SplineKnots(int *u,int n,int t)
{
   int j;

   for (j=0;j<=n+t;j++) {
      if (j < t)
         u[j] = 0;
      else if (j <= n)
         u[j] = j - t + 1;
      else if (j > n)
         u[j] = n - t + 2;	
   }
}

void SplineKnots(int *u, int n, int t) {
    int j;

    // Primeiros 't' nós iguais a 0
    for (j = 0; j < t; j++)
        u[j] = 0;

    // Nós intermediários uniformemente distribuídos
    for (; j <= n; j++)
        u[j] = j - t + 1;

    // Últimos 't' nós iguais ao último valor
    for (; j <= n + t; j++)
        u[j] = n - t + 2;
}


/*-------------------------------------------------------------------------
   Create all the points along a spline curve
   Control points "inp", "n" of them.
   Knots "knots", degree "t".
   Ouput curve "outp", "res" of them.
*/
void SplineCurve(Dot *inp,int n,int *knots,int t,Dot *outp,int res)
{
   int i;
   double interval,increment;

   interval = 0;
   increment = (n - t + 2) / (double)(res - 1);
   for (i=0;i<res-1;i++) {
      SplinePoint(knots,n,t,interval,inp,&(outp[i]));
      interval += increment;
   }
   outp[res-1] = inp[n];
}

