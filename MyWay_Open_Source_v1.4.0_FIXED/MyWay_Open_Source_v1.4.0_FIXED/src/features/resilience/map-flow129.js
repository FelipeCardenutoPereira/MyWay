/* v1.2.9 · Mapa de escolhas: criação e ligação visíveis, propósito nas conexões e alternativas contextuais. */
let mapLinkSource129=null;
const PURPOSES129={
  trigger_thought:{id:'desencadeia',label:'Isso costuma despertar este pensamento'},
  thought_behavior:{id:'aumenta-vontade',label:'Este pensamento costuma aumentar esta vontade'},
  behavior_consequence:{id:'leva-depois',label:'Esta reação costuma levar a isto depois'},
  any_alternative:{id:'abre-alternativa',label:'Aqui posso interromper o ciclo com uma alternativa'},
  alternative_support:{id:'apoio',label:'Este apoio torna a alternativa mais fácil'},
  generic:{id:'relacao-percebida',label:'Percebo uma relação entre estas duas caixas'}
};
function cleanText129(value=''){return String(value).toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function nodeById129(id){return triggerTreeState40().nodes.find(n=>n.id===id)||null;}
function inferPurpose129(fromNode,toNode){
  if(toNode?.type==='alternative')return PURPOSES129.any_alternative;
  if(fromNode?.type==='alternative'&&toNode?.type==='support61')return PURPOSES129.alternative_support;
  if(fromNode?.type==='trigger'&&toNode?.type==='thought52')return PURPOSES129.trigger_thought;
  if(fromNode?.type==='thought52'&&toNode?.type==='behavior')return PURPOSES129.thought_behavior;
  if(fromNode?.type==='behavior'&&toNode?.type==='consequence')return PURPOSES129.behavior_consequence;
  return PURPOSES129.generic;
}
function suggestionRows129(node){
  const text=cleanText129([node?.title,node?.note,...(node?.entries61||[]).slice(-2).map(x=>x.text)].join(' '));
  const rows=[];
  const add=(label,why)=>{if(!rows.some(x=>x.label===label))rows.push({label,why});};
  if(/aposta|cassino|bet|jogo/.test(text)){
    add('Sair do app/site e bloquear o acesso por 15 minutos','cria distância do impulso');
    add('Mandar mensagem para alguém de confiança antes de decidir','coloca uma pausa entre vontade e ação');
    add('Trocar por uma atividade curta já escolhida','reduz o tempo de exposição ao gatilho');
  }
  if(/procrast|adiar|estudo|trabalho|tarefa/.test(text)){
    add('Fazer só 5 minutos da próxima ação concreta','reduz o tamanho da tarefa');
    add('Abrir apenas o material necessário e esconder o restante','diminui distrações');
    add('Definir um fim pequeno: “até este parágrafo / este item”','cria um ponto de chegada claro');
  }
  if(/ansied|nervos|tens|panico|preocup/.test(text)){
    add('Afastar-se do gatilho por 2 minutos e respirar mais devagar','ajuda a reduzir a urgência antes de decidir');
    add('Nomear o que está acontecendo em uma frase objetiva','separa fato, pensamento e reação');
    add('Escolher uma ação pequena que esteja sob seu controle agora','traz a atenção para o presente');
  }
  if(/alcool|bebid|cerveja|vinho|cigar|nicotin|maconha/.test(text)){
    add('Mudar de ambiente e adiar a decisão por 10 minutos','quebra a sequência automática');
    add('Pegar água ou outra bebida sem álcool e ocupar as mãos','substitui parte do ritual');
    add('Avisar alguém de confiança que a vontade apareceu','adiciona apoio antes da decisão');
  }
  if(/compra|shopping|gasto|cartao/.test(text)){
    add('Salvar no carrinho e esperar até amanhã','cria tempo entre desejo e compra');
    add('Anotar o valor e comparar com uma meta importante','traz a decisão para um contexto maior');
  }
  if(/raiva|briga|discuss|irrit/.test(text)){
    add('Não responder por 10 minutos','evita decidir no pico da reação');
    add('Escrever o que quer dizer antes de enviar','cria uma etapa de revisão');
  }
  if(/instagram|tiktok|youtube|celular|telefone|rede social|scroll/.test(text)){
    add('Fechar o app e deixar o celular fora do alcance por 10 minutos','reduz o acesso automático');
    add('Abrir a tarefa que você queria fazer antes do celular','troca o gatilho por uma ação definida');
  }
  if(!rows.length){
    add('Criar uma pausa curta antes de agir','dá tempo para escolher em vez de só reagir');
    add('Mudar de ambiente por alguns minutos','reduz a exposição ao gatilho');
    add('Pedir apoio a alguém ou usar um recurso já combinado','torna a alternativa mais fácil de executar');
  }
  return rows.slice(0,3);
}
function mapDockMarkup129(){
  return `<div class="map-dock-main129"><button type="button" class="primary" id="mapAdd129">+ Caixa</button><button type="button" class="ghost" id="mapConnect129">Ligar</button><button type="button" class="text-button" id="mapOrganize129">Organizar</button></div><div class="map-add-pop129" id="mapAddPop129" hidden>${SIMPLE_NODE_TYPES127.map(([type,label,hint])=>`<button type="button" data-map-add129="${type}"><b>${label}</b><small>${hint}</small></button>`).join('')}</div><div class="map-link-status129" id="mapLinkStatus129" hidden><span></span><button type="button" class="text-button" data-cancel-link129>Cancelar</button></div><div class="map-suggestions129" id="mapSuggestions129" hidden></div>`;
}
function ensureMapDock129(){
  const viewport=$('#treeCanvas40')?.parentElement;if(!viewport||$('#mapDock129'))return;
  const dock=document.createElement('aside');dock.id='mapDock129';dock.className='map-dock129';dock.innerHTML=mapDockMarkup129();viewport.prepend(dock);
  const add=$('#mapAdd129'),pop=$('#mapAddPop129');add.onclick=()=>{pop.hidden=!pop.hidden;$('#mapSuggestions129').hidden=true;};
  pop.querySelectorAll('[data-map-add129]').forEach(b=>b.onclick=async()=>{pop.hidden=true;const node=paletteNode61(b.dataset.mapAdd129);if(node){await editNode61(node.id);renderCanvas61();}});
  $('#mapConnect129').onclick=()=>{
    mapLinkSource129=null;treeConnection40=null;paintLinkMode129();setText40($('#treeHint40'),'Escolha a caixa de origem tocando no ponto + ao lado direito dela.');
  };
  $('#mapOrganize129').onclick=()=>organizeNodes61();
  dock.querySelector('[data-cancel-link129]').onclick=()=>cancelLink129();
}
function cancelLink129(){mapLinkSource129=null;treeConnection40=null;paintLinkMode129();setText40($('#treeHint40'),'Ligação cancelada.');}
function paintLinkMode129(){
  const status=$('#mapLinkStatus129');
  $$('#treeCanvas40 [data-tree-node40]').forEach(el=>el.classList.toggle('map-link-source129',el.dataset.treeNode40===mapLinkSource129));
  if(status){status.hidden=!mapLinkSource129;const node=nodeById129(mapLinkSource129);status.querySelector('span').textContent=node?`Ligando a partir de: ${node.title}. Agora toque em outra caixa.`:'';}
  const connect=$('#mapConnect129');if(connect){connect.classList.toggle('active129',!!mapLinkSource129);connect.textContent=mapLinkSource129?'Ligando…':'Ligar';}
}
function purposeChoices129(fromNode,toNode){
  const inferred=inferPurpose129(fromNode,toNode);
  const all=[inferred,PURPOSES129.any_alternative,PURPOSES129.generic];
  if(fromNode?.type==='trigger')all.push(PURPOSES129.trigger_thought);
  if(fromNode?.type==='thought52')all.push(PURPOSES129.thought_behavior);
  if(fromNode?.type==='behavior')all.push(PURPOSES129.behavior_consequence);
  return [...new Map(all.map(x=>[x.id,x])).values()].slice(0,4);
}
function connectionDialog129(fromId,toId){
  const from=nodeById129(fromId),to=nodeById129(toId);if(!from||!to)return;
  const d=document.createElement('dialog');d.className='connection-purpose129';
  const choices=purposeChoices129(from,to),inferred=inferPurpose129(from,to);
  d.innerHTML=`<form method="dialog" class="connection-purpose-card129"><button type="button" class="close65" aria-label="Fechar">×</button><p class="eyebrow">PROPÓSITO DA LIGAÇÃO</p><h3>${escapeHTML(from.title)} <span>→</span> ${escapeHTML(to.title)}</h3><p class="note">Escolha o que esta seta significa para você. Isso deixa o mapa útil, não apenas visual.</p><div class="purpose-choices129">${choices.map(x=>`<button type="button" class="${x.id===inferred.id?'selected129':''}" data-purpose129="${escapeHTML(x.id)}">${escapeHTML(x.label)}</button>`).join('')}</div><label class="purpose-note129"><span>Detalhe opcional</span><input maxlength="160" id="purposeNote129" placeholder="Ex.: quando chego cansado depois do trabalho"></label><footer><button type="button" class="ghost" data-purpose-cancel129>Cancelar</button><button type="button" class="primary" data-purpose-save129>Salvar ligação</button></footer></form>`;
  let selected=inferred.id;
  d.querySelectorAll('[data-purpose129]').forEach(b=>b.onclick=()=>{selected=b.dataset.purpose129;d.querySelectorAll('[data-purpose129]').forEach(x=>x.classList.toggle('selected129',x===b));});
  const close=()=>{d.close();d.remove();};d.querySelector('.close65').onclick=close;d.querySelector('[data-purpose-cancel129]').onclick=close;
  d.querySelector('[data-purpose-save129]').onclick=()=>{
    const before=new Set(triggerTreeState40().edges.map(e=>e.id)),message=treeConnect40(fromId,toId);if(message){toast(message);return;}
    const edge=triggerTreeState40().edges.find(e=>!before.has(e.id))||triggerTreeState40().edges.find(e=>e.from===fromId&&e.to===toId);
    const def=Object.values(PURPOSES129).find(x=>x.id===selected)||PURPOSES129.generic;if(edge){edge.purpose129=def.id;edge.purposeLabel129=def.label;edge.purposeNote129=$('#purposeNote129')?.value.trim()||'';edge.updatedAt=new Date().toISOString();}
    mapLinkSource129=null;treeConnection40=null;saveState();close();renderCanvas61();showSuggestionsForNode129(fromId);setText40($('#treeHint40'),'Ligação salva com propósito. Você pode criar uma alternativa a partir das sugestões.');
  };
  document.body.append(d);d.addEventListener('click',e=>{if(e.target===d)close();});d.showModal();
}
function startOrFinishLink129(id){
  if(!mapLinkSource129){mapLinkSource129=id;treeConnection40=id;paintLinkMode129();setText40($('#treeHint40'),'Agora toque na caixa de destino. A ligação vai pedir um propósito.');showSuggestionsForNode129(id);return;}
  if(mapLinkSource129===id){cancelLink129();return;}
  const from=mapLinkSource129;connectionDialog129(from,id);
}
function createSuggestedAlternative129(sourceId,row){
  const source=nodeById129(sourceId);if(!source)return;
  const n=paletteNode61('alternative','',{x:(Number(source.x)||0)+210,y:Number(source.y)||0});if(!n)return;
  n.title=row.label.slice(0,100);n.note=row.label+(row.why?` — ${row.why}.`:'');n.draft61=true;
  const before=new Set(triggerTreeState40().edges.map(e=>e.id));const message=treeConnect40(source.id,n.id);if(message){toast(message);return;}
  const edge=triggerTreeState40().edges.find(e=>!before.has(e.id));if(edge){edge.purpose129=PURPOSES129.any_alternative.id;edge.purposeLabel129=PURPOSES129.any_alternative.label;edge.purposeNote129=row.why||'';}
  saveState();renderCanvas61();setText40($('#treeHint40'),'Alternativa adicionada. Abra a caixa quando quiser personalizar o texto.');
}
function showSuggestionsForNode129(id){
  const dock=$('#mapDock129'),box=$('#mapSuggestions129'),node=nodeById129(id);if(!dock||!box||!node)return;
  const rows=suggestionRows129(node);box.hidden=false;box.innerHTML=`<div><b>Alternativas para este gatilho</b><small>Sugestões práticas; escolha só as que fizerem sentido.</small></div>${rows.map((r,i)=>`<button type="button" data-suggestion129="${i}"><span>${escapeHTML(r.label)}</span><small>${escapeHTML(r.why)}</small><b>+</b></button>`).join('')}`;
  box.querySelectorAll('[data-suggestion129]').forEach(b=>b.onclick=()=>createSuggestedAlternative129(id,rows[Number(b.dataset.suggestion129)]));
}
function purposeLabelForEdge129(edge){return edge.purposeLabel129||inferPurpose129(nodeById129(edge.from),nodeById129(edge.to)).label;}
function renderEdgePurposeBadges129(){
  const canvas=$('#treeCanvas40');if(!canvas)return;canvas.querySelectorAll('.edge-purpose129').forEach(x=>x.remove());
  const nodes=new Map(triggerTreeState40().nodes.map(n=>[n.id,n]));for(const edge of triggerTreeState40().edges){const a=nodes.get(edge.from),b=nodes.get(edge.to);if(!a||!b)continue;const badge=document.createElement('button');badge.type='button';badge.className='edge-purpose129';badge.textContent=purposeLabelForEdge129(edge);badge.title=edge.purposeNote129||'Editar propósito da ligação';badge.style.left=`${Math.max(10,((Number(a.x)||0)+(Number(b.x)||0))/2+76)}px`;badge.style.top=`${Math.max(10,((Number(a.y)||0)+(Number(b.y)||0))/2+28)}px`;badge.onclick=()=>editEdgePurpose129(edge.id);canvas.append(badge);}
}
function editEdgePurpose129(edgeId){
  const edge=triggerTreeState40().edges.find(e=>e.id===edgeId);if(!edge)return;connectionDialogEdit129(edge);
}
function connectionDialogEdit129(edge){
  const from=nodeById129(edge.from),to=nodeById129(edge.to);if(!from||!to)return;
  const d=document.createElement('dialog');d.className='connection-purpose129';const choices=purposeChoices129(from,to);let selected=edge.purpose129||inferPurpose129(from,to).id;
  d.innerHTML=`<form method="dialog" class="connection-purpose-card129"><button type="button" class="close65" aria-label="Fechar">×</button><p class="eyebrow">EDITAR LIGAÇÃO</p><h3>${escapeHTML(from.title)} <span>→</span> ${escapeHTML(to.title)}</h3><div class="purpose-choices129">${choices.map(x=>`<button type="button" class="${x.id===selected?'selected129':''}" data-purpose129="${escapeHTML(x.id)}">${escapeHTML(x.label)}</button>`).join('')}</div><label class="purpose-note129"><span>Detalhe opcional</span><input maxlength="160" id="purposeEditNote129" value="${escapeHTML(edge.purposeNote129||'')}"></label><footer><button type="button" class="text-button danger-text126" data-purpose-remove129>Remover ligação</button><button type="button" class="primary" data-purpose-save129>Salvar</button></footer></form>`;
  const close=()=>{d.close();d.remove();};d.querySelector('.close65').onclick=close;d.querySelectorAll('[data-purpose129]').forEach(b=>b.onclick=()=>{selected=b.dataset.purpose129;d.querySelectorAll('[data-purpose129]').forEach(x=>x.classList.toggle('selected129',x===b));});
  d.querySelector('[data-purpose-save129]').onclick=()=>{const def=Object.values(PURPOSES129).find(x=>x.id===selected)||PURPOSES129.generic;edge.purpose129=def.id;edge.purposeLabel129=def.label;edge.purposeNote129=$('#purposeEditNote129')?.value.trim()||'';saveState();close();renderCanvas61();};
  d.querySelector('[data-purpose-remove129]').onclick=()=>{triggerTreeState40().edges=triggerTreeState40().edges.filter(e=>e.id!==edge.id);saveState();close();renderCanvas61();};document.body.append(d);d.addEventListener('click',e=>{if(e.target===d)close();});d.showModal();
}
function decorateNodes129(){
  const canvas=$('#treeCanvas40');if(!canvas)return;
  canvas.querySelectorAll('[data-tree-node40]').forEach(el=>{
    const id=el.dataset.treeNode40;if(el.querySelector('.node-link-port129'))return;
    const port=document.createElement('button');port.type='button';port.className='node-link-port129';port.setAttribute('aria-label','Iniciar ou concluir ligação');port.title='Ligar esta caixa';port.textContent='+';port.onclick=e=>{e.stopPropagation();startOrFinishLink129(id);};el.append(port);
    el.addEventListener('click',e=>{if(!mapLinkSource129||e.target.closest('button'))return;e.preventDefault();e.stopPropagation();startOrFinishLink129(id);});
    el.addEventListener('dblclick',e=>{if(e.target.closest('button'))return;showSuggestionsForNode129(id);});
  });
  paintLinkMode129();renderEdgePurposeBadges129();
}
function simplifyMapChrome129(){
  $('#treeZoomOut65')?.closest('.tree-zoom65')?.classList.add('map-legacy-zoom129');
  const how=$('.resilience-how126');if(how)how.innerHTML='<span><b>1</b> + Caixa</span><span><b>2</b> Preencha</span><span><b>3</b> + para ligar</span><span><b>4</b> Dê um propósito</span>';
  const hint=$('#treeHint40');if(hint)hint.textContent='Use + Caixa para começar. Para ligar, toque no + da primeira caixa e depois na caixa de destino.';
}
function initMapFlow129(){
  ensureMapDock129();simplifyMapChrome129();
  const oldCanvas=renderCanvas61;renderCanvas61=function(...args){const r=oldCanvas(...args);ensureMapDock129();decorateNodes129();return r;};renderTriggerTree40=renderCanvas61;
  const oldDraw=drawEdges61;drawEdges61=function(...args){const r=oldDraw(...args);renderEdgePurposeBadges129();return r;};drawTreeEdges40=drawEdges61;
  const originalConnect=treeConnect40;treeConnect40=function(from,to){const msg=originalConnect(from,to);if(!msg){const edge=triggerTreeState40().edges.findLast?.(e=>e.from===from&&e.to===to)||[...triggerTreeState40().edges].reverse().find(e=>e.from===from&&e.to===to);if(edge&&!edge.purposeLabel129){const def=inferPurpose129(nodeById129(from),nodeById129(to));edge.purpose129=def.id;edge.purposeLabel129=def.label;}}return msg;};
  renderCanvas61();
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mapLinkSource129)cancelLink129();});
}
initMapFlow129();
