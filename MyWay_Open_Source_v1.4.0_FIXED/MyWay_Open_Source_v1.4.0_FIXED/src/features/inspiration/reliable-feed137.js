/* v1.3.7 · Inspiração: restauração de pins + navegação/busca resiliente.
   - Mantém um backup pequeno e independente dos pins.
   - Recupera pins de estados locais antigos quando a hidratação recebe um estado sem pins.
   - "Para você" nunca fica vazio: mostra pins salvos + referências locais imediatamente.
   - Clique em Explorar / Salvos / Quadros é delegado e não depende do binding antigo. */
const INSPIRATION_PINS_BACKUP137='myway_inspiration_pins_v137';
let inspirationLegacyPinsCache137=null,inspirationAutoRecoveryOpen137=true;

function normalizePin137(pin,index=0){
  if(!pin||typeof pin!=='object')return null;
  const title=String(pin.title||pin.name||pin.label||'Referência').trim()||'Referência';
  const image=String(pin.image||pin.thumb||pin.imageUrl||pin.urlImage||'').trim();
  const source=String(pin.source||pin.link||pin.url||'').trim();
  const id=String(pin.id||pin.key||`recovered-${Date.now()}-${index}`);
  return {...pin,id,title,image,thumb:String(pin.thumb||image),source,boardId:String(pin.boardId||pin.board||'general'),savedAt:pin.savedAt||pin.createdAt||new Date().toISOString()};
}
function pinKey137(pin){return String(pin?.source||pin?.image||pin?.thumb||pin?.id||'').trim();}
function mergePins137(...sets){
  const out=[],seen=new Set();
  for(const set of sets){
    if(!Array.isArray(set))continue;
    for(let i=0;i<set.length;i++){
      const pin=normalizePin137(set[i],i);if(!pin)continue;
      const key=pinKey137(pin)||`id:${pin.id}`;if(seen.has(key))continue;seen.add(key);out.push(pin);
    }
  }
  return out;
}
function readPinsBackup137(){
  try{const rows=JSON.parse(localStorage.getItem(INSPIRATION_PINS_BACKUP137)||'[]');return Array.isArray(rows)?rows:[];}catch{return [];}
}
function scanLegacyPins137(force=false){
  if(!force&&inspirationLegacyPinsCache137)return inspirationLegacyPinsCache137.slice();
  const found=[];
  try{
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);if(!key||key===INSPIRATION_PINS_BACKUP137)continue;
      const raw=localStorage.getItem(key);if(!raw||raw[0]!=='{')continue;
      try{
        const data=JSON.parse(raw);
        for(const candidate of [data?.inspirationPins,data?.savedPins,data?.inspirationSaved,data?.pins])if(Array.isArray(candidate))found.push(...candidate);
      }catch{}
    }
  }catch{}
  inspirationLegacyPinsCache137=found;return found.slice();
}
function backupInspirationPins137({allowEmpty=false}={}){
  try{
    const pins=mergePins137(state?.inspirationPins||[]);
    if(pins.length||allowEmpty)localStorage.setItem(INSPIRATION_PINS_BACKUP137,JSON.stringify(pins.slice(0,300)));
  }catch{}
}
function recoverInspirationPins137({announce=false,force=false}={}){
  if(!state)return 0;
  const current=Array.isArray(state.inspirationPins)?state.inspirationPins:[];
  if(!force&&!inspirationAutoRecoveryOpen137){state.inspirationPins=current;return 0;}
  const recovered=mergePins137(current,readPinsBackup137(),scanLegacyPins137(force));
  const added=Math.max(0,recovered.length-current.length);
  state.inspirationPins=recovered;
  if(recovered.length){
    backupInspirationPins137();
    if(added){try{saveState();}catch{} }
  }
  const recoverBtn=$('#inspirationRestorePins137');
  if(recoverBtn)recoverBtn.hidden=!readPinsBackup137().length&&!scanLegacyPins137().length;
  if(announce&&added)toast(`${added} pin${added===1?' recuperado':'s recuperados'}.`,'O mural voltou a usar os registros locais encontrados.');
  return added;
}

// Protege os pins mesmo quando um estado nativo antigo é carregado depois da UI.
backupInspirationPins137();
const saveStateBeforePins137=saveState;
saveState=function(...args){backupInspirationPins137({allowEmpty:!inspirationAutoRecoveryOpen137});return saveStateBeforePins137(...args);};

// Normaliza o perfil antes de qualquer ranqueamento, inclusive estados antigos/incompletos.
const ensureTasteProfileBefore137=ensureTasteProfile;
ensureTasteProfile=function(){
  const raw=state.inspirationTaste&&typeof state.inspirationTaste==='object'?state.inspirationTaste:{};
  state.inspirationTaste={...raw};
  for(const k of ['interestScores','termScores','domainScores'])if(!state.inspirationTaste[k]||typeof state.inspirationTaste[k]!=='object'||Array.isArray(state.inspirationTaste[k]))state.inspirationTaste[k]={};
  for(const k of ['dismissed','actions'])if(!Array.isArray(state.inspirationTaste[k]))state.inspirationTaste[k]=[];
  return ensureTasteProfileBefore137();
};

// Em Para você, preserva os próprios pins do usuário e completa com resultados de busca.
const inspirationVisibleItemsBefore137=inspirationVisibleItems;
inspirationVisibleItems=function(){
  if(inspirationAutoRecoveryOpen137)recoverInspirationPins137();
  if(inspirationMode==='saved')return (state.inspirationPins||[]).slice().sort((a,b)=>String(b.savedAt||'').localeCompare(String(a.savedAt||'')));
  if(inspirationMode==='board')return (state.inspirationPins||[]).filter(x=>(x.boardId||'general')===inspirationActiveBoard).slice().sort((a,b)=>String(b.savedAt||'').localeCompare(String(a.savedAt||'')));
  const rows=mergePins137(state.inspirationPins||[],inspirationSearchResults||[]);
  return rows.length?rows:inspirationVisibleItemsBefore137();
};

function localRows137(query=''){
  try{
    const rows=localInspiration127(query);
    if(Array.isArray(rows)&&rows.length)return rows;
  }catch{}
  return (typeof INSPIRATION_LOCAL127!=='undefined'?INSPIRATION_LOCAL127:[]).map(x=>({...x,query,interest:inspirationActiveInterest||''}));
}
function showLocalRows137(query,status){
  const local=localRows137(query);
  inspirationSearchResults=local;
  inspirationMode='discover';
  inspirationSearchBusy=false;
  if($('#inspirationSearchStatus'))$('#inspirationSearchStatus').textContent=status||`${local.length} referências locais · seus pins salvos também aparecem no mural.`;
  renderInspiration(false);
  return local;
}
async function remoteRows137(query){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),5000);
  try{
    const r=await fetch(`/api/inspiration/search?q=${encodeURIComponent(query)}`,{signal:controller.signal,headers:{Accept:'application/json'}});
    if(!r.ok)return null;return await r.json().catch(()=>null);
  }catch{return null;}finally{clearTimeout(timer);}
}
searchInspiration=async function(query,fromInterest=false,{auto=false}={}){
  query=String(query||'').trim()||personalizedInspirationQuery(false)||userInterests()?.[0]||'inspiração visual';
  inspirationMode='discover';inspirationActiveBoard='';inspirationActiveInterest=fromInterest?query:'';
  if($('#inspirationSearchInput'))$('#inspirationSearchInput').value=query;
  if(!auto)try{learnInspiration({title:query,interest:fromInterest?query:'',query},'search');}catch{}
  // Mostra conteúdo imediatamente. A rede nunca deixa o mural em branco.
  showLocalRows137(query,`Explorando “${query}”… mostrando referências locais enquanto busco mais.`);
  inspirationSearchBusy=true;
  const data=await remoteRows137(query);
  inspirationSearchBusy=false;
  if(data?.ok&&Array.isArray(data.results)&&data.results.length){
    try{inspirationSearchResults=rankInspirationResults(data.results.map(x=>({...x,interest:fromInterest?query:(inspirationActiveInterest||''),query})));}
    catch{inspirationSearchResults=data.results.map(x=>({...x,query}));}
    if($('#inspirationSearchStatus'))$('#inspirationSearchStatus').textContent=`${inspirationSearchResults.length} referências online + ${(state.inspirationPins||[]).length} salvos.`;
    renderInspiration(false);return;
  }
  if($('#inspirationSearchStatus'))$('#inspirationSearchStatus').textContent=`Busca online indisponível; exibindo referências locais + ${(state.inspirationPins||[]).length} salvos.`;
  renderInspiration(false);
};

function showInspirationMode137(mode,board=''){
  if(inspirationAutoRecoveryOpen137)recoverInspirationPins137({announce:false});
  inspirationMode=mode;
  inspirationActiveBoard=mode==='board'?board:'';
  if(mode==='discover'&&!inspirationSearchResults.length)inspirationSearchResults=localRows137(personalizedInspirationQuery(false)||'inspiração visual');
  renderInspiration(false);
  const pins=(state.inspirationPins||[]).length;
  if(mode==='saved'&&$('#inspirationSearchStatus'))$('#inspirationSearchStatus').textContent=pins?`${pins} pin${pins===1?' salvo':'s salvos'} no seu mural.`:'Nenhum pin salvo neste perfil. O botão “recuperar pins locais” aparece se eu encontrar registros antigos.';
}

function ensureInspirationReady137(){
  recoverInspirationPins137();
  if(inspirationMode==='discover'&&!inspirationSearchResults.length)inspirationSearchResults=localRows137(personalizedInspirationQuery(false)||'inspiração visual');
  try{renderInspiration(false);}catch(e){
    inspirationSearchBusy=false;
    const box=$('#inspirationMasonry');if(box)box.innerHTML=localRows137('inspiração visual').map(x=>renderInspirationPinCard(x,false)).join('');
  }
  const empty=$('#inspirationEmpty');if(empty&&inspirationVisibleItems().length)empty.hidden=true;
}

// Delegação em captura: independe de clones/re-renderizações dos botões antigos.
if(document.documentElement.dataset.inspirationDelegation137!=='1'){
  document.documentElement.dataset.inspirationDelegation137='1';
  document.addEventListener('click',e=>{
    const search=e.target.closest?.('#inspirationSearchBtn');
    if(search){e.preventDefault();e.stopImmediatePropagation();searchInspiration($('#inspirationSearchInput')?.value||'',false,{auto:false});return;}
    const filter=e.target.closest?.('[data-inspiration-filter]');
    if(filter){e.preventDefault();e.stopImmediatePropagation();showInspirationMode137(filter.dataset.inspirationFilter||'discover');return;}
    const board=e.target.closest?.('[data-inspiration-board]');
    if(board){e.preventDefault();e.stopImmediatePropagation();showInspirationMode137('board',board.dataset.inspirationBoard||'general');return;}
    const recover=e.target.closest?.('#inspirationRestorePins137');
    if(recover){e.preventDefault();e.stopImmediatePropagation();recoverInspirationPins137({announce:true,force:true});showInspirationMode137('saved');return;}
  },true);
  document.addEventListener('keydown',e=>{
    if(e.target?.id==='inspirationSearchInput'&&e.key==='Enter'){
      e.preventDefault();e.stopImmediatePropagation();searchInspiration(e.target.value,false,{auto:false});
    }
  },true);
}

// A hidratação nativa é assíncrona; revisita o estado depois que ela pode ter terminado.
queueMicrotask(ensureInspirationReady137);
setTimeout(ensureInspirationReady137,250);
setTimeout(()=>{const added=recoverInspirationPins137();if(added)ensureInspirationReady137();},1000);
setTimeout(()=>{inspirationAutoRecoveryOpen137=false;backupInspirationPins137({allowEmpty:true});},2200);

// Reconstroi o mural depois que o estado nativo termina de chegar. Sem isso, uma hidratação
// tardia podia redesenhar a aba como vazia mesmo havendo backup/pins locais.
window.addEventListener('myway:hydrated',()=>{
  try{recoverInspirationPins137();}catch{}
  try{ensureInspirationReady137();}catch{}
});
