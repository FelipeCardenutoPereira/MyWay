/* v1.2.6 · Resiliência simples: um único painel para adicionar, planejar e configurar. */
let resilienceTab126='add';
function setResilienceTab126(name){
  resilienceTab126=name;
  $$('#nodePalette61 [data-res-tab126]').forEach(b=>{const on=b.dataset.resTab126===name;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on));});
  $$('#nodePalette61 [data-res-panel126]').forEach(p=>p.hidden=p.dataset.resPanel126!==name);
}
function rebuildResiliencePanel126(){
  const tree=$('#triggerTree40'),aside=$('#nodePalette61'),layout=$('.canvas-layout61'),toggle=$('#paletteToggle61'),organize=$('#organizeNodes61');if(!tree||!aside||!layout||aside.dataset.ux126==='1')return;
  aside.dataset.ux126='1';tree.classList.add('resilience-simple126');
  const title=tree.querySelector('.feature-head40 h3');if(title)title.textContent='Seu mapa e suas escolhas';
  const intro=document.createElement('div');intro.className='resilience-how126';intro.innerHTML='<span><b>1</b> Adicione</span><span><b>2</b> Escreva o que aconteceu</span><span><b>3</b> Conecte uma alternativa</span>';
  tree.querySelector('.feature-head40')?.after(intro);
  if(toggle){toggle.textContent='Adicionar / ajustes';toggle.classList.add('primary');toggle.classList.remove('ghost');}
  if(organize)organize.textContent='Organizar mapa';
  const head=aside.querySelector(':scope>header');if(head){head.querySelector('h4').textContent='Mapa e escolhas';head.querySelector('.note').textContent='Tudo o que você precisa para montar e ajustar o mapa fica aqui.';}
  const tabs=document.createElement('div');tabs.className='resilience-tabs126';tabs.setAttribute('role','tablist');tabs.innerHTML='<button type="button" data-res-tab126="add" class="active" role="tab">Adicionar</button><button type="button" data-res-tab126="plan" role="tab">Plano</button><button type="button" data-res-tab126="settings" role="tab">Ajustes</button>';head?.after(tabs);
  const add=document.createElement('section');add.className='resilience-panel126';add.dataset.resPanel126='add';
  const plan=document.createElement('section');plan.className='resilience-panel126';plan.dataset.resPanel126='plan';plan.hidden=true;
  const settings=document.createElement('section');settings.className='resilience-panel126';settings.dataset.resPanel126='settings';settings.hidden=true;
  const search=$('#paletteSearch61')?.closest('label'),list=$('#paletteList61'),pager=$('#palettePagination124'),custom=$('#customCare61'),models=aside.querySelector('.palette-models61');
  for(const el of [search,list,pager,custom,models])if(el)add.append(el);
  const planWrap=$('.plan-panel61'),planCard=planWrap?.querySelector('.paper-card');if(planCard){planCard.querySelector('h3').textContent='Minha próxima escolha';planCard.querySelector('.v34-help').textContent='Escolha um tema, uma alternativa simples e, se quiser, um apoio.';plan.append(planCard);planWrap.remove();}
  const prefs=aside.querySelector('.palette-prefs61'),settingsCard=$('#resilienceSettingsCard34');if(settingsCard){settingsCard.querySelector('h3').textContent='Temas e lembretes';settings.append(settingsCard);}prefs?.remove();
  aside.append(add,plan,settings);tabs.querySelectorAll('[data-res-tab126]').forEach(b=>b.onclick=()=>setResilienceTab126(b.dataset.resTab126));
  toggle?.addEventListener('click',()=>setResilienceTab126('add'));
  setResilienceTab126('add');
}
function simplifyNodeTypes126(){
  const labels={trigger:['Gatilho','O que aconteceu?','Situação ou contexto.'],thought52:['Pensamento','O que passou pela cabeça?','Uma frase curta já basta.'],emotion52:['Emoção','O que senti?','Nomeie a emoção.'],behavior:['Ação / vontade','O que fiz ou tive vontade de fazer?','Descreva a ação ou impulso.'],consequence:['Depois','O que aconteceu depois?','Registre a consequência percebida.'],alternative:['Alternativa','O que posso tentar?','Uma ação pequena e possível.'],support61:['Apoio','Quem ou o que ajuda?','Pessoa, recurso ou ambiente de apoio.']};
  for(const [id,row] of Object.entries(labels)){if(!NODE_TYPES61[id])continue;NODE_TYPES61[id].label=row[0];NODE_TYPES61[id].title=row[1];NODE_TYPES61[id].hint=row[2];}
}
function compactNodeDialog126(id){
  const node=triggerTreeState40().nodes.find(n=>n.id===id);if(!node)return;
  const d=document.createElement('dialog');d.className='node-detail-dialog65 node-dialog126';
  const box=document.createElement('section');box.className='node-detail65 tools-content49';
  box.innerHTML='<button class="close65" type="button" aria-label="Fechar">×</button><p class="eyebrow"></p><h2></h2><p class="node-summary126"></p><div class="node-main-actions126"><button type="button" class="primary" data-node-main126></button><button type="button" class="ghost" data-node-edit126>Editar</button><button type="button" class="ghost" data-node-link126>Conectar</button></div><details class="node-more-actions126"><summary>Mais opções</summary><div></div></details>';
  box.querySelector('.eyebrow').textContent=nodeType61(node.type).label;box.querySelector('h2').textContent=node.title;box.querySelector('.node-summary126').textContent=node.note||nodeType61(node.type).hint;
  const main=box.querySelector('[data-node-main126]');main.textContent=node.draft61?'Preencher caixa':'Novo registro';main.onclick=()=>{d.close();node.draft61?editNode61(id):feedNode61(id);};
  box.querySelector('[data-node-edit126]').onclick=()=>{d.close();editNode61(id);};
  box.querySelector('[data-node-link126]').onclick=()=>{d.close();if(!treeConnection40){treeConnection40=id;setText40($('#treeHint40'),'Agora abra a caixa de destino e escolha Conectar.');}else{const message=treeConnect40(treeConnection40,id);if(message){setText40($('#treeHint40'),message);return;}treeConnection40=null;saveState();renderCanvas61();}};
  const more=box.querySelector('.node-more-actions126>div');
  if(['trigger','behavior'].includes(node.type)){const choice=document.createElement('button');choice.type='button';choice.className='ghost';choice.textContent='Registrar minha escolha';choice.onclick=()=>{d.close();recordAvoidedTree41(id);};more.append(choice);}
  const remove=document.createElement('button');remove.type='button';remove.className='text-button danger-text126';remove.textContent='Remover caixa';remove.onclick=async()=>{const snapshot=state,owner=owner61();if(await askConfirmation('Remover esta caixa e suas ligações?','Remover')&&sameWorkspace61(snapshot,owner)){d.close();deleteTreeNode40(id);saveState();renderCanvas61();}};more.append(remove);
  box.querySelector('.close65').onclick=()=>d.close();d.append(box);document.body.append(d);d.addEventListener('close',()=>d.remove());d.addEventListener('click',e=>{if(e.target===d)d.close();});d.showModal();
}
function initResilienceUx126(){
  simplifyNodeTypes126();rebuildResiliencePanel126();
  nodeDetails65=compactNodeDialog126;
  const oldCanvas=renderCanvas61;renderCanvas61=function(...args){const r=oldCanvas(...args);$$('#treeCanvas40 [data-tree-node40]').forEach(el=>{const more=el.querySelector('.node-more124');if(more)more.onclick=e=>{e.preventDefault();e.stopPropagation();compactNodeDialog126(el.dataset.treeNode40);};});return r;};renderTriggerTree40=renderCanvas61;renderCanvas61();
}
initResilienceUx126();
