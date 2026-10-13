/* v1.2.7 · Pesquisa de ferramentas + menu lateral sem barra visível. */
let toolSearchPage127=0,toolSearchRows127=[];
const TOOL_SEARCH_PAGE127=6;
function normalizeSearch127(v=''){return String(v).toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();}
function toolCatalog127(){
  const rows=[],seen=new Set();
  if(typeof FEATURES_R1==='object')for(const [id,f] of Object.entries(FEATURES_R1)){
    if(!f?.name||!f?.view)continue;const k='feature:'+id;if(seen.has(k))continue;seen.add(k);
    rows.push({key:k,id,label:f.name,view:f.view,target:f.target||'',kind:'Ferramenta',search:normalizeSearch127(`${f.name} ${f.view} ${id}`)});
  }
  document.querySelectorAll('.sidebar .nav-item[data-view-target]').forEach(b=>{
    const view=b.dataset.viewTarget,label=b.querySelector(':scope>span:not(.nav-icon):not(.menu-grip126)')?.textContent?.trim()||view,k='view:'+view;if(seen.has(k))return;seen.add(k);
    rows.push({key:k,label,view,target:'',kind:'Área',search:normalizeSearch127(`${label} ${view}`)});
  });
  // aliases úteis: ajudam a pessoa a achar pela intenção, não pelo nome técnico.
  const aliases={resilience:'gatilho mapa escolhas vicio vontade comportamento resiliencia',reflection57:'filosofia espiritualidade valores sentido estoicismo budismo religiao',psychoanalysis:'psicanalise freud sonhos trauma associacao livre',inspiration:'inspiracao referencias mural imagens ideias',journal:'diario escrever caderno',notes:'notas anotacoes',puc:'estudo faculdade curso aulas',meditation:'respiracao ansiedade bem estar'};
  for(const r of rows)r.search+=' '+(aliases[r.view]||'');
  // evita duplicar a mesma ferramenta quando ela existe no catálogo e também no menu lateral.
  const unique=[],signatures=new Set();
  for(const r of rows){const sig=`${normalizeSearch127(r.label)}|${r.view}`;if(signatures.has(sig))continue;signatures.add(sig);unique.push(r);}
  return unique.sort((a,b)=>a.label.localeCompare(b.label,'pt-BR'));
}
function paintToolSearch127(){
  const panel=$('#toolSearchResults127');if(!panel)return;
  const pages=Math.max(1,Math.ceil(toolSearchRows127.length/TOOL_SEARCH_PAGE127));toolSearchPage127=Math.max(0,Math.min(toolSearchPage127,pages-1));
  const start=toolSearchPage127*TOOL_SEARCH_PAGE127,rows=toolSearchRows127.slice(start,start+TOOL_SEARCH_PAGE127);
  panel.innerHTML=`<div class="tool-search-list127">${rows.length?rows.map(r=>`<button type="button" data-tool-key127="${escapeHTML(r.key)}"><span>${escapeHTML(r.label)}</span><small>${escapeHTML(r.kind)}</small></button>`).join(''):'<p>Nenhuma ferramenta encontrada.</p>'}</div><footer ${toolSearchRows127.length<=TOOL_SEARCH_PAGE127?'hidden':''}><button type="button" data-tool-prev127 aria-label="Página anterior">‹</button><output>${toolSearchRows127.length?toolSearchPage127+1:0} / ${toolSearchRows127.length?pages:0}</output><button type="button" data-tool-next127 aria-label="Próxima página">›</button></footer>`;
  panel.querySelectorAll('[data-tool-key127]').forEach(b=>b.onclick=()=>openToolResult127(toolSearchRows127.find(r=>r.key===b.dataset.toolKey127)));
  panel.querySelector('[data-tool-prev127]')?.addEventListener('click',()=>{toolSearchPage127--;paintToolSearch127();});
  panel.querySelector('[data-tool-next127]')?.addEventListener('click',()=>{toolSearchPage127++;paintToolSearch127();});
}
function runToolSearch127(value){
  const q=normalizeSearch127(value),all=toolCatalog127();toolSearchPage127=0;
  toolSearchRows127=q?all.filter(r=>r.search.includes(q)||q.split(' ').every(t=>r.search.includes(t))).slice(0,36):all.filter(r=>['reflection57','resilience','psychoanalysis','inspiration','notes','journal'].includes(r.view)).slice(0,12);
  paintToolSearch127();$('#toolSearchResults127')?.classList.add('open');
}
function openToolResult127(row){
  if(!row)return;const input=$('#toolSearchInput127');if(input)input.value='';$('#toolSearchResults127')?.classList.remove('open');
  if(row.id&&typeof openFeatureR1==='function')openFeatureR1(row.id);else showView(row.view);
  requestAnimationFrame(()=>{const target=row.target?document.querySelector(row.target):document.querySelector(`#view-${CSS.escape(row.view)} .section-head`);target?.scrollIntoView({block:'start',behavior:'smooth'});});
}
function ensureToolSearch127(){
  const sidebar=$('.sidebar'),nav=sidebar?.querySelector('.nav');if(!sidebar||!nav||$('#toolSearch127'))return;
  const box=document.createElement('div');box.id='toolSearch127';box.className='tool-search127';box.innerHTML='<label><span aria-hidden="true">⌕</span><input id="toolSearchInput127" type="search" autocomplete="off" placeholder="Pesquisar ferramenta" aria-label="Pesquisar ferramenta"></label><div id="toolSearchResults127" class="tool-search-results127" role="listbox"></div>';
  nav.before(box);const input=$('#toolSearchInput127');
  input.addEventListener('focus',()=>runToolSearch127(input.value));input.addEventListener('input',()=>runToolSearch127(input.value));
  input.addEventListener('keydown',e=>{if(e.key==='Escape'){input.value='';$('#toolSearchResults127').classList.remove('open');input.blur();}});
  document.addEventListener('pointerdown',e=>{if(!e.target.closest('#toolSearch127'))$('#toolSearchResults127')?.classList.remove('open');});
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSidebarCollapsed?.(false);requestAnimationFrame(()=>input.focus());}});
}
function initSidebarEdgeScroll127(){
  const nav=$('.sidebar .nav');if(!nav||nav.dataset.edgeScroll127==='1')return;nav.dataset.edgeScroll127='1';let speed=0,raf=0;
  function frame(){if(!speed){raf=0;return;}nav.scrollTop+=speed;raf=requestAnimationFrame(frame);}
  nav.addEventListener('pointermove',e=>{const r=nav.getBoundingClientRect(),edge=Math.min(74,Math.max(42,r.height*.14)),top=e.clientY-r.top,bottom=r.bottom-e.clientY;speed=top<edge?-Math.max(1,(edge-top)/6):bottom<edge?Math.max(1,(edge-bottom)/6):0;if(speed&&!raf)raf=requestAnimationFrame(frame);});
  nav.addEventListener('pointerleave',()=>{speed=0;if(raf){cancelAnimationFrame(raf);raf=0;}});
}
function initToolNavigation127(){
  ensureToolSearch127();initSidebarEdgeScroll127();
  const oldGroup=groupNavigation58;groupNavigation58=function(...args){const r=oldGroup(...args);ensureToolSearch127();initSidebarEdgeScroll127();return r;};
  const observer=new MutationObserver(()=>{ensureToolSearch127();initSidebarEdgeScroll127();});observer.observe(document.body,{childList:true,subtree:true});
}
initToolNavigation127();
