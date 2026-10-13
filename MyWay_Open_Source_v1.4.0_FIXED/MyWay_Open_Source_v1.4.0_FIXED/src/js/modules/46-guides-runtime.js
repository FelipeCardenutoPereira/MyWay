function learningState37(){
 if(!state.learning37||typeof state.learning37!=='object'||Array.isArray(state.learning37))state.learning37={};
 const l=state.learning37;if(!l.progress||typeof l.progress!=='object'||Array.isArray(l.progress))l.progress={};
 if(!l.dismissed||typeof l.dismissed!=='object'||Array.isArray(l.dismissed))l.dismissed={};return l;
}
function availableGuides37(){return LEARNING_GUIDES37.filter(g=>(!g.master||isMasterUser())&&(g.id!=='wellness'||!isMasterUser()));}
function guideProgress37(g){const l=learningState37();let p=l.progress[g.id];if(!p||typeof p!=='object'||Array.isArray(p))p=l.progress[g.id]={index:0,skipped:[]};p.index=Math.max(0,Math.min(g.steps.length-1,Math.floor(Number(p.index)||0)));if(!Array.isArray(p.skipped))p.skipped=[];return p;}
function guideStatus37(g){const p=guideProgress37(g);return p.done?'Guia visto'+(p.practiced?' · prática feita':''):p.started?'Retomar · etapa '+(p.index+1)+'/'+g.steps.length:g.steps.length+' etapas · prática opcional';}
function clearGuideHighlight37(){if(learningHighlight37){learningHighlight37.classList.remove('guide-target37');learningHighlight37.removeAttribute('data-guide-label37');learningHighlight37=null;}}
function pauseGuide37(announce=false){
 if(learningActive37){learningState37().last=learningActive37;saveState();}
 learningActive37=null;learningCleanup37?.();learningCleanup37=null;clearGuideHighlight37();$('#learningCoach37')?.remove();refreshLearning37();if(announce)toast('Guia pausado.','Retome pelo botão Como usar, no topo.');
}
function openLearningHub37(view=''){
 pauseGuide37();$('#learningHub37')?.close();
 const d=document.createElement('dialog');d.id='learningHub37';d.className='myway-dialog learning-hub37';d.setAttribute('aria-labelledby','learningHubTitle37');
 const all=availableGuides37(),last=all.find(g=>g.id===learningState37().last&&!guideProgress37(g).done);
 d.innerHTML=`<header class="learning-hub-head37"><div><p class="eyebrow">NO SEU RITMO</p><h2 id="learningHubTitle37">Como usar o MyWay</h2></div><button type="button" class="ghost" data-hub-close37 aria-label="Fechar guias">Fechar</button></header><p>Escolha uma ferramenta. Veja onde clicar, uma etapa por vez. As práticas são opcionais e usam dados de exemplo.</p>${last?`<button class="primary" data-resume37="${last.id}">Retomar: ${escapeHTML(last.title)}</button>`:''}<div class="learning-search37"><label>Buscar ferramenta<input type="search" id="learningSearch37" placeholder="Ex.: Kanban, notas, foco, backup"></label><label>Mostrar<select id="learningFilter37"><option value="">Todas as ferramentas</option>${[...new Set(all.map(g=>g.view))].map(v=>`<option value="${v}" ${v===view?'selected':''}>${escapeHTML(all.find(g=>g.view===v).title)}</option>`).join('')}</select></label></div><div class="learning-catalog37" id="learningCatalog37"></div><p class="learning-empty37" id="learningEmpty37" hidden>Nenhum guia encontrado. Tente outro termo ou escolha todas as ferramentas.</p><p class="learning-foot37">Você pode pular etapas, pular a prática ou pausar. O progresso do guia fica salvo neste computador.</p>`;
 document.body.append(d);
 const list=()=>{const term=$('#learningSearch37').value.trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,''),filter=$('#learningFilter37').value;const items=all.filter(g=>(!filter||g.view===filter)&&(!term||[g.title,g.description,g.view,...g.steps.map(s=>s.text)].join(' ').toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(term)));$('#learningCatalog37').innerHTML=items.map(g=>`<article><h3>${escapeHTML(g.title)}</h3><p>${escapeHTML(g.description)}</p><small>${escapeHTML(guideStatus37(g))}</small><button type="button" class="ghost" data-start-guide37="${g.id}">${guideProgress37(g).done?'Rever guia':guideProgress37(g).started?'Retomar guia':'Abrir guia'}</button></article>`).join('');$('#learningEmpty37').hidden=!!items.length;};
 list();d.querySelector('[data-hub-close37]').onclick=()=>d.close();d.querySelector('#learningSearch37').oninput=list;d.querySelector('#learningFilter37').onchange=list;
 d.onclick=e=>{const b=e.target.closest('[data-start-guide37],[data-resume37]');if(!b)return;const id=b.dataset.startGuide37||b.dataset.resume37;d.close();startGuide37(id);};
 d.addEventListener('close',()=>{state.settings.tutorialSeen=true;saveState();d.remove();$('#learningHelp37')?.focus();},{once:true});d.showModal();
}
function startGuide37(id){
 const g=availableGuides37().find(x=>x.id===id);if(!g)return false;
 if(state.focus36?.until>Date.now()&&g.view!==state.focus36.target&&!['control','data'].includes(g.view)){
  toast('Esta ferramenta está fora do foco atual.','No botão Modo foco, encerre ou troque a prioridade para abrir este guia.');return false;
 }
 if(!featureEnabled(g.view)){toast('Ative esta ferramenta para acompanhar.','Use Completo no topo ou Personalizar e depois reabra o guia.');return false;}
 pauseGuide37();showView(g.view);if(!$('#view-'+g.view)?.classList.contains('active'))return false;
 const p=guideProgress37(g);if(p.done){p.index=0;p.done=false;p.skipped=[];}p.started=true;learningState37().last=g.id;learningActive37=g.id;saveState();renderGuideCoach37();refreshLearning37();return true;
}
function advanceGuide37(skip=false){const g=availableGuides37().find(x=>x.id===learningActive37);if(!g)return;const p=guideProgress37(g);if(skip&&!p.skipped.includes(p.index))p.skipped.push(p.index);if(p.index<g.steps.length-1){p.index++;saveState();renderGuideCoach37();}else{p.done=true;p.finishedAt=new Date().toISOString();saveState();pauseGuide37();toast('Guia percorrido.','Você pode rever ou escolher outra ferramenta em Como usar.');}}
function showGuideTarget37(){
 const g=availableGuides37().find(x=>x.id===learningActive37);if(!g)return;const s=g.steps[guideProgress37(g).index];
 const targets=$$(s.target);const target=targets.find(el=>!el.closest('[hidden]')&&(!el.closest('.view')||el.closest('.view').classList.contains('active')))||$('#view-'+g.view)?.querySelector('.section-head');
 clearGuideHighlight37();if(!target)return;const coach=$('#learningCoach37');if(coach){coach.classList.add('learning-minimized37');if(!coach.querySelector('[data-guide-expand37]')){const expand=document.createElement('button');expand.type='button';expand.className='ghost';expand.textContent='Ver etapa';expand.dataset.guideExpand37='';expand.onclick=()=>{coach.classList.remove('learning-minimized37');expand.remove();};coach.querySelector('header').append(expand);}}learningHighlight37=target;target.classList.add('guide-target37');target.setAttribute('data-guide-label37',s.title);target.scrollIntoView({behavior:state.settings.animationsEnabled===false||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
 const msg=$('#guideLocation37');if(msg)msg.textContent=targets.includes(target)?'O controle está destacado. Use os campos da ferramenta quando quiser.':'Primeiro crie ou abra um item nesta tela para ver esse controle. A prática de exemplo continua disponível.';
}
function renderGuideCoach37(){
 learningCleanup37?.();learningCleanup37=null;clearGuideHighlight37();$('#learningCoach37')?.remove();
 const g=availableGuides37().find(x=>x.id===learningActive37);if(!g){learningActive37=null;return;}
 const p=guideProgress37(g),s=g.steps[p.index],c=document.createElement('aside');c.id='learningCoach37';c.className='learning-coach37';c.setAttribute('aria-labelledby','guideStepTitle37');c.setAttribute('role','region');
 c.innerHTML=`<header><span>${escapeHTML(g.title)}</span><button class="text-button" type="button" data-pause-guide37 aria-label="Pausar guia">Pausar</button></header><p class="learning-counter37">Etapa ${p.index+1} de ${g.steps.length}</p><progress max="${g.steps.length}" value="${p.index+1}" aria-label="Etapa do guia"></progress><div class="guide-heading38"><h3 id="guideStepTitle37" tabindex="-1">${escapeHTML(s.title)}</h3>${illustration38(g.view,p.index)}</div><p>${escapeHTML(s.text)}</p><button type="button" class="ghost" data-guide-where37>Mostrar onde clicar</button><p class="learning-location37" id="guideLocation37" role="status"></p><div class="learning-practice37" id="learningPractice37">${p.practiced?'<p>✓ Prática de exemplo concluída.</p>':p.practiceSkipped?'<p>Prática pulada. Você pode seguir no seu ritmo.</p><button class="text-button" type="button" data-practice37>Experimentar agora</button>':'<button class="ghost" type="button" data-practice37>Praticar com exemplo · opcional</button>'}</div><nav aria-label="Etapas do guia"><button class="ghost" type="button" data-guide-back37 ${p.index===0?'disabled':''}>Voltar</button><button class="primary" type="button" data-guide-next37>${p.index===g.steps.length-1?'Concluir guia':'Próxima etapa'}</button></nav><footer><button class="text-button" type="button" data-guide-skip37>Pular esta etapa</button><button class="text-button" type="button" data-guide-all37>Ver outros guias</button></footer>`;
 document.body.append(c);c.querySelector('[data-pause-guide37]').onclick=()=>pauseGuide37(true);c.querySelector('[data-guide-where37]').onclick=showGuideTarget37;c.querySelector('[data-guide-next37]').onclick=()=>advanceGuide37();c.querySelector('[data-guide-back37]').onclick=()=>{p.index=Math.max(0,p.index-1);saveState();renderGuideCoach37();};c.querySelector('[data-guide-skip37]').onclick=()=>advanceGuide37(true);c.querySelector('[data-guide-all37]').onclick=()=>openLearningHub37(g.view);c.querySelector('[data-practice37]')?.addEventListener('click',()=>renderGuidePractice37(g));c.querySelector('#guideStepTitle37').focus({preventScroll:true});
}
function renderGuidePractice37(g){
 const box=$('#learningPractice37');if(!box||g.id!==learningActive37)return;learningCleanup37?.();learningCleanup37=null;
 const finish=()=>{const p=guideProgress37(g);p.practiced=true;p.practiceSkipped=false;saveState();box.innerHTML='<p role="status">✓ Prática concluída no exemplo. Nenhum registro pessoal foi alterado.</p>';refreshLearning37();};
 const note=(text,error=false)=>{const el=box.querySelector('[data-practice-feedback37]');el.textContent=text;el.classList.toggle('practice-error37',error);};
 const shell=html=>{box.innerHTML=`<p class="learning-demo-label37">PRÁTICA OPCIONAL · DADOS DE EXEMPLO</p>${html}<p data-practice-feedback37 role="status" aria-live="polite"></p><button type="button" class="text-button" data-practice-skip37>Pular prática</button>`;box.querySelector('[data-practice-skip37]').onclick=()=>{guideProgress37(g).practiceSkipped=true;saveState();renderGuideCoach37();};};
 if(g.practice==='kanban'){
  shell('<p>Mova o cartão “Abrir o arquivo” para Fazendo e depois Feito. Arraste pelo ⠿ ou use a lista de status.</p><div class="demo-kanban37"><div data-demo-col37="todo"><b>A Fazer</b><article id="demoCard37"><button type="button" draggable="true" id="demoGrip37" aria-label="Arrastar cartão de exemplo">⠿</button> Abrir o arquivo</article></div><div data-demo-col37="doing"><b>Fazendo</b></div><div data-demo-col37="done"><b>Feito</b></div></div><label>Status do exemplo<select id="demoStatus37"><option value="todo">A Fazer</option><option value="doing">Fazendo</option><option value="done">Feito</option></select></label>');
  let doing=false;const move=status=>{if(status==='done'&&!doing){note('Passe primeiro por Fazendo. Você pode usar a lista de status.',true);box.querySelector('#demoStatus37').value='todo';return;}const col=box.querySelector(`[data-demo-col37="${status}"]`),card=box.querySelector('#demoCard37');if(!col||!card)return;col.append(card);box.querySelector('#demoStatus37').value=status;if(status==='doing'){doing=true;note('Agora mova para Feito.');}if(status==='done')finish();};
  box.querySelector('#demoStatus37').onchange=e=>move(e.target.value);box.querySelector('#demoGrip37').ondragstart=e=>e.dataTransfer?.setData('text/plain','myway-demo37');box.querySelectorAll('[data-demo-col37]').forEach(col=>{col.ondragover=e=>e.preventDefault();col.ondrop=e=>{e.preventDefault();if(e.dataTransfer?.getData('text/plain')==='myway-demo37')move(col.dataset.demoCol37);};});
  const controller=new AbortController();learningCleanup37=()=>controller.abort();let dragging=false;box.querySelector('#demoGrip37').onpointerdown=e=>{if(e.button!==0)return;dragging=true;e.preventDefault();};document.addEventListener('pointerup',e=>{if(!dragging)return;dragging=false;const col=document.elementFromPoint?.(e.clientX,e.clientY)?.closest('[data-demo-col37]');if(col&&box.contains(col))move(col.dataset.demoCol37);},{signal:controller.signal});return;
 }
 if(g.practice==='note'){
  shell('<p>Ative Negrito, escreva uma palavra e salve esta nota de exemplo.</p><button type="button" class="ghost" id="demoBold37" aria-pressed="false">Negrito</button><label>Texto de exemplo<textarea id="demoNote37" placeholder="Escreva uma palavra"></textarea></label><div id="demoNotePreview37" aria-label="Prévia da nota"></div><button type="button" class="ghost" id="demoNoteSave37">Salvar exemplo</button>');let bold=false;const preview=()=>{const el=box.querySelector('#demoNotePreview37');el.textContent=box.querySelector('#demoNote37').value;el.style.fontWeight=bold?'700':'400';};box.querySelector('#demoBold37').onclick=e=>{bold=!bold;e.currentTarget.setAttribute('aria-pressed',String(bold));preview();};box.querySelector('#demoNote37').oninput=preview;box.querySelector('#demoNoteSave37').onclick=()=>{if(!bold||!box.querySelector('#demoNote37').value.trim())return note('Ative Negrito e escreva uma palavra antes de salvar.',true);finish();};return;
 }
 if(g.practice==='habit'){
  shell('<p>Você caminhou 5 minutos. Registre isso no exemplo abaixo.</p><label>Minutos de caminhada<input type="number" id="demoHabit37" min="0" max="1000" value="0"></label><button class="ghost" type="button" id="demoHabitSave37">Registrar exemplo</button>');box.querySelector('#demoHabitSave37').onclick=()=>{if(Number(box.querySelector('#demoHabit37').value)!==5)return note('Neste exemplo foram 5 minutos. Use esse valor.',true);finish();};return;
 }
 if(g.practice==='finance'){
  shell('<p>Você pagou R$ 30 por um almoço. Cadastre uma saída neste exemplo.</p><label>Tipo<select id="demoFinanceType37"><option value="in">Entrada</option><option value="out">Saída</option></select></label><label>Valor em reais<input type="number" step="0.01" id="demoFinanceAmount37" min="0"></label><button type="button" class="ghost" id="demoFinanceSave37">Registrar exemplo</button>');box.querySelector('#demoFinanceSave37').onclick=()=>{if(box.querySelector('#demoFinanceType37').value!=='out'||Number(box.querySelector('#demoFinanceAmount37').value)!==30)return note('O almoço foi uma saída de R$ 30. Confira tipo e valor.',true);finish();};return;
 }
 if(g.practice==='trigger'){
  shell('<p>Exemplo: tensão → beber → fumar → gastar dinheiro. Em qual ponto você prepararia uma alternativa?</p><label>Ponto para agir<select id="demoTriggerPoint37"><option value="">Escolha um ponto</option><option value="before">Antes de beber</option><option value="middle">Antes de fumar</option><option value="money">Antes de gastar</option></select></label><label>Uma alternativa concreta<input id="demoTriggerAction37" placeholder="Ex.: caminhar e falar com alguém"></label><button type="button" class="ghost" id="demoTriggerSave37">Testar plano de exemplo</button>');box.querySelector('#demoTriggerSave37').onclick=()=>{if(!box.querySelector('#demoTriggerPoint37').value||box.querySelector('#demoTriggerAction37').value.trim().length<4)return note('Escolha um ponto e escreva uma ação concreta. Pode ser uma frase curta.',true);finish();};return;
 }
 if(g.practice==='flashcard'){
  shell('<p>Qual é a capital do Brasil? Tente lembrar antes de revelar.</p><button type="button" class="ghost" id="demoFlashReveal37">Revelar resposta</button><p id="demoFlashAnswer37" hidden>Brasília.</p><div id="demoFlashGrade37" hidden><button type="button" class="ghost" data-demo-grade37>Preciso rever</button><button type="button" class="ghost" data-demo-grade37>Lembrei</button></div>');box.querySelector('#demoFlashReveal37').onclick=()=>{box.querySelector('#demoFlashAnswer37').hidden=false;box.querySelector('#demoFlashGrade37').hidden=false;};box.querySelectorAll('[data-demo-grade37]').forEach(b=>b.onclick=finish);return;
 }
 if(g.practice==='backup'){
  shell('<p>Verifique este arquivo fictício antes de importar. Este exercício não importa dados no aplicativo.</p><label>Conteúdo JSON de exemplo<textarea id="demoBackup37" spellcheck="false">{"version":36,"notes":[],"days":{}}</textarea></label><button type="button" class="ghost" id="demoBackupCheck37">Verificar exemplo</button>');box.querySelector('#demoBackupCheck37').onclick=()=>{let obj;try{obj=JSON.parse(box.querySelector('#demoBackup37').value);}catch{return note('O exemplo precisa ser um JSON válido. Confira aspas, chaves e vírgulas.',true);}if(!obj||typeof obj!=='object'||Array.isArray(obj)||!Array.isArray(obj.notes)||!obj.days||typeof obj.days!=='object'||Array.isArray(obj.days))return note('Confira se o exemplo contém notes como lista e days como objeto.',true);finish();};return;
 }
 shell(`<form id="demoChoice37"><fieldset><legend>${escapeHTML(g.question)}</legend>${g.options.map((o,i)=>`<label class="demo-option37"><input type="radio" name="answer37" value="${i}">${escapeHTML(o)}</label>`).join('')}</fieldset><button class="ghost" type="submit">Conferir resposta</button></form>`);
 box.querySelector('#demoChoice37').onsubmit=e=>{e.preventDefault();const selected=box.querySelector('[name=answer37]:checked');if(!selected)return note('Escolha uma opção, ou pule a prática se preferir.',true);if(Number(selected.value)!==g.answer)return note('Tente outra opção. '+g.feedback,true);finish();const done=document.createElement('p');done.textContent=g.feedback;box.append(done);};
}
function refreshLearning37(){
 const all=availableGuides37();$$('.learning-strip37').forEach(strip=>{const view=strip.dataset.learningView37,g=all.find(x=>x.view===view);strip.hidden=!g||learningState37().dismissed[view]===true;const label=strip.querySelector('[data-learning-step37]');if(g&&label)label.textContent=(guideProgress37(g).started&&!guideProgress37(g).done?'Retome o guia quando quiser.':'Primeiro passo: '+g.steps[0].title.toLocaleLowerCase('pt-BR')+'.');});
}
function initLearning37(){
 const nav=$('.navigation-access34');if(nav){const b=document.createElement('button');b.id='learningHelp37';b.type='button';b.className='ghost';b.textContent='Como usar';b.onclick=()=>openLearningHub37();nav.append(b);}
 $$('.view').forEach(view=>{const v=view.id.replace('view-','');const strip=document.createElement('div');strip.className='learning-strip37';strip.dataset.learningView37=v;strip.innerHTML='<span data-learning-step37></span><button type="button" class="text-button" data-learning-open37>Guia desta tela</button><button type="button" class="text-button" data-learning-hide37 aria-label="Ocultar dica desta tela">Ocultar dica</button>';const head=view.querySelector(':scope > .section-head');if(head)head.after(strip);else view.prepend(strip);strip.querySelector('[data-learning-open37]').onclick=()=>openLearningHub37(v);strip.querySelector('[data-learning-hide37]').onclick=()=>{learningState37().dismissed[v]=true;saveState();refreshLearning37();};});
 const originalShow=showView;showView=function(name){originalShow(name);if($('#view-'+name)?.classList.contains('active')&&learningActive37&&LEARNING_GUIDES37.find(g=>g.id===learningActive37)?.view!==name)pauseGuide37(true);refreshLearning37();};
 const originalAll=renderAll;renderAll=function(...args){const result=originalAll(...args);refreshLearning37();return result;};
 let learningLogin37=normalizedLogin();const originalAccess=applyAccessProfile;applyAccessProfile=function(...args){const result=originalAccess(...args);if(learningLogin37!==normalizedLogin()){pauseGuide37();$('#learningHub37')?.close();learningLogin37=normalizedLogin();}if(learningActive37&&!availableGuides37().some(g=>g.id===learningActive37))pauseGuide37();refreshLearning37();return result;};
 showFirstRunTutorial=function(force=false){if(!force&&state.settings.tutorialSeen===true)return;$('#firstRunTutorial')?.setAttribute('hidden','');openLearningHub37('today');};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&learningActive37&&!document.querySelector('dialog[open]'))pauseGuide37(true);});refreshLearning37();
}

function syncThemeControls37(){
 const theme=state.settings.theme==='dark'?'dark':'light';
 $$('[data-panel-theme37]').forEach(b=>{const active=b.dataset.panelTheme37===theme;b.setAttribute('aria-pressed',String(active));b.classList.toggle('active',active);});
 $$('[name="onboardTheme37"]').forEach(r=>r.checked=r.value===theme);
 const preview=$('#onboardThemePreview37');if(preview){preview.dataset.previewTheme37=theme;preview.querySelector('b').textContent=theme==='dark'?'Prévia do modo escuro':'Prévia do modo claro';}
}
function initTheme37(){
 const nav=$('.navigation-access34');if(nav){const group=document.createElement('div');group.id='visibleTheme37';group.className='theme-switch37';group.setAttribute('role','group');group.setAttribute('aria-label','Escolher aparência');group.innerHTML='<button type="button" data-panel-theme37="light" aria-pressed="false"><span aria-hidden="true">☀</span> Claro</button><button type="button" data-panel-theme37="dark" aria-pressed="false"><span aria-hidden="true">☾</span> Escuro</button>';nav.prepend(group);group.querySelectorAll('button').forEach(b=>b.onclick=()=>{applyTheme(b.dataset.panelTheme37);saveState();});}
 const originalTheme=applyTheme;applyTheme=function(...args){originalTheme(...args);syncThemeControls37();};
 const originalPrefill=prefillOnboarding;prefillOnboarding=function(...args){originalPrefill(...args);syncThemeControls37();};
 $$('[name="onboardTheme37"]').forEach(r=>r.addEventListener('change',()=>{if(r.checked){applyTheme(r.value);saveState();}}));syncThemeControls37();
}

/* Small local vector illustrations; decorative, with no remote requests. */
function illustration38(view,step=0){
 const shapes={
 work:'<rect x="17" y="23" width="62" height="44" rx="6"/><path d="M37 23v-7h22v7M17 38h62M43 35h10v8H43"/>',
 puc:'<path d="M16 24c13-7 22-5 32 1 10-6 19-8 32-1v43c-13-6-23-5-32 1-9-6-19-7-32-1zM48 25v43M25 34l14 1M25 43l14 1M57 34l14-1M57 43l14-1"/>',
 finance:'<rect x="17" y="24" width="62" height="43" rx="7"/><path d="M24 24v-9h47v9M79 35H60v21h19"/><circle cx="67" cy="45" r="2"/><path d="M28 39h18M28 49h10"/>',
 future:'<path d="M13 41 48 14 83 41M23 34v36h50V34M40 70V49h16v21"/><path d="M21 78h54"/>',
 culture:'<rect x="15" y="23" width="66" height="46" rx="6"/><path d="M15 35h66M27 23v12M43 23v12M59 23v12M73 23v12"/><path d="m41 45 16 8-16 8z"/>',
 notes:'<rect x="25" y="14" width="48" height="60" rx="6"/><path d="M35 29h27M35 39h27M35 49h18M17 58l6 6 12-14"/>',
 habits:'<rect x="19" y="23" width="58" height="47" rx="6"/><path d="M19 35h58M31 17v12M65 17v12M31 47l5 5 8-10M54 47h12M31 61h14M54 61h12"/>',
 meditation:'<circle cx="48" cy="25" r="7"/><path d="M36 56 43 38h10l7 18M25 42l11 8 12-5 12 5 11-8M23 64l15-8 10 7 10-7 15 8M23 64c8 12 42 12 50 0"/>',
 english:'<path d="M18 19h60v39H48L35 71V58H18zM30 43l8-15 8 15M33 37h10M56 29h12M59 29c0 11-5 15-8 15M54 33c2 6 6 10 14 12"/>',
 channel:'<rect x="15" y="24" width="53" height="43" rx="7"/><path d="m68 36 14-8v35L68 55M36 36l16 10-16 10z"/>',
 reminders:'<path d="M27 60V40c0-16 9-22 21-22s21 6 21 22v20l7 7H20zM40 73c0 10 16 10 16 0"/><circle cx="71" cy="21" r="9"/><path d="M71 16v5l3 2"/>',
 today:'<circle cx="48" cy="43" r="28"/><path d="M48 24v21l13 8M13 43h7M76 43h7M48 8v7M48 71v7"/>',
 journal:'<rect x="21" y="16" width="55" height="58" rx="6"/><path d="M31 16v58M42 30h23M42 40h23M42 50h15M16 27h10M16 44h10M16 60h10"/>',
 games:'<path d="M29 32h38c10 0 16 8 16 21s-5 20-13 12l-8-7H34l-8 7C18 73 13 66 13 53s6-21 16-21zM32 41v15M25 48h14"/><circle cx="64" cy="44" r="2"/><circle cx="71" cy="52" r="2"/>',
 resilience:'<path d="M48 14 76 26v23c0 17-28 28-28 28S20 66 20 49V26zM34 46l9 9 19-23"/>',
 data:'<ellipse cx="48" cy="25" rx="28" ry="11"/><path d="M20 25v35c0 15 56 15 56 0V25M20 42c0 15 56 15 56 0"/><path d="M42 52v18m-7-7 7 7 7-7"/>',
 control:'<path d="M18 27h60M18 45h60M18 63h60"/><rect x="30" y="20" width="12" height="14" rx="3"/><rect x="56" y="38" width="12" height="14" rx="3"/><rect x="27" y="56" width="12" height="14" rx="3"/>',
 gym:'<path d="M14 33v26M23 26v40M73 26v40M82 33v26M23 46h50"/>',
 rewards:'<path d="M32 20h32v24c0 19-32 19-32 0zM32 26H19v9c0 14 13 15 16 15M64 26h13v9c0 14-13 15-16 15M48 60v13M34 73h28"/>',
 reports:'<path d="M19 17v56h62M31 63V48h10v15M49 63V35h10v28M67 63V23h10v40"/>',
 inspiration:'<rect x="17" y="20" width="62" height="51" rx="6"/><circle cx="35" cy="36" r="6"/><path d="m18 61 18-15 14 11 13-17 15 21"/>',
 relationships:'<path d="M48 69S18 51 18 34c0-18 23-24 30-7 7-17 30-11 30 7 0 17-30 35-30 35z"/>'
 };
 const shape=shapes[view]||shapes.today;return `<svg class="tool-illustration38" viewBox="0 0 96 96" aria-hidden="true" focusable="false"><circle cx="48" cy="45" r="39" fill="currentColor" opacity=".07"/><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${shape}</g>${[0,1,2,3].map(i=>`<circle cx="${33+i*10}" cy="88" r="2.4" fill="currentColor" opacity="${i===step%4?'1':'.18'}"/>`).join('')}</svg>`;
}
