/* =========================================================
   V9 — CANAL STUDIO / AI + ASSETS + ANALYTICS
   ========================================================= */
const NV_STATUS={idea:"Ideia",research:"Pesquisa",script:"Roteiro",recording:"Gravando",editing:"Editando",thumbnail:"Thumbnail",published:"Publicado"};
let nvFilter="all", nvPendingScript=null, nvPendingThumb="", nvResearchAttachment="";
function nvStatusOptions(current){return Object.entries(NV_STATUS).map(([k,v])=>`<option value="${k}" ${k===current?"selected":""}>${v}</option>`).join("")}
function nvStatusProgress(status){return {idea:5,research:20,script:38,recording:55,editing:75,thumbnail:90,published:100}[status]||0}
function resizeImageFile(file,maxW=1280,quality=.78){return new Promise((resolve,reject)=>{const r=new FileReader(),img=new Image();r.onload=()=>img.src=r.result;img.onload=()=>{const s=Math.min(1,maxW/img.width),c=document.createElement('canvas');c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);resolve(c.toDataURL(file.type==='image/png'?'image/png':'image/jpeg',quality))};img.onerror=reject;r.onerror=reject;r.readAsDataURL(file)})}
async function readScriptFile(file){if(!file)return null;const lower=file.name.toLowerCase();let text="";if(/\.(txt|md|rtf|json|csv)$/.test(lower)){try{text=await file.text()}catch(e){}}let data="";if(file.size<=900000){data=await new Promise(res=>{const r=new FileReader();r.onload=()=>res(r.result||"");r.onerror=()=>res("");r.readAsDataURL(file)})}return{name:file.name,type:file.type||"application/octet-stream",size:file.size,text:text.slice(0,80000),data}}
function setupDropZone(zone,input,kind){if(!zone||!input)return;['dragenter','dragover'].forEach(ev=>zone.addEventListener(ev,e=>{e.preventDefault();zone.classList.add('dragover')}));['dragleave','drop'].forEach(ev=>zone.addEventListener(ev,e=>{e.preventDefault();zone.classList.remove('dragover')}));zone.addEventListener('drop',async e=>{const f=e.dataTransfer.files?.[0];if(f)await handleNVFile(f,kind)});input.addEventListener('change',async()=>{const f=input.files?.[0];if(f)await handleNVFile(f,kind)})}
async function handleNVFile(file,kind){if(kind==='thumb'){if(!file.type.startsWith('image/'))return toast('Escolha uma imagem para a thumbnail.');nvPendingThumb=await resizeImageFile(file);$('#nvThumbPreview').src=nvPendingThumb;$('#nvThumbDrop').classList.add('has-preview');toast('Thumbnail carregada.')}else{nvPendingScript=await readScriptFile(file);$('#nvScriptName').textContent=nvPendingScript?.name||file.name;toast('Roteiro anexado.',file.name)}}
setupDropZone($('#nvScriptDrop'),$('#nvScriptFile'),'script');setupDropZone($('#nvThumbDrop'),$('#nvThumbFile'),'thumb');
function renderNVAnalytics(){const a=state.nvAnalytics||DEFAULT_STATE.nvAnalytics;if(!$('#nvAnalyticsViews'))return;renderNVDailyChart(a.dailyViews||[]);$('#nvAnalyticsViews').textContent=Number(a.views||0).toLocaleString('pt-BR');$('#nvAnalyticsImpressions').textContent=Number(a.impressions||0).toLocaleString('pt-BR');$('#nvAnalyticsCTR').textContent=`${Number(a.ctr||0).toLocaleString('pt-BR',{maximumFractionDigits:2})}%`;$('#nvAnalyticsSubs').textContent=`${Number(a.subscribersGained||0)>=0?'+':''}${Number(a.subscribersGained||0)}`;$('#nvTopVideos').innerHTML=(a.topVideos||[]).slice(0,5).map((v,i)=>`<div class="nv-top-video"><b>${String(i+1).padStart(2,'0')}</b><span>${escapeHTML(v.title)}</span><small>${v.views} views · ${Number(v.ctr||0).toLocaleString('pt-BR',{maximumFractionDigits:2})}% CTR</small></div>`).join('')}

function renderNVDailyChart(values){
  const c=$('#nvDailyChart');if(!c)return;const v=(values||[]).map(Number).filter(x=>Number.isFinite(x));if(!v.length){c.innerHTML='<span class="note">importe um CSV para preencher</span>';return}const W=420,H=110,p=12,max=Math.max(1,...v),step=(W-p*2)/Math.max(1,v.length-1);const pts=v.map((x,i)=>[p+i*step,H-p-(x/max)*(H-p*2)]),line=pts.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' '),area=`M ${p} ${H-p} `+pts.map(q=>`L ${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' ')+` L ${pts[pts.length-1][0].toFixed(1)} ${H-p} Z`;c.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><linearGradient id="nvGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b01a1a" stop-opacity=".8"/><stop offset="1" stop-color="#b01a1a" stop-opacity="0"/></linearGradient></defs><line class="nv-grid" x1="${p}" y1="${H-p}" x2="${W-p}" y2="${H-p}"/><path class="nv-area" d="${area}"/><path class="nv-line" d="${line}"/></svg>`}

function csvSplit(line){let out=[],cur='',q=false;for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'){if(q&&line[i+1]==='"'){cur+='"';i++}else q=!q}else if(ch===','&&!q){out.push(cur);cur=''}else cur+=ch}out.push(cur);return out}
$('#nvAnalyticsImport')?.addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;const lines=(await f.text()).split(/\r?\n/).filter(Boolean),rows=lines.map(csvSplit);if(rows.length<2)return toast('CSV vazio ou incompatível.');const h=rows[0],idx=n=>h.indexOf(n);if(idx('Data')>=0&&idx('Visualizações')>=0&&idx('Título do vídeo')<0){state.nvAnalytics.dailyViews=rows.slice(1).map(r=>Number(String(r[idx('Visualizações')]||0).replace(',','.'))||0);state.nvAnalytics.views=state.nvAnalytics.dailyViews.reduce((a,b)=>a+b,0);saveState();renderNVAnalytics();toast('Série diária atualizada.',f.name);return}const videos=rows.slice(1).filter(r=>r[idx('Título do vídeo')]&&r[idx('Título do vídeo')]!=='').map(r=>({title:r[idx('Título do vídeo')],views:Number(String(r[idx('Visualizações')]||0).replace(',','.'))||0,ctr:Number(String(r[idx('Taxa de cliques na miniatura (%)')]||0).replace(',','.'))||0})).filter(v=>v.title!=='Total').sort((a,b)=>b.views-a.views);const total=rows.find(r=>r[0]==='Total');if(total){state.nvAnalytics.views=Number(total[idx('Visualizações')]||0);state.nvAnalytics.impressions=Number(total[idx('Impressões de miniaturas')]||0);state.nvAnalytics.ctr=Number(String(total[idx('Taxa de cliques na miniatura (%)')]||0).replace(',','.'))||0;state.nvAnalytics.subscribersGained=Number(total[idx('Inscritos')]||0);state.nvAnalytics.watchHours=Number(total[idx('Tempo de exibição (horas)')]||0)}state.nvAnalytics.topVideos=videos.slice(0,8);saveState();renderNVAnalytics();toast('Analytics atualizados.',f.name)});
async function refreshAIStatus(){const status=$('#nvAIStatus');if(!status)return;status.textContent='Assistente interno · regras locais de organização';}
$('#nvSaveAPIKey')?.addEventListener('click',async()=>{const key=$('#nvAPIKey').value.trim();if(!key)return toast('Cole uma chave da API OpenAI.');const r=await nativeJSON('/api/openai/key',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key})});if(r?.ok){$('#nvAPIKey').value='';toast('Chave salva no backend local.');refreshAIStatus()}else toast('Não foi possível salvar a chave.');});
async function handoffToChatGPT(){
  const prompt=$('#nvResearchPrompt')?.value.trim()||"";
  if(!prompt)return toast('Escreva uma pauta ou pergunta.');
  let text=prompt;
  if(nvResearchAttachment)text+=`\n\nROTEIRO/CONTEXTO ANEXADO:\n${nvResearchAttachment}`;
  try{await navigator.clipboard.writeText(text);toast('Pesquisa copiada.','Cole no ChatGPT que será aberto agora.');}catch(e){toast('Abrindo ChatGPT.','Copie a pauta manualmente caso o navegador bloqueie a área de transferência.');}
  window.open('https://chatgpt.com/','_blank');
}
$('#nvUseChatGPT')?.addEventListener('click',handoffToChatGPT);

function researchFavoriteByUrl(url){return (state.nvResearchFavorites||[]).find(x=>x.url===url)}
function renderNVResearchFavorites(){
  const c=$("#nvResearchFavorites");if(!c)return;
  state.nvResearchFavorites=state.nvResearchFavorites||[];
  if($("#nvResearchFavoritesCount"))$("#nvResearchFavoritesCount").textContent=state.nvResearchFavorites.length;
  c.innerHTML=state.nvResearchFavorites.length?state.nvResearchFavorites.map(x=>`<div class="nv-saved-link" data-research-fav="${x.id}"><div><a href="${escapeHTML(x.url)}" target="_blank" rel="noopener">${escapeHTML(x.title||x.url)}</a><small>${escapeHTML(x.snippet||x.url)}</small></div><button data-research-fav-delete>×</button></div>`).join(""):`<span class="note" style="color:#756865">Nenhum link favoritado.</span>`;
  $$("[data-research-fav]",c).forEach(row=>row.querySelector("[data-research-fav-delete]").addEventListener("click",()=>{state.nvResearchFavorites=state.nvResearchFavorites.filter(x=>x.id!==row.dataset.researchFav);saveState();renderNVResearchFavorites()}));
}
function renderNVWebResults(results){
  const box=$("#nvResearchResponse");
  box.innerHTML=`<div class="nv-web-results">${(results||[]).map((x,i)=>`<article class="nv-web-result" data-web-result="${i}"><div class="nv-web-result-head"><a href="${escapeHTML(x.url)}" target="_blank" rel="noopener">${escapeHTML(x.title)}</a><button class="nv-web-favorite ${researchFavoriteByUrl(x.url)?"on":""}" data-web-favorite title="Favoritar">${researchFavoriteByUrl(x.url)?"♥":"♡"}</button></div><p>${escapeHTML(x.snippet||"")}</p><small>${escapeHTML(x.url)}</small></article>`).join("")}</div>`;
  $$("[data-web-result]",box).forEach(card=>{
    const x=results[Number(card.dataset.webResult)],btn=card.querySelector("[data-web-favorite]");
    btn.addEventListener("click",()=>{
      const found=researchFavoriteByUrl(x.url);
      if(found)state.nvResearchFavorites=state.nvResearchFavorites.filter(f=>f.id!==found.id);
      else state.nvResearchFavorites.unshift({id:cryptoId(),title:x.title,url:x.url,snippet:x.snippet||"",query:$("#nvResearchPrompt")?.value.trim()||"",savedAt:new Date().toISOString()});
      saveState();renderNVWebResults(results);renderNVResearchFavorites();
    });
  });
}
$("#nvWebResearch")?.addEventListener("click",async()=>{
  const prompt=$("#nvResearchPrompt").value.trim();if(!prompt)return toast("Escreva uma pauta ou pergunta.");
  const box=$("#nvResearchResponse");box.innerHTML="<span>Pesquisando na web sem usar créditos da API…</span>";
  const r=await nativeJSON("/api/research/web?q="+encodeURIComponent(prompt));
  if(!r?.ok){box.textContent=r?.error||"Não foi possível pesquisar agora.";return;}
  renderNVWebResults(r.results||[]);
});

$('#nvAttachResearchScript')?.addEventListener('click',()=>$('#nvResearchScriptFile').click());$('#nvResearchScriptFile')?.addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;const a=await readScriptFile(f);nvResearchAttachment=a?.text||'';toast(nvResearchAttachment?'Roteiro anexado à pesquisa.':'Arquivo anexado, mas o texto não pôde ser lido neste formato.',f.name)});
$('#nvResearchSend')?.addEventListener('click',async()=>{const prompt=$('#nvResearchPrompt').value.trim();if(!prompt)return toast('Escreva uma pauta ou pergunta.');if(IS_ANDROID||window.MyWayAndroid){return handoffToChatGPT()}const box=$('#nvResearchResponse');box.textContent='Pesquisando via API…';const r=await nativeJSON('/api/openai/research',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,context:nvResearchAttachment})});let msg=r?.text||r?.error||'Não foi possível concluir a pesquisa.';if(r?.billing_error)msg='A API está sem créditos ou atingiu um limite. Sua assinatura do ChatGPT é separada da API. Use “Usar meu ChatGPT” ou ajuste o faturamento da API.';box.textContent=msg;if(r?.text){state.nvResearchHistory=state.nvResearchHistory||[];state.nvResearchHistory.unshift({date:activeDate,prompt,text:r.text});state.nvResearchHistory=state.nvResearchHistory.slice(0,30);saveState()}});

let draggedNVNote=null;
function renderNVQuickNotes(){const c=$('#nvQuickNotes');if(!c)return;const notes=(state.notes||[]).filter(n=>n.area==='channel').slice(0,12);c.innerHTML=notes.length?notes.map(n=>`<article class="nv-quick-note" draggable="true" data-nv-note="${n.id}" data-status="${n.status||'todo'}"><header><i class="status-dot ${n.status||'todo'}"></i><small>${escapeHTML(n.dueDate?formatDateBR(n.dueDate):'sem data')}</small></header><b>${escapeHTML(n.title||'Sem título')}</b><p>${escapeHTML(n.body||'')}</p></article>`).join(''):`<p class="note" style="color:#756865">Crie uma nota para o canal ou use “+ nota”.</p>`;$$('[data-nv-note]',c).forEach(card=>{card.addEventListener('dragstart',()=>{draggedNVNote=card.dataset.nvNote;card.classList.add('dragging')});card.addEventListener('dragend',()=>{draggedNVNote=null;card.classList.remove('dragging')});card.addEventListener('dragover',e=>e.preventDefault());card.addEventListener('drop',e=>{e.preventDefault();const target=card.dataset.nvNote;if(!draggedNVNote||target===draggedNVNote)return;const a=state.notes.findIndex(n=>n.id===draggedNVNote),b=state.notes.findIndex(n=>n.id===target);if(a<0||b<0)return;const [m]=state.notes.splice(a,1);state.notes.splice(b,0,m);saveState();renderNVQuickNotes();renderDashboardNotes()});card.addEventListener('dblclick',()=>showView('notes'))})}
$('#nvQuickNoteAdd')?.addEventListener('click',()=>{createNote('channel','Nova pauta','',false,'todo',activeDate);renderNVQuickNotes();renderDashboardNotes();toast('Nota do canal criada.')});



/* =========================================================
   V27 — INSPIRAÇÃO
   ========================================================= */
let inspirationMode="discover",inspirationActiveBoard="",inspirationActiveInterest="",inspirationSearchResults=[],inspirationSearchBusy=false,inspirationAutoLoaded=false;
const INSPIRATION_STOPWORDS=new Set("para com uma umas uns por dos das de da do em no na nos nas que seu sua seus suas como mais menos muito muita visual referencia referencias inspiração inspiracao ideia ideias estilo projeto projetos the and for with from this that you your uma um ao aos e ou".split(/\s+/));
function userInterests(){return normalizeInterests(state.settings.interests)}
function ensureTasteProfile(){
  state.inspirationTaste={...deepClone(DEFAULT_STATE.inspirationTaste),...(state.inspirationTaste||{}),interestScores:{...(state.inspirationTaste?.interestScores||{})},termScores:{...(state.inspirationTaste?.termScores||{})},domainScores:{...(state.inspirationTaste?.domainScores||{})},dismissed:[...(state.inspirationTaste?.dismissed||[])],actions:[...(state.inspirationTaste?.actions||[])]};
  return state.inspirationTaste;
}
function tasteKey(s=""){return String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}
function tasteTokens(text=""){
  const words=tasteKey(text).replace(/https?:\/\/\S+/g," ").replace(/[^a-z0-9]+/g," ").split(/\s+/).filter(x=>x.length>=3&&!INSPIRATION_STOPWORDS.has(x));
  return [...new Set(words)].slice(0,18);
}
function tasteAdd(map,key,delta){if(!key||!Number.isFinite(delta))return;map[key]=Math.max(-20,Math.min(40,Number(map[key]||0)+delta));if(Math.abs(map[key])<.05)delete map[key]}
function inspirationDomain(url=""){try{return new URL(url).hostname.replace(/^www\./,"")}catch(e){return "referência"}}
function inspirationPinKey(x){return String(x.source||x.image||x.thumb||x.id||"")}
function inspirationItemText(item){return [item.title,item.snippet,item.note,item.query,item.interest].filter(Boolean).join(" ")}
function matchingInterests(item){
  const text=tasteKey(inspirationItemText(item)),out=[];
  for(const interest of userInterests()){const k=tasteKey(interest);if(k&&text.includes(k))out.push(interest)}
  const explicit=String(item.interest||"").trim();if(explicit&&!out.some(x=>tasteKey(x)===tasteKey(explicit))&&userInterests().some(x=>tasteKey(x)===tasteKey(explicit)))out.push(explicit);
  return out;
}
function learnInspiration(item,action,{persist=true}={}){
  const taste=ensureTasteProfile(),weights={save:4,unsave:-1.2,open:.7,more:3.2,less:-4.5,search:.8,manualpin:3};
  const w=weights[action]??0;if(!w)return;
  const interests=matchingInterests(item);if(item.interest&&action!=="search"&&!interests.length)interests.push(String(item.interest).trim());
  interests.forEach(x=>tasteAdd(taste.interestScores,x,w));
  tasteTokens(inspirationItemText(item)).slice(0,10).forEach(t=>tasteAdd(taste.termScores,t,w*.32));
  const domain=item.source?inspirationDomain(item.source):"";if(domain&&domain!=="referência")tasteAdd(taste.domainScores,domain,w*.28);
  if(action==="less")taste.dismissed=[inspirationPinKey(item),...taste.dismissed.filter(x=>x!==inspirationPinKey(item))].slice(0,120);
  if(action==="more")taste.dismissed=taste.dismissed.filter(x=>x!==inspirationPinKey(item));
  taste.signals=Math.max(0,Number(taste.signals||0)+1);taste.updatedAt=new Date().toISOString();
  taste.actions=[{action,key:inspirationPinKey(item),interest:item.interest||"",at:taste.updatedAt},...(taste.actions||[])].slice(0,100);
  if(persist)saveState();renderTasteSummary();
}
function topTasteEntries(map,limit=5){return Object.entries(map||{}).filter(([,v])=>Number(v)>.15).sort((a,b)=>Number(b[1])-Number(a[1])).slice(0,limit)}
function tasteInterestRanking(){
  const taste=ensureTasteProfile(),scores={};userInterests().forEach((x,i)=>scores[x]=(Number(taste.interestScores[x]||0)+Math.max(.35,1.5-i*.05)));
  Object.entries(taste.interestScores||{}).forEach(([k,v])=>{const existing=Object.keys(scores).find(x=>tasteKey(x)===tasteKey(k));scores[existing||k]=Math.max(Number(scores[existing||k]||0),Number(v||0))});
  return Object.entries(scores).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
}
function inspirationItemScore(item){
  const taste=ensureTasteProfile();let score=0,text=tasteKey(inspirationItemText(item));
  for(const [interest,v] of Object.entries(taste.interestScores||{})){if(text.includes(tasteKey(interest)))score+=Number(v||0)*1.3}
  for(const token of tasteTokens(text)){score+=Number(taste.termScores[token]||0)*.55}
  const d=item.source?inspirationDomain(item.source):"";if(d)score+=Number(taste.domainScores[d]||0)*.65;
  if(inspirationIsSaved(item))score+=1.5;return score;
}
function rankInspirationResults(results){
  const taste=ensureTasteProfile(),dismissed=new Set(taste.dismissed||[]);
  return (results||[]).filter(x=>!dismissed.has(inspirationPinKey(x))).map((x,i)=>({...x,_rank:i,_tasteScore:inspirationItemScore(x)})).sort((a,b)=>(b._tasteScore-a._tasteScore)||(a._rank-b._rank));
}
function personalizedInspirationQuery(explore=false){
  const interests=tasteInterestRanking(),taste=ensureTasteProfile(),terms=topTasteEntries(taste.termScores,8).map(([k])=>k);
  let primary="";
  if(explore&&userInterests().length>1){const top=new Set(interests.slice(0,2).map(([x])=>tasteKey(x))),pool=userInterests().filter(x=>!top.has(tasteKey(x)));primary=(pool.length?pool:userInterests())[Math.floor(Math.random()*(pool.length||userInterests().length))]||""}
  else primary=interests[0]?.[0]||userInterests()[0]||"";
  const extra=terms.filter(t=>!tasteKey(primary).includes(t)).slice(0,Number(taste.signals||0)>=4?2:1);
  return [primary,...extra,"referências visuais"].filter(Boolean).join(" ").trim();
}
function renderTasteSummary(){
  const taste=ensureTasteProfile(),signals=Number(taste.signals||0),topI=tasteInterestRanking().slice(0,4).map(([x])=>x),topT=topTasteEntries(taste.termScores,5).map(([x])=>x).filter(x=>!topI.some(i=>tasteKey(i).includes(x))).slice(0,2),labels=[...topI,...topT].slice(0,5);
  const chips=labels.length?labels.map(x=>`<span>${escapeHTML(x)}</span>`).join(""):`<span>começando pelos seus interesses</span>`;
  if($("#inspirationTasteChips"))$("#inspirationTasteChips").innerHTML=chips;if($("#inspirationTasteSignals"))$("#inspirationTasteSignals").textContent=`${signals} ${signals===1?"sinal":"sinais"}`;
  const summary=signals<3?"O feed ainda está começando. Salvar e usar “mais assim” pesa mais.":labels.length?`Seu feed está puxando mais ${labels.slice(0,3).join(", ")}.`:"Ainda aprendendo seu estilo.";
  if($("#inspirationTasteHint"))$("#inspirationTasteHint").textContent=summary;if($("#inspirationLearningSummary"))$("#inspirationLearningSummary").textContent=summary;
  if($("#controlTasteSignals"))$("#controlTasteSignals").textContent=`${signals} ${signals===1?"sinal":"sinais"}`;if($("#controlTasteSummary"))$("#controlTasteSummary").textContent=summary;
}
function resetTasteLearning(){
  state.inspirationTaste=deepClone(DEFAULT_STATE.inspirationTaste);for(const interest of userInterests())state.inspirationTaste.interestScores[interest]=1.5;state.inspirationTaste.updatedAt=new Date().toISOString();saveState();inspirationAutoLoaded=false;inspirationSearchResults=[];renderTasteSummary();renderInspiration(false);toast("Aprendizado reiniciado.","Seus interesses e pins salvos foram preservados.");
}
function ensureInspirationBoards(){
  if(!Array.isArray(state.inspirationBoards)||!state.inspirationBoards.length)state.inspirationBoards=deepClone(DEFAULT_STATE.inspirationBoards);
  if(!state.inspirationBoards.some(x=>x.id==="general"))state.inspirationBoards.unshift({id:"general",name:"Geral",color:state.settings.uiAccent||"#3e7a83"});
}
function boardById(id){ensureInspirationBoards();return state.inspirationBoards.find(x=>x.id===id)||state.inspirationBoards[0]}
function inspirationIsSaved(x){const k=inspirationPinKey(x);return (state.inspirationPins||[]).some(p=>inspirationPinKey(p)===k)}
function renderInterestChips(container,clickable=true){
  if(!container)return;const interests=userInterests();
  container.innerHTML=interests.length?interests.map(x=>`<button class="${x===inspirationActiveInterest?"active":""}" data-inspiration-interest="${escapeHTML(x)}">${escapeHTML(x)}</button>`).join(""):`<button data-open-interest-control>+ definir interesses</button>`;
  if(clickable)$$('[data-inspiration-interest]',container).forEach(b=>b.addEventListener("click",()=>searchInspiration(b.dataset.inspirationInterest,true,{auto:false})));
  $("[data-open-interest-control]",container)?.addEventListener("click",()=>showView("control"));
}
function renderInspirationBoards(){
  ensureInspirationBoards();const box=$("#inspirationBoards");if(!box)return;
  box.innerHTML=state.inspirationBoards.map(b=>`<button class="${inspirationMode==="board"&&inspirationActiveBoard===b.id?"active":""}" data-inspiration-board="${b.id}"><i style="background:${escapeHTML(b.color||state.settings.uiAccent||"#3e7a83")}"></i><span>${escapeHTML(b.name)}</span><b>${(state.inspirationPins||[]).filter(p=>p.boardId===b.id).length}</b></button>`).join("");
  $$('[data-inspiration-board]',box).forEach(btn=>btn.addEventListener("click",()=>{inspirationMode="board";inspirationActiveBoard=btn.dataset.inspirationBoard;renderInspiration(false)}));
  const sel=$("#inspirationPinBoard");if(sel)sel.innerHTML=state.inspirationBoards.map(b=>`<option value="${b.id}">${escapeHTML(b.name)}</option>`).join("");
}
function renderInspirationPinCard(x,savedCard=false){
  const isSaved=savedCard||inspirationIsSaved(x),img=x.thumb||x.image||"",board=savedCard?boardById(x.boardId):null,source=x.source||"";
  return `<article class="inspiration-pin" data-pin-key="${escapeHTML(inspirationPinKey(x))}">
    <div class="inspiration-pin-media" data-pin-open>${img?`<img src="${escapeHTML(img)}" alt="${escapeHTML(x.title||"Referência")}" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentElement.innerHTML='<div class=&quot;inspiration-pin-fallback&quot;>${escapeHTML((x.title||x.interest||"Inspiração").slice(0,42))}</div>'">`:`<div class="inspiration-pin-fallback">${escapeHTML((x.title||x.interest||"Inspiração").slice(0,42))}</div>`}
      <div class="inspiration-pin-actions"><button data-pin-more title="Mais referências assim">✦</button>${savedCard?"":`<button data-pin-less title="Menos referências assim">×</button>`}<button class="${isSaved?"saved":""}" data-pin-save title="${isSaved?"Remover dos salvos":"Salvar"}">${isSaved?"♥":"♡"}</button></div>
    </div>
    <div class="inspiration-pin-copy"><h4>${escapeHTML(x.title||"Sem título")}</h4>${x.note||x.snippet?`<p>${escapeHTML(x.note||x.snippet||"")}</p>`:""}<footer><span>${escapeHTML(source?inspirationDomain(source):(x.interest||"MyWay"))}</span>${board?`<span class="inspiration-pin-board">${escapeHTML(board.name)}</span>`:""}</footer></div>
  </article>`;
}
function inspirationVisibleItems(){
  if(inspirationMode==="saved")return (state.inspirationPins||[]).slice().sort((a,b)=>String(b.savedAt||"").localeCompare(String(a.savedAt||"")));
  if(inspirationMode==="board")return (state.inspirationPins||[]).filter(x=>x.boardId===inspirationActiveBoard).slice().sort((a,b)=>String(b.savedAt||"").localeCompare(String(a.savedAt||"")));
  return inspirationSearchResults;
}
function renderInspirationMasonry(){
  const box=$("#inspirationMasonry"),empty=$("#inspirationEmpty");if(!box)return;const items=inspirationVisibleItems(),savedMode=inspirationMode!=="discover";
  box.innerHTML=items.map(x=>renderInspirationPinCard(x,savedMode)).join("");empty.hidden=items.length>0;if($("#inspirationResultCount"))$("#inspirationResultCount").textContent=`${items.length} ${items.length===1?"item":"itens"}`;if($("#inspirationSavedCount"))$("#inspirationSavedCount").textContent=(state.inspirationPins||[]).length;
  $$(".inspiration-pin",box).forEach((card,i)=>{
    const item=items[i];
    card.querySelector("[data-pin-open]")?.addEventListener("click",e=>{if(e.target.closest(".inspiration-pin-actions"))return;learnInspiration(item,"open");if(item.source)window.open(item.source,"_blank","noopener")});
    card.querySelector("[data-pin-save]")?.addEventListener("click",e=>{e.stopPropagation();toggleInspirationPin(item,savedMode)});
    card.querySelector("[data-pin-more]")?.addEventListener("click",e=>{e.stopPropagation();learnInspiration(item,"more");card.classList.add("learned-more");const q=[item.interest,...tasteTokens(item.title||item.snippet||"").slice(0,3),"referências visuais"].filter(Boolean).join(" ");searchInspiration(q,false,{auto:true});toast("Mais assim.","O feed registrou essa preferência.")});
    card.querySelector("[data-pin-less]")?.addEventListener("click",e=>{e.stopPropagation();learnInspiration(item,"less");inspirationSearchResults=inspirationSearchResults.filter(x=>inspirationPinKey(x)!==inspirationPinKey(item));renderInspiration(false);toast("Entendido.","Vou reduzir referências parecidas.")});
  });
}
function toggleInspirationPin(item,savedMode=false){
  const key=inspirationPinKey(item),found=(state.inspirationPins||[]).find(x=>inspirationPinKey(x)===key);
  if(found){state.inspirationPins=state.inspirationPins.filter(x=>x.id!==found.id);learnInspiration(found,"unsave",{persist:false});if(found.localMediaId&&!state.inspirationPins.some(x=>x.localMediaId===found.localMediaId))nativeJSON(`/api/inspiration/delete?id=${encodeURIComponent(found.localMediaId)}`,{method:"POST"});saveState();toast("Pin removido dos salvos.")}
  else{ensureInspirationBoards();const saved={id:cryptoId(),title:item.title||"Referência",image:item.image||item.thumb||"",thumb:item.thumb||item.image||"",source:item.source||"",snippet:item.snippet||"",note:item.note||"",interest:item.interest||inspirationActiveInterest||"",query:item.query||"",boardId:"general",localMediaId:item.localMediaId||"",savedAt:new Date().toISOString()};state.inspirationPins.unshift(saved);learnInspiration(saved,"save",{persist:false});saveState();toast("Pin salvo.","Essa escolha também ajustou seu feed.")}
  if(inspirationMode==="discover")inspirationSearchResults=rankInspirationResults(inspirationSearchResults);
  renderInspiration(false);
}
async function searchInspiration(query,fromInterest=false,{auto=false}={}){
  query=String(query||"").trim();if(!query||inspirationSearchBusy)return;inspirationSearchBusy=true;inspirationMode="discover";inspirationActiveBoard="";inspirationActiveInterest=fromInterest?query:"";
  if($("#inspirationSearchInput"))$("#inspirationSearchInput").value=query;if($("#inspirationSearchStatus"))$("#inspirationSearchStatus").textContent=`Buscando referências para “${query}”...`;renderInspiration(false);
  if(!auto)learnInspiration({title:query,interest:fromInterest?query:"",query},"search");
  const r=await nativeJSON(`/api/inspiration/search?q=${encodeURIComponent(query)}`);inspirationSearchBusy=false;
  if(!r?.ok){inspirationSearchResults=[];if($("#inspirationSearchStatus"))$("#inspirationSearchStatus").textContent=r?.error||"Não foi possível buscar imagens agora.";renderInspiration(false);return}
  const mapped=(r.results||[]).map(x=>({...x,interest:fromInterest?query:(inspirationActiveInterest||""),query}));inspirationSearchResults=rankInspirationResults(mapped);
  if($("#inspirationSearchStatus"))$("#inspirationSearchStatus").textContent=`${inspirationSearchResults.length} referências · ordenadas pelo seu perfil de gosto.`;renderInspiration(false);
}
function renderInspiration(allowAutoload=true){
  if(!$("#view-inspiration"))return;ensureTasteProfile();ensureInspirationBoards();renderInterestChips($("#inspirationInterestStrip"));renderInspirationBoards();renderTasteSummary();
  $$('[data-inspiration-filter]').forEach(b=>b.classList.toggle("active",b.dataset.inspirationFilter===inspirationMode));const board=inspirationMode==="board"?boardById(inspirationActiveBoard):null;
  if($("#inspirationViewKicker"))$("#inspirationViewKicker").textContent=inspirationMode==="saved"?"SALVOS":inspirationMode==="board"?"QUADRO":"PARA VOCÊ";if($("#inspirationViewTitle"))$("#inspirationViewTitle").textContent=inspirationMode==="saved"?"Tudo que você guardou.":board?board.name:"Ideias para explorar.";renderInspirationMasonry();
  if(allowAutoload&&!inspirationAutoLoaded&&state.settings.inspirationAutoload!==false&&!inspirationSearchResults.length){const q=personalizedInspirationQuery(false);if(q){inspirationAutoLoaded=true;setTimeout(()=>searchInspiration(q,false,{auto:true}),80)}}
}
$$('[data-inspiration-filter]').forEach(b=>b.addEventListener("click",()=>{inspirationMode=b.dataset.inspirationFilter;inspirationActiveBoard="";renderInspiration(false)}));
$("#inspirationSearchBtn")?.addEventListener("click",()=>searchInspiration($("#inspirationSearchInput").value,false,{auto:false}));
$("#inspirationSearchInput")?.addEventListener("keydown",e=>{if(e.key==="Enter")searchInspiration(e.currentTarget.value,false,{auto:false})});
$("#inspirationShuffle")?.addEventListener("click",()=>{const q=personalizedInspirationQuery(true);if(!q)return showView("control");searchInspiration(q,false,{auto:true})});
$("#inspirationNewBoard")?.addEventListener("click",async()=>{const result=await openFormDialog({title:"Novo quadro",description:"Organize suas referências em um quadro.",submitLabel:"Criar quadro",fields:[{key:"name",label:"Nome do quadro",required:true,placeholder:"Ex.: Referências de vídeo"}]});const name=result?.name;if(!name)return;ensureInspirationBoards();const colors=["#3e7a83","#a85f6a","#a37a35","#6b5f99","#4f7c62","#855c3b"],id=`board-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;state.inspirationBoards.push({id,name:name.trim(),color:colors[state.inspirationBoards.length%colors.length]});saveState();inspirationMode="board";inspirationActiveBoard=id;renderInspiration(false)});
$("#inspirationEditInterests")?.addEventListener("click",()=>showView("control"));$("#inspirationTasteReset")?.addEventListener("click",async()=>{if(await askConfirmation("Resetar o que o feed aprendeu? Seus interesses e pins salvos continuam intactos.","Resetar aprendizado"))resetTasteLearning()});$("#controlTasteReset")?.addEventListener("click",async()=>{if(await askConfirmation("Resetar o aprendizado do mural?","Resetar aprendizado"))resetTasteLearning()});
$("#inspirationAddPin")?.addEventListener("click",()=>{$("#inspirationAddPanel").hidden=false;renderInspirationBoards();$("#inspirationPinTitle")?.focus()});$("#inspirationAddClose")?.addEventListener("click",()=>$("#inspirationAddPanel").hidden=true);
async function uploadInspirationFile(file){if(!file)return null;const fd=new FormData();fd.append("file",file,file.name);try{const r=await fetch("/api/inspiration/upload",{method:"POST",body:fd});if(r.ok)return await r.json()}catch(e){}try{return {ok:true,id:"",url:await resizeImageFile(file,1500,.78),embedded:true}}catch(e){return null}}
$("#inspirationPinSave")?.addEventListener("click",async()=>{
  let title=$("#inspirationPinTitle").value.trim(),source=$("#inspirationPinSource").value.trim(),image=$("#inspirationPinImage").value.trim(),note=$("#inspirationPinNote").value.trim(),boardId=$("#inspirationPinBoard").value||"general",localMediaId="";
  const file=$("#inspirationPinFile").files?.[0];if(file){const up=await uploadInspirationFile(file);if(!up?.ok)return toast("Não consegui salvar a imagem local.");image=up.url;localMediaId=up.id;if(!title)title=file.name.replace(/\.[^.]+$/,"")}
  if(!title&&!source&&!image)return toast("Adicione um título, link ou imagem.");const pin={id:cryptoId(),title:title||"Referência",source,image,thumb:image,note,interest:inspirationActiveInterest||"",boardId,localMediaId,savedAt:new Date().toISOString()};state.inspirationPins.unshift(pin);learnInspiration(pin,"manualpin",{persist:false});saveState();
  ["#inspirationPinTitle","#inspirationPinSource","#inspirationPinImage","#inspirationPinNote"].forEach(s=>{if($(s))$(s).value=""});if($("#inspirationPinFile"))$("#inspirationPinFile").value="";$("#inspirationAddPanel").hidden=true;inspirationMode="saved";renderInspiration(false);toast("Pin salvo.");
});
$("#inspirationPinFile")?.addEventListener("change",e=>{const f=e.target.files?.[0];if(f&&!$("#inspirationPinTitle").value)$("#inspirationPinTitle").value=f.name.replace(/\.[^.]+$/,"")});
function renderInterestControls(){const ints=userInterests();if($("#controlInterests")&&document.activeElement!==$("#controlInterests"))$("#controlInterests").value=ints.join(", ");const box=$("#controlInterestChips");if(box)box.innerHTML=ints.length?ints.map(x=>`<span class="interest-chip">${escapeHTML(x)}</span>`).join(""):`<span class="note">Nenhum interesse definido.</span>`;renderTasteSummary()}
$("#controlInterestsSave")?.addEventListener("click",()=>{state.settings.interests=normalizeInterests($("#controlInterests").value);ensureTasteProfile();for(const interest of userInterests())if(Number(state.inspirationTaste.interestScores[interest]||0)<1.5)state.inspirationTaste.interestScores[interest]=1.5;saveState();renderInterestControls();inspirationAutoLoaded=false;inspirationSearchResults=[];toast("Interesses atualizados.","O mural combina sua seleção com o que aprende no uso.")});

function renderNVInsights(){
  const c=$("#nvInsights");if(!c)return;
  state.nvInsights=state.nvInsights||[];
  c.innerHTML=state.nvInsights.length?state.nvInsights.map(x=>`<article class="nv-insight" draggable="true" data-nv-insight="${x.id}"><header><span>${escapeHTML(x.type||"Insight")}</span><button data-nv-insight-delete>×</button></header><input data-nv-insight-title value="${escapeHTML(x.title||"Insight")}"><textarea data-nv-insight-body placeholder="Escreva o insight...">${escapeHTML(x.body||"")}</textarea></article>`).join(""):`<p class="note" style="color:#817977">Nenhum insight ainda.</p>`;
  let dragging="";
  $$("[data-nv-insight]",c).forEach(card=>{
    const item=state.nvInsights.find(x=>x.id===card.dataset.nvInsight);if(!item)return;
    card.querySelector("[data-nv-insight-title]").addEventListener("input",e=>{item.title=e.target.value;saveState()});
    card.querySelector("[data-nv-insight-body]").addEventListener("input",e=>{item.body=e.target.value;saveState()});
    card.querySelector("[data-nv-insight-delete]").addEventListener("click",()=>{state.nvInsights=state.nvInsights.filter(x=>x.id!==item.id);saveState();renderNVInsights()});
    card.addEventListener("dragstart",()=>{dragging=item.id;card.classList.add("dragging")});
    card.addEventListener("dragend",()=>{dragging="";card.classList.remove("dragging")});
    card.addEventListener("dragover",e=>e.preventDefault());
    card.addEventListener("drop",e=>{e.preventDefault();if(!dragging||dragging===item.id)return;const a=state.nvInsights.findIndex(x=>x.id===dragging),b=state.nvInsights.findIndex(x=>x.id===item.id);if(a<0||b<0)return;const [m]=state.nvInsights.splice(a,1);state.nvInsights.splice(b,0,m);saveState();renderNVInsights()});
  });
}
function createNVInsight(){
  const title=$("#nvInsightTitle")?.value.trim()||"Novo insight",type=$("#nvInsightType")?.value||"Outro";
  state.nvInsights.unshift({id:cryptoId(),title,type,body:"",createdAt:new Date().toISOString()});
  if($("#nvInsightTitle"))$("#nvInsightTitle").value="";
  saveState();renderNVInsights();
}
$("#nvInsightCreate")?.addEventListener("click",createNVInsight);
$("#nvInsightAdd")?.addEventListener("click",()=>{if($("#nvInsightTitle"))$("#nvInsightTitle").focus();});
$("#nvInsightTitle")?.addEventListener("keydown",e=>{if(e.key==="Enter")createNVInsight()});

$$("[data-nv-launch]").forEach(btn=>btn.addEventListener("click",async()=>{
  const app=btn.dataset.nvLaunch;
  if(app==="youtube"){const u=channelUrl();if(u)window.open(u,"_blank","noopener");else toast("Configure a URL do canal.","Creator Studio → Identidade visual.");return;}
  const r=await nativeJSON(`/api/system/launch?app=${encodeURIComponent(app)}`,{method:"POST"});
  if(!r?.ok)toast("Não consegui abrir o aplicativo.",r?.error||"Verifique se ele está instalado.");
}));

function renderChannel(){renderChannelIdeas34();if(!$('#nvContentList'))return;applyProductLabels();applyChannelBrand();renderProductConfigInputs();renderNVAnalytics();renderNVQuickNotes();renderNVInsights();renderNVResearchFavorites();refreshAIStatus();const all=state.nvContent||[],ym=monthKey(activeDate),published=all.filter(x=>x.status==='published').length,publishedMonth=all.filter(x=>x.status==='published'&&(x.publishedAt||x.date||'').startsWith(ym)).length,ideas=all.filter(x=>x.status==='idea').length,prod=all.filter(x=>['research','script','recording','editing','thumbnail'].includes(x.status)).length;$('#nvIdeasCount').textContent=ideas;$('#nvProductionCount').textContent=prod;$('#nvPublishedCount').textContent=published;$('#nvPublishedMonth').textContent=publishedMonth;const target=Math.max(0,Number(state.settings.nvMonthlyTarget||0)),pct=target?Math.min(100,publishedMonth/target*100):(publishedMonth?100:0);$('#nvMonthProgress').style.width=`${pct}%`;$('#nvMonthText').textContent=target?`${publishedMonth} de ${target} publicação(ões) na meta deste mês.`:`${publishedMonth} publicação(ões) registradas neste mês.`;const filtered=all.filter(x=>nvFilter==='all'||(nvFilter==='production'&&['research','script','recording','editing','thumbnail'].includes(x.status))||x.status===nvFilter);$('#nvContentList').innerHTML=filtered.length?filtered.map(item=>`<article class="nv-content-card" data-nv-card="${item.id}"><div class="nv-content-thumb" data-nv-thumb-zone>${item.thumbnail?`<img src="${item.thumbnail}" alt="thumb">`:''}<button data-nv-thumb-pick title="Clique ou arraste uma imagem">${item.thumbnail?"Atualizar thumb":"Enviar thumb"}</button><input type="file" data-nv-thumb-input accept="image/png,image/jpeg,image/webp" hidden>${item.thumbnail?'<button data-nv-thumb-remove title="Remover thumbnail">Remover</button>':''}</div><div class="nv-content-main"><div class="nv-content-row" data-nv-id="${item.id}" data-status="${item.status||'idea'}"><i class="nv-state-dot"></i><input data-nv-title value="${escapeHTML(item.title||'Sem título')}" aria-label="Título"><select data-nv-pillar>${(channelPillars().length?channelPillars():['Conteúdo']).map(x=>`<option ${x===item.pillar?'selected':''}>${escapeHTML(x)}</option>`).join('')}</select><select data-nv-status>${nvStatusOptions(item.status||'idea')}</select><input data-nv-date type="date" value="${escapeHTML(item.dueDate||'')}"><div class="nv-progress-wrap"><input data-nv-progress type="range" min="0" max="100" value="${Number(item.progress??nvStatusProgress(item.status))}"><small>${Number(item.progress??nvStatusProgress(item.status))}%</small></div><button class="nv-delete" data-nv-delete>×</button></div><div class="nv-content-assets"><span>${item.script?.name?`roteiro: ${escapeHTML(item.script.name)}`:'sem roteiro'}</span><button data-nv-script-attach>+ roteiro</button><input type="file" data-nv-script-input accept=".txt,.md,.rtf,.pdf,.docx" hidden><span>${item.thumbnail?'thumb registrada':'sem thumb'}</span></div></div></article>`).join(''):`<p class="note" style="color:#817977">Nada nesta etapa ainda. Adicione uma ideia acima.</p>`;$$('[data-nv-card]',$('#nvContentList')).forEach(card=>{const item=state.nvContent.find(x=>x.id===card.dataset.nvCard),row=card.querySelector('[data-nv-id]');if(!item||!row)return;row.querySelector('[data-nv-title]').addEventListener('input',e=>{item.title=e.target.value;saveState()});row.querySelector('[data-nv-pillar]').addEventListener('change',e=>{item.pillar=e.target.value;saveState()});row.querySelector('[data-nv-date]').addEventListener('change',e=>{item.dueDate=e.target.value;saveState()});row.querySelector('[data-nv-status]').addEventListener('change',e=>{const prevStatus=item.status,prevProgress=Number(item.progress??nvStatusProgress(item.status));item.status=e.target.value;item.progress=nvStatusProgress(item.status);if(item.status==='published'&&prevStatus!=='published')item.publishedAt=activeDate;if(item.status!=='published'&&prevStatus==='published')item.publishedAt='';logGoalTransition(item,"channel",prevProgress,card);saveState();renderChannel()});row.querySelector('[data-nv-progress]').addEventListener('input',e=>{const prev=Number(item.progress||0);item.progress=Number(e.target.value);e.target.parentElement.querySelector('small').textContent=`${item.progress}%`;logGoalTransition(item,"channel",prev,card);saveState()});row.querySelector('[data-nv-delete]').addEventListener('click',()=>{state.nvContent=state.nvContent.filter(x=>x.id!==item.id);saveState();renderChannel()});const tz=card.querySelector('[data-nv-thumb-zone]');card.querySelector('[data-nv-thumb-pick]').addEventListener('click',()=>card.querySelector('[data-nv-thumb-input]').click());card.querySelector('[data-nv-thumb-input]').addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;if(!/^image\/(png|jpeg|webp)$/.test(file.type)||file.size>8*1024*1024)return toast('Envie PNG, JPG ou WebP de até 8 MB.');try{item.thumbnail=await resizeImageFile(file,900,.8);item.thumbnailUpdatedAt=new Date().toISOString();saveState();renderChannel();toast('Thumbnail atualizada no MyWay.','Para publicar a alteração, envie a imagem também pelo YouTube Studio.');}catch{toast('Não consegui ler essa imagem.');}});card.querySelector('[data-nv-thumb-remove]')?.addEventListener('click',()=>{item.thumbnail='';saveState();renderChannel();});['dragenter','dragover'].forEach(ev=>tz.addEventListener(ev,e=>{e.preventDefault();tz.classList.add('dragover')}));['dragleave','drop'].forEach(ev=>tz.addEventListener(ev,e=>{e.preventDefault();tz.classList.remove('dragover')}));tz.addEventListener('drop',async e=>{const f=e.dataTransfer.files?.[0];if(f&&/^image\/(png|jpeg|webp)$/.test(f.type)&&f.size<=8*1024*1024){try{item.thumbnail=await resizeImageFile(f,900,.8);saveState();renderChannel();toast('Thumbnail atualizada no MyWay.');}catch{toast('Não consegui ler essa imagem.');}}else if(f)toast('Envie PNG, JPG ou WebP de até 8 MB.');});card.querySelector('[data-nv-script-attach]').addEventListener('click',()=>card.querySelector('[data-nv-script-input]').click());card.querySelector('[data-nv-script-input]').addEventListener('change',async e=>{const f=e.target.files?.[0];if(f){item.script=await readScriptFile(f);saveState();renderChannel()}})});}
$('#nvAddContent')?.addEventListener('click',()=>{const title=$('#nvTitle').value.trim();if(!title)return toast('Dê um título para a ideia.');const status=$('#nvStatus').value||'idea';state.nvContent.unshift({id:cryptoId(),title,pillar:$('#nvPillar').value||(channelPillars()[0]||'Conteúdo'),status,dueDate:$('#nvDueDate').value||'',notes:$('#nvNotes').value.trim(),progress:nvStatusProgress(status),date:activeDate,publishedAt:status==='published'?activeDate:'',script:nvPendingScript,thumbnail:nvPendingThumb,createdAt:new Date().toISOString()});$('#nvTitle').value='';$('#nvNotes').value='';$('#nvStatus').value='idea';nvPendingScript=null;nvPendingThumb='';$('#nvScriptName').textContent='arraste ou escolha um arquivo';$('#nvThumbDrop').classList.remove('has-preview');$('#nvThumbPreview').src='';saveState();renderChannel();toast(`Conteúdo adicionado a ${state.settings.channelName||'seu canal'}.`)});
$$('[data-nv-filter]').forEach(b=>b.addEventListener('click',()=>{nvFilter=b.dataset.nvFilter;$$('[data-nv-filter]').forEach(x=>x.classList.toggle('active',x===b));renderChannel()}));

