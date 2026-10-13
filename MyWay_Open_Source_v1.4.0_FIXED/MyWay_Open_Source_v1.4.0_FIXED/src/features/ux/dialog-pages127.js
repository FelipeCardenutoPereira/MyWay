/* v1.2.7 · Pop-ups antigos longos viram páginas quando possível. */
function dialogWeight127(el){
  if(el.matches('textarea,fieldset,.form-grid,.two-col,.three-col'))return 2;
  if(el.querySelector?.('textarea'))return 2;
  if(el.matches('details'))return 1.5;
  return 1;
}
function paginateLegacyDialog127(dialog){
  if(!dialog||dialog.dataset.paged127==='1'||dialog.classList.contains('paged-dialog68')||dialog.classList.contains('anxiety-dialog39')||dialog.classList.contains('practice-dialog52')||dialog.classList.contains('cloud-dialog53')||dialog.querySelector('#cloudForm53')||dialog.matches('[data-confirm-dialog],.confirmation-dialog'))return;
  const root=dialog.querySelector(':scope>form')||dialog.querySelector(':scope>.tools-content49')||dialog.querySelector('.tools-content49');if(!root)return;
  if(root.querySelector('.legacy-pages127'))return;
  const maxHeight=Math.min(700,innerHeight-40);if(dialog.scrollHeight<=maxHeight&&root.scrollHeight<=maxHeight)return;
  const children=[...root.children].filter(el=>!el.matches('header,footer,script,.close65,.dialog-close58,.modal-close,[data-dialog-cancel]')&&!el.classList.contains('legacy-dialog-nav127'));
  if(children.length<3)return;
  const limit=innerWidth<650||innerHeight<720?2.7:4,pages=[];let page=[],w=0;
  for(const el of children){const ew=dialogWeight127(el);if(page.length&&w+ew>limit){pages.push(page);page=[];w=0;}page.push(el);w+=ew;}
  if(page.length)pages.push(page);if(pages.length<2)return;
  const box=document.createElement('div');box.className='legacy-pages127';let index=0;
  pages.forEach((nodes,i)=>{const p=document.createElement('section');p.className='legacy-page127';p.hidden=i!==0;nodes.forEach(n=>p.append(n));box.append(p);});
  const footer=root.querySelector(':scope>footer');root.insertBefore(box,footer||null);
  const nav=document.createElement('div');nav.className='legacy-dialog-nav127';nav.innerHTML='<button type="button" class="ghost" data-legacy-back127>Voltar</button><output></output><button type="button" class="primary" data-legacy-next127>Próximo</button>';
  root.insertBefore(nav,footer||null);dialog.classList.add('legacy-paged127');dialog.dataset.paged127='1';
  function paint(){box.querySelectorAll('.legacy-page127').forEach((p,i)=>p.hidden=i!==index);nav.querySelector('output').textContent=`${index+1} / ${pages.length}`;nav.querySelector('[data-legacy-back127]').hidden=index===0;const next=nav.querySelector('[data-legacy-next127]');next.textContent=index===pages.length-1?'Concluir etapa':'Próximo';next.hidden=index===pages.length-1;requestAnimationFrame(()=>box.querySelector('.legacy-page127:not([hidden]) :is(input,select,textarea,button)')?.focus({preventScroll:true}));}
  nav.querySelector('[data-legacy-back127]').onclick=()=>{if(index>0){index--;paint();}};
  nav.querySelector('[data-legacy-next127]').onclick=()=>{if(index<pages.length-1){index++;paint();}};paint();
}
function initLegacyDialogPagination127(){
  const obs=new MutationObserver(()=>{document.querySelectorAll('dialog[open]').forEach(d=>requestAnimationFrame(()=>paginateLegacyDialog127(d)));});
  obs.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['open']});
  document.querySelectorAll('dialog[open]').forEach(paginateLegacyDialog127);
}
initLegacyDialogPagination127();
