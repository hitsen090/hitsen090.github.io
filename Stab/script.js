document.documentElement.style.setProperty('--real-vh', `${window.innerHeight}px`);
alert(8);
let m = SETTINGS.q*SETTINGS.l/SETTINGS.g;
let iI = m*SETTINGS.l**2/3;
let l = SETTINGS.l;
let g = SETTINGS.g;
let p = 0;
let w1 = 0;
let w2 = 0;
let alpha2 = 0;
let alpha1 = SETTINGS.alpha;
alert(11);
setCanvasSize();
alert(12);
render();

//
async function render() {
   alert(2);
   try{
   let workerCode = `
   let {
                g,l,m,iI,alpha,dt,v,k
            } = e.data;
   let w1 = 0;
   let w2 = 0;
   let alpha2 = 0;
   let alpha1 = alpha;
   let M1 = 0;
   let M2 = 0;
   setInterval(() => {
   M1 = m*g*l*alpha1 - k*(alpha1-alpha2);
   M2 = m*g*l*alpha2 - k*alpha2 - M1;
   w1 += M1*dt/iI;
   w2 += M2*dt/iI;
   alpha1 += w1*dt;
   alpha2 += w2*dt;
   postMessage({alpha1,alpha2});
   }, 1/v);
   `;
   //canvas.startPath(100,100);
   const workerURL = URL.createObjectURL(new Blob([workerCode], { type: "application/javascript" }));
   let workers = new Worker(workerURL);
   workers.postMessage({g,l,m,iI,SETTINGS.alpha,SETTINGS.dt,SETTINGS.v,SETTINGS.k});
   workers.onmessage = (e) => {
      ctx.clearRect(0,0,1000,1000);
      ctx.beginPath();
      ctx.moveTo(100,100);
      ctx.lineTo(200,e.data);
      alert(9);
      ctx.stroke();
   };
   }catch(e){if(p<1){alert(e);p++;}}
    //performance.mark('renderStart');
   /* if (isRendering) return;
    isRendering = true;

    clearTimeout(fpsTimeout);
    if (!startTime) startTime = performance.now();

    if (!SETTINGS.animatedMode) $('#progress').text(I18N[LANG].rendering);

    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    //animateWithoutRequest();

    let currTime = performance.now();
    lastRenderTime = Math.round(currTime - startTime);
    runningFPS = runningFPS * 0.8 + 200/lastRenderTime;
   // updateJSI18N();

    isRendering = false;
    //performance.mark('renderEnd');
    startTime = currTime;

    fpsTimeout = setTimeout(e => startTime = null, 100);*/
    
}