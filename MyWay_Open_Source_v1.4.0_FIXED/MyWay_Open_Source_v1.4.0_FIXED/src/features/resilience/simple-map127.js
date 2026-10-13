/* v1.2.7 · Mapa de escolhas: um único painel, menos tipos e ações mais óbvias. */
const SIMPLE_NODE_TYPES127=[
  ['trigger','Situação','O que aconteceu?'],
  ['thought52','Pensamento','O que passou pela cabeça?'],
  ['behavior','Reação','O que você fez ou teve vontade de fazer?'],
  ['alternative','Alternativa','O que você pode tentar no lugar?']
];
function quickNodePanel127(){
  const add=$('#nodePalette61 [data-res-panel126="add"]');if(!add||$('#quickNodes127'))return;
  const quick=document.createElement('section');quick.id='quickNodes127';quick.className='quick-nodes127';
  quick.innerHTML='<div class="quick-nodes-head127"><b>Adicionar uma caixa</b><small>Escolha só o que precisa agora. Você pode conectar depois.</small></div><div class="quick-nodes-grid127">'+SIMPLE_NODE_TYPES127.map(([type,label,hint])=>`<button type="button" data-quick-node127="${type}"><b>${label}</b><small>${hint}</small></button>`).join('')+'</div><div class="quick-theme-label127"><b>Ou escolha um tema para cuidar</b><small>Ex.: procrastinação, apostas, compras, ansiedade ou um tema seu.</small></div>';
  add.prepend(quick);quick.querySelectorAll('[data-quick-node127]').forEach(b=>b.onclick=()=>paletteNode61(b.dataset.quickNode127));
  const models=add.querySelector('.palette-models61');if(models)models.hidden=true;
}
function unifyResilienceControls127(){
  const tree=$('#triggerTree40'),aside=$('#nodePalette61'),toggle=$('#paletteToggle61'),settings=$('#nodePalette61 [data-res-panel126="settings"]');if(!tree||!aside||!toggle)return;
  tree.classList.add('resilience-v127');toggle.textContent='Montar mapa';toggle.classList.add('primary');
  const head=aside.querySelector(':scope>header');if(head){head.querySelector('h4').textContent='Montar meu mapa';head.querySelector('.note').textContent='Adicionar caixas, planejar uma alternativa e ajustar lembretes ficam no mesmo lugar.';}
  $$('#nodePalette61 [data-res-tab126]').forEach(b=>{if(b.dataset.resTab126==='add')b.textContent='Caixas';if(b.dataset.resTab126==='plan')b.textContent='Próxima escolha';if(b.dataset.resTab126==='settings')b.textContent='Ajustes';});
  const organize=$('#organizeNodes61');if(organize&&settings&&!settings.contains(organize)){organize.textContent='Organizar caixas automaticamente';organize.classList.remove('map-organize124');organize.classList.add('ghost','organize-inside127');settings.append(organize);}
  const how=$('.resilience-how126');if(how)how.innerHTML='<span><b>1</b> Registre a situação</span><span><b>2</b> O que pensou ou fez</span><span><b>3</b> Crie uma alternativa</span>';
  const hint=$('#treeHint40');if(hint&&!hint.dataset.simple127){hint.dataset.simple127='1';hint.textContent='Comece em “Montar mapa”. Use poucas caixas e conecte apenas o que fizer sentido.';}
  quickNodePanel127();
}
function compactNodeDialog127(id){
  const node=triggerTreeState40().nodes.find(n=>n.id===id);if(!node)return;
  const d=document.createElement('dialog');d.className='node-detail-dialog65 node-dialog126 node-dialog127';
  const box=document.createElement('section');box.className='node-detail65 tools-content49';
  box.innerHTML='<button class="close65" type="button" aria-label="Fechar">×</button><p class="eyebrow"></p><h2></h2><p class="node-summary126"></p><div class="node-main-actions127"><button type="button" class="primary" data-node-record127></button><button type="button" class="ghost" data-node-link127>Conectar</button></div><details class="node-edit-more127"><summary>Editar ou remover</summary><div><button type="button" class="ghost" data-node-edit127>Editar caixa</button><button type="button" class="text-button danger-text126" data-node-remove127>Remover caixa</button></div></details>';
  box.querySelector('.eyebrow').textContent=nodeType61(node.type).label;box.querySelector('h2').textContent=node.title;box.querySelector('.node-summary126').textContent=node.note||nodeType61(node.type).hint;
  const record=box.querySelector('[data-node-record127]');record.textContent=node.draft61?'Preencher':'Registrar';record.onclick=()=>{d.close();node.draft61?editNode61(id):feedNode61(id);};
  box.querySelector('[data-node-link127]').onclick=()=>{d.close();if(!treeConnection40){treeConnection40=id;setText40($('#treeHint40'),'Agora abra a caixa de destino e escolha Conectar.');}else{const message=treeConnect40(treeConnection40,id);if(message){setText40($('#treeHint40'),message);return;}treeConnection40=null;saveState();renderCanvas61();}};
  box.querySelector('[data-node-edit127]').onclick=()=>{d.close();editNode61(id);};
  box.querySelector('[data-node-remove127]').onclick=async()=>{const snapshot=state,owner=owner61();if(await askConfirmation('Remover esta caixa e suas ligações?','Remover')&&sameWorkspace61(snapshot,owner)){d.close();deleteTreeNode40(id);saveState();renderCanvas61();}};
  box.querySelector('.close65').onclick=()=>d.close();d.append(box);document.body.append(d);d.addEventListener('close',()=>d.remove());d.addEventListener('click',e=>{if(e.target===d)d.close();});d.showModal();
}
function simplifyPalette127(){
  const types=$('#paletteTypes61');if(types)types.closest('.palette-models61')?.setAttribute('hidden','');
  const custom=$('#customCare61');if(custom){custom.textContent='+ Criar meu próprio tema';custom.classList.add('custom-care127');}
  const search=$('#paletteSearch61');if(search){search.placeholder='Buscar tema: ansiedade, apostas…';search.closest('label')?.querySelector('span')?.replaceChildren(document.createTextNode('Buscar tema'));}
}
function initSimpleMap127(){
  unifyResilienceControls127();simplifyPalette127();
  compactNodeDialog126=compactNodeDialog127;nodeDetails65=compactNodeDialog127;
  const basePalette=renderPalette61;renderPalette61=function(...args){const r=basePalette(...args);simplifyPalette127();quickNodePanel127();return r;};
  const baseCanvas=renderCanvas61;renderCanvas61=function(...args){const r=baseCanvas(...args);$$('#treeCanvas40 .node61').forEach((el,i)=>{el.dataset.step127=String((i%9)+1);el.querySelector('.node-status61')?.remove();el.querySelector('.node-actions61')?.remove();el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label','Abrir detalhes desta caixa');el.onclick=e=>{if(e.target.closest('button'))return;compactNodeDialog127(el.dataset.treeNode40);};el.onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('button')){e.preventDefault();compactNodeDialog127(el.dataset.treeNode40);}};});drawEdges61();return r;};renderTriggerTree40=renderCanvas61;
  renderPalette61();renderCanvas61();
}
initSimpleMap127();
