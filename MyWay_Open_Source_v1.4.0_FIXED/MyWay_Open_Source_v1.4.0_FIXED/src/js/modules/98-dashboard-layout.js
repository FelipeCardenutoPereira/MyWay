/* v68 · Dashboard livre: arrastar, reordenar e escolher largura dos quadros favoritos. */
function dashboardSizes68(){return state.settings.dashboardCardSizes68&&typeof state.settings.dashboardCardSizes68==='object'?state.settings.dashboardCardSizes68:(state.settings.dashboardCardSizes68={});}
function dashboardHomeOrder68(){return [...document.querySelectorAll('#featureFavoritesR1 .favorite-tool-r2[data-dashboard-feature68]')].map(x=>x.dataset.dashboardFeature68).filter(Boolean);}
function persistDashboardOrder68(order=dashboardHomeOrder68()){
 const pins=featurePinsR1(),map=new Map(pins.map(p=>[p.id,p])),home=new Set(order),rest=pins.filter(p=>!home.has(p.id));
 state.settings.featurePinsR1=[...order.map(id=>map.get(id)).filter(Boolean),...rest];saveState();
}
function cycleDashboardSize68(id,card){
 const sizes=dashboardSizes68(),seq=['normal','wide','full'],current=sizes[id]||'normal',next=seq[(seq.indexOf(current)+1)%seq.length];sizes[id]=next;card.dataset.dashboardSize68=next;saveState();toast(next==='normal'?'Largura normal.':next==='wide'?'Quadro ampliado.':'Quadro em largura total.');
}
function positionDraggedCard68(grid,dragged,target,event){
 if(!target||target===dragged)return;const rect=target.getBoundingClientRect();
 const before=(event.clientY<rect.top+rect.height/2)||(Math.abs(event.clientY-(rect.top+rect.height/2))<rect.height*.24&&event.clientX<rect.left+rect.width/2);
 grid.insertBefore(dragged,before?target:target.nextSibling);
}
function enhanceDashboardDrag68(){
 const grid=$('#featureFavoritesR1 .favorite-tools-grid-r2');if(!grid||grid.dataset.dragReady68==='true')return;grid.dataset.dragReady68='true';
 for(const card of [...grid.children]){
  const open=card.querySelector('[data-pin-openR1]'),id=open?.getAttribute('data-pin-openR1');if(!id)continue;
  card.dataset.dashboardFeature68=id;card.dataset.dashboardSize68=dashboardSizes68()[id]||'normal';
  const header=card.querySelector('.favorite-tool-title-r2');if(!header)continue;
  const controls=header.querySelector('div')||document.createElement('div');
  const grip=document.createElement('button');grip.type='button';grip.className='dashboard-drag68';grip.title='Arrastar quadro';grip.setAttribute('aria-label','Arrastar '+(FEATURES_R1[id]?.name||'quadro'));grip.innerHTML='<span aria-hidden="true">⠿</span>';
  const size=document.createElement('button');size.type='button';size.className='dashboard-size68';size.title='Alterar largura';size.setAttribute('aria-label','Alterar largura do quadro');size.innerHTML='<span aria-hidden="true">↔</span>';size.onclick=()=>cycleDashboardSize68(id,card);
  header.insertBefore(grip,header.firstChild);controls.insertBefore(size,controls.firstChild);
  card.draggable=false;
  grip.addEventListener('keydown',e=>{if(!['ArrowUp','ArrowLeft','ArrowDown','ArrowRight'].includes(e.key))return;e.preventDefault();const sibling=['ArrowUp','ArrowLeft'].includes(e.key)?card.previousElementSibling:card.nextElementSibling;if(!sibling)return;if(['ArrowUp','ArrowLeft'].includes(e.key))grid.insertBefore(card,sibling);else grid.insertBefore(sibling,card);persistDashboardOrder68();grip.focus();});
  grip.addEventListener('dragstart',e=>e.preventDefault());
 }
 let drag=null,raf=0;
 grid.addEventListener('pointerdown',e=>{const grip=e.target.closest('.dashboard-drag68');if(!grip||e.button!==0)return;const card=grip.closest('.favorite-tool-r2');if(!card)return;e.preventDefault();drag={card,grip,id:e.pointerId,startX:e.clientX,startY:e.clientY,moved:false,last:e};grip.setPointerCapture?.(e.pointerId);});
 grid.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;drag.last=e;if(!drag.moved&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<6)return;if(!drag.moved){drag.moved=true;drag.card.classList.add('dashboard-dragging68');document.body.classList.add('dashboard-reordering68');}
  e.preventDefault();if(raf)return;raf=requestAnimationFrame(()=>{raf=0;if(!drag)return;const hit=document.elementFromPoint(drag.last.clientX,drag.last.clientY)?.closest('.favorite-tool-r2');if(hit&&grid.contains(hit))positionDraggedCard68(grid,drag.card,hit,drag.last);});
 });
 const finish=e=>{if(!drag||e.pointerId!==drag.id)return;const d=drag;drag=null;d.card.classList.remove('dashboard-dragging68');document.body.classList.remove('dashboard-reordering68');if(d.moved){e.preventDefault();persistDashboardOrder68();playSound58?.('dashboard');toast('Ordem do dashboard salva.');}try{d.grip.releasePointerCapture?.(e.pointerId)}catch{}};
 grid.addEventListener('pointerup',finish);grid.addEventListener('pointercancel',finish);
}
function initDashboardLayout68(){
 const previous=renderFeaturePinsR2;
 renderFeaturePinsR2=function(...args){const out=previous(...args);requestAnimationFrame(enhanceDashboardDrag68);return out;};
 renderFeaturePinsR1=renderFeaturePinsR2;
 const observer=new MutationObserver(()=>requestAnimationFrame(enhanceDashboardDrag68));const host=$('#featureFavoritesR1');if(host)observer.observe(host,{childList:true,subtree:true});
 enhanceDashboardDrag68();
}
