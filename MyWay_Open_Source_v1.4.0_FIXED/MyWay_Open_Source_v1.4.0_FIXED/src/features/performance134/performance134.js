/* v1.3.4 · Transição assistida para áreas pesadas.
   Mostra a mesma linguagem visual do preloader antes do render síncrono. */
const HEAVY_VIEWS134=new Set(['control','reports','inspiration','finance','resilience','nutrition','channel','puc','future','journal','games','gym']);
let busyOverlayTimer134=0,busyNavigation134=false;
function ensureBusyOverlay134(){
  let el=$('#busyOverlay134');if(el)return el;
  el=document.createElement('div');el.id='busyOverlay134';el.className='busy-overlay134 myway-loading60';el.hidden=true;el.setAttribute('aria-live','polite');el.setAttribute('aria-busy','true');
  el.innerHTML=`<div class="loading-frames60" aria-hidden="true"><img class="loading-frame60" src="assets/loading60/frame-1.png" alt=""><img class="loading-frame60" src="assets/loading60/frame-2.png" alt=""><img class="loading-frame60" src="assets/loading60/frame-3.png" alt=""><img class="loading-frame60" src="assets/loading60/frame-4.png" alt=""></div><span class="busy-caption134">Carregando esta área…</span>`;
  document.body.append(el);return el;
}
function showBusy134(text='Carregando esta área…'){
  clearTimeout(busyOverlayTimer134);const el=ensureBusyOverlay134();const copy=el.querySelector('.busy-caption134');if(copy)copy.textContent=text;el.hidden=false;requestAnimationFrame(()=>el.classList.add('visible'));
}
function hideBusy134(delay=90){
  clearTimeout(busyOverlayTimer134);busyOverlayTimer134=setTimeout(()=>{const el=$('#busyOverlay134');if(!el)return;el.classList.remove('visible');setTimeout(()=>{if(!el.classList.contains('visible'))el.hidden=true;},180);},delay);
}
function navigateWithBusy134(target){
  if(!HEAVY_VIEWS134.has(target)){showView(target);return}
  if(busyNavigation134)return;
  busyNavigation134=true;showBusy134();
  // Duas frames garantem que o overlay seja pintado antes do trabalho pesado.
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    const started=performance.now();
    try{showView(target)}finally{
      const spent=performance.now()-started;requestAnimationFrame(()=>{hideBusy134(Math.max(80,260-spent));busyNavigation134=false;});
    }
  }));
}
window.MyWayBusy134=Object.freeze({show:showBusy134,hide:hideBusy134,navigate:navigateWithBusy134});
