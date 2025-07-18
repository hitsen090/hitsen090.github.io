document.documentElement.style.setProperty('--real-vh', `${window.innerHeight}px`);
let m = SETTINGS.q*SETTINGS.l/SETTINGS.g;
let I = SETTINGS.m*SETTINGS.l^2/3;
let l = SETTINGS.l;
let g = SETTINGS.g;
let w1 = 0;
let w2 = 0;
let alpha2 = 0;
let alpha1 = SETTINGS.alpha;
render();
let p = 0;
//
async function render() {
   try{
   let workerCode = `
   setTimeout(() => {
   postMessage("A");
   }, 2000);
   `;
   const workerURL = URL.createObjectURL(new Blob([workerCode], { type: "application/javascript" }));
   let workers = new Worker(workerURL);
   workers.onmessage = (e) => {
      alert(e.data);
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