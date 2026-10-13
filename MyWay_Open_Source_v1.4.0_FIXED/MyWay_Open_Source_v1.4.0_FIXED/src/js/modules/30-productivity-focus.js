/* fixed sidebar with optional pin */
let sidebarHoverExpanded=false;
function setSidebarCollapsed(collapsed){
  if(state.settings.sidebarPinned===true)collapsed=false;
  if(innerWidth<=900)collapsed=false;
  document.body.classList.toggle("sidebar-collapsed",!!collapsed);document.body.classList.toggle("sidebar-pinned",state.settings.sidebarPinned===true);
  const b=$("#sidebarCollapseButton");if(b){b.classList.toggle("pinned",state.settings.sidebarPinned===true);b.title=state.settings.sidebarPinned===true?"Liberar menu automático":"Fixar menu aberto";b.setAttribute("aria-label",b.title);b.setAttribute("aria-expanded",String(!collapsed));}
}
$("#sidebarCollapseButton")?.addEventListener("click",()=>{state.settings.sidebarPinned=state.settings.sidebarPinned!==true;if(state.settings.sidebarPinned)state.settings.sidebarAutoCollapse=false;else state.settings.sidebarAutoCollapse=true;saveState();setSidebarCollapsed(!state.settings.sidebarPinned)});
const sidebarEl=$(".sidebar");
const canAutoSidebar=()=>innerWidth>900&&state.settings.sidebarPinned!==true&&state.settings.sidebarAutoCollapse!==false;
const expandAutoSidebar=()=>{if(canAutoSidebar()&&document.body.classList.contains("sidebar-collapsed")){sidebarHoverExpanded=true;setSidebarCollapsed(false)}};
sidebarEl?.addEventListener("pointerenter",expandAutoSidebar);
sidebarEl?.addEventListener("focusin",expandAutoSidebar);
sidebarEl?.addEventListener("pointerleave",()=>{if(canAutoSidebar()&&sidebarHoverExpanded&&!sidebarEl.matches(":focus-within")){sidebarHoverExpanded=false;setSidebarCollapsed(true)}});
sidebarEl?.addEventListener("focusout",()=>queueMicrotask(()=>{if(canAutoSidebar()&&sidebarHoverExpanded&&!sidebarEl.matches(":focus-within")&&!sidebarEl.matches(":hover")){sidebarHoverExpanded=false;setSidebarCollapsed(true)}}));
window.addEventListener("resize",()=>{if(innerWidth<=900)setSidebarCollapsed(false);else if(canAutoSidebar()&&!sidebarEl?.matches(":hover")&&!sidebarEl?.matches(":focus-within"))setSidebarCollapsed(true)});
document.addEventListener("click",e=>{const nav=e.target.closest(".nav-item[data-view-target],.feature-linkR1[data-pin-openR1]");if(nav&&canAutoSidebar())setTimeout(()=>{if(!sidebarEl?.matches(":hover")&&!sidebarEl?.matches(":focus-within"))setSidebarCollapsed(true)},160)});

/* low-friction ADHD execution helpers */
function renderADHDGuide(){
  const d=ensureDay();if($("#adhdNextAction"))$("#adhdNextAction").value=d.adhdNextAction||"";if($("#adhdEnergyNow"))$("#adhdEnergyNow").value=d.adhdEnergyNow||"";
  const box=$("#adhdParkingLot");if(box){const items=Array.isArray(d.distractions)?d.distractions:[];box.innerHTML=items.map((x,i)=>`<button data-distraction-index="${i}" title="Clique para remover">${escapeHTML(x)}</button>`).join("");$$('[data-distraction-index]',box).forEach(b=>b.addEventListener('click',()=>{d.distractions.splice(Number(b.dataset.distractionIndex),1);saveState();renderADHDGuide()}));}
}
$("#adhdNextAction")?.addEventListener("input",e=>{ensureDay().adhdNextAction=e.target.value;saveState()});
$("#adhdEnergyNow")?.addEventListener("change",e=>{ensureDay().adhdEnergyNow=e.target.value;saveState()});
$("#adhdFiveMinute")?.addEventListener("click",()=>{const d=ensureDay();if($("#focusTask"))$("#focusTask").value=d.adhdNextAction||$("#focusTask").value;timerSeconds=Number(state.settings.focusMinutes35||25)*60;drawTimer();startTimer();toast("Modo de entrada iniciado.","Comece no seu ritmo. Depois você decide se continua.")});
$("#adhdParkDistraction")?.addEventListener("click",()=>{$("#adhdDistractionRow").hidden=false;$("#adhdDistractionInput")?.focus()});
$("#adhdDistractionSave")?.addEventListener("click",()=>{const v=$("#adhdDistractionInput").value.trim();if(!v)return;const d=ensureDay();d.distractions=Array.isArray(d.distractions)?d.distractions:[];d.distractions.push(v);$("#adhdDistractionInput").value="";$("#adhdDistractionRow").hidden=true;saveState();renderADHDGuide();toast("Distração estacionada.","Você não precisa resolver isso agora.")});

/* daily XP and streak — derived, not another chore to maintain */
function xpForDay(d){if(!d)return 0;let xp=0;xp+=d.morningNoScroll?10:0;xp+=d.studyMinimum?20:0;xp+=d.careerAction?15:0;xp+=d.preparedTomorrow?10:0;xp+=d.cbtFiveMinute?8:0;xp+=d.cbtThoughtCheck?8:0;xp+=d.cbtIfThen?8:0;xp+=Number(d.waterCups||0)>=Number(state.settings.waterGoalCups||8)?10:0;xp+=Number(d.walkMinutes||0)>=Number(state.settings.walkGoalMinutes||20)?10:0;xp+=d.meditated?10:0;xp+=Math.min(20,Number(d.returns||0)*2);xp+=Math.min(30,Number(d.studyPomodoros||0)*10);return xp}
function dayCompletion(d){const checks=[!!d?.morningNoScroll,!!d?.studyMinimum,!!d?.careerAction,!!d?.preparedTomorrow,!!d?.cbtFiveMinute,!!d?.cbtThoughtCheck,!!d?.cbtIfThen,Number(d?.waterCups||0)>=Number(state.settings.waterGoalCups||8),Number(d?.walkMinutes||0)>=Number(state.settings.walkGoalMinutes||20),!!d?.meditated,Number(d?.studyMinutes||0)>=25];return Math.round(checks.filter(Boolean).length/checks.length*100)}
function lifetimeXP(){return rewardTotal34()}
function currentStreak(){let n=0,d=new Date();for(let i=0;i<365;i++){const iso=localISO(d),day=state.days?.[iso];if(dayCompletion(day)>=25)n++;else if(i>0||day)break;d.setDate(d.getDate()-1)}return n}
function renderDailyGame(){normalize34();if(!$("#dailyGamebar"))return;const d=ensureDay(),xp=state.rewards34.ledger.filter(x=>x.date===activeDate).reduce((n,x)=>n+x.xp,0),total=lifetimeXP(),levelInfo=level36(total),level=levelInfo.level,pct=levelInfo.progress,completion=dayCompletion(d);$("#dailyLevel").textContent=level;$("#dailyXPLabel").textContent=`${xp} XP hoje · ${total} total`;$("#dailyStreakLabel").textContent="Seu XP permanece, mesmo quando você pausa.";$("#dailyCompletion").textContent=`${completion}%`;$("#dailyXPBar").style.width=`${pct}%`;}

/* study-specific Pomodoro */
let studyPomodoroSeconds=25*60,studyPomodoroHandle=null,studyPomodoroBreak=false,studyBlockMinutes52=25;
function drawStudyPomodoro(){if(!$("#studyPomodoroClock"))return;const m=String(Math.floor(studyPomodoroSeconds/60)).padStart(2,"0"),sec=String(studyPomodoroSeconds%60).padStart(2,"0");$("#studyPomodoroClock").textContent=`${m}:${sec}`;$("#studyPomodoroPhase").textContent=studyPomodoroBreak?"PAUSA":"FOCO";$("#studyPomodoroSessions").textContent=`${Number(ensureDay().studyPomodoros||0)} ciclos de foco hoje`;}
function studyPomodoroStart(){
 if(studyPomodoroHandle)return;if(!studyPomodoroBreak)studyBlockMinutes52=Math.max(1,Math.ceil(studyPomodoroSeconds/60));
 studyPomodoroHandle=setInterval(()=>{studyPomodoroSeconds--;drawStudyPomodoro();if(studyPomodoroSeconds>0)return;studyPomodoroPause();
  if(!studyPomodoroBreak){const d=ensureDay();d.studyPomodoros=Number(d.studyPomodoros||0)+1;d.studyMinutes=Number(d.studyMinutes||0)+studyBlockMinutes52;d.studyMinimum=d.studyMinimum||d.studyMinutes>=25;state.studySessions.unshift({id:cryptoId(),date:activeDate,minutes:studyBlockMinutes52,lessons:0,description:$("#studyPomodoroTask")?.value.trim()||"Pomodoro de estudo",createdAt:new Date().toISOString()});studyPomodoroBreak=true;studyPomodoroSeconds=(Number(state.settings.pomodoroBreak52)||5)*60;saveState();renderDailyGame();renderPUCWeek();toast("Pomodoro concluído.",studyBlockMinutes52+" min registrados. Faça uma pausa.");notifySystem("MyWay","Pomodoro de estudo concluído.");}
  else{studyPomodoroBreak=false;studyPomodoroSeconds=(Number(state.settings.focusMinutes35)||25)*60;toast("Pausa concluída.","Próximo ciclo pronto.");}drawStudyPomodoro();
 },1000);
}
function studyPomodoroPause(){clearInterval(studyPomodoroHandle);studyPomodoroHandle=null}
function studyPomodoroReset(){studyPomodoroPause();studyPomodoroBreak=false;studyPomodoroSeconds=(Number(state.settings.focusMinutes35)||25)*60;drawStudyPomodoro()}
$("#studyPomodoroStart")?.addEventListener("click",studyPomodoroStart);$("#studyPomodoroPause")?.addEventListener("click",studyPomodoroPause);$("#studyPomodoroReset")?.addEventListener("click",studyPomodoroReset);

/* flashcards */
let flashcardIndex=0;
function studyCards(){const c=currentStudyCourse();return (state.flashcards||[]).filter(x=>!c||!x.courseId||x.courseId===c.id)}
function renderFlashcards(){const cards=studyCards();if(cards.length&&flashcardIndex>=cards.length)flashcardIndex=0;const card=cards[flashcardIndex];$("#flashcardQuestion").textContent=card?.question||"Crie seu primeiro cartão.";$("#flashcardAnswer").textContent=card?.answer||"";$("#flashcardAnswer").hidden=false;resetFlash52(!!card);$("#flashcardList").innerHTML=cards.map((x,i)=>`<button data-flash-index="${i}">${i+1}</button>`).join("");$$('[data-flash-index]',$('#flashcardList')).forEach(b=>b.addEventListener('click',()=>{flashcardIndex=Number(b.dataset.flashIndex);renderFlashcards()}));}
async function openFlashcardModal(){
 const course=currentStudyCourse();const result=await openFormDialog({title:'Adicionar flashcard',description:course?'Matéria: '+course.title+'. Escreva uma pergunta e sua resposta.':'Crie uma pergunta e sua resposta. Você também pode criar cartões sem uma matéria.',submitLabel:'Criar cartão',fields:[{key:'question',label:'Pergunta',type:'textarea',required:true,maxLength:2000,placeholder:'O que você quer lembrar?'},{key:'answer',label:'Resposta',type:'textarea',required:true,maxLength:6000,placeholder:'Escreva com suas palavras.'}]});if(!result)return;
 state.flashcards ||= [];state.flashcards.push({id:cryptoId(),courseId:course?.id||'',question:result.question,answer:result.answer,hits:0,misses:0,createdAt:new Date().toISOString()});flashcardIndex=Math.max(0,studyCards().length-1);saveState();renderFlashcards();toast('Flashcard criado.',course?.title||'');
}
$("#flashcardAdd")?.addEventListener("click",openFlashcardModal);
$("#flashcardReveal")?.addEventListener("click",toggleFlash52);$("#flashcardStage")?.addEventListener("click",toggleFlash52);
$("#flashcardKnow")?.addEventListener("click",()=>{const c=studyCards()[flashcardIndex];if(c){c.hits=Number(c.hits||0)+1;saveState()}flashcardIndex=(flashcardIndex+1)%Math.max(1,studyCards().length);renderFlashcards()});
$("#flashcardAgain")?.addEventListener("click",()=>{const c=studyCards()[flashcardIndex];if(c){c.misses=Number(c.misses||0)+1;saveState()}flashcardIndex=(flashcardIndex+1)%Math.max(1,studyCards().length);renderFlashcards()});

/* YouTube study library */
function youtubeId(url){const m=String(url||"").match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([A-Za-z0-9_-]{6,})/);return m?m[1]:""}
function renderStudyYoutube(){const c=$("#studyYoutubeList");if(!c)return;const course=currentStudyCourse(),items=(state.studyYoutube||[]).filter(x=>!course||!x.courseId||x.courseId===course.id);$("#studyYoutubeCount").textContent=items.length;c.innerHTML=items.length?items.map(x=>`<article class="study-video-card" data-study-video="${x.id}"><iframe src="https://www.youtube-nocookie.com/embed/${escapeHTML(x.videoId)}" title="${escapeHTML(x.title)}" loading="lazy" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe><div><b>${escapeHTML(x.title||"Vídeo do YouTube")}</b><small>${escapeHTML(x.author||"")}</small><footer><a href="${escapeHTML(x.url)}" target="_blank" rel="noopener">YouTube ↗</a><button data-study-video-delete>excluir</button></footer></div></article>`).join(""):`<p class="note">Nenhum vídeo salvo para esta matéria.</p>`;$$('[data-study-video]',c).forEach(card=>card.querySelector('[data-study-video-delete]').addEventListener('click',()=>{state.studyYoutube=state.studyYoutube.filter(x=>x.id!==card.dataset.studyVideo);saveState();renderStudyYoutube()}));}
$("#studyYoutubeAdd")?.addEventListener("click",async()=>{const url=$("#studyYoutubeUrl").value.trim(),id=youtubeId(url);if(!id)return toast("Cole um link válido do YouTube.");let title=$("#studyYoutubeTitle").value.trim(),author="";const meta=await nativeJSON(`/api/youtube/oembed?url=${encodeURIComponent(url)}`);if(meta?.ok){title=title||meta.title||"Vídeo do YouTube";author=meta.author||""}state.studyYoutube=state.studyYoutube||[];state.studyYoutube.unshift({id:cryptoId(),courseId:currentStudyCourse()?.id||"",url,videoId:id,title:title||"Vídeo do YouTube",author,createdAt:new Date().toISOString()});$("#studyYoutubeUrl").value="";$("#studyYoutubeTitle").value="";saveState();renderStudyYoutube();toast("Vídeo salvo nos estudos.")});
function renderStudyToolkit(){drawStudyPomodoro();renderFlashcards();renderStudyYoutube();}

/* Content integration; authentication is always internal. */
async function refreshIntegrationStatus(){
  const r=await nativeJSON('/api/integrations/status');
  if($("#integrationStatus"))$("#integrationStatus").textContent=r?.pinterestToken?"Login interno ativo. Pinterest conectado.":"Login interno ativo. Pinterest não conectado.";
  if($("#pinterestConnectStatus"))$("#pinterestConnectStatus").textContent=r?.pinterestToken?"conectado":"não conectado";
  if($("#pinterestImport"))$("#pinterestImport").hidden=!r?.pinterestToken;
}
async function connectPinterest(){const r=await nativeJSON('/api/integrations/pinterest/connect',{method:'POST'});if(!r?.ok)toast("Pinterest ainda não conectado.",r?.error||"Configure o OAuth do produto.");refreshIntegrationStatus()}
$("#pinterestConnect")?.addEventListener('click',connectPinterest);$("#controlPinterestConnect")?.addEventListener('click',connectPinterest);
$("#pinterestImport")?.addEventListener('click',async()=>{const r=await nativeJSON('/api/integrations/pinterest/pins');if(!r?.ok)return toast("Não consegui importar os pins.",r?.error||"");let added=0;for(const p of r.items||[]){if(!p.image||state.inspirationPins.some(x=>x.source===p.link))continue;state.inspirationPins.unshift({id:cryptoId(),title:p.title||"Pinterest",image:p.image,source:p.link||"",note:"Importado do Pinterest",boardId:"general",interest:"Pinterest",saved:true,createdAt:new Date().toISOString()});added++}saveState();renderInspiration(false);toast("Pinterest importado.",`${added} pins adicionados, sem anúncios do feed.`)});


/* V30 — first-run tutorial */
const TUTORIAL_STEPS=[
  {k:"01 / 06",title:"Comece pelo foco.",text:"A caixa de foco fica no topo da Home. Escreva uma única ação concreta e use um bloco curto. O objetivo é começar, não provar disciplina.",visual:"AÇÃO PEQUENA → TIMER → COMEÇAR"},
  {k:"02 / 06",title:"Use o dia como feedback.",text:"Hábitos, retornos de distração e microtarefas de TCC viram XP automaticamente. Você não precisa manter outra planilha de desempenho.",visual:"CHECK-IN → XP → NÍVEL"},
  {k:"03 / 06",title:"Trabalho tem central de atenção.",text:"Use status e prazos nas notas. A aba Trabalho separa o que está em andamento, semana, mês e atrasos; no fim do período, gere o relatório.",visual:"AGORA → SEMANA → MÊS → RELATÓRIO"},
  {k:"04 / 06",title:"Estudos têm trilha e ferramentas.",text:"Adicione uma matéria e tarefas à trilha. Cada tarefa concluída atualiza o progresso automaticamente. Pomodoro, flash cards e vídeos complementam seus estudos.",visual:"TRILHA + POMODORO + FLASH CARDS"},
  {k:"05 / 06",title:"Finanças ficam visíveis.",text:"Cadastre saldo, recebimentos, gastos fixos e diários. O MyWay mostra fluxo, regra de reserva e alertas sem transformar simulação em recomendação de investimento.",visual:"RENDA → GASTOS → RESERVA → META"},
  {k:"06 / 06",title:"Nem tudo precisa virar tarefa.",text:"Use o Diário para desabafar, registrar pensamentos e, quando precisar, encontrar caminhos de cuidado profissional. Tudo pode ser ajustado em Controle.",visual:"DIÁRIO → REFLEXÃO → PRÓXIMA AÇÃO"}
];
let tutorialStep=0;
function renderTutorial(){const t=TUTORIAL_STEPS[tutorialStep];if(!t)return;$("#tutorialKicker").textContent=t.k;$("#tutorialTitle").textContent=t.title;$("#tutorialText").textContent=t.text;$("#tutorialVisual").textContent=t.visual;$("#tutorialProgress").style.width=`${(tutorialStep+1)/TUTORIAL_STEPS.length*100}%`;$("#tutorialBack").disabled=tutorialStep===0;$("#tutorialNext").textContent=tutorialStep===TUTORIAL_STEPS.length-1?"Concluir":"Próximo"}
function showFirstRunTutorial(force=false){if(!force&&state.settings.tutorialSeen===true)return;const el=$("#firstRunTutorial");if(!el)return;tutorialStep=0;renderTutorial();el.hidden=false}
function closeTutorial(){const el=$("#firstRunTutorial");if(el)el.hidden=true;state.settings.tutorialSeen=true;saveState()}
$("#tutorialNext")?.addEventListener("click",()=>{if(tutorialStep<TUTORIAL_STEPS.length-1){tutorialStep++;renderTutorial()}else closeTutorial()});$("#tutorialBack")?.addEventListener("click",()=>{if(tutorialStep>0){tutorialStep--;renderTutorial()}});$("#tutorialSkip")?.addEventListener("click",closeTutorial);$("#tutorialClose")?.addEventListener("click",closeTutorial);

/* generic well-being for non-master workspaces */
function renderWellnessGeneric(){const c=$("#wellnessPracticeList");if(!c)return;state.wellnessPractices=state.wellnessPractices||[];c.innerHTML=state.wellnessPractices.length?state.wellnessPractices.map(x=>`<div class="wellness-practice" data-wellness="${x.id}"><input value="${escapeHTML(x.title||"Prática")}" data-wellness-title><select data-wellness-type>${["Meditação","Respiração","Mindfulness","Alongamento","Yoga","Outro"].map(v=>`<option ${v===x.type?"selected":""}>${v}</option>`).join("")}</select><input type="number" min="1" value="${Number(x.minutes||10)}" data-wellness-minutes><label><input type="checkbox" data-wellness-done ${x.done?"checked":""}> feito</label><button data-wellness-delete>×</button></div>`).join(""):`<p class="note">Adicione uma prática para começar.</p>`;$$('[data-wellness]',c).forEach(row=>{const x=state.wellnessPractices.find(v=>v.id===row.dataset.wellness);row.querySelector('[data-wellness-title]').addEventListener('input',e=>{x.title=e.target.value;saveState()});row.querySelector('[data-wellness-type]').addEventListener('change',e=>{x.type=e.target.value;saveState()});row.querySelector('[data-wellness-minutes]').addEventListener('change',e=>{x.minutes=Number(e.target.value||10);saveState()});row.querySelector('[data-wellness-done]').addEventListener('change',e=>{x.done=e.target.checked;saveState();if(x.done)celebrateElement(row)});row.querySelector('[data-wellness-delete]').addEventListener('click',()=>{state.wellnessPractices=state.wellnessPractices.filter(v=>v.id!==x.id);saveState();renderWellnessGeneric()})})}
$("#wellnessAddPractice")?.addEventListener("click",()=>{state.wellnessPractices=state.wellnessPractices||[];state.wellnessPractices.push({id:cryptoId(),title:"Nova prática",type:"Meditação",minutes:10,done:false});saveState();renderWellnessGeneric()});

/* gamified housing path */
function renderPropertyGame(){if(!$("#propertyGame"))return;const price=Number(state.settings.propertyValue||0),saved=Number(state.settings.currentSavings||0)+Number(state.settings.fgtsBalance||0)+Number(state.settings.otherEntry||0),quota=financingQuota(),entry=price?price*(1-quota):0,extras=price?Math.max(price*.05,12000):0,target=entry+extras,gap=Math.max(0,target-saved),pct=target?Math.min(100,Math.round(saved/target*100)):0,monthly=Number(state.settings.monthlyContribution||0);let level=1,name="Fundação",msg="Comece formando sua reserva.";if(pct>=25){level=2;name="Base";msg="A reserva já ganhou corpo."}if(pct>=50){level=3;name="Entrada";msg="Você passou da metade do caminho estimado."}if(entry&&saved>=entry){level=4;name="Entrada coberta";msg="A entrada estimada está coberta; agora proteja os custos extras."}if(pct>=100){level=5;name="Pronto para simular";msg="Entrada e reserva de custos estão cobertas na referência atual."}$("#propertyGameLevel").textContent=level;$("#propertyGameLevelName").textContent=name;$("#propertyGameMessage").textContent=price?msg:"Defina o valor do imóvel e sua reserva para visualizar o caminho.";$("#propertyGamePercent").textContent=`${pct}%`;$("#propertyGameSaved").textContent=money(saved);$("#propertyGameTarget").textContent=target?money(target):"—";$("#propertyGameGap").textContent=target?(gap?money(gap):"coberto"):"—";$("#propertyGameMonths").textContent=gap&&monthly>0?`~${Math.ceil(gap/monthly)} meses`:gap?"defina seu aporte":"pronto";$("#propertyGameBar").style.width=`${pct}%`;const milestones=[{p:10,t:"Reserva inicial"},{p:25,t:"1/4 do caminho"},{p:50,t:"Metade"},{p:entry&&target?Math.round(entry/target*100):80,t:"Entrada coberta"},{p:100,t:"Entrada + custos"}];$("#propertyGameMilestones").innerHTML=milestones.map(m=>`<div class="${pct>=m.p?'done':''}"><i>✓</i><span>${m.t}</span><small>${m.p}%</small></div>`).join("")}


/* =========================================================
   V32 — TRABALHO / FINANÇAS / DIÁRIO / FOCO
   ========================================================= */
function isoDateObj(iso){const [y,m,d]=String(iso||todayISO()).split("-").map(Number);return new Date(y,m-1,d,12,0,0,0)}
function isoAdd(iso,days){const d=isoDateObj(iso);d.setDate(d.getDate()+days);return localISO(d)}
function weekBounds(iso=activeDate){const d=isoDateObj(iso),wd=d.getDay()||7;d.setDate(d.getDate()-(wd-1));const start=localISO(d);d.setDate(d.getDate()+6);return [start,localISO(d)]}
function isoBetween(iso,a,b){return !!iso&&iso>=a&&iso<=b}
function isOpenWorkNote(n){return n?.area==="work"&&!['done','cancelled'].includes(n.status||'todo')}
function workDeadlineCard(n){const overdue=isOpenWorkNote(n)&&n.dueDate&&n.dueDate<activeDate;return `<article class="work-deadline-card ${overdue?'overdue':''}" data-work-note-open="${n.id}"><div><i class="status-dot ${n.status||'todo'}"></i><span>${escapeHTML(NOTE_STATUS[n.status||'todo']||'A Fazer')}</span><time>${escapeHTML(n.dueDate?formatDateBR(n.dueDate):'sem prazo')}</time></div><b>${escapeHTML(n.title||'Sem título')}</b>${n.body?`<p>${escapeHTML(n.body)}</p>`:''}</article>`}
function renderWorkCommand(){
  renderWorkKanban35();
  if(!$("#workCurrentCount"))return;
  const notes=(state.notes||[]).filter(n=>n.area==="work"),open=notes.filter(isOpenWorkNote),[ws,we]=weekBounds(activeDate),ym=monthKey(activeDate);
  const current=open.filter(n=>['doing','attention'].includes(n.status)||n.dueDate===activeDate);
  const week=open.filter(n=>isoBetween(n.dueDate,ws,we));
  const month=open.filter(n=>(n.dueDate||'').startsWith(ym));
  const overdue=open.filter(n=>n.dueDate&&n.dueDate<activeDate);
  $("#workCurrentCount").textContent=current.length;$("#workWeekCount").textContent=week.length;$("#workMonthCount").textContent=month.length;$("#workOverdueCount").textContent=overdue.length;
  $("#workWeekLabel").textContent=`${formatDateBR(ws)} → ${formatDateBR(we)}`;$("#workMonthLabel").textContent=new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(isoDateObj(activeDate));$("#workPlannerMonthLabel").textContent=ym;
  const now=[...current,...overdue.filter(n=>!current.includes(n))].slice(0,6);
  $("#workNowBoard").innerHTML=now.length?now.map(workDeadlineCard).join(''):`<div class="work-empty"><b>Nada em modo urgente.</b><span>Use “Fazendo” ou “Precisa de Atenção” para destacar uma atividade aqui.</span></div>`;
  const weekSorted=week.slice().sort((a,b)=>(a.dueDate||'').localeCompare(b.dueDate||''));
  const rest=month.filter(n=>!isoBetween(n.dueDate,ws,we)).sort((a,b)=>(a.dueDate||'').localeCompare(b.dueDate||''));
  $("#workWeekBoard").innerHTML=weekSorted.length?weekSorted.map(workDeadlineCard).join(''):`<p class="note">Nenhum prazo nos próximos 7 dias.</p>`;
  $("#workMonthBoard").innerHTML=rest.length?rest.map(workDeadlineCard).join(''):`<p class="note">Nenhum outro prazo neste mês.</p>`;
  $$('[data-work-note-open]').forEach(card=>card.addEventListener('dblclick',()=>showView('notes')));
}
$("#workAddTaskTop")?.addEventListener("click",()=>{$("#workQuickNoteTitle")?.focus();$("#workQuickNoteTitle")?.scrollIntoView({behavior:'smooth',block:'center'})});
$$('[data-work-filter]').forEach(b=>b.addEventListener('click',()=>{$("#workQuickNotes")?.scrollIntoView({behavior:'smooth',block:'start'})}));
let lastWorkReportHTML="",lastWorkReportName="";
function workReportFor(period){
  const notes=(state.notes||[]).filter(n=>n.area==='work'),isMonth=period==='month',ym=monthKey(activeDate);
  const selected=isMonth?notes.filter(n=>(n.dueDate||n.completedAt||'').startsWith(ym)):notes.filter(n=>n.dueDate===activeDate||String(n.completedAt||'').slice(0,10)===activeDate);
  const done=selected.filter(n=>n.status==='done'),doing=selected.filter(n=>n.status==='doing'),waiting=selected.filter(n=>n.status==='waiting'),attention=selected.filter(n=>n.status==='attention'),open=selected.filter(n=>!['done','cancelled'].includes(n.status));
  const arrivals=Object.entries(state.days||{}).filter(([date,d])=>isMonth?date.startsWith(ym):date===activeDate).filter(([,d])=>d.arrivalTime).map(([date,d])=>({date,time:d.arrivalTime}));
  const label=isMonth?new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(isoDateObj(activeDate)):formatDateBR(activeDate);
  const list=(title,items)=>`<section><h4>${title} <small>${items.length}</small></h4>${items.length?`<ul>${items.map(n=>`<li><b>${escapeHTML(n.title||'Sem título')}</b>${n.dueDate?` <span>${formatDateBR(n.dueDate)}</span>`:''}</li>`).join('')}</ul>`:'<p>—</p>'}</section>`;
  return `<div class="generated-work-report"><header><p>MYWAY / TRABALHO</p><h3>${isMonth?'Fechamento mensal':'Fechamento do dia'} · ${label}</h3><div><span>${done.length} concluídas</span><span>${open.length} abertas</span><span>${attention.length} atenção</span></div></header><div class="generated-report-grid">${list('Concluídas',done)}${list('Em andamento',doing)}${list('Aguardando',waiting)}${list('Precisa de atenção',attention)}</div><section><h4>Pontualidade</h4>${arrivals.length?`<p>${arrivals.map(x=>`${formatDateBR(x.date)} · ${x.time}`).join('<br>')}</p>`:'<p>Sem registro de chegada no período.</p>'}</section><footer>Gerado pelo MyWay em ${new Date().toLocaleString('pt-BR')}.</footer></div>`;
}
function renderWorkReport(period){lastWorkReportHTML=workReportFor(period);lastWorkReportName=`myway-trabalho-${period}-${period==='month'?monthKey(activeDate):activeDate}.html`;$("#workReportOutput").innerHTML=lastWorkReportHTML;$("#workReportDownload").disabled=false;$("#workReportShare34").disabled=false}
$("#workReportDay")?.addEventListener("click",()=>renderWorkReport('day'));$("#workReportMonth")?.addEventListener("click",()=>renderWorkReport('month'));$("#workReportDownload")?.addEventListener("click",()=>{if(lastWorkReportHTML)download(lastWorkReportName,`<!doctype html><meta charset="utf-8"><title>MyWay Trabalho</title><style>body{font:15px Arial;max-width:900px;margin:40px auto;color:#172733}header{border-bottom:2px solid #20384f;padding-bottom:18px}section{margin:22px 0}h3{font-size:28px}h4 small{font-weight:400;color:#73808a}li{margin:7px 0}span{color:#667}</style>${lastWorkReportHTML}`,'text/html')});

const FINANCE_TIPS=[
  ['Liquidez antes de alguns décimos','Para reserva de emergência, verifique quando o dinheiro pode ser resgatado antes de comparar apenas o % do CDI.'],
  ['Compare o que realmente rende','Em CDB pós-fixado, compare % do CDI, prazo, liquidez, tributação e risco do emissor — não só o número maior.'],
  ['Automatize no dia do recebimento','Uma regra simples é separar a porcentagem escolhida assim que o dinheiro entra, antes de o saldo virar “dinheiro disponível”.'],
  ['Reserva não precisa buscar o máximo','Dinheiro para emergência prioriza acesso e previsibilidade; objetivos longos podem tolerar prazos maiores.'],
  ['Não concentre por distração','Se o patrimônio crescer, acompanhe emissor e cobertura aplicável do FGC em vez de tratar todos os CDBs como equivalentes.']
];
let financeTipIndex=quoteIndexForDate(todayISO())%FINANCE_TIPS.length;
function financeMonthlyIncome(){const advance=state.settings.salaryHasAdvance===true||state.settings.salaryHasAdvance==='true';const split=Number(state.settings.salaryAdvance||0)+Number(state.settings.salarySecondPayment||0);return advance&&split>0?split:Number(state.settings.salaryBase||0)}
function financeMonthTransactions(){const ym=monthKey(activeDate);return (state.financeTransactions||[]).filter(x=>(x.date||'').startsWith(ym))}
function renderFinanceHub(){
  if(!$("#financeHubBalance"))return;normalizeV32Product();
  const incomeBase=financeMonthlyIncome(),tx=financeMonthTransactions(),extraIncome=tx.filter(x=>x.type==='income').reduce((s,x)=>s+Number(x.amount||0),0),dailySpent=tx.filter(x=>x.type==='expense').reduce((s,x)=>s+Number(x.amount||0),0),fixed=(state.financeFixedExpenses||[]).filter(x=>x.active!==false).reduce((s,x)=>s+Number(x.amount||0),0),income=incomeBase+extraIncome,spent=fixed+dailySpent,balance=Number(state.settings.cashBalance||0),debts=(state.financeDebts||[]).filter(x=>x.active!==false).reduce((s,x)=>s+Number(x.balance||0),0),savePct=Math.max(0,Number(state.settings.financeSavePercent||0)),suggested=income*savePct/100;
  $("#financeHubBalance").textContent=money(balance);$("#financeHubIncome").textContent=money(income);$("#financeHubSpent").textContent=money(spent);$("#financeHubSaveRate").textContent=`${savePct}%`;$("#financeHubIncomeSub").textContent=state.settings.salaryHasAdvance===true||state.settings.salaryHasAdvance==='true'?`adiantamento dia ${state.settings.salaryAdvanceDay||'—'} + final dia ${state.settings.salarySecondDay||'—'}`:'salário + entradas extras';$("#financeHubSpentSub").textContent=`${money(fixed)} fixos + ${money(dailySpent)} lançamentos`;$("#financeHubSaveRateSub").textContent=`meta: separar ${money(suggested)}`;$("#financeSaveRule").innerHTML=`<b>Regra automática</b><span>Ao receber ${money(incomeBase)}, separe ${savePct}% = <strong>${money(incomeBase*savePct/100)}</strong>.</span>`;
  let label='organizado',text='O fluxo cadastrado cabe na renda do mês.',cls='ok';if(debts>0){label='dívida cadastrada';text=`Há ${money(debts)} em dívidas ativas para acompanhar.`;cls='warn'}if(income>0&&spent>income){label='fluxo negativo';text=`Os gastos cadastrados excedem a renda do mês em ${money(spent-income)}.`;cls='danger'}if(balance<0){label='saldo negativo';text='O saldo atual informado está abaixo de zero.';cls='danger'}const health=$("#financeHealthCard");health.className=`finance-health ${cls}`;$("#financeHealthLabel").textContent=label;$("#financeHealthText").textContent=text;$("#financeDebtAlert").textContent=debts?`Dívidas ativas cadastradas: ${money(debts)}. Priorize entender taxa, vencimento e custo antes de buscar maior rentabilidade.`:'Nenhuma dívida ativa cadastrada.';
  if($("#financeTxnDate")&&!$("#financeTxnDate").value)$("#financeTxnDate").value=activeDate;
  renderFinanceFixed();renderFinanceTransactions();renderFinanceDebts();renderCdbLab();renderFinanceTip();
}
function renderFinanceFixed(){const c=$("#financeFixedList");if(!c)return;c.innerHTML=(state.financeFixedExpenses||[]).length?(state.financeFixedExpenses||[]).map(x=>`<div class="finance-fixed-row" data-fixed-id="${x.id}"><label><span>Compromisso</span><input aria-label="Nome do compromisso" value="${escapeHTML(x.name||'Gasto fixo')}" data-fixed-name></label><label><span>Valor mensal (R$)</span><input aria-label="Valor mensal" type="number" min="0" step="0.01" value="${Number(x.amount||0)}" data-fixed-amount></label><label class="fixed-day40"><span>Vence no dia</span><input aria-label="Dia de vencimento" type="number" min="1" max="31" value="${Number(x.day||1)}" data-fixed-day></label><label><input type="checkbox" ${x.active!==false?'checked':''} data-fixed-active> ativo</label><button data-fixed-delete>×</button></div>`).join(''):`<p class="note">Nenhum gasto fixo cadastrado.</p>`;$$('[data-fixed-id]',c).forEach(row=>{const x=state.financeFixedExpenses.find(v=>v.id===row.dataset.fixedId);row.querySelector('[data-fixed-name]').addEventListener('input',e=>{x.name=e.target.value;saveState()});row.querySelector('[data-fixed-amount]').addEventListener('change',e=>{x.amount=Number(e.target.value||0);saveState();renderFinanceHub()});row.querySelector('[data-fixed-day]').addEventListener('change',e=>{x.day=Number(e.target.value||1);saveState()});row.querySelector('[data-fixed-active]').addEventListener('change',e=>{x.active=e.target.checked;saveState();renderFinanceHub()});row.querySelector('[data-fixed-delete]').addEventListener('click',()=>{state.financeFixedExpenses=state.financeFixedExpenses.filter(v=>v.id!==x.id);saveState();renderFinanceHub()})})}
$("#financeFixedAdd")?.addEventListener("click",()=>{state.financeFixedExpenses.push({id:cryptoId(),name:'Novo gasto fixo',amount:0,day:1,active:true});saveState();renderFinanceHub()});
function renderFinanceTransactionsBase34(){const c=$("#financeTxnRecent");if(!c)return;const rows=(state.financeTransactions||[]).slice().sort((a,b)=>(b.date||'').localeCompare(a.date||'')||String(b.createdAt||'').localeCompare(String(a.createdAt||''))).slice(0,12);c.innerHTML=rows.length?rows.map(x=>`<div class="finance-txn-row ${x.type}" data-txn-id="${x.id}"><span>${x.type==='income'?'ENTRADA':'GASTO'}</span><b>${escapeHTML(x.category||'Sem categoria')}</b><small>${formatDateBR(x.date||activeDate)}${x.note?` · ${escapeHTML(x.note)}`:''}</small><strong>${x.type==='income'?'+':'−'} ${money(x.amount)}</strong><button data-txn-delete>×</button></div>`).join(''):`<p class="note">Nenhum lançamento neste histórico.</p>`;$$('[data-txn-id]',c).forEach(row=>row.querySelector('[data-txn-delete]').addEventListener('click',()=>{state.financeTransactions=state.financeTransactions.filter(x=>x.id!==row.dataset.txnId);saveState();renderFinanceHub()}))}
$("#financeTxnAdd")?.addEventListener("click",()=>{const amount=Number($("#financeTxnAmount").value||0);if(amount<=0)return toast('Informe um valor.');state.financeTransactions.unshift({id:cryptoId(),type:$("#financeTxnType").value,amount,category:$("#financeTxnCategory").value.trim()||'Outros',date:$("#financeTxnDate").value||activeDate,impulseDecision:$("#financeTxnType").value==='expense'?$("#financeImpulse34").value:'',note:$("#financeTxnNote").value.trim(),createdAt:new Date().toISOString()});$("#financeTxnAmount").value='';$("#financeTxnCategory").value='';$("#financeTxnNote").value='';$("#financeImpulse34").value='';saveState();renderFinanceHub()});
function renderFinanceDebts(){const c=$("#financeDebtList");if(!c)return;c.innerHTML=(state.financeDebts||[]).length?(state.financeDebts||[]).map(x=>`<div class="finance-debt-row" data-debt-id="${x.id}"><input value="${escapeHTML(x.name||'Dívida')}" data-debt-name><input type="number" step="0.01" value="${Number(x.balance||0)}" data-debt-balance><input type="number" step="0.01" value="${Number(x.rate||0)}" data-debt-rate title="taxa ao mês"><input type="date" value="${escapeHTML(x.dueDate||'')}" data-debt-date><label><input type="checkbox" ${x.active!==false?'checked':''} data-debt-active> ativa</label><button data-debt-delete>×</button></div>`).join(''):`<p class="note">Nenhuma dívida cadastrada.</p>`;$$('[data-debt-id]',c).forEach(row=>{const x=state.financeDebts.find(v=>v.id===row.dataset.debtId);row.querySelector('[data-debt-name]').addEventListener('input',e=>{x.name=e.target.value;saveState()});row.querySelector('[data-debt-balance]').addEventListener('change',e=>{x.balance=Number(e.target.value||0);saveState();renderFinanceHub()});row.querySelector('[data-debt-rate]').addEventListener('change',e=>{x.rate=Number(e.target.value||0);saveState()});row.querySelector('[data-debt-date]').addEventListener('change',e=>{x.dueDate=e.target.value;saveState()});row.querySelector('[data-debt-active]').addEventListener('change',e=>{x.active=e.target.checked;saveState();renderFinanceHub()});row.querySelector('[data-debt-delete]').addEventListener('click',()=>{state.financeDebts=state.financeDebts.filter(v=>v.id!==x.id);saveState();renderFinanceHub()})})}
$("#financeDebtAdd")?.addEventListener("click",()=>{state.financeDebts.push({id:cryptoId(),name:'Nova dívida',balance:0,rate:0,dueDate:'',active:true});saveState();renderFinanceHub()});
function renderCdbLab(){if(!$("#financeCdbGross"))return;const principal=Math.max(0,Number(state.settings.currentSavings||0)),months=Math.max(1,Number($("#financeCdbMonths")?.value||12)),annual=Math.max(0,Number(state.settings.cdiAnnual||0))*Math.max(0,Number(state.settings.cdbPercent||0))/100,gross=principal*Math.pow(1+annual/100,months/12),income=financeMonthlyIncome(),suggested=income*Math.max(0,Number(state.settings.financeSavePercent||0))/100;$("#financeCdbGross").textContent=money(gross);$("#financeCdbYield").textContent=money(Math.max(0,gross-principal));$("#financeSuggestedSave").textContent=money(suggested)}
$("#financeCdbMonths")?.addEventListener("input",renderCdbLab);
function renderFinanceTip(){if(!$("#financeTipTitle"))return;const t=FINANCE_TIPS[financeTipIndex%FINANCE_TIPS.length];$("#financeTipTitle").textContent=t[0];$("#financeTipText").textContent=t[1]}
$("#financeTipNext")?.addEventListener("click",()=>{financeTipIndex=(financeTipIndex+1)%FINANCE_TIPS.length;renderFinanceTip()});

const FOCUS_TIPS=[
  'Reduza a tarefa até ela ficar fácil de começar.','Deixe só a próxima ação visível; esconda o restante do projeto.','Use um timer curto para decidir depois se continua.','Se travou, troque “preciso terminar” por “qual é o próximo clique?”.','Anote a distração em vez de segui-la imediatamente.','Prepare o ambiente antes de depender de força de vontade.','Uma tarefa mecânica pode abrir caminho para uma tarefa difícil.'
];
let focusTipIndex=quoteIndexForDate(todayISO())%FOCUS_TIPS.length;
function renderFocusCoach(){if($("#focusTipText"))$("#focusTipText").textContent=FOCUS_TIPS[focusTipIndex%FOCUS_TIPS.length]}
$("#focusTipNext")?.addEventListener("click",()=>{focusTipIndex=(focusTipIndex+1)%FOCUS_TIPS.length;renderFocusCoach()});

function renderJournal(){if(!$("#journalHistory"))return;const rows=(state.journalEntries||[]).slice().sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||''))).slice(0,24);$("#journalCount").textContent=state.journalEntries.length;$("#journalHistory").innerHTML=rows.length?rows.map(x=>`<article class="journal-entry ${x.type||'journal'}" data-journal-id="${x.id}"><header><span>${x.type==='thought'?'REGISTRO TCC':'DIÁRIO'}</span><time>${new Date(x.createdAt).toLocaleString('pt-BR')}</time><button data-journal-delete>×</button></header>${x.type==='thought'?`<b>${escapeHTML(x.situation||'Situação')}</b><p><strong>Pensamento:</strong> ${escapeHTML(x.thought||'')}</p><p><strong>Alternativa:</strong> ${escapeHTML(x.alternative||'')}</p><small>${escapeHTML(x.emotion||'')} ${x.intensity?`· ${x.intensity}/100`:''}${x.action?` · próxima ação: ${escapeHTML(x.action)}`:''}</small>`:`<p>${escapeHTML(x.text||'').replace(/\n/g,'<br>')}</p><small>humor ${x.mood||'—'}/10 · energia ${x.energy||'—'}/10 ${x.tags?`· ${escapeHTML(x.tags)}`:''}</small>`}</article>`).join(''):`<p class="note">Nenhuma entrada ainda.</p>`;$$('[data-journal-id]',$('#journalHistory')).forEach(row=>row.querySelector('[data-journal-delete]').addEventListener('click',()=>{state.journalEntries=state.journalEntries.filter(x=>x.id!==row.dataset.journalId);saveState();renderJournal()}));}
$("#journalSave")?.addEventListener("click",()=>{const text=$("#journalText").value.trim();if(!text)return toast('Escreva alguma coisa antes de salvar.');state.journalEntries.unshift({id:cryptoId(),type:'journal',text,mood:$("#journalMood").value,energy:$("#journalEnergy").value,tags:$("#journalTags").value.trim(),date:activeDate,createdAt:new Date().toISOString()});$("#journalText").value='';$("#journalTags").value='';saveState();renderJournal();toast('Entrada salva.','O diário fica no seu workspace.')});
$("#cbtSave")?.addEventListener("click",()=>{const situation=$("#cbtSituation").value.trim(),thought=$("#cbtThought").value.trim();if(!situation&&!thought)return toast('Preencha pelo menos situação ou pensamento.');state.journalEntries.unshift({id:cryptoId(),type:'thought',situation,thought,emotion:$("#cbtEmotion").value.trim(),intensity:Number($("#cbtIntensity").value||0),forEvidence:$("#cbtFor").value.trim(),against:$("#cbtAgainst").value.trim(),alternative:$("#cbtAlternative").value.trim(),action:$("#cbtAction").value.trim(),date:activeDate,createdAt:new Date().toISOString()});['#cbtSituation','#cbtThought','#cbtEmotion','#cbtIntensity','#cbtFor','#cbtAgainst','#cbtAlternative','#cbtAction'].forEach(s=>{if($(s))$(s).value=''});saveState();renderJournal();toast('Registro salvo.','Você pode reler depois com mais distância.')});
$$('[data-care-search]').forEach(btn=>btn.addEventListener('click',()=>{const city=$("#careCity")?.value.trim()||state.settings.careCity||'',uf=$("#careUF")?.value||state.settings.careUF||'',type=btn.dataset.careSearch==='psychiatrist'?'psiquiatra':'psicólogo',q=[type,city,uf].filter(Boolean).join(' ');window.open(`https://www.google.com/maps/search/${encodeURIComponent(q)}`,'_blank','noopener')}));

function renderAll(){
  applyInterfacePreferences();applyAccessProfile();
  renderToday();renderDailyGame();renderFocusCoach();
  const active=$(".view.active")?.id||"view-today";
  if(active==="view-today")renderCover();
  else if(active==="view-work"){renderArrival();renderBank();renderHistory();renderWorkNotes();renderWorkCommand();}
  else if(active==="view-finance")renderFinanceHub();
  else if(active==="view-journal")renderJournal();
  else if(active==="view-psychoanalysis")renderPsychoanalysis67();
  else if(active==="view-puc"){renderWeek();renderSeries();renderStudyHistory();renderPUCWeek();renderPUCCourses();renderStudyToolkit();}
  else if(active==="view-habits"){renderHabits();renderRoutine();}
  else if(active==="view-future"){renderHousing();renderCashflow();renderSavedProperties();renderGoals();}
  else if(active==="view-relationships")renderRelationships();
  else if(active==="view-english")renderEnglish();
  else if(active==="view-meditation"){if(isMasterUser())renderMeditation();else renderWellnessGeneric();}
  else if(active==="view-notes"){renderNotes();renderStickyNotes();}
  else if(active==="view-inspiration")renderInspiration(false);
  else if(active==="view-channel")renderChannel();
  else if(active==="view-reports")renderReports();
  else if(active==="view-reminders")renderReminders();
  else if(active==="view-control")renderControlPanel();
  applyNavigation34();renderOverview34();renderPlan34();
  if(active==="view-games")renderGames35();if(active==="view-gym")renderGym34();if(active==="view-rewards")renderRewards34();if(active==="view-resilience")renderResilience34();
  updateNotificationStatus();updateStorageInfo();
}
function prepareV31Layout(){$(".legacy-execution-guide")?.remove();}
const PRELOADER_STARTED=performance.now();let preloadFinishTimer46=0;
function finishPreloader(){const p=$("#appPreloader");if(!p||p.classList.contains('done')||preloadFinishTimer46)return;const reduced=state.settings.animationsEnabled===false||matchMedia('(prefers-reduced-motion: reduce)').matches;const wait=Math.max(0,(reduced?0:850)-(performance.now()-PRELOADER_STARTED));preloadFinishTimer46=setTimeout(()=>{preloadFinishTimer46=0;p.classList.add("done");setTimeout(()=>p.remove(),reduced?0:420);},wait);}

function clarifyForms(){
  const labels={focusTask:"Tarefa do ciclo de foco",adhdDistractionInput:"Distração para lembrar depois",workQuickNoteTitle:"Título da nota de trabalho",workQuickNoteStatus:"Status da nota",studyPomodoroTask:"Tarefa deste ciclo (opcional)",studyYoutubeUrl:"Link do YouTube (obrigatório)",studyYoutubeTitle:"Título do vídeo (opcional)",propertyUrl:"Link do imóvel",financeTxnType:"Tipo de lançamento",financeTxnAmount:"Valor do lançamento (R$)",financeTxnCategory:"Categoria (opcional)",financeTxnDate:"Data do lançamento",financeTxnNote:"Observação (opcional)",relationshipsWeddingPlanText:"Plano para o casamento",relationshipsIdeaText:"Ideia para fazer juntos",relationshipsIdeaType:"Tipo de ideia",relationshipsTripDestination:"Destino da viagem",relationshipsTripDate:"Data da viagem (opcional)",relationshipsTripNote:"Observação (opcional)",relationshipsVaultNewPin:"Criar PIN do cofre",relationshipsVaultNewPin2:"Confirmar PIN",relationshipsVaultPin:"PIN do cofre",englishUserAnswer:"Sua resposta em inglês",inspirationPinTitle:"Título da referência",inspirationPinSource:"Link da fonte (opcional)",inspirationPinImage:"Link da imagem",inspirationPinBoard:"Quadro",inspirationPinNote:"Observação (opcional)",inspirationSearchInput:"Pesquisar referências",nvResearchPrompt:"O que pesquisar",nvInsightTitle:"Título do insight",nvInsightType:"Tipo de insight",contributionInput:"Valor do aporte de hoje (R$)",controlInterests:"Seus interesses"};
  for(const [id,text] of Object.entries(labels)){
    const input=document.getElementById(id);if(!input||input.closest("label"))continue;
    const label=document.createElement("label"),span=document.createElement("span");label.className="clarified-field";span.textContent=text;
    input.before(label);label.append(span,input);input.setAttribute("aria-label",text);
  }
  const marked=new Set();
  $$('[data-setting], [data-day], #controlProfileName, #controlProfileRole, #controlEducationLabel, #controlChannelLabel, #channelConfigName, #controlFontPreset').forEach(input=>{
    const panel=input.closest('article');if(!panel||marked.has(panel))return;
    marked.add(panel);const tools=document.createElement('div');tools.className='form-save-tools';
    if(!panel.querySelector('.form-save-note')){const note=document.createElement('p');note.className='note form-save-note';note.textContent='Salvamento automático ativo. Você também pode usar “Salvar alterações”.';tools.append(note);}
    const button=document.createElement('button');button.className='ghost';button.type='button';button.dataset.manualSave='';button.textContent='Salvar alterações';button.addEventListener('click',()=>{try{saveState();toast('Alterações salvas.');}catch{toast('Não foi possível salvar.','Exporte um backup e confira o espaço disponível.');}});tools.append(button);panel.append(tools);
  });
}

/* MyWay v34: optional modules, deliberate submissions and lasting rewards. */
const V34_MODULE_NAMES={games:"Jogos",relationships:"Relacionamentos",resilience:"Resiliência",work:"Trabalho",puc:"Estudos",habits:"Hábitos",gym:"Academia",nutrition:"Nutrição",notes:"Notas",journal:"Diário",psychoanalysis:"Psicanálise",future:"Metas e casa",finance:"Finanças",english:"Inglês",meditation:"Bem-estar",inspiration:"Inspirações",channel:"Canal",reports:"Relatórios",reminders:"Lembretes"};
const REWARDS34=[
 {id:"base",name:"Azul original",xp:0,primary:"#20384f",accent:"#3e7a83",paper:"#e7e4de"},
 {id:"ocean",name:"Oceano",xp:100,primary:"#123b58",accent:"#127ca6",paper:"#e8f0f5"},
 {id:"sunset",name:"Pôr do sol",xp:250,primary:"#56313b",accent:"#c96c3b",paper:"#f0e5df"},
 {id:"forest",name:"Floresta",xp:500,primary:"#183c31",accent:"#4b8569",paper:"#e7ece6"},
 {id:"violet",name:"Violeta",xp:1000,primary:"#34305c",accent:"#7864ba",paper:"#ece9f3"}
];
const GYM_TIPS34=[
 ["Uma meta que cabe na sua semana","Escolha uma frequência possível e registre o treino realizado. A OMS recomenda fortalecimento dos principais grupos musculares em dois ou mais dias por semana para adultos; adapte com orientação profissional."],
 ["Comece pequeno","Se o dia estiver difícil, combine uma sessão menor com seu professor. Você pode registrar um treino curto sem precisar bater recordes."],
 ["Guarde a ficha, não a obrigação de decorar","Registre os exercícios, séries e repetições indicados pelo seu professor. Use as observações para levar dúvidas ao próximo atendimento."],
 ["Progresso inclui recuperação","Compare seus próprios registros ao longo das semanas. Carga maior não é a única forma de perceber constância ou evolução."],
 ["Respeite o que o corpo sinaliza","Interrompa o exercício se sentir dor aguda, tontura ou mal-estar e procure orientação. Ajuste a ficha com um profissional antes de insistir."]
];
const CHANNEL_TIPS34=[
 ["Uma promessa clara","Título e thumbnail devem explicar o assunto e corresponder ao vídeo. Use um elemento visual forte e texto legível no celular."],
 ["CTR precisa de contexto","Compare vídeos do próprio canal considerando fonte de tráfego e volume de impressões. Pequenas variações não bastam para concluir que uma thumbnail funcionou melhor."],
 ["O começo deve cumprir a promessa","Revise os primeiros segundos: o público entende logo o que vai receber? Use a retenção para encontrar trechos que precisam de ajuste."],
 ["Uma frequência sustentável","Defina um ritmo que você consegue manter. Organize ideias, produção e revisão sem transformar cada semana numa corrida."],
 ["Transforme comentários em pauta","Registre dúvidas recorrentes do público e salve ideias com contexto. Antes de produzir, escolha a pergunta que aquele vídeo vai responder."],
 ["Segurança também é saúde do canal","Ative a verificação em duas etapas, confira quem tem acesso e os direitos de uso de imagens e músicas. Não compartilhe senhas com o MyWay."]
];
let gymTipIndex34=0,channelTipIndex34=0;
let rewardNotification34=null,installPrompt34=null;
function normalize34(){
 normalizeResilience34();
 state.gymPlans=Array.isArray(state.gymPlans)?state.gymPlans:[];state.gymSessions=Array.isArray(state.gymSessions)?state.gymSessions:[];
 state.channelIdeas=Array.isArray(state.channelIdeas)?state.channelIdeas:[];state.channelHealth=state.channelHealth||{};
 state.rewards34=state.rewards34&&typeof state.rewards34==='object'?state.rewards34:{ledger:[],englishHighWater:0};state.rewards34.ledger=Array.isArray(state.rewards34.ledger)?state.rewards34.ledger:[];
 const s=state.settings;for(const [key,value] of Object.entries({featureGym:false,navigationMode:"simple",dashboardPriorities:["work","puc","habits"],dashboardTitle:"Uma coisa de cada vez.",layoutDensity:"normal",dashboardInspiration:true,rewardFeedback:"quiet",rewardGif:"",gymWeeklyGoal:3}))if(s[key]===undefined)s[key]=value;
 s.dashboardPriorities=Array.isArray(s.dashboardPriorities)?s.dashboardPriorities.slice(0,3):["work","puc","habits"];
 s.navigationMode=s.navigationMode==='full'?'full':'simple';
 state.account.plan=state.account.plan||{id:"free",status:"active",price:0,activatedAt:new Date().toISOString()};
 state.version=36;normalize35();
}
function rewardTotal34(){normalize34();return state.rewards34.ledger.reduce((n,x)=>n+Math.max(0,Number(x.xp)||0),0)+Math.max(0,Number(state.rewards34.englishHighWater)||0)}
function grantReward34(key,xp,label,date=activeDate){
 if(state.rewards34.ledger.some(x=>x.key===key))return false;
 state.rewards34.ledger.push({key,xp,label,date,createdAt:new Date().toISOString()});return true;
}
function syncRewardXP34(){
 normalize34();const before=rewardTotal34(),ledger=state.rewards34.ledger;
 for(const [date,d] of Object.entries(state.days||{})){
  const rules=[["morningNoScroll",10,"Rotina da manhã"],["studyMinimum",20,"Estudo realizado"],["careerAction",15,"Ação profissional"],["preparedTomorrow",10,"Amanhã organizado"],["cbtFiveMinute",8,"Começo de cinco minutos"],["cbtThoughtCheck",8,"Reflexão registrada"],["cbtIfThen",8,"Plano registrado"],["meditated",10,"Meditação realizada"]];
  if(Number(d.waterCups)>0)grantReward34(`small36:${date}:water`,2,"Primeiro copo de água",date);if(Number(d.walkMinutes)>0)grantReward34(`small36:${date}:walk`,3,"Começou a caminhar",date);if(Number(d.pagesRead)>0)grantReward34(`small36:${date}:reading`,3,"Primeiras páginas lidas",date);
  for(const [key,xp,label] of rules)if(d[key])grantReward34(`habit:${date}:${key}`,xp,label,date);
  if(Number(d.waterCups||0)>=Math.max(1,Number(state.settings.waterGoalCups||8)))grantReward34(`habit:${date}:water`,10,"Meta de água",date);
  if(Number(d.walkMinutes||0)>=Math.max(1,Number(state.settings.walkGoalMinutes||20)))grantReward34(`habit:${date}:walk`,10,"Caminhada realizada",date);
  for(let n=1;n<=Math.min(10,Number(d.returns||0));n++)grantReward34(`return:${date}:${n}`,2,"Retomada do foco",date);
  for(let n=1;n<=Math.min(3,Number(d.studyPomodoros||0));n++)grantReward34(`pomodoro:${date}:${n}`,10,"Ciclo de estudo",date);
 }
 for(const task of state.pucTrackModules||[])if(task.done)grantReward34(`task:${task.id}`,15,task.title||"Tarefa de estudo");
 for(const note of state.notes||[])if(note.status==="done")grantReward34(`note:${note.id}`,15,note.title||"Tarefa concluída",note.date||activeDate);
 for(const record of state.resilience34.records)if(record.outcome==='pause')grantReward34(`resilience:${record.date}:${record.goalId}`,[8,12,18][Math.min(3,Math.max(1,Number(record.priority)||1))-1],"Pausa e alternativa reconhecidas",record.date);
 for(const session of state.gymSessions)grantReward34(`gym:${session.date}`,25,"Treino registrado",session.date);
 for(const item of state.nvContent||[])if(item.status==="published")grantReward34(`publish:${item.id}`,30,item.title||"Conteúdo publicado",item.publishedAt||item.date||activeDate);
 state.rewards34.englishHighWater=Math.max(Number(state.rewards34.englishHighWater)||0,Math.round(Number(state.englishXP||0)/2));
 const after=rewardTotal34(),delta=after-before;
 const first=!state.meta.rewardsV34Initialized;state.meta.rewardsV34Initialized=true;
 if(delta>0&&!first&&!resilienceSaving34&&!document.body.classList.contains('auth-locked')){
  const unlocked=REWARDS34.filter(r=>r.xp>before&&r.xp<=after).map(r=>r.name);
  celebrateXP34(delta,unlocked.length?`Desbloqueado: ${unlocked.join(', ')}`:ledger[ledger.length-1]?.label||"Ação reconhecida");
 }
 return delta;
}
function celebrateXP34(xp,label){
 if(state.settings.rewardFeedback==="off")return;
 rewardNotification34?.remove();const toast=document.createElement('div');toast.className='v34-complete-toast';toast.setAttribute('role','status');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches||state.settings.animationsEnabled===false;
 const gif=state.settings.rewardFeedback==='gif'&&state.settings.rewardGif&&rewardTotal34()>=250&&!reduced;
 toast.innerHTML=`${gif?`<img src="${escapeHTML(state.settings.rewardGif)}" alt="">`:'<span class="v34-sparkle" aria-hidden="true">✓</span>'}<div><b>+${xp} XP</b><small>${escapeHTML(label)}</small></div>`;
 document.body.append(toast);rewardNotification34=toast;setTimeout(()=>toast.remove(),3200);
 if(state.settings.rewardFeedback==='confetti'&&!reduced){const confetti=document.createElement('div');confetti.className='v34-confetti';for(let i=0;i<26;i++){const piece=document.createElement('i');piece.style.left=`${Math.random()*100}%`;piece.style.background=[state.settings.uiPrimary,state.settings.uiAccent,'#f2b34b'][i%3];piece.style.animationDelay=`${Math.random()*.25}s`;confetti.append(piece);}document.body.append(confetti);setTimeout(()=>confetti.remove(),2200);}
}
function applyNavigation34(){
 normalize34();const simple=state.settings.navigationMode!=="full",priorities=state.settings.dashboardPriorities||[];
 applyFeatureVisibility();
 document.body.classList.toggle('v34-simple',simple);document.body.classList.toggle('v34-compact',state.settings.layoutDensity==='compact');document.body.classList.toggle('v34-roomy',state.settings.layoutDensity==='roomy');document.body.classList.toggle('v34-mobile',!!window.MYWAY_HOSTED);
 $$('.nav-item').forEach(button=>{const target=button.dataset.viewTarget;button.classList.toggle('v34-hidden-nav',simple&&!['today','notes','control','data','rewards','resilience','games',...priorities].includes(target));});
 if($('#dashboardTitle34'))$('#dashboardTitle34').textContent=state.settings.dashboardTitle||'Uma coisa de cada vez.';
 if($('#quickGym34'))$('#quickGym34').hidden=!featureEnabled('gym');
 if($('#quickIdea34'))$('#quickIdea34').hidden=!featureEnabled('channel');
 if($('#quickTask34'))$('#quickTask34').hidden=!featureEnabled('puc');
 if($('#showModules34'))$('#showModules34').textContent=simple?'Ativar modo Completo':'Voltar ao Essencial';
 $$('[data-navigation-mode34]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.navigationMode34===state.settings.navigationMode)));
 if($('#mobileHelp34')&&window.MYWAY_HOSTED)$('#mobileHelp34').textContent='No Android, abra este endereço no Chrome e escolha “Instalar aplicativo” no menu. O acesso móvel é privado e os registros são salvos na sua conta desta versão.';
}
function setNavigationMode34(mode){
 if(!['simple','full'].includes(mode)||state.settings.navigationMode===mode)return;
 state.settings.navigationMode=mode;saveState();renderAll();
 const current=$('.view.active')?.id.replace('view-',''),button=$(`.nav-item[data-view-target="${current}"]`);
 if(mode==='simple'&&button&&(button.classList.contains('v34-hidden-nav')||button.classList.contains('feature-disabled')))showView('today');
 toast(mode==='full'?'Modo Completo ativo.':'Modo Essencial ativo.',mode==='full'?'Todas as áreas estão no menu.':'Suas prioridades voltaram ao menu.');
}
function renderNavigationSetup34(){
 const full=$('input[name="onboardNavigationMode"]:checked')?.value==='full';
 for(const id of ['onboardPriorities34','onboardOtherModules34'])if($(`#${id}`))$(`#${id}`).hidden=full;
}
function prefillNavigationSetup34(){
 normalize34();
 $$('input[name="onboardNavigationMode"]').forEach(input=>input.checked=input.value===state.settings.navigationMode);
 const options='<option value="">Nenhuma por enquanto</option>'+Object.entries(V34_MODULE_NAMES).filter(([value])=>value!=='channel').map(([value,label])=>`<option value="${value}">${escapeHTML(label)}</option>`).join('');
 $$('[data-onboard-priority34]').forEach((input,index)=>{input.innerHTML=options;input.value=state.settings.dashboardPriorities[index]||'';});
 renderNavigationSetup34();
}
function saveNavigationSetup34(){
 state.settings.navigationMode=$('input[name="onboardNavigationMode"]:checked')?.value==='full'?'full':'simple';
 state.settings.dashboardPriorities=[...new Set($$('[data-onboard-priority34]').map(input=>input.value).filter(value=>V34_MODULE_NAMES[value]))];
 for(const target of state.settings.dashboardPriorities){const key=FEATURE_SETTINGS[target];if(key)state.settings[key]=true;}
}
function renderNavigationSetupSummary34(){
 const box=$('#onboardSummary');if(!box)return;
 const full=$('input[name="onboardNavigationMode"]:checked')?.value==='full',names=[...new Set($$('[data-onboard-priority34]').map(input=>V34_MODULE_NAMES[input.value]).filter(Boolean))];
 box.insertAdjacentHTML('afterbegin',`<div><span>Modo</span><b>${full?'Completo · todas as áreas':'Essencial · menu reduzido'}</b></div>${full?'':`<div><span>Prioridades</span><b>${escapeHTML(names.join(' · ')||'Você pode escolher depois')}</b></div>`}`);
 if(full)box.lastElementChild.querySelector('b').textContent='Todas as áreas disponíveis';
}
async function personalize34(){
 const priorities=state.settings.dashboardPriorities;
 const options=Object.entries(V34_MODULE_NAMES).filter(([value])=>value!=='channel').map(([value,label])=>({value,label}));
 const result=await openFormDialog({title:'Personalizar seu painel',description:'Escolha o que ajuda agora. Use o modo Completo no topo para acessar todas as áreas.',submitLabel:'Salvar personalização',fields:[
  {key:'title',label:'Nome do painel',required:true,value:state.settings.dashboardTitle,maxLength:60},
  {key:'mode',label:'Navegação',value:state.settings.navigationMode,options:[{value:'simple',label:'Essencial — poucas opções'},{value:'full',label:'Completo — gratuito'}]},
  {key:'first',label:'Prioridade 1',value:priorities[0]||'work',options},
  {key:'second',label:'Prioridade 2',value:priorities[1]||'puc',options},
  {key:'third',label:'Prioridade 3',value:priorities[2]||'habits',options},
  {key:'density',label:'Espaçamento',value:state.settings.layoutDensity,options:[{value:'compact',label:'Compacto'},{value:'normal',label:'Normal'},{value:'roomy',label:'Mais espaço'}]},
  {key:'inspiration',label:'Inspirações no painel',value:state.settings.dashboardInspiration?'yes':'no',options:[{value:'yes',label:'Mostrar até três referências escolhidas'},{value:'no',label:'Ocultar'}]}
 ]});if(!result)return;
 state.settings.dashboardTitle=result.title;state.settings.navigationMode=result.mode;state.settings.layoutDensity=result.density;state.settings.dashboardPriorities=[...new Set([result.first,result.second,result.third])];state.settings.dashboardInspiration=result.inspiration==='yes';
 for(const module of state.settings.dashboardPriorities){const key=FEATURE_SETTINGS[module];if(key)state.settings[key]=true;}
 saveState();renderAll();toast('Personalização salva.');
}
function renderOverview34(){
 normalize34();renderResilienceSummary34();const total=rewardTotal34(),next=REWARDS34.find(x=>x.xp>total);
 if($('#rewardSummary34'))$('#rewardSummary34').textContent=`Nível ${Math.floor(total/120)+1} · ${total} XP acumulados`;
 if($('#rewardNext34'))$('#rewardNext34').textContent=next?`Faltam ${next.xp-total} XP para liberar ${next.name}.`:'Todas as cores desta versão estão liberadas.';
 const box=$('#dashboardInspiration34');if(!box)return;
 const pins=(state.inspirationPins||[]).filter(x=>x.onDashboard).slice(0,3);
 box.hidden=!state.settings.dashboardInspiration||!pins.length;
 box.innerHTML=pins.map(pin=>`<button class="v34-inspiration-card" data-dashboard-pin="${escapeHTML(pin.id)}">${pin.image?`<img src="${escapeHTML(pin.image)}" alt="" loading="lazy">`:''}<span>${escapeHTML(pin.title||'Referência salva')}</span></button>`).join('');
 $$('[data-dashboard-pin]',box).forEach(button=>button.addEventListener('click',()=>{showView('inspiration');inspirationMode='saved';renderInspiration(false)}));
}
function renderRewards34(){
 if(!$('#rewardCatalog34'))return;const total=rewardTotal34();$('#rewardLevel34').textContent=`Nível ${Math.floor(total/120)+1}`;$('#rewardTotal34').textContent=`${total} XP`;
 $('#rewardCatalog34').innerHTML=REWARDS34.map(r=>`<article class="v34-reward ${total<r.xp?'locked':''}"><span class="v34-swatch" style="background:linear-gradient(90deg,${r.primary} 50%,${r.accent} 50%)"></span><b>${r.name}</b><small>${total<r.xp?`Libera em ${r.xp} XP — faltam ${r.xp-total}`:'Liberado'}</small><button class="ghost" data-reward-theme="${r.id}" ${total<r.xp?'disabled':''}>Aplicar cores</button></article>`).join('');
 $$('[data-reward-theme]').forEach(button=>button.addEventListener('click',()=>{const reward=REWARDS34.find(x=>x.id===button.dataset.rewardTheme);if(!reward||total<reward.xp)return;state.settings.uiThemePreset='custom';state.settings.uiPrimary=reward.primary;state.settings.uiAccent=reward.accent;state.settings.uiPaper=reward.paper;saveState();applyAppearance();renderAll();toast('Cores aplicadas.',reward.name)}));
 $('#rewardFeedback34').value=state.settings.rewardFeedback;
 if($('#rewardGif34'))$('#rewardGif34').disabled=total<250;
 $('#rewardHistory34').innerHTML=state.rewards34.ledger.slice(-12).reverse().map(x=>`<div class="v34-list-item"><header><b>${escapeHTML(x.label)}</b><small>+${x.xp} XP</small></header><small>${formatDateBR(x.date)}</small></div>`).join('')||'<p class="v34-help">Conclua sua primeira ação para começar.</p>';
}
function readDataURL34(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);})}
function renderGym34(){
 normalize34();if(!$('#gymPlans34'))return;
 const [weekStart,weekEnd]=weekBounds(),sessions=state.gymSessions.filter(x=>x.date>=weekStart&&x.date<=weekEnd);$('#gymWeek34').textContent=new Set(sessions.map(x=>x.date)).size;$('#gymGoal34').textContent=state.settings.gymWeeklyGoal;$('#gymMinutes34').textContent=sessions.reduce((n,x)=>n+(Number(x.minutes)||0),0);
 const select=$('#gymPlan34'),selected=select.value;select.innerHTML='<option value="">Treino livre / sem ficha</option>'+state.gymPlans.map(x=>`<option value="${escapeHTML(x.id)}">${escapeHTML(x.title)}</option>`).join('');if(state.gymPlans.some(x=>x.id===selected))select.value=selected;
 if(!$('#gymDate34').value)$('#gymDate34').value=activeDate;
 $('#gymPlans34').innerHTML=state.gymPlans.map(plan=>`<div class="v34-list-item" data-gym-plan="${escapeHTML(plan.id)}"><header><b>${escapeHTML(plan.title)}</b><button class="text-button" data-gym-edit>Editar</button></header><p>${escapeHTML(plan.exercises||'Sem exercícios informados.')}</p><div class="v34-item-actions"><button class="ghost" data-gym-start>Usar no check-in</button><button class="text-button" data-gym-delete>Excluir ficha</button></div></div>`).join('')||'<p class="v34-help">Nenhuma ficha cadastrada. Você também pode registrar um treino livre.</p>';
 $$('[data-gym-plan]').forEach(row=>{const plan=state.gymPlans.find(x=>x.id===row.dataset.gymPlan);row.querySelector('[data-gym-edit]').addEventListener('click',()=>editGymPlan34(plan));row.querySelector('[data-gym-start]').addEventListener('click',()=>{$('#gymPlan34').value=plan.id;$('#gymCheckinForm34').scrollIntoView({behavior:'smooth',block:'center'})});row.querySelector('[data-gym-delete]').addEventListener('click',async()=>{if(!await askConfirmation(`Excluir a ficha “${plan.title}”? O histórico de treinos será mantido.`,'Excluir ficha'))return;state.gymPlans=state.gymPlans.filter(x=>x.id!==plan.id);saveState();renderGym34()});});
 $('#gymHistory34').innerHTML=state.gymSessions.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,20).map(session=>`<div class="v34-list-item" data-gym-session="${escapeHTML(session.id)}"><header><b>${escapeHTML(session.planTitle||'Treino livre')}</b><small>${formatDateBR(session.date)} · ${session.minutes||0} min</small></header>${session.note?`<p>${escapeHTML(session.note)}</p>`:''}<small>${escapeHTML(session.energy||'Intensidade não informada')}</small><button class="text-button" data-gym-remove>Excluir registro</button></div>`).join('')||'<p class="v34-help">Nenhum treino registrado ainda.</p>';
 $$('[data-gym-session]').forEach(row=>row.querySelector('[data-gym-remove]').addEventListener('click',async()=>{if(!await askConfirmation('Excluir este registro? Os XP já conquistados permanecem.','Excluir registro'))return;state.gymSessions=state.gymSessions.filter(x=>x.id!==row.dataset.gymSession);saveState();renderGym34()}));
 const tip=GYM_TIPS34[gymTipIndex34%GYM_TIPS34.length];$('#gymTipTitle34').textContent=tip[0];$('#gymTipText34').textContent=tip[1];
}
async function editGymPlan34(plan=null){const result=await openFormDialog({title:plan?'Editar ficha':'Adicionar ficha',description:'Transcreva a ficha orientada pelo seu professor.',submitLabel:'Salvar ficha',fields:[{key:'title',label:'Nome da ficha',required:true,value:plan?.title,placeholder:'Ex.: Treino A',maxLength:80},{key:'exercises',label:'Exercícios, séries e repetições',type:'textarea',required:true,value:plan?.exercises,placeholder:'Um exercício por linha',maxLength:4000}]});if(!result)return;if(plan)Object.assign(plan,result);else state.gymPlans.push({id:cryptoId(),...result,createdAt:new Date().toISOString()});saveState();renderGym34();toast('Ficha salva.');}
function renderChannelIdeas34(){
 normalize34();if(!$('#channelIdeas34'))return;
 $('#channelIdeas34').innerHTML=state.channelIdeas.map(idea=>`<div class="v34-list-item" data-channel-idea="${escapeHTML(idea.id)}"><header><b>${escapeHTML(idea.title)}</b><small>${idea.contentId?'Enviada à produção':'Ideia salva'}</small></header>${idea.description?`<p>${escapeHTML(idea.description)}</p>`:''}${idea.reference?`<a href="${escapeHTML(safeExternalUrl34(idea.reference))}" target="_blank" rel="noopener">Referência</a>`:''}<div class="v34-item-actions"><button class="ghost" data-idea-produce ${idea.contentId?'disabled':''}>Enviar para produção</button><button class="text-button" data-idea-edit>Editar</button><button class="text-button" data-idea-delete>Excluir</button></div></div>`).join('')||'<p class="v34-help">Nenhuma ideia salva. Uma frase já é suficiente para começar.</p>';
 $$('[data-channel-idea]').forEach(row=>{const idea=state.channelIdeas.find(x=>x.id===row.dataset.channelIdea);row.querySelector('[data-idea-edit]').addEventListener('click',()=>editChannelIdea34(idea));row.querySelector('[data-idea-delete]').addEventListener('click',async()=>{if(!await askConfirmation('Excluir esta ideia? Conteúdos já enviados à produção serão mantidos.','Excluir ideia'))return;state.channelIdeas=state.channelIdeas.filter(x=>x.id!==idea.id);saveState();renderChannelIdeas34()});row.querySelector('[data-idea-produce]').addEventListener('click',()=>{if(idea.contentId)return;const id=cryptoId();state.nvContent.unshift({id,title:idea.title,notes:idea.description||'',status:'research',pillar:channelPillars()[0]||'Conteúdo',progress:nvStatusProgress('research'),date:activeDate,dueDate:'',thumbnail:'',createdAt:new Date().toISOString()});idea.contentId=id;saveState();renderChannel();toast('Ideia enviada para produção.');});});
 const tip=CHANNEL_TIPS34[channelTipIndex34%CHANNEL_TIPS34.length];$('#channelTipTitle34').textContent=tip[0];$('#channelTipText34').textContent=tip[1];
 const week=weekBounds()[0],review=state.channelHealth[week]||{};$$('input[type="checkbox"]',$('#channelHealthForm34')).forEach(input=>input.checked=!!review[input.name]);$('#channelHealthResult34').textContent=review.savedAt?`Revisão salva em ${new Date(review.savedAt).toLocaleDateString('pt-BR')}.`:'Ainda não revisada nesta semana.';
}
function safeExternalUrl34(value){try{const url=new URL(value);return ['https:','http:'].includes(url.protocol)?url.href:'#';}catch{return '#';}}
async function editChannelIdea34(idea=null){const result=await openFormDialog({title:idea?'Editar ideia':'Salvar ideia do canal',description:'Guarde o tema e complete os detalhes quando quiser.',submitLabel:'Salvar ideia',fields:[{key:'title',label:'Título ou tema',required:true,value:idea?.title,placeholder:'Ex.: Por que essa cena funciona?',maxLength:160},{key:'description',label:'Anotações',type:'textarea',value:idea?.description,maxLength:3000},{key:'reference',label:'Link de referência',type:'url',value:idea?.reference,placeholder:'https://...'}],validate:v=>v.reference&&safeExternalUrl34(v.reference)==='#'?'Use um link http ou https válido.':''});if(!result)return;if(idea)Object.assign(idea,result);else state.channelIdeas.unshift({id:cryptoId(),...result,createdAt:new Date().toISOString()});saveState();renderChannelIdeas34();toast('Ideia salva.');}
async function selectDashboardPins34(){
 const pins=state.inspirationPins||[];if(!pins.length)return toast('Salve uma referência primeiro.','Depois escolha até três para seu painel.');
 const options=[{value:'',label:'Nenhuma'},...pins.map(x=>({value:x.id,label:x.title||'Referência'}))],selected=pins.filter(x=>x.onDashboard);
 const result=await openFormDialog({title:'Inspirações no painel',description:'Escolha até três referências salvas para manter à vista.',submitLabel:'Enviar para o painel',fields:[1,2,3].map((n)=>({key:`pin${n}`,label:`Referência ${n}`,value:selected[n-1]?.id||'',options}))});if(!result)return;
 const ids=new Set(Object.values(result).filter(Boolean));pins.forEach(x=>x.onDashboard=ids.has(x.id));state.settings.dashboardInspiration=true;saveState();renderOverview34();toast('Referências enviadas ao painel.');
}
function renderPlan34(){
 normalize34();if($('#planStatus34'))$('#planStatus34').textContent=state.account.plan.status==='active'?'Plano gratuito ativo.':'Ative gratuitamente para registrar seu plano.';
 if($('#activateFree34')){$('#activateFree34').textContent=state.account.plan.status==='active'?'Gratuito ativo':'Ativar plano gratuito';$('#activateFree34').disabled=state.account.plan.status==='active';}
}
async function shareWorkReport34(){
 if(!lastWorkReportHTML)return;
 const body=`<!doctype html><meta charset="utf-8"><title>Relatório MyWay</title><style>body{font:16px Arial;max-width:900px;margin:24px auto;padding:16px;line-height:1.5;color:#172733}h3{font-size:28px}section{margin:24px 0}li{margin:8px 0}</style>${lastWorkReportHTML}`;
 const file=new File([body],lastWorkReportName,{type:'text/html'});
 if(navigator.canShare?.({files:[file]})){try{await navigator.share({files:[file],title:'Relatório de trabalho'});}catch(e){if(e.name!=='AbortError')toast('Não consegui abrir o envio.','Use Baixar HTML e anexe o arquivo.');}}
 else {download(lastWorkReportName,body,'text/html');toast('Relatório baixado para enviar.','Anexe o arquivo na conversa ou e-mail de sua escolha.');}
}
function init34(){
 if($("#overview34"))$("#view-today").prepend($("#overview34"));
 normalize34();syncRewardXP34();applyNavigation34();renderOverview34();renderPlan34();
 $('#workReportShare34')?.addEventListener('click',shareWorkReport34);
 for(const id of ['customize34','openPersonalization34'])$(`#${id}`)?.addEventListener('click',personalize34);
 $('#showModules34')?.addEventListener('click',()=>setNavigationMode34(state.settings.navigationMode==='full'?'simple':'full'));
 $$('[data-navigation-mode34]').forEach(button=>button.addEventListener('click',()=>setNavigationMode34(button.dataset.navigationMode34)));
 $$('input[name="onboardNavigationMode"]').forEach(input=>input.addEventListener('change',renderNavigationSetup34));
 $$('[data-onboard-priority34]').forEach(input=>input.addEventListener('change',()=>{const checkbox=$(`#onboardModules input[value="${input.value}"]`);if(checkbox)checkbox.checked=true;}));
 $('#onboardModules')?.addEventListener('change',e=>{if(e.target.checked)return;$$('[data-onboard-priority34]').filter(input=>input.value===e.target.value).forEach(input=>input.value='');});
 $('#openRewards34')?.addEventListener('click',()=>showView('rewards'));
 $('#dailyGamebar')?.addEventListener('click',()=>showView('rewards'));$('#dailyGamebar')?.setAttribute('title','Abrir recompensas');
 $('#quickTask34')?.addEventListener('click',()=>{showView('puc');if($('#pucTrackAddTask')?.disabled)toast('Cadastre uma matéria primeiro.','Use Adicionar matéria para começar sua trilha.');else openStudyTaskDialog()});$('#quickGym34')?.addEventListener('click',()=>showView('gym'));$('#quickIdea34')?.addEventListener('click',()=>{showView('channel');editChannelIdea34()});
 $('#gymAddPlan34')?.addEventListener('click',()=>editGymPlan34());$('#gymNextTip34')?.addEventListener('click',()=>{gymTipIndex34++;renderGym34()});
 $('#gymCheckinForm34')?.addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;const date=$('#gymDate34').value,minutes=Number($('#gymDuration34').value||0),plan=state.gymPlans.find(x=>x.id===$('#gymPlan34').value);if(!date||date>todayISO())return toast('Escolha hoje ou uma data anterior.');if(!Number.isFinite(minutes)||minutes<0||minutes>600)return toast('Informe de 0 a 600 minutos.');state.gymSessions.unshift({id:cryptoId(),date,minutes,planId:plan?.id||'',planTitle:plan?.title||'Treino livre',energy:$('#gymEnergy34').value,note:$('#gymNote34').value.trim(),createdAt:new Date().toISOString()});saveState();$('#gymNote34').value='';$('#gymDuration34').value='';$('#gymCheckinResult34').textContent='Treino registrado. Você ganhou XP se este é o primeiro registro do dia.';renderGym34();renderDailyGame();renderOverview34();});
 $('#gymSettings34')?.addEventListener('click',async()=>{const result=await openFormDialog({title:'Meta de academia',description:'Defina uma meta pessoal viável de dias com treino por semana.',submitLabel:'Salvar meta',fields:[{key:'goal',label:'Dias por semana',required:true,type:'number',value:state.settings.gymWeeklyGoal}],validate:r=>!Number.isInteger(Number(r.goal))||Number(r.goal)<1||Number(r.goal)>7?'Escolha um número inteiro de 1 a 7.':''});if(!result)return;state.settings.gymWeeklyGoal=Number(result.goal);saveState();renderGym34();});
 $('#channelAddIdea34')?.addEventListener('click',()=>editChannelIdea34());$('#channelNextTip34')?.addEventListener('click',()=>{channelTipIndex34++;renderChannelIdeas34()});
 $('#channelHealthForm34')?.addEventListener('submit',e=>{e.preventDefault();const review={savedAt:new Date().toISOString()};$$('input[type="checkbox"]',e.currentTarget).forEach(input=>review[input.name]=input.checked);state.channelHealth[weekBounds()[0]]=review;saveState();$('#channelHealthResult34').textContent='Revisão semanal salva.';toast('Revisão do canal salva.');});
 $('#inspirationDashboard34')?.addEventListener('click',selectDashboardPins34);
 $('#rewardAnimationForm34')?.addEventListener('submit',async e=>{e.preventDefault();const mode=$('#rewardFeedback34').value,file=$('#rewardGif34')?.files?.[0];if((mode==='gif'||file)&&rewardTotal34()<250)return toast('GIF personalizado libera em 250 XP.');if(file){if(file.type!=='image/gif'||file.size>500*1024)return toast('Envie um GIF de até 500 KB.');state.settings.rewardGif=await readDataURL34(file);}if(mode==='gif'&&!state.settings.rewardGif)return toast('Envie um GIF antes de escolher esse estilo.');state.settings.rewardFeedback=mode;saveState();toast('Animação salva.');});
 $('#activateFree34')?.addEventListener('click',()=>{state.account.plan={id:'free',status:'active',price:0,activatedAt:new Date().toISOString()};saveState();renderPlan34();toast('Plano gratuito ativo.');});
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt34=e;$('#installApp34').textContent='Instalar aplicativo';});
 $('#installApp34')?.addEventListener('click',async()=>{if(installPrompt34){await installPrompt34.prompt();await installPrompt34.userChoice;installPrompt34=null;}else await openFormDialog({title:'MyWay no celular',description:window.MYWAY_HOSTED?'No Android: abra este endereço no Chrome, toque no menu ⋮ e escolha Instalar aplicativo ou Adicionar à tela inicial. No primeiro acesso, entre na conta ChatGPT autorizada para esta versão privada. Depois configure ou entre no MyWay.':'O executável .exe funciona no Windows. No Android, abra o endereço da versão móvel no Chrome e escolha Instalar aplicativo. Use o link entregue junto desta versão.',submitLabel:'Entendi',confirmation:true});});
}

const RESILIENCE_GOALS34=[{"id": "casino", "label": "Cassino online / slots / roleta"}, {"id": "bets", "label": "Apostas esportivas / bets"}, {"id": "lottery", "label": "Loterias / bingo"}, {"id": "vape", "label": "Vape / cigarro eletrônico"}, {"id": "gaming", "label": "Jogos digitais em excesso"}, {"id": "lootboxes", "label": "Loot boxes / microtransações"}, {"id": "social", "label": "Redes sociais"}, {"id": "shorts", "label": "Vídeos curtos / feed infinito"}, {"id": "streaming", "label": "Séries / streaming em excesso"}, {"id": "phone", "label": "Uso constante do celular"}, {"id": "shopping", "label": "Compras compulsivas"}, {"id": "trading", "label": "Especulação / operações impulsivas"}, {"id": "food", "label": "Comer por impulso / episódios de compulsão"}, {"id": "sugar", "label": "Açúcar / doces em excesso"}, {"id": "caffeine", "label": "Cafeína / energéticos em excesso"}, {"id": "sex", "label": "Comportamento sexual que traz prejuízo"}, {"id": "masturbation", "label": "Masturbação que interfere na rotina"}, {"id": "work", "label": "Trabalho sem limites / descanso insuficiente"}, {"id": "exercise", "label": "Exercício sem descanso adequado"}, {"id": "nails", "label": "Roer unhas"}, {"id": "checking", "label": "Checagens repetitivas"}, {"id": "approval", "label": "Busca constante de aprovação"}, {"id": "other", "label": "Outro comportamento que quero cuidar"}, {"id": "alcohol", "label": "Álcool"}, {"id": "smoking", "label": "Cigarro / nicotina"}, {"id": "cannabis", "label": "Maconha"}, {"id": "spending", "label": "Compras por ansiedade"}, {"id": "porn", "label": "Pornografia"}, {"id": "scroll", "label": "Rolagem e distrações digitais"}];
let resilienceAudio34=null,resiliencePromptStarted34=Date.now(),resilienceSaving34=false;
function normalizeResilience34(){
 for(const goal of state.customCare36||[])if(careAllowed38(goal.label)&&!RESILIENCE_GOALS34.some(g=>g.id===goal.id))RESILIENCE_GOALS34.push(goal);
 const r=state.resilience34=state.resilience34||{};
 r.goals=r.goals&&typeof r.goals==='object'?r.goals:{};
 r.records=Array.isArray(r.records)?r.records:[];r.wellbeing=Array.isArray(r.wellbeing)?r.wellbeing:[];
 for(const [k,v] of Object.entries({sound:'off',effects:'confetti',promptMinutes:180,showTopics:false,alternative:'',support:''}))if(r[k]===undefined)r[k]=v;
}
function resiliencePoints34(){return (state.rewards34?.ledger||[]).filter(x=>String(x.key).startsWith('resilience:')).reduce((sum,x)=>sum+Number(x.xp||0),0)}
function activeResilienceGoals34(){return RESILIENCE_GOALS34.filter(g=>state.resilience34.goals[g.id]?.enabled)}
function resilienceSound34(preview=false){
 if(!preview&&state.resilience34.sound!=='on')return;
 try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;resilienceAudio34=resilienceAudio34||new Audio();resilienceAudio34.resume().catch(()=>{});const t=resilienceAudio34.currentTime;
 for(const [i,note] of [523.25,659.25,783.99].entries()){const oscillator=resilienceAudio34.createOscillator(),gain=resilienceAudio34.createGain();oscillator.type='sine';oscillator.frequency.value=note;gain.gain.setValueAtTime(0,t+i*.12);gain.gain.linearRampToValueAtTime(.045,t+i*.12+.025);gain.gain.exponentialRampToValueAtTime(.0001,t+i*.12+.28);oscillator.connect(gain);gain.connect(resilienceAudio34.destination);oscillator.start(t+i*.12);oscillator.stop(t+i*.12+.3);}
 }catch{}
}
function celebrateResilience34(xp,label){
 const previous=state.settings.rewardFeedback;state.settings.rewardFeedback=state.resilience34.effects;
 celebrateXP34(xp,label);state.settings.rewardFeedback=previous;resilienceSound34();
}
function renderResilienceSummary34(){
 normalizeResilience34();const r=state.resilience34,points=resiliencePoints34(),pct=Math.min(100,points),today=r.records.filter(x=>x.date===activeDate&&x.outcome==='pause');
 $$('[data-reservoir-fill]').forEach(el=>{el.style.width=`${pct}%`;el.closest('[role="progressbar"]')?.setAttribute('aria-valuenow',pct)});
 $$('[data-reservoir-label]').forEach(el=>el.textContent=`${pct}%`);
 $$('[data-reservoir-copy]').forEach(el=>el.textContent=points>=100?`${points} pontos de escolhas reconhecidas. Reservatório completo; seus XP continuam crescendo.`:`${points} de 100 pontos de escolhas reconhecidas. Cada pausa conta.`);
 renderReservoirHint35(points);const box=$('#resilienceToday34');if(!box)return;
 const goals=activeResilienceGoals34();$('#resilienceQuick34').textContent=goals.length?'Registrar pausa / escolha':'Escolher assuntos para começar';
 if(!goals.length)box.innerHTML='<p class="v34-help">Escolha os assuntos que deseja acompanhar. Os nomes ficam ocultos neste painel até você decidir mostrá-los.</p>';
 else if(!today.length)box.innerHTML='<p class="v34-help">Como foi hoje? Registre uma pausa, uma alternativa ou uma dificuldade.</p>';
 else if(!r.showTopics)box.innerHTML=`<p class="v34-help">${new Set(today.map(x=>x.goalId)).size} assunto(s) com pausas registradas nesta data. Abra Resiliência para ver os gatilhos.</p>`;
 else box.innerHTML='<div class="resilience-today-tags34">'+[...new Set(today.map(x=>x.goalId))].map(id=>`<span>✓ ${escapeHTML(RESILIENCE_GOALS34.find(g=>g.id===id)?.label||'Escolha registrada')}</span>`).join('')+'</div>';
}
function resilienceContext34(){const id=$('#resilienceGoal34').value,el=$('#resilienceContext34');const messages={alcohol:'Se houver dependência de álcool, parar abruptamente pode ser perigoso. Procure orientação médica antes de reduzir ou interromper o consumo.',body:'O registro acompanha pausas nas checagens e comparações; não avalia sua aparência. Se isso traz sofrimento, procure apoio profissional.',skin:'Não é falta de força de vontade. Se há ferimentos ou sofrimento, procure avaliação profissional.'};el.hidden=!messages[id];el.textContent=messages[id]||'';}
function renderResilience34(){
 normalizeResilience34();renderResilienceSummary34();const r=state.resilience34,goals=activeResilienceGoals34(),select=$('#resilienceGoal34'),previous=select.value;
 select.innerHTML=goals.length?goals.map(g=>`<option value="${g.id}">${escapeHTML(g.label)}</option>`).join(''):'<option value="">Escolha um assunto nas preferências abaixo</option>';
 if(goals.some(g=>g.id===previous))select.value=previous;resilienceContext34();
 $('#resilienceCheckin34 button[type="submit"]').disabled=!goals.length;
 if(!$('#resilienceDate34').value)$('#resilienceDate34').value=activeDate;
 $('#resilienceAlternative34').value=r.alternative;$('#resilienceSupport34').value=r.support;
 $('#resilienceGoals34').innerHTML=RESILIENCE_GOALS34.map(g=>{const cfg=r.goals[g.id]||{};return `<div class="resilience-goal34" data-resilience-goal="${g.id}"><label><input type="checkbox" ${cfg.enabled?'checked':''}>${escapeHTML(g.label)}</label><select aria-label="Prioridade de ${escapeHTML(g.label)}"><option value="1" ${Number(cfg.priority||1)===1?'selected':''}>Prioridade 1 · 8 XP</option><option value="2" ${Number(cfg.priority)===2?'selected':''}>Prioridade 2 · 12 XP</option><option value="3" ${Number(cfg.priority)===3?'selected':''}>Prioridade 3 · 18 XP</option></select></div>`}).join('');
 $('#resilienceSound34').value=r.sound;$('#resilienceEffects34').value=r.effects;$('#resiliencePrompt34').value=String(r.promptMinutes);$('#resiliencePrivate34').checked=!!r.showTopics;
 $('#resilienceAlcoholNote34').hidden=!r.goals.alcohol?.enabled;
 $('#resilienceWellbeing34').innerHTML=r.wellbeing.slice(0,12).map(x=>`<div class="v34-list-item"><header><b>${escapeHTML(({hard:'Está difícil',low:'Pouca energia',neutral:'Mais ou menos',okay:'Bem',good:'Animado(a)'})[x.feeling]||'Registro')}</b><small>${formatDateBR(x.date)}</small></header>${x.note?`<p>${escapeHTML(x.note)}</p>`:''}</div>`).join('')||'<p class="v34-help">Nenhum check-in de bem-estar ainda.</p>';
 $('#resilienceHistory34').innerHTML=r.records.filter(x=>!ARCHIVED_CARE38.some(g=>g.id===x.goalId)).slice().sort((a,b)=>b.date.localeCompare(a.date)||b.updatedAt.localeCompare(a.updatedAt)).slice(0,40).map(x=>`<div class="v34-list-item"><header><b>${escapeHTML(RESILIENCE_GOALS34.find(g=>g.id===x.goalId)?.label||'Assunto anterior')}</b><small>${formatDateBR(x.date)}</small></header><p>${x.outcome==='pause'?'Pausa / alternativa registrada':x.outcome==='hard'?'Foi difícil desta vez. Um próximo passo continua possível.':'Nenhum gatilho registrado.'}</p>${x.trigger?`<small>Contexto: ${escapeHTML(x.trigger)}</small>`:''}${x.strategy?`<p>${escapeHTML(x.strategy)}</p>`:''}</div>`).join('')||'<p class="v34-help">Seus primeiros registros aparecerão aqui.</p>';
}
function openResilience34(settings=false){showView('resilience');if(settings)setTimeout(()=>$('#resilienceSettingsCard34').scrollIntoView({behavior:'smooth',block:'start'}),100)}
async function assessImpulse34(transaction){
 const result=await openFormDialog({title:'Como você avalia esse gasto?',description:`${transaction.category||'Gasto'} · ${money(transaction.amount)}. Sua avaliação é pessoal e pode mudar.`,submitLabel:'Salvar avaliação',fields:[{key:'decision',label:'Você considerou esse gasto impulsivo?',value:transaction.impulseDecision||'',options:[{value:'',label:'Ainda não avaliei'},{value:'yes',label:'Sim, foi impulsivo para mim'},{value:'no',label:'Não, foi uma escolha planejada'},{value:'unsure',label:'Ainda não tenho certeza'}]},{key:'context',label:'Gatilho ou contexto (opcional)',value:transaction.impulseContext||'',maxLength:500}]});
 if(!result)return;transaction.impulseDecision=result.decision;transaction.impulseContext=result.context;transaction.impulseReviewedAt=new Date().toISOString();saveState();renderFinanceHub();toast('Avaliação salva.','O valor do lançamento permanece o mesmo.');
}
function renderFinanceTransactions(){renderFinanceTransactionsBase34();enhanceFinanceImpulse34()}
function enhanceFinanceImpulse34(){
 const list=$('#financeTxnRecent');if(!list)return;
 $$('[data-txn-id]',list).forEach(row=>{const tx=state.financeTransactions.find(x=>x.id===row.dataset.txnId);if(!tx||tx.type!=='expense'||row.querySelector('[data-assess-impulse]'))return;const button=document.createElement('button');button.className='ghost resilience-impulse34';button.dataset.assessImpulse='';button.textContent=({yes:'Impulsivo · rever avaliação',no:'Planejado · rever avaliação',unsure:'Em dúvida · avaliar', '':'Foi impulsivo?'})[tx.impulseDecision||'']||'Foi impulsivo?';button.addEventListener('click',()=>assessImpulse34(tx));row.append(button);});
 let summary=$('#impulseSummary34');if(!summary){summary=document.createElement('p');summary.id='impulseSummary34';summary.className='resilience-finance-summary34';list.before(summary)}
 const month=financeMonthTransactions().filter(x=>x.type==='expense'),marked=month.filter(x=>x.impulseDecision==='yes');summary.textContent=`Neste mês, você marcou ${marked.length} gasto(s) como impulsivo(s): ${money(marked.reduce((n,x)=>n+Number(x.amount||0),0))}. Esta é sua avaliação; o app não classifica compras automaticamente.`;
}
function maybeResiliencePrompt34(){
 if(game35)return;
 const r=state.resilience34,minutes=Number(r?.promptMinutes||0);if(!minutes||document.hidden||document.body.classList.contains('auth-locked')||$('.myway-dialog')||$('.resilience-checkin-prompt34')||timerHandle||studyPomodoroHandle||(/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)&&document.activeElement?.offsetParent!==null))return;
 const last=Number(r.lastPromptAt||resiliencePromptStarted34);if(Date.now()-last<(r.lastPromptAt?minutes:12)*60000)return;
 r.lastPromptAt=Date.now();saveState();const panel=document.createElement('aside');panel.className='resilience-checkin-prompt34';panel.setAttribute('role','status');panel.innerHTML='<b>Como você está agora?</b><p>Quer registrar como se sente ou uma escolha que fez? Pode deixar para depois.</p><button class="primary" data-checkin-now>Registrar agora</button><button class="ghost" data-checkin-later>Agora não</button>';
 panel.querySelector('[data-checkin-now]').addEventListener('click',()=>{panel.remove();wellbeingCheckin34()});panel.querySelector('[data-checkin-later]').addEventListener('click',()=>panel.remove());document.body.append(panel);
}
async function wellbeingCheckin34(){return openWellbeing52();}
function initResilience34(){
 normalizeResilience34();if($('#resilienceDashboard34'))$('#view-today').prepend($('#resilienceDashboard34'));renderResilienceSummary34();
 $('#resilienceOpen34')?.addEventListener('click',()=>openResilience34());$('#resilienceCustomize34')?.addEventListener('click',()=>openResilience34(true));$('#resilienceQuick34')?.addEventListener('click',quickResilience35);
 $('#resilienceGoal34')?.addEventListener('change',resilienceContext34);$('#resilienceFeeling34')?.addEventListener('click',wellbeingCheckin34);
 $('#resilienceTestSound34')?.addEventListener('click',()=>resilienceSound34(true));
 $('#resilienceCheckin34')?.addEventListener('submit',e=>{e.preventDefault();if(e.currentTarget.reportValidity())recordResilience35({goalId:$('#resilienceGoal34').value,date:$('#resilienceDate34').value,outcome:$('#resilienceOutcome34').value,trigger:$('#resilienceTrigger34').value.trim(),strategy:$('#resilienceStrategy34').value.trim()});});
 $('#resiliencePlan34')?.addEventListener('submit',e=>{e.preventDefault();state.resilience34.alternative=$('#resilienceAlternative34').value.trim();state.resilience34.support=$('#resilienceSupport34').value.trim();saveState();toast('Seu plano foi salvo.');});
 $('#resilienceSettings34')?.addEventListener('submit',e=>{e.preventDefault();const r=state.resilience34;$$('[data-resilience-goal]').forEach(row=>r.goals[row.dataset.resilienceGoal]={enabled:row.querySelector('input').checked,priority:Number(row.querySelector('select').value)});r.sound=$('#resilienceSound34').value;r.effects=$('#resilienceEffects34').value;r.promptMinutes=Number($('#resiliencePrompt34').value);r.showTopics=$('#resiliencePrivate34').checked;saveState();renderResilience34();toast('Preferências de resiliência salvas.');});
 setInterval(maybeResiliencePrompt34,60000);
}

/* v35: optional personal profile, one work data model and explicit check-ins. */
function normalize35(){
 const s=state.settings;for(const [key,value] of Object.entries({gymProfile35:'',adhdProfile35:'',relationshipProfile35:'',focusMinutes35:25,focusNeeds35:[],featureGames:true,workView35:'kanban',workAllStatuses35:false}))if(s[key]===undefined)s[key]=value;
 if(!Number.isInteger(Number(s.focusMinutes35))||Number(s.focusMinutes35)<1||Number(s.focusMinutes35)>120)s.focusMinutes35=25;
 if(!Array.isArray(s.focusNeeds35))s.focusNeeds35=[];
 state.games35=state.games35&&typeof state.games35==='object'?state.games35:{sessions:[]};state.games35.sessions=Array.isArray(state.games35.sessions)?state.games35.sessions:[];
}
function prefillProfile35(){
 normalize35();const s=state.settings,r=state.resilience34;
 const values={onboardGym35:s.gymProfile35,onboardAdhd35:s.adhdProfile35,onboardRelationship35:s.relationshipProfile35,onboardFocusMinutes35:String(s.focusMinutes35),onboardDashboardTitle35:s.dashboardTitle,onboardDensity35:s.layoutDensity,onboardWellbeing35:String(r.promptMinutes),onboardSound35:r.sound,onboardEffects35:r.effects==='confetti'?'confetti':'quiet',onboardMotion35:s.animationsEnabled===false?'reduced':'full'};
 for(const [id,value] of Object.entries(values))if($('#'+id))$('#'+id).value=value;
 $('#onboardGames35').checked=s.featureGames!==false;
 $$('[data-focus-need35]').forEach(input=>input.checked=s.focusNeeds35.includes(input.dataset.focusNeed35));
 $('#onboardResilienceGoals35').innerHTML=RESILIENCE_GOALS34.map(goal=>`<label><input type="checkbox" data-onboard-goal35="${goal.id}" ${r.goals[goal.id]?.enabled?'checked':''}>${escapeHTML(goal.label)}</label>`).join('');
}
function saveProfile35(){
 const s=state.settings,r=state.resilience34;s.gymProfile35=$('#onboardGym35').value;s.adhdProfile35=$('#onboardAdhd35').value;s.relationshipProfile35=$('#onboardRelationship35').value;
 if(!state.account.configured)s.focusMinutes35=25;s.focusNeeds35=$$('[data-focus-need35]:checked').map(x=>x.dataset.focusNeed35);
 s.dashboardTitle=$('#onboardDashboardTitle35').value.trim()||'Uma coisa de cada vez.';s.layoutDensity=$('#onboardDensity35').value;
 s.featureGames=$('#onboardGames35').checked;if(['yes','start'].includes(s.gymProfile35))s.featureGym=true;if(s.gymProfile35==='no')s.featureGym=false;
 if(s.relationshipProfile35==='yes')s.featureRelationships=true;if(s.relationshipProfile35==='no')s.featureRelationships=false;
 r.sound=$('#onboardSound35').value;r.effects=$('#onboardEffects35').value;r.promptMinutes=Number($('#onboardWellbeing35').value);
 s.rewardFeedback=r.effects;s.animationsEnabled=$('#onboardMotion35').value!=='reduced';
 $$('[data-onboard-goal35]').forEach(input=>{const id=input.dataset.onboardGoal35;r.goals[id]={...r.goals[id],enabled:input.checked,priority:r.goals[id]?.priority||1};});
 s.profileQuestionnaire35=true;
}
function renderReservoirHint35(points){
 const goals=activeResilienceGoals34();$$('[data-reservoir-copy]').forEach(el=>{
  if(points===0)el.textContent=goals.length?'0 de 100 pontos. Registre uma pausa ou alternativa para começar a preencher.':'0 de 100 pontos. Escolha um assunto para acompanhar e registre sua primeira pausa.';
 });
 const start=$('#adhdFiveMinute');if(start)start.textContent=`Começar por ${state.settings.focusMinutes35||25} minutos`;
 const minutes=Number(state.settings.focusMinutes35||25),label=$('.focus-dock .eyebrow');if(label)label.textContent=`FOCO / ${minutes} MIN`;
 if(!timerStarted35&&!timerHandle){timerSeconds=minutes*60;drawTimer();}
 const needs=state.settings.focusNeeds35||[],title=$('#focusCoachTitle'),copy=$('#focusCoachText');
 if(title&&copy){
  if(needs.includes('starting')||['yes','unsure'].includes(state.settings.adhdProfile35)){title.textContent='Escolha um primeiro passo pequeno.';copy.textContent=`Defina uma ação e comece por ${minutes} minutos. Depois você decide se continua.`;}
  else if(needs.includes('planning')){title.textContent='Organize apenas o próximo passo.';copy.textContent='Escolha uma prioridade do painel e transforme em uma ação concreta.';}
  else if(needs.includes('distractions')){title.textContent='Uma ação por bloco.';copy.textContent='Antes de começar, afaste a distração que mais costuma interromper você.';}
  else {title.textContent='Defina uma ação que caiba em um bloco.';copy.textContent='Prefira uma ação concreta, como abrir o arquivo e escrever o primeiro parágrafo.';}
 }
}
function recordResilience35(values){
 normalize34();const cfg=state.resilience34.goals[values.goalId];
 if(!RESILIENCE_GOALS34.some(g=>g.id===values.goalId)||!cfg?.enabled)return toast('Escolha um assunto nas preferências de resiliência.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(values.date)||values.date>todayISO())return toast('Use hoje ou uma data anterior.');
 if(!['pause','hard','none'].includes(values.outcome))return;
 const before=rewardTotal34(),priorPoints=resiliencePoints34();
 if(values.outcome==='hard')failureSound36();
 const repeat42=values.outcome==='pause'&&state.resilience34.records.some(r=>r.outcome==='pause'&&r.goalId===values.goalId&&r.date===values.date),recordId42=cryptoId();state.resilience34.records.unshift({id:recordId42,goalId:values.goalId,date:values.date,outcome:values.outcome,priority:Math.min(3,Math.max(1,Number(cfg.priority)||1)),trigger:String(values.trigger||'').slice(0,140),strategy:String(values.strategy||'').slice(0,1000),updatedAt:new Date().toISOString()});
 if(repeat42)grantReward34('resilience-repeat42:'+recordId42,3,'Nova escolha de cuidado registrada',values.date);resilienceSaving34=true;try{saveState()}finally{resilienceSaving34=false}
 const delta=rewardTotal34()-before;
 if(delta>0)celebrateResilience34(delta,'Pausa registrada. Seu reservatório avançou.');
 const message=values.outcome==='hard'?'Registro salvo. Seus XP permanecem. Você pode planejar um próximo passo.':values.outcome==='none'?'Registro salvo. Sem gatilho nesta ocasião.':delta>0?`+${delta} XP · Reservatório: ${Math.min(100,priorPoints)}% → ${Math.min(100,resiliencePoints34())}%.`:'Pausa salva. Os XP deste assunto e data já foram reconhecidos.';
 $('#resilienceResult34').textContent=message;renderResilienceSummary34();renderDailyGame();renderOverview34();
 if(delta>0&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&state.settings.animationsEnabled!==false){$$('.reservoir-track34').forEach(el=>{el.classList.remove('reservoir-updated35');void el.offsetWidth;el.classList.add('reservoir-updated35');});}
 toast(message);return {delta,points:resiliencePoints34()};
}
async function quickResilience35(){
 const goals=activeResilienceGoals34();if(!goals.length){openResilience34(true);toast('Escolha o que quer acompanhar.','Marque um assunto e clique em Salvar preferências.');return;}
 const first=goals[0],result=await openFormDialog({title:'Registrar uma escolha',description:'Uma pausa ou alternativa preenche o reservatório. O primeiro registro do cuidado no dia reconhece de 8 a 18 XP; os próximos reconhecem 3 XP cada.',submitLabel:'Registrar escolha',fields:[{key:'goalId',label:'Qual assunto?',value:first.id,options:goals.map(g=>({value:g.id,label:g.label}))},{key:'outcome',label:'Como foi?',value:'pause',options:[{value:'pause',label:'Fiz uma pausa / escolhi uma alternativa'},{value:'hard',label:'Não consegui desta vez'},{value:'none',label:'Não houve gatilho'}]},{key:'date',label:'Data',type:'date',required:true,value:activeDate},{key:'trigger',label:'Gatilho ou contexto (opcional)',maxLength:140},{key:'strategy',label:'O que ajudou? (opcional)',type:'textarea',maxLength:1000}]});
 if(result)recordResilience35(result);
}
const KANBAN_CORE35=['todo','doing','waiting','done'];let workDragged35=null;
function renderWorkKanban35(){
 const board=$('#workKanbanBoard35');if(!board)return;normalize35();
 const kanban=state.settings.workView35!=='list';$('#view-work').classList.toggle('work-kanban-mode35',kanban);$('#workKanban35').hidden=!kanban;
 $$('[data-work-view35]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.workView35===(kanban?'kanban':'list'))));
 const all=(state.notes||[]).filter(n=>n.area==='work'),search=($('#workKanbanSearch35').value||'').trim().toLocaleLowerCase('pt-BR'),project=$('#workKanbanProject35').value;
 const projects=[...new Set(all.map(n=>n.workProject35||'').filter(Boolean))].sort();$('#workKanbanProject35').innerHTML='<option value="">Todos os projetos</option>'+projects.map(name=>`<option value="${escapeHTML(name)}">${escapeHTML(name)}</option>`).join('');$('#workKanbanProject35').value=projects.includes(project)?project:'';
 const notes=all.filter(n=>(!search||`${n.title||''} ${n.body||''}`.toLocaleLowerCase('pt-BR').includes(search))&&(!project||n.workProject35===project));
 $('#workKanbanAll35').checked=!!state.settings.workAllStatuses35;
 const statusOf=n=>NOTE_STATUS[n.status]?n.status:'todo',extras=Object.keys(NOTE_STATUS).filter(key=>!KANBAN_CORE35.includes(key)&&(state.settings.workAllStatuses35||notes.some(n=>statusOf(n)===key))),columns=[...KANBAN_CORE35.slice(0,3),...extras,...KANBAN_CORE35.slice(3)];
 board.innerHTML=columns.map(status=>{const cards=notes.filter(n=>statusOf(n)===status);return `<section class="kanban-column35" data-kanban-status35="${status}" aria-label="${escapeHTML(NOTE_STATUS[status])}"><header><b><i class="status-dot ${status}"></i>${escapeHTML(NOTE_STATUS[status])}</b><span>${cards.length}</span><button type="button" data-kanban-add35="${status}" aria-label="Adicionar em ${escapeHTML(NOTE_STATUS[status])}">+</button></header><div class="kanban-cards35">${cards.map(n=>`<article class="kanban-card35" draggable="true" data-kanban-note35="${escapeHTML(n.id)}"><button class="kanban-title35" data-kanban-edit35>${escapeHTML(n.title||'Sem título')}</button>${n.workProject35?`<small class="kanban-project35">${escapeHTML(n.workProject35)}</small>`:''}${n.body?`<small class="kanban-detail-hint40">Tem informações adicionais</small>`:''}${n.dueDate?`<time class="${n.dueDate<activeDate&&!['done','cancelled'].includes(n.status)?'overdue':''}">Prazo: ${formatDateBR(n.dueDate)}</time>`:''}<button class="text-button" data-kanban-edit35>Editar detalhes</button></article>`).join('')||'<p class="kanban-empty35">Nenhuma atividade nesta coluna.</p>'}</div></section>`}).join('');
 $$('[data-kanban-add35]',board).forEach(button=>button.addEventListener('click',()=>editWorkCard35(null,button.dataset.kanbanAdd35)));
 $$('[data-kanban-note35]',board).forEach(card=>{const note=all.find(n=>n.id===card.dataset.kanbanNote35);if(!note)return;
  $$('[data-kanban-edit35]',card).forEach(button=>button.addEventListener('click',()=>editWorkCard35(note)));
  card.querySelector('[data-kanban-move35]')?.addEventListener('change',e=>moveWorkCard35(note,e.target.value));
  card.addEventListener('dragstart',e=>{if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)){e.preventDefault();return;}workDragged35=note.id;e.dataTransfer.setData('application/x-myway-work',note.id);e.dataTransfer.effectAllowed='move';card.classList.add('dragging');});
  card.addEventListener('dragend',()=>{workDragged35=null;card.classList.remove('dragging');$$('.kanban-column35').forEach(column=>column.classList.remove('drag-over'));});
 });
 $$('[data-kanban-status35]',board).forEach(column=>{
  column.addEventListener('dragover',e=>{if(!workDragged35)return;e.preventDefault();e.dataTransfer.dropEffect='move';column.classList.add('drag-over');});
  column.addEventListener('dragleave',e=>{if(!column.contains(e.relatedTarget))column.classList.remove('drag-over');});
  column.addEventListener('drop',e=>{e.preventDefault();column.classList.remove('drag-over');const id=e.dataTransfer.getData('application/x-myway-work')||workDragged35,note=all.find(n=>n.id===id),before=e.target.closest('[data-kanban-note35]')?.dataset.kanbanNote35;workDragged35=null;if(note)moveWorkCard35(note,column.dataset.kanbanStatus35,before);});
 });
 $('#workKanbanResult35').textContent=search||project?`${notes.length} de ${all.length} atividade(s) neste filtro.`:`${all.length} atividade(s). Mudanças são salvas automaticamente.`;
}
function moveWorkCard35(note,status,beforeId){
 if(!NOTE_STATUS[status]||note.area!=='work')return;const previous=note.status;note.status=status;note.updatedAt=new Date().toISOString();
 if(status==='done'&&previous!=='done')note.completedAt=new Date().toISOString();else if(status!=='done')note.completedAt='';
 if(beforeId!==note.id){const index=state.notes.indexOf(note);if(index>=0){state.notes.splice(index,1);const before=state.notes.findIndex(n=>n.id===beforeId);if(before>=0)state.notes.splice(before,0,note);else state.notes.push(note);}}
 saveState();renderAll();renderNotes();renderStickyNotes();$('#workKanbanResult35').textContent=`${note.title||'Atividade'} → ${NOTE_STATUS[status]}. Salvo.`;
}
async function editWorkCard35(note=null,status='todo'){
 const result=await openFormDialog({title:note?'Editar atividade':'Adicionar atividade',description:'Este cartão também aparece nas notas de trabalho e nos relatórios.',submitLabel:note?'Salvar atividade':'Criar cartão',fields:[{key:'title',label:'Título',required:true,value:note?.title,maxLength:160},{key:'body',label:'Descrição (opcional)',type:'textarea',value:note?.body,maxLength:3000},{key:'status',label:'Coluna / status',value:note?.status||status,options:Object.entries(NOTE_STATUS).map(([value,label])=>({value,label}))},{key:'dueDate',label:'Prazo (opcional)',type:'date',value:note?.dueDate||''},{key:'workProject35',label:'Projeto ou etiqueta (opcional)',value:note?.workProject35,maxLength:60}]});if(!result)return;
 if(note){const previous=note.status;Object.assign(note,result,{updatedAt:new Date().toISOString()});if(result.status==='done'&&previous!=='done')note.completedAt=new Date().toISOString();if(result.status!=='done')note.completedAt='';}
 else state.notes.unshift({id:cryptoId(),area:'work',...result,pinned:false,createdAt:new Date().toISOString(),completedAt:result.status==='done'?new Date().toISOString():''});
 saveState();renderAll();renderNotes();renderStickyNotes();toast('Atividade salva.');
}
function init35(){
 normalize35();$('#quickPersonalize35')?.addEventListener('click',personalize34);$('#onboardExisting35')?.addEventListener('click',()=>setAuthMode('login'));
 $('#workAddCard35')?.addEventListener('click',()=>editWorkCard35());
 $$('[data-work-view35]').forEach(button=>button.addEventListener('click',()=>{state.settings.workView35=button.dataset.workView35;saveState();renderWorkKanban35();}));
 $('#workKanbanSearch35')?.addEventListener('input',renderWorkKanban35);$('#workKanbanProject35')?.addEventListener('change',renderWorkKanban35);
 $('#workKanbanAll35')?.addEventListener('change',e=>{state.settings.workAllStatuses35=e.target.checked;saveState();renderWorkKanban35();});
 $$('[data-start-game35]').forEach(button=>button.addEventListener('click',()=>startGame35(button.dataset.startGame35)));
 $('#gameExit35')?.addEventListener('click',()=>{stopGame35();renderGames35();});$('#gameNext35')?.addEventListener('click',nextGame35);
 const profileLink=$('#controlRerunOnboarding');if(profileLink)profileLink.textContent='Rever questionário e personalização';
 renderWorkKanban35();renderReservoirHint35(resiliencePoints34());
}

const GAME_NAMES35={logic:'Padrões e lógica',memory:'Foco e memória',attention:'Atenção por etapas',resilience:'Pausa e próxima escolha'};
const MEMORY_SYMBOLS35=['●','■','▲','★','☾','◆'];
const RESILIENCE_SCENARIOS35=[
 {text:'Uma promoção aparece quando você está ansioso(a), e a compra não estava planejada.',answers:['Fazer uma pausa, salvar a ideia e revisar o orçamento depois.','Comprar imediatamente para resolver a ansiedade.','Evitar olhar o valor e decidir na hora.'],why:'Adiar a decisão e consultar o orçamento cria espaço para uma escolha mais consciente.'},
 {text:'Você abriu vídeos curtos e percebeu que a tarefa ficou para depois.',answers:['Fechar o feed e escolher um primeiro passo de poucos minutos.','Abrir mais abas até encontrar motivação.','Esperar vontade de fazer a tarefa inteira.'],why:'Uma ação pequena e definida facilita a retomada. Você pode ajustar o tamanho do passo.'},
 {text:'Uma crítica no trabalho trouxe frustração e vontade de abandonar tudo naquele momento.',answers:['Nomear o que sentiu, fazer uma pausa e escolher uma ação prática.','Responder no impulso sem reler a mensagem.','Transformar essa crítica em uma avaliação de toda a sua vida.'],why:'Separar a emoção da decisão ajuda a responder com mais contexto.'},
 {text:'Um dia saiu do planejado e você deixou de fazer algumas tarefas.',answers:['Rever o que cabe agora e escolher uma prioridade possível.','Tentar compensar tudo de uma vez, sem descanso.','Apagar todo o planejamento porque um dia não funcionou.'],why:'Replanejar permite continuar. Uma dificuldade não apaga o que já foi realizado.'},
 {text:'Você se pegou comparando sua trajetória com várias pessoas nas redes sociais.',answers:['Interromper a comparação e voltar a uma meta que depende de você.','Continuar procurando mais perfis para se comparar.','Trocar todas as suas metas a partir de um único post.'],why:'Voltar ao próprio contexto ajuda a escolher um próximo passo viável.'}
];
let game35=null,gameTimers35=new Set();
function shuffle35(items){const list=[...items];for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}return list;}
function stopGame35(){gameTimers35.forEach(id=>clearTimeout(id));gameTimers35.clear();game35=null;$('#gameSession35').hidden=true;}
function gameLater35(fn,ms){const id=setTimeout(()=>{gameTimers35.delete(id);fn();},ms);gameTimers35.add(id);}
function renderGames35(){
 normalize35();const sessions=state.games35.sessions;
 $('#gamesXP35').textContent=`${sessions.reduce((sum,s)=>sum+(Number(s.xp)||0),0)} XP em desafios`;
 $('#gamesHistory35').innerHTML=sessions.slice(0,12).map(s=>`<div class="game-history35"><b>${escapeHTML(GAME_NAMES35[s.type]||'Desafio')}</b><span>${formatDateBR(s.date)} · ${s.rounds} etapas · +${s.xp} XP</span></div>`).join('')||'<p class="v34-help">Escolha um jogo para começar. Seu histórico aparece ao concluir um desafio.</p>';
}
function startGame35(type){
 if(!GAME_NAMES35[type])return;stopGame35();
 game35={id:cryptoId(),type,round:0,total:type==='memory'||type==='attention'?3:5,answered:false,startedAt:Date.now(),attempts:0,date:todayISO()};
 $('#gameSession35').hidden=false;$('#gameTitle35').textContent=GAME_NAMES35[type];renderGameRound35();$('#gameSession35').scrollIntoView({behavior:state.settings.animationsEnabled===false?'instant':'smooth',block:'start'});
}
function renderGameRound35(){
 const g=game35;if(!g)return;g.answered=false;$('#gameProgress35').textContent=`Etapa ${g.round+1} de ${g.total} · sem limite de tempo`;
 $('#gameFeedback35').textContent='';$('#gameNext35').hidden=true;
 if(g.type==='logic')renderLogic35();else if(g.type==='resilience')renderScenario35();else if(g.type==='memory')renderMemory35();else renderAttention35();
}
function renderQuestion35(text,answers,correct,why,extra=''){
 const g=game35;if(!g)return;
 $('#gameContent35').innerHTML=`<p class="game-question35">${escapeHTML(text)}</p>${extra}<div class="game-options35">${shuffle35(answers.map((text,index)=>({text,correct:index===correct}))).map((option,index)=>{g['answer'+index]=option.correct;return `<button type="button" data-game-answer35="${index}">${escapeHTML(String(option.text))}</button>`;}).join('')}</div>`;
 $$('[data-game-answer35]').forEach(button=>button.addEventListener('click',()=>{
  if(game35!==g||g.answered)return;g.attempts++;
  if(g['answer'+button.dataset.gameAnswer35]){g.answered=true;$('#gameFeedback35').textContent='Boa escolha. '+why;$$('[data-game-answer35]').forEach(b=>b.disabled=true);$('#gameNext35').hidden=false;$('#gameNext35').textContent=g.round+1===g.total?'Concluir desafio':'Próxima etapa';}
  else $('#gameFeedback35').textContent='Você pode tentar novamente. '+(g.type==='resilience'?'Procure a alternativa que cria uma pausa e um próximo passo.':'Observe a regra entre os valores.');
 }));
}
function renderLogic35(){
 const g=game35,a=2+Math.floor(Math.random()*5),d=2+Math.floor(Math.random()*4);let values,answer,why;
 switch(g.round%5){
  case 0:values=[a,a+d,a+2*d,a+3*d];answer=a+4*d;why=`A regra é somar ${d} a cada valor.`;break;
  case 1:values=[a,a*2,a*4,a*8];answer=a*16;why='Cada valor é o dobro do anterior.';break;
  case 2:values=[1,4,9,16];answer=25;why='São os quadrados de 1, 2, 3, 4 e 5.';break;
  case 3:values=[a,a+2,a+5,a+9];answer=a+14;why='Os acréscimos são 2, 3, 4 e depois 5.';break;
  default:values=[a,a+d,a+2*d,a+3*d];answer=a+4*d;why=`A sequência aumenta de ${d} em ${d}.`;
 }
 renderQuestion35('Qual número completa a sequência?',[answer,answer+1,answer-1,answer+3],0,why,`<div class="game-sequence35">${values.join(' · ')} · ?</div>`);
}
function renderScenario35(){const s=RESILIENCE_SCENARIOS35[game35.round%RESILIENCE_SCENARIOS35.length];renderQuestion35(s.text,s.answers,0,s.why);}
function renderMemory35(){
 const g=game35;g.sequence=Array.from({length:3+g.round},()=>Math.floor(Math.random()*MEMORY_SYMBOLS35.length));g.input=[];g.phase='ready';
 $('#gameContent35').innerHTML='<p class="game-question35">Quando estiver pronto(a), mostre a sequência. Depois repita no seu ritmo.</p><div class="memory-pad35">'+MEMORY_SYMBOLS35.map((symbol,index)=>`<button type="button" data-memory35="${index}" aria-label="Símbolo ${index+1}: ${symbol}" disabled>${symbol}</button>`).join('')+'</div><button class="ghost" id="memoryReplay35">Mostrar sequência</button>';
 $$('[data-memory35]').forEach(button=>button.addEventListener('click',()=>{
  if(game35!==g||g.phase!=='repeat'||g.answered)return;g.attempts++;const value=Number(button.dataset.memory35);
  if(g.sequence[g.input.length]!==value){g.input=[];$('#gameFeedback35').textContent='Pode tentar outra vez desde o primeiro símbolo ou assistir novamente.';return;}
  g.input.push(value);$('#gameFeedback35').textContent=`${g.input.length} de ${g.sequence.length} símbolos repetidos.`;
  if(g.input.length===g.sequence.length){g.answered=true;$$('[data-memory35]').forEach(b=>b.disabled=true);$('#memoryReplay35').disabled=true;$('#gameFeedback35').textContent='Sequência concluída. Você pode avançar.';$('#gameNext35').hidden=false;$('#gameNext35').textContent=g.round+1===g.total?'Concluir desafio':'Próxima etapa';}
 }));$('#memoryReplay35').addEventListener('click',showMemorySequence35);
}
function showMemorySequence35(){
 const g=game35;if(!g||g.type!=='memory'||g.answered)return;g.phase='show';g.input=[];
 $$('[data-memory35]').forEach(b=>{b.disabled=true;b.classList.remove('active');});$('#memoryReplay35').disabled=true;$('#gameFeedback35').textContent='Observe os símbolos destacados.';
 let index=0;const next=()=>{
  if(game35!==g)return;
  if(index>=g.sequence.length){g.phase='repeat';$$('[data-memory35]').forEach(b=>b.disabled=false);$('#memoryReplay35').disabled=false;$('#memoryReplay35').textContent='Assistir novamente';$('#gameFeedback35').textContent='Sua vez. Repita desde o primeiro símbolo.';return;}
  const button=$(`[data-memory35="${g.sequence[index++]}"]`);button.classList.add('active');gameLater35(()=>{if(game35!==g)return;button.classList.remove('active');gameLater35(next,300);},1100);
 };gameLater35(next,500);
}
function renderAttention35(){
 const g=game35,target=['★','●','◆'][g.round],other=MEMORY_SYMBOLS35.filter(symbol=>symbol!==target);g.selected=new Set();g.targets=new Set();
 const values=shuffle35([target,target,target,...Array.from({length:6},(_,index)=>other[index%other.length])]);
 $('#gameContent35').innerHTML=`<p class="game-question35">Selecione os três símbolos ${target}.</p><div class="attention-grid35">${values.map((symbol,index)=>{if(symbol===target)g.targets.add(index);return `<button type="button" data-attention35="${index}" aria-pressed="false" aria-label="Símbolo ${index+1}: ${symbol}">${symbol}</button>`;}).join('')}</div>`;
 $$('[data-attention35]').forEach(button=>button.addEventListener('click',()=>{
  if(game35!==g||g.answered)return;g.attempts++;const index=Number(button.dataset.attention35);
  if(!g.targets.has(index)){$('#gameFeedback35').textContent='Esse símbolo não é o alvo desta etapa. Tente outro.';return;}
  if(g.selected.has(index))g.selected.delete(index);else g.selected.add(index);button.classList.toggle('selected',g.selected.has(index));button.setAttribute('aria-pressed',String(g.selected.has(index)));
  $('#gameFeedback35').textContent=`${g.selected.size} de 3 encontrados.`;
  if(g.selected.size===3){g.answered=true;$$('[data-attention35]').forEach(b=>b.disabled=true);$('#gameFeedback35').textContent='Etapa concluída. Uma instrução por vez.';$('#gameNext35').hidden=false;$('#gameNext35').textContent=g.round+1===g.total?'Concluir desafio':'Próxima etapa';}
 }));
}
function nextGame35(){const g=game35;if(!g?.answered)return;g.round++;if(g.round>=g.total)finishGame35();else renderGameRound35();}
function finishGame35(){
 const g=game35;if(!g)return;const completed=state.rewards34.ledger.filter(s=>s.key.startsWith(`game:${g.date}:${g.type}:`)).length,key=`game:${g.date}:${g.type}:${completed+1}`;
 const xp=completed<2&&grantReward34(key,10,`Desafio: ${GAME_NAMES35[g.type]}`,g.date)?10:0;
 state.games35.sessions.unshift({id:g.id,type:g.type,date:g.date,rounds:g.total,attempts:g.attempts,xp,durationMs:Math.max(0,Date.now()-g.startedAt),completedAt:new Date().toISOString()});state.games35.sessions=state.games35.sessions.slice(0,120);
 saveState();game35=null;gameTimers35.forEach(id=>clearTimeout(id));gameTimers35.clear();
 $('#gameProgress35').textContent='Desafio concluído';$('#gameContent35').innerHTML=`<p class="game-question35">${xp?'+10 XP · Etapas concluídas.':'Etapas concluídas. Seu treino foi registrado.'}</p><p class="v34-help">${xp?'Você pode escolher outro desafio ou voltar à sua próxima tarefa.':'Os XP deste jogo e data já foram reconhecidos duas vezes. Você pode continuar praticando.'}</p><button class="ghost" id="gamesBack35">Voltar ao painel</button>`;
 $('#gameFeedback35').textContent='';$('#gameNext35').hidden=true;$('#gamesBack35').addEventListener('click',()=>{stopGame35();showView('today');});
 renderGames35();renderDailyGame();renderOverview34();if(xp)celebrateXP34(xp,'Desafio concluído.');
}

let localCacheOK36=true;
function cacheLocal36(value){try{localStorage.setItem(STORAGE_KEY,value);localCacheOK36=true;}catch{localCacheOK36=false;}return localCacheOK36;}
