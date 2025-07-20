alert(77);
document.documentElement.style.setProperty('--real-vh', `${window.innerHeight}px`);
alert(8);
alert(11);

setCanvasSize();
alert(canvas.height);

render();

//
async function render() {
   let m = SETTINGS.q*SETTINGS.l/SETTINGS.g;
   let iI = m*SETTINGS.l**2/3;
   let l = SETTINGS.l;
   let g = SETTINGS.g;
   let t = 0.00000;
   let p = 0;
   let w1 = 0;
   let w2 = 0;
   let alpha2 = 0;
   let alpha1 = SETTINGS.alpha;
   //alert(ctx.height);
   try{
   let workerCode = `
   onmessage = function(e){
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
     M2 = m*g*l*alpha2 - k*alpha2 + k*(alpha1-alpha2);
     w1 += M1*dt/iI;
     w2 += M2*dt/iI;
     alpha1 += w1*dt;
     alpha2 += w2*dt;
     postMessage({alpha1,alpha2});
     }, 1000/v);
   }
   `;
   //canvas.startPath(100,100);
   let width = canvas.width;
   let height = canvas.height;
   const workerURL = URL.createObjectURL(new Blob([workerCode], { type: "application/javascript" }));
   let workers = new Worker(workerURL);
   //alert(910);
   workers.postMessage({g:g,
      l:l,
      m:m,
      iI:iI,
      alpha:SETTINGS.alpha,
      dt:SETTINGS.dt,
      v:SETTINGS.v,
      k:SETTINGS.k});
   workers.onmessage = (e) => {
      t += SETTINGS.dt;
      if(SETTINGS.stop){
         SETTINGS.stop = false;
         workers.terminate();
      }
      $("#timme").html(t.toFixed(6));
      ctx.clearRect(0,0,1000,1000);
      ctx.beginPath();
      ctx.moveTo(0.5*width,0.75*height);
      let x2 = 0.5*width-0.25*height*Math.sin(e.data.alpha2);
      let y2 = 0.75*height-0.25*height*Math.cos(e.data.alpha2);
      let x1 = x2 -0.25*height*Math.sin(e.data.alpha1);
      let y1 = y2 - 0.25*height*Math.cos(e.data.alpha1);
      ctx.lineTo(x2,y2);
      ctx.lineTo(x1,y1);
      //alert(9);
      ctx.stroke();
   };
   }catch(e){if(p<1){alert(e);p++;}}
    //performance.mark('renderStart');
    
}