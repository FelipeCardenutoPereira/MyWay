/* v1.2.4 · mapa compacto, controles reduzidos e paginação da paleta. */
let palettePage124=0;
const PALETTE_PAGE_SIZE124=8;

function compactNodePositions124(){
  nodePosition61=function(){
    const viewport=$('#treeCanvas40')?.parentElement,t=triggerTreeState40(),left=(viewport?.scrollLeft||0)+18,top=(viewport?.scrollTop||0)+18;
    let x=left,y=top;
    while(t.nodes.some(n=>Math.abs((Number(n.x)||0)-x)<190&&Math.abs((Number(n.y)||0)-y)<145)){
      x+=210;
      if(x-left>630){x=left;y+=155;}
    }
    return {x,y};
  };
  organizeNodes61=function(){
    if(!mayEdit61())return;
    const canvas=$('#treeCanvas40'),viewport=canvas?.parentElement;if(!viewport)return;
    const nodes=treeVisibleNodes40(),columns=Math.max(1,Math.floor((viewport.clientWidth/treeZoom65-30)/210));
    let y=18;
    for(let row=0;row<nodes.length;row+=columns){
      const group=nodes.slice(row,row+columns);
      for(const [i,n] of group.entries()){n.x=18+i*210;n.y=y;}
      y+=155;
    }
    saveState();renderCanvas61();viewport.scrollLeft=0;viewport.scrollTop=0;
    setText40($('#treeHint40'),'Mapa organizado. Arraste pelo ⠿ para ajustar.');
  };
}

function ensurePalettePager124(){
  const list=$('#paletteList61');if(!list)return null;
  let pager=$('#palettePagination124');
  if(!pager){
    pager=document.createElement('div');pager.id='palettePagination124';pager.className='palette-pagination124';
    pager.innerHTML='<button type="button" class="ghost" data-palette-prev124>‹</button><output></output><button type="button" class="ghost" data-palette-next124>›</button>';
    list.after(pager);
    pager.querySelector('[data-palette-prev124]').onclick=()=>{palettePage124=Math.max(0,palettePage124-1);paintPalettePage124();};
    pager.querySelector('[data-palette-next124]').onclick=()=>{palettePage124++;paintPalettePage124();};
  }
  return pager;
}
function paintPalettePage124(){
  const list=$('#paletteList61');if(!list)return;
  const rows=[...list.children].filter(el=>el.classList.contains('palette-item61'));
  const pages=Math.max(1,Math.ceil(rows.length/PALETTE_PAGE_SIZE124));palettePage124=Math.min(Math.max(0,palettePage124),pages-1);
  rows.forEach((el,i)=>el.hidden=Math.floor(i/PALETTE_PAGE_SIZE124)!==palettePage124);
  const pager=ensurePalettePager124();if(!pager)return;
  pager.hidden=rows.length<=PALETTE_PAGE_SIZE124;
  pager.querySelector('output').textContent=rows.length?`${palettePage124+1} / ${pages}`:'0 / 0';
  pager.querySelector('[data-palette-prev124]').disabled=palettePage124===0;
  pager.querySelector('[data-palette-next124]').disabled=palettePage124>=pages-1;
}

function decorateCompactNodes124(){
  const canvas=$('#treeCanvas40');if(!canvas)return;
  for(const el of canvas.querySelectorAll('[data-tree-node40]')){
    if(el.querySelector('.node-more124'))continue;
    const id=el.dataset.treeNode40,header=el.querySelector(':scope>header');if(!header)continue;
    const more=document.createElement('button');more.type='button';more.className='node-more124';more.textContent='⋯';more.title='Abrir opções';more.setAttribute('aria-label','Abrir opções da caixa');
    more.onclick=e=>{e.preventDefault();e.stopPropagation();nodeDetails65(id);};header.append(more);
    el.addEventListener('dblclick',e=>{if(e.target.closest('button'))return;nodeDetails65(id);});
  }
}

function simplifyMapToolbar124(){
  const toggle=$('#paletteToggle61'),organize=$('#organizeNodes61');
  if(toggle){toggle.textContent='Adicionar caixa';toggle.classList.add('map-add124');}
  if(organize){organize.textContent='Organizar';organize.classList.add('map-organize124');}
  const note=$('.canvas-pan61');if(note)note.textContent='Arraste as caixas para organizar. Toque em ⋯ para editar, registrar ou remover.';
}

function initCleanUi124(){
  compactNodePositions124();
  const oldPalette=renderPalette61;
  renderPalette61=function(...args){const r=oldPalette(...args);paintPalettePage124();return r;};
  const search=$('#paletteSearch61');if(search)search.oninput=()=>{palettePage124=0;renderPalette61();};
  const oldCanvas=renderCanvas61;
  renderCanvas61=function(...args){const r=oldCanvas(...args);decorateCompactNodes124();return r;};
  renderTriggerTree40=renderCanvas61;
  simplifyMapToolbar124();
  renderPalette61();renderCanvas61();
  window.addEventListener('resize',()=>{if(innerWidth<700&&treeZoom65>.8){treeZoom65=.72;scaleCanvas65();}},{passive:true});
}

initCleanUi124();
