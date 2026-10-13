/* v1.2.6 · menu lateral reorganizável por drag and drop, sem novos botões fixos. */
let navDragArmed126='',navDragging126='';
function navOrder126(){state.settings.navOrder126||={};return state.settings.navOrder126;}
function applyNavOrder126(){
  const saved=navOrder126();
  $$('.sidebar [data-nav-group58]').forEach(group=>{
    const id=group.dataset.navGroup58,slot=group.querySelector(':scope>div'),order=Array.isArray(saved[id])?saved[id]:[];if(!slot)return;
    const byView=new Map([...slot.querySelectorAll(':scope>.nav-item[data-view-target]')].map(b=>[b.dataset.viewTarget,b]));
    for(const view of order){const b=byView.get(view);if(b)slot.append(b);}
    decorateNavDnD126(slot,id);
  });
}
function persistNavOrder126(groupId,slot){
  navOrder126()[groupId]=[...slot.querySelectorAll(':scope>.nav-item[data-view-target]')].map(b=>b.dataset.viewTarget);saveState();
}
function decorateNavDnD126(slot,groupId){
  for(const button of slot.querySelectorAll(':scope>.nav-item[data-view-target]')){
    button.draggable=true;button.dataset.navDnd126=groupId;
    if(!button.querySelector('.menu-grip126')){const grip=document.createElement('span');grip.className='menu-grip126';grip.setAttribute('aria-hidden','true');grip.title='Arraste para reorganizar';grip.textContent='⋮⋮';button.append(grip);}
  }
}
function navDropBefore126(slot,y,dragging){
  const rows=[...slot.querySelectorAll(':scope>.nav-item[data-view-target]')].filter(x=>x!==dragging&&!x.hidden);
  let best=null,bestOffset=Number.NEGATIVE_INFINITY;
  for(const row of rows){const r=row.getBoundingClientRect(),offset=y-r.top-r.height/2;if(offset<0&&offset>bestOffset){bestOffset=offset;best=row;}}
  return best;
}
function initNavDnD126(){
  const sidebar=$('.sidebar');if(!sidebar)return;
  const oldGroup=groupNavigation58;groupNavigation58=function(...args){const r=oldGroup(...args);applyNavOrder126();return r;};
  applyNavOrder126();
  sidebar.addEventListener('pointerdown',e=>{const grip=e.target.closest('.menu-grip126');navDragArmed126=grip?.closest('.nav-item')?.dataset.viewTarget||'';});
  sidebar.addEventListener('pointerup',()=>{if(!navDragging126)navDragArmed126='';});
  sidebar.addEventListener('dragstart',e=>{const b=e.target.closest?.('.nav-item[data-view-target]');if(!b||b.dataset.viewTarget!==navDragArmed126){e.preventDefault();return;}navDragging126=b.dataset.viewTarget;b.classList.add('nav-dragging126');e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',navDragging126);});
  sidebar.addEventListener('dragover',e=>{const slot=e.target.closest?.('[data-nav-group58]>div');const b=$(`.sidebar .nav-item[data-view-target="${CSS.escape(navDragging126)}"]`);if(!slot||!b||b.parentElement!==slot)return;e.preventDefault();e.dataTransfer.dropEffect='move';slot.classList.add('nav-drop126');const before=navDropBefore126(slot,e.clientY,b);slot.insertBefore(b,before);});
  sidebar.addEventListener('drop',e=>{const slot=e.target.closest?.('[data-nav-group58]>div');const group=slot?.closest('[data-nav-group58]');const b=$(`.sidebar .nav-item[data-view-target="${CSS.escape(navDragging126)}"]`);if(!slot||!group||!b||b.parentElement!==slot)return;e.preventDefault();persistNavOrder126(group.dataset.navGroup58,slot);});
  sidebar.addEventListener('dragend',()=>{$$('.sidebar .nav-drop126').forEach(x=>x.classList.remove('nav-drop126'));$('.sidebar .nav-dragging126')?.classList.remove('nav-dragging126');navDragging126='';navDragArmed126='';});
}
initNavDnD126();
