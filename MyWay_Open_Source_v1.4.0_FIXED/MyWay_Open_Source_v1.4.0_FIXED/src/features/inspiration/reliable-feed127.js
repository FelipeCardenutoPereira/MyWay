/* v1.2.7 · Inspiração nunca fica eternamente vazia: busca remota com timeout + biblioteca local. */
const INSPIRATION_LOCAL127=[
  {id:'local-mountain-surreal',title:'Paisagem surreal · contraste e profundidade',image:'assets/wallpapers/mountain-surreal.jpg',thumb:'assets/wallpapers/mountain-surreal.jpg',snippet:'Referência visual de montanha, lago, contraste quente/frio e composição ampla.',tags:'montanha natureza surreal arte paisagem wallpaper cores contraste'},
  {id:'local-misurina',title:'Lago ao pôr do sol · luz e reflexão',image:'assets/wallpapers/misurina-sunset.jpg',thumb:'assets/wallpapers/misurina-sunset.jpg',snippet:'Referência de fotografia, luz dourada, montanha e reflexo na água.',tags:'fotografia natureza montanha lago por do sol viagem paisagem'},
  {id:'local-mountain-lake',title:'Montanhas e lago · paleta fria',image:'assets/wallpapers/mountain-lake.jpg',thumb:'assets/wallpapers/mountain-lake.jpg',snippet:'Referência com azuis profundos, árvores, simetria e sensação contemplativa.',tags:'natureza lago montanha floresta azul calma minimalista'},
  {id:'local-cover',title:'Editorial minimalista · capa',image:'assets/cover-default.jpg',thumb:'assets/cover-default.jpg',snippet:'Referência para composição editorial, capas e hierarquia visual.',tags:'design editorial capa tipografia minimalista layout'},
  {id:'local-header',title:'Cabeçalho abstrato · interface',image:'assets/header-default.png',thumb:'assets/header-default.png',snippet:'Referência para cabeçalho de dashboard e identidade visual.',tags:'design interface dashboard cabecalho abstrato tecnologia'},
  {id:'local-channel',title:'Banner visual · composição horizontal',image:'assets/nv-banner.png',thumb:'assets/nv-banner.png',snippet:'Referência horizontal para banner, composição e contraste.',tags:'banner design canal composicao horizontal criacao'}
];
function localInspiration127(query=''){
  const q=normalizeSearch127?normalizeSearch127(query):String(query).toLowerCase(),tokens=q.split(/\s+/).filter(Boolean);
  let rows=INSPIRATION_LOCAL127.map((x,i)=>({...x,source:'',interest:inspirationActiveInterest||'',query,_local127:true,_score127:tokens.reduce((n,t)=>n+((x.title+' '+x.snippet+' '+x.tags).toLowerCase().includes(t)?1:0),0)-i*.001}));
  if(tokens.length){const matched=rows.filter(x=>x._score127>0);if(matched.length)rows=matched.concat(rows.filter(x=>x._score127<=0));}
  return rankInspirationResults(rows.slice(0,6));
}
function setLocalInspiration127(query,status='Referências locais carregadas. Você pode salvar, pesquisar ou adicionar as suas.'){
  inspirationSearchResults=localInspiration127(query);inspirationSearchBusy=false;inspirationMode='discover';
  const s=$('#inspirationSearchStatus');if(s)s.textContent=status;
  const empty=$('#inspirationEmpty');if(empty)empty.hidden=true;
  renderInspiration(false);
}
async function remoteInspiration127(query){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),4500);
  try{
    const r=await fetch(`/api/inspiration/search?q=${encodeURIComponent(query)}`,{signal:controller.signal,headers:{Accept:'application/json'}});
    const data=await r.json().catch(()=>null);return data;
  }catch{return null;}finally{clearTimeout(timer);}
}
function installInspirationSearch127(){
  searchInspiration=async function(query,fromInterest=false,{auto=false}={}){
    query=String(query||'').trim();if(!query||inspirationSearchBusy)return;
    inspirationSearchBusy=true;inspirationMode='discover';inspirationActiveBoard='';inspirationActiveInterest=fromInterest?query:'';
    if($('#inspirationSearchInput'))$('#inspirationSearchInput').value=query;
    if($('#inspirationSearchStatus'))$('#inspirationSearchStatus').textContent=`Buscando “${query}”…`;
    renderInspiration(false);if(!auto)learnInspiration({title:query,interest:fromInterest?query:'',query},'search');
    const data=await remoteInspiration127(query);
    if(data?.ok&&Array.isArray(data.results)&&data.results.length){
      const mapped=data.results.map(x=>({...x,interest:fromInterest?query:(inspirationActiveInterest||''),query}));
      inspirationSearchResults=rankInspirationResults(mapped);inspirationSearchBusy=false;
      if($('#inspirationSearchStatus'))$('#inspirationSearchStatus').textContent=`${inspirationSearchResults.length} referências encontradas.`;
      renderInspiration(false);return;
    }
    setLocalInspiration127(query,data?.error?'Busca online indisponível; mostrando referências locais.':'Nenhum resultado online; mostrando referências locais.');
  };
}
function ensureInspirationNotEmpty127(){
  if(!$('#view-inspiration')||inspirationMode!=='discover'||inspirationSearchBusy||inspirationSearchResults.length)return;
  const q=personalizedInspirationQuery(false)||userInterests?.()?.[0]||'inspiração visual';
  setLocalInspiration127(q,'Feed local pronto. Pesquise qualquer tema para refinar.');
}
function initReliableInspiration127(){
  installInspirationSearch127();
  const baseRender=renderInspiration;renderInspiration=function(...args){const r=baseRender(...args);if(args[0]!==false)queueMicrotask(ensureInspirationNotEmpty127);return r;};
  const searchBtn=$('#inspirationSearchBtn');if(searchBtn){const fresh=searchBtn.cloneNode(true);searchBtn.replaceWith(fresh);fresh.onclick=()=>searchInspiration($('#inspirationSearchInput')?.value||'',false,{auto:false});}
  const input=$('#inspirationSearchInput');if(input){input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();searchInspiration(e.currentTarget.value,false,{auto:false});}};}
  setTimeout(ensureInspirationNotEmpty127,250);
}
initReliableInspiration127();
