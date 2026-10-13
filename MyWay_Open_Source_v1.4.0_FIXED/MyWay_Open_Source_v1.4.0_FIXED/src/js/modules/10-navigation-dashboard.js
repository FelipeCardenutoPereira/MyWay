/* views */
function showView(name){
 if(state.focus36?.until>Date.now()&&!['control','data'].includes(name)&&name!==state.focus36.target){toast("Modo foco ativo.","Use o botão do topo para encerrar ou trocar sua prioridade.");return;}
  if(name!=="games"&&game35)stopGame35();
  if(!featureEnabled(name)){toast("Módulo desativado.","Ative novamente em Controle.");return;}
  $$(".view").forEach(v=>v.classList.toggle("active",v.id===`view-${name}`));
  $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.viewTarget===name));
  window.scrollTo({top:0,behavior:"smooth"});
  if(name==="work"){renderWorkNotes();renderWorkCommand();}
  if(name==="finance")renderFinanceHub();
  if(name==="journal")renderJournal();
  if(name==="psychoanalysis")renderPsychoanalysis67();
  if(name==="games")renderGames35();if(name==="gym")renderGym34();if(name==="rewards")renderRewards34();if(name==="resilience")renderResilience34();
  if(name==="puc"){renderWeek();renderSeries();renderStudyHistory();renderPUCWeek();renderPUCCourses();renderStudyToolkit();}
  if(name==="habits"){renderHabits();renderRoutine();}
  if(name==="future") renderHousing();
  if(name==="relationships") renderRelationships();
  if(name==="english") renderEnglish();
  if(name==="meditation") renderMeditation();
  if(name==="notes") renderNotes();
  if(name==="inspiration") renderInspiration(true);
  if(name==="channel") renderChannel();
  if(name==="reports") renderReports();
  if(name==="reminders"){renderReminders();refreshNativeStatus();}
  if(name==="control")renderControlPanel();
  if(name==="data")refreshNativeStatus();
  applyNavigation34();renderOverview34();
  revealVisible();
}
$$("[data-view-target]").forEach(el=>el.addEventListener("click",()=>navigateWithBusy134(el.dataset.viewTarget)));

/* active date */
$("#activeDate").value=activeDate;
if($("#noteDate"))$("#noteDate").value=activeDate;
$("#activeDate").addEventListener("change",e=>{
  activeDate=e.target.value||todayISO();
  if($("#noteDate"))$("#noteDate").value=activeDate;
  loadDayIntoUI();
  renderAll();
});
$("#goToday").addEventListener("click",()=>{
  activeDate=todayISO();
  $("#activeDate").value=activeDate;
  if($("#noteDate"))$("#noteDate").value=activeDate;
  loadDayIntoUI(); renderAll();
});

/* binding settings */
$$("[data-setting]").forEach(el=>{
  const key=el.dataset.setting;
  const val=state.settings[key];
  if(el.type==="checkbox") el.checked=Boolean(val);
  else if(val!==undefined && val!==null) el.value=val;
  const evt=(el.type==="checkbox"||el.tagName==="SELECT")?"change":"input";
  el.addEventListener(evt,()=>{
    let value=el.type==="checkbox"?el.checked:el.value;
    if(el.type==="number"||el.type==="range") value=Number(value||0);
    if(key==="salaryHasAdvance") value=String(value)==="true";
    state.settings[key]=value;
    if(key==="subjectName"){const course=currentStudyCourse();if(course)course.title=value;}
    if(/^series|^live[123]$|^nextLesson$/.test(key)){const course=currentStudyCourse();if(course){course.studyDetails=course.studyDetails||{};course.studyDetails[key]=value;}}
    if(key.startsWith("series")) clampSeries();
    saveState(); renderAll();
    if($("#view-finance")?.classList.contains("active"))renderFinanceHub();
  });
});
function loadDayIntoUI(){
  const d=ensureDay();
  $$("[data-day]").forEach(el=>{
    const key=el.dataset.day;
    const val=d[key];
    if(el.type==="checkbox") el.checked=Boolean(val);
    else el.value=val ?? "";
  });
}
$$("[data-day]").forEach(el=>{
  const evt=(el.type==="checkbox"||el.tagName==="SELECT")?"change":"input";
  el.addEventListener(evt,()=>{
    const d=ensureDay();
    let value=el.type==="checkbox"?el.checked:el.value;
    if(el.type==="number") value=Number(value||0);
    d[el.dataset.day]=value;
    saveState(); renderAll();
  });
});


/* V9 — dashboard de notas / drag & drop */
let draggedDashboardNote=null;
function renderDashboardNotes(){
  const c=$("#dashboardNotes");if(!c)return;
  const notes=(state.notes||[]).slice(0,12);
  c.innerHTML=notes.length?notes.map(n=>`<article class="dashboard-note" draggable="true" data-dashboard-note="${n.id}" data-status="${n.status||'todo'}"><header><i class="status-dot ${n.status||'todo'}"></i><small>${escapeHTML(n.area==='work'?'trabalho':n.area==='channel'?'canal':'vida')} · ${escapeHTML(n.dueDate?formatDateBR(n.dueDate):'sem data')}</small></header><b>${escapeHTML(n.title||'Sem título')}</b><p>${escapeHTML(n.body||'')}</p></article>`).join(''):`<p class="note">Crie uma nota e ela também aparecerá aqui.</p>`;
  $$('[data-dashboard-note]',c).forEach(card=>{
    card.addEventListener('dragstart',()=>{draggedDashboardNote=card.dataset.dashboardNote;card.classList.add('dragging')});
    card.addEventListener('dragend',()=>{draggedDashboardNote=null;card.classList.remove('dragging')});
    card.addEventListener('dragover',e=>e.preventDefault());
    card.addEventListener('drop',e=>{e.preventDefault();const target=card.dataset.dashboardNote;if(!draggedDashboardNote||target===draggedDashboardNote)return;const a=state.notes.findIndex(n=>n.id===draggedDashboardNote),b=state.notes.findIndex(n=>n.id===target);if(a<0||b<0)return;const [m]=state.notes.splice(a,1);state.notes.splice(b,0,m);saveState();renderDashboardNotes();renderNotes();});
    card.addEventListener('dblclick',()=>showView('notes'));
  });
}

/* returns */
$("#returnPlus").addEventListener("click",()=>{
  const d=ensureDay(); d.returns=(Number(d.returns)||0)+1; saveState(); renderAll();
});
$("#returnMinus").addEventListener("click",()=>{
  const d=ensureDay(); d.returns=Math.max(0,(Number(d.returns)||0)-1); saveState(); renderAll();
});

/* timer */
function drawTimer(){
  const m=String(Math.floor(timerSeconds/60)).padStart(2,"0"), s=String(timerSeconds%60).padStart(2,"0");
  $("#timerDisplay").textContent=`${m}:${s}`;
}
function startTimer(){
  if(timerHandle) return;
  if(!timerStarted35){timerBlockMinutes35=Math.max(1,Math.ceil(timerSeconds/60));timerStarted35=true;}
  timerHandle=setInterval(()=>{
    timerSeconds--;
    drawTimer();
    if(timerSeconds<=0){
      clearInterval(timerHandle);timerHandle=null;const completedMinutes35=timerBlockMinutes35;timerStarted35=false;timerSeconds=Number(state.settings.focusMinutes35||25)*60;drawTimer();
      toast("Bloco concluído.","Faça uma pausa antes de decidir se continua.");
      notifySystem("MyWay",`Bloco de ${completedMinutes35} minutos concluído.`);
      const d=ensureDay();
      d.studyMinutes=(Number(d.studyMinutes)||0)+completedMinutes35;
      d.studyMinimum=d.studyMinimum||d.studyMinutes>=25;if(completedMinutes35>=5)d.cbtFiveMinute=true;
      saveState();loadDayIntoUI();renderAll();
    }
  },1000);
}
function pauseTimer(){clearInterval(timerHandle);timerHandle=null}
function resetTimer(){pauseTimer();timerStarted35=false;timerSeconds=Number(state.settings.focusMinutes35||25)*60;drawTimer()}
$("#timerStart").addEventListener("click",startTimer);
$("#timerPause").addEventListener("click",pauseTimer);
$("#timerReset").addEventListener("click",resetTimer);
$("#startQuickFocus").addEventListener("click",()=>{
  $("#focusTask").focus();
  startTimer();
  toast("Bloco iniciado.","Uma tarefa. Vinte e cinco minutos.");
});

/* bank */
$("#addBankRecovery").addEventListener("click",()=>{
  const mins=Number($("#bankRecoveryInput").value||0);
  if(mins<=0) return toast("Informe os minutos recuperados.");
  state.settings.bankHours=Number((Number(state.settings.bankHours||0)+mins/60).toFixed(2));
  const bankInput=$('[data-setting="bankHours"]'); if(bankInput) bankInput.value=state.settings.bankHours;
  const d=ensureDay(); d.bankRecoveryMinutes=(Number(d.bankRecoveryMinutes)||0)+mins;
  state.bankEvents.push({date:activeDate,minutes:mins,createdAt:new Date().toISOString()});
  $("#bankRecoveryInput").value="";
  saveState();renderAll();toast("Banco atualizado.",`${mins} minutos registrados.`);
});

/* study */
$("#logStudySession").addEventListener("click",()=>{
  const mins=Number($("#sessionMinutes").value||0);
  const desc=$("#sessionDescription").value.trim();
  const lessons=Math.max(0,Number($("#sessionLessons")?.value||0));
  if(mins<=0) return toast("Informe a duração da sessão.");
  state.studySessions.push({
    id:cryptoId(),date:activeDate,minutes:mins,lessons,description:desc,
    subject:state.settings.subjectName||"",createdAt:new Date().toISOString()
  });
  const d=ensureDay(); d.studyMinutes=(Number(d.studyMinutes)||0)+mins; if(mins>=25 || weekday(activeDate)===3)d.studyMinimum=true;
  $("#sessionDescription").value="";
  saveState();loadDayIntoUI();renderAll();toast("Sessão registrada.",`${mins} minutos adicionados.`);
});
$("#newSubject").addEventListener("click",()=>openStudyCourseDialog());
function clampSeries(){
  for(let i=1;i<=3;i++){
    const total=Math.max(3,Math.min(5,Number(state.settings[`series${i}Total`]||4)));
    state.settings[`series${i}Total`]=total;
    state.settings[`series${i}Done`]=Math.max(0,Math.min(total,Number(state.settings[`series${i}Done`]||0)));
    const range=$(`#series${i}Done`);if(range){range.max=total;range.value=state.settings[`series${i}Done`];}
  }
}

/* apartment */
function renderApartment(){
  if(!$("#apartmentProgress") || !$("#apartmentText")) return;
  const goal=Number(state.settings.apartmentGoal||0), saved=Number(state.settings.apartmentSaved||0), monthly=Number(state.settings.monthlyContribution||0);
  const pct=goal>0?Math.max(0,Math.min(100,saved/goal*100)):0;
  $("#apartmentProgress").style.width=`${pct}%`;
  if(!goal){$("#apartmentText").textContent="Preencha os valores.";return}
  const missing=Math.max(0,goal-saved);
  let text=`${pct.toFixed(1)}% da meta · faltam R$ ${missing.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  if(monthly>0 && missing>0) text+=` · ${Math.ceil(missing/monthly)} aportes mensais sem considerar rendimento`;
  $("#apartmentText").textContent=text;
}

/* daily rendering */
const dailyPlan={
  0:["Domingo","Descanso e preparação da semana."],
  1:["Segunda","Rotina básica + um bloco de PUC."],
  2:["Terça","Continue a matéria atual."],
  3:["Quarta","Live da PUC, 19h–21h."],
  4:["Quinta","Um bloco de 25 minutos."],
  5:["Sexta","Feche pendências essenciais."],
  6:["Sábado","Até dois blocos de estudo, com pausa."]
};
function renderToday(){
  renderDashboardNotes();
  const d=ensureDay(), [name,msg]=dailyPlan[weekday(activeDate)];
  const profileName=String(state.settings.profileName||'').trim(),firstName=profileName&&profileName.toLowerCase()!=='seu nome'?profileName.split(/\s+/)[0]:'';
  $("#todayHeadline").textContent=firstName?`${firstName}, seu plano de ${name.toLocaleLowerCase('pt-BR')}.`:`${name} · plano do dia`;
  $("#todayGuidance").textContent=msg;
  if($("#todayWater"))$("#todayWater").textContent=Number(d.waterCups)||0;
  if($("#todayWalk"))$("#todayWalk").textContent=Number(d.walkMinutes)||0;
  if($("#todayPages"))$("#todayPages").textContent=Number(d.pagesRead)||0;
  if($("#todayProtein49"))$("#todayProtein49").textContent=Number(d.proteinMeals49)||0;
  if($("#todayMeditation"))$("#todayMeditation").textContent=d.meditated?"sim":"não";
  $("#returnsToday").textContent=Number(d.returns)||0;
  $("#todayStudyMetric").textContent=`${Number(d.studyMinutes)||0} min`;
  $("#todayBankMetric").textContent=`${Number(state.settings.bankHours||0).toFixed(2).replace(".",",")}h`;
  $("#todayEnergyMetric").textContent=d.energy?`${d.energy}/5`:"—/5";
  renderDayCompass();
  if(d.arrivalTime){
    const delay=parseTime(d.arrivalTime)-parseTime(state.settings.workStart||"08:00");
    $("#todayArrivalMetric").textContent=d.arrivalTime;
    $("#todayArrivalSub").textContent=delay<=0?"no horário contratual":`${delay} min após o horário`;
  }else{
    $("#todayArrivalMetric").textContent="—";$("#todayArrivalSub").textContent="registre quando chegar";
  }
}
function dayCompassItems(){
  const d=ensureDay(),items=[],now=new Date(),today=activeDate===todayISO(),course=currentStudyCourse?.();
  if(today){
    const current=currentRoutineOccurrence(now),next=nextRoutineOccurrence(now),r=current||next;
    if(r){const mins=Math.round((r.when-now)/60000);if(current||mins<=180)items.push({icon:current?"!":"↗",title:current?`Agora: ${r.item.title}`:`${r.item.time} · ${r.item.title}`,detail:current?"Faça só o próximo passo desta rotina.":`${mins} min até este compromisso.`,target:"habits"})}
  }
  if(!d.studyMinimum&&course)items.push({icon:"25",title:`25 min de ${course.title}`,detail:`Trilha atual em ${studyTaskProgress(course)}%. Um bloco já conta.`,target:"puc"});
  const waterGoal=Number(state.settings.waterGoalCups||8),water=Number(d.waterCups||0);if(water<waterGoal)items.push({icon:"H₂O",title:`Mais ${Math.max(1,waterGoal-water)} copo(s) de água`,detail:`Hoje: ${water}/${waterGoal}.`,target:"habits"});
  const urgent=(state.notes||[]).find(n=>["attention","tomorrow"].includes(n.status||"")&&n.status!=="done");if(urgent)items.push({icon:"•",title:urgent.title||"Nota pendente",detail:urgent.status==="attention"?"Marcada como precisa de atenção.":"Planejada para amanhã.",target:"notes"});
  if(!d.preparedTomorrow&&new Date().getHours()>=16)items.push({icon:"✓",title:"Preparar amanhã",detail:"Defina o próximo passo antes de encerrar o dia.",target:"today"});
  if(!items.length)items.push({icon:"✓",title:"Dia sob controle",detail:"Escolha uma ação pequena no campo de foco e avance um bloco.",target:"today"});
  return items.slice(0,3);
}
function renderDayCompass(){
  const c=$("#dayCompassList");if(!c)return;const items=dayCompassItems();$("#dayCompassPulse").textContent=`${items.length} ${items.length===1?"sugestão":"sugestões"}`;
  c.innerHTML=items.map((x,i)=>`<button class="day-compass-item" data-compass-target="${escapeHTML(x.target)}"><i>${escapeHTML(x.icon)}</i><span><b>${escapeHTML(x.title)}</b><small>${escapeHTML(x.detail)}</small></span></button>`).join("");
  $$('[data-compass-target]',c).forEach(b=>b.addEventListener('click',()=>{const t=b.dataset.compassTarget;if(t&&t!=="today")showView(t);else $("#focusTask")?.focus()}));
}

function renderArrival(){
  const d=ensureDay(), arrival=parseTime(d.arrivalTime), start=parseTime(state.settings.workStart), phase=parseTime(state.settings.phaseArrival);
  if(arrival==null){$("#arrivalAnalysis").textContent="Registre a chegada para receber uma leitura objetiva.";return}
  const late=arrival-start, phaseDiff=arrival-phase;
  let txt;
  if(late<=0) txt=`Chegada dentro do horário contratual. ${Math.abs(late)} minuto(s) de margem.`;
  else if(phaseDiff<=0) txt=`${late} min após o horário contratual, mas dentro da meta intermediária desta fase.`;
  else txt=`${late} min após o horário contratual e ${phaseDiff} min além da meta intermediária. Próximo objetivo: reduzir, não compensar tudo em um único dia.`;
  $("#arrivalAnalysis").textContent=txt;
}
function renderBank(){
  const bank=Number(state.settings.bankHours||0);
  const start=-14;
  const progress=bank>=0?100:Math.max(0,Math.min(100,((bank-start)/(0-start))*100));
  $("#bankProgress").style.width=`${progress}%`;
  const remaining=Math.max(0,-bank);
  $("#bankProjection").textContent=remaining?`Faltam aproximadamente ${remaining.toFixed(2)} h para zerar o saldo informado.`:"Saldo informado não está negativo.";
}
function renderHistory(){
  const arr=Object.entries(state.days).filter(([date,d])=>d.arrivalTime).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,10);
  $("#arrivalHistory").innerHTML=arr.length?arr.map(([date,d])=>{
    const late=parseTime(d.arrivalTime)-parseTime(state.settings.workStart||"08:00");
    return `<div class="history-row"><span>${formatDateBR(date)}</span><b>${escapeHTML(d.arrivalTime)}</b><i>${late<=0?"no horário":`+${late} min`}</i></div>`;
  }).join(""):`<div class="history-row"><span>—</span><b>Nenhuma chegada registrada ainda.</b><i></i></div>`;
}
function pucCourseStatus(course){
  const ref=activeDate;
  if(Number(course.progress)>=100)return "Concluída";
  if(course.start&&ref<course.start)return "Em breve";
  if(course.end&&ref>course.end)return "Encerrada";
  return course.current?"Atual":"Disponível";
}
function pucDaysLeft(course){
  if(!course.end)return "";
  const [y,m,d]=course.end.split("-").map(Number),end=new Date(y,m-1,d,12),nowParts=activeDate.split("-").map(Number),now=new Date(nowParts[0],nowParts[1]-1,nowParts[2],12);
  const diff=Math.ceil((end-now)/86400000);
  if(diff<0)return `encerrou há ${Math.abs(diff)} dia(s)`;
  if(diff===0)return "encerra hoje";
  return `${diff} dia(s) até o fim`;
}
function currentStudyCourse(){return (state.pucCourses||[]).find(x=>x.current)||(state.pucCourses||[])[0]||null}
function ensureStudyTaskOwners(){
  const legacy=(state.pucCourses||[]).find(c=>c.id==="puc-planejamento")||currentStudyCourse();
  if(!legacy)return;
  for(const task of state.pucTrackModules||[]){if(!task.courseId)task.courseId=legacy.id;}
}
function studyTasks(course=currentStudyCourse()){
  if(!course)return [];
  ensureStudyTaskOwners();return (state.pucTrackModules||[]).filter(task=>task.courseId===course.id);
}
function studyTaskProgress(course){const tasks=studyTasks(course);return tasks.length?Math.round(tasks.filter(x=>x.done).length/tasks.length*100):0}
function updateStudyTaskProgress(course){
  const prev=Number(course.progress||0);if(!Object.prototype.hasOwnProperty.call(course,"previousManualProgress"))course.previousManualProgress=prev;
  course.progress=studyTaskProgress(course);logGoalTransition(course,"study",prev,$(".puc-track-panel"));
}
function selectStudyCourse(course){
  const old=currentStudyCourse();
  const keys=["series1Done","series1Total","series1Reading","series2Done","series2Total","series2Reading","series3Done","series3Total","series3Reading","live1","live2","live3","nextLesson"];
  if(old){old.studyDetails=old.studyDetails||{};for(const key of keys)old.studyDetails[key]=state.settings[key];}
  state.pucCourses.forEach(x=>x.current=x.id===course.id);state.settings.subjectName=course.title;
  for(const key of keys)state.settings[key]=course.studyDetails?.[key]??DEFAULT_STATE.settings[key];
  syncInputsFromState();saveState();renderAll();
}
async function openStudyCourseDialog(course=null){
  const result=await openFormDialog({title:course?"Editar matéria":"Adicionar matéria",description:"Cadastre a matéria e depois adicione as tarefas da sua trilha.",submitLabel:course?"Salvar matéria":"Adicionar matéria",fields:[
    {key:"title",label:"Nome da matéria",required:true,value:course?.title,placeholder:"Ex.: Experiência do Cliente",maxLength:160},
    {key:"start",label:"Data de início",type:"date",value:course?.start||activeDate},
    {key:"end",label:"Data de término",type:"date",value:course?.end||""}
  ],validate:values=>values.start&&values.end&&values.end<values.start?"A data de término deve ser igual ou posterior ao início.":""});
  if(!result)return;
  if(course){Object.assign(course,result);if(currentStudyCourse()?.id===course.id)state.settings.subjectName=course.title;}
  else{const created={id:cryptoId(),...result,code:"",progress:0,status:"current",current:false};state.pucCourses.push(created);selectStudyCourse(created);}
  saveState();syncInputsFromState();renderAll();toast(course?"Matéria atualizada.":"Matéria adicionada.",result.title);
}
async function openStudyTaskDialog(task=null){
  const course=currentStudyCourse();if(!course){await openStudyCourseDialog();return;}
  const courseId=course.id;
  const result=await openFormDialog({title:task?"Editar tarefa":"Adicionar tarefa",description:`Matéria: ${course.title}. Cada tarefa tem o mesmo peso no progresso.`,submitLabel:task?"Salvar tarefa":"Adicionar tarefa",fields:[
    {key:"title",label:"Nome da tarefa",required:true,value:task?.title,placeholder:"Ex.: Assistir à aula 1",maxLength:180},
    {key:"type",label:"Tipo de tarefa",value:task?.type||"Aula",options:["Aula","Leitura","Live","Exercício","Outro"].map(label=>({label,value:label}))}
  ]});
  if(!result||!state.pucCourses.some(x=>x.id===courseId))return;
  if(task)Object.assign(task,result);else state.pucTrackModules.push({id:cryptoId(),courseId,...result,items:1,done:false,createdAt:new Date().toISOString()});
  updateStudyTaskProgress(course);saveState();renderPUCCourses();toast(task?"Tarefa atualizada.":"Tarefa adicionada.");
}
function renderPUCCourses(){
  const box=$("#pucCoursesBoard");if(!box)return;
  state.pucCourses=state.pucCourses||[];state.pucTrackModules=state.pucTrackModules||[];ensureStudyTaskOwners();
  const selected=currentStudyCourse();
  const courses=state.pucCourses.slice().sort((a,b)=>(a.start||"").localeCompare(b.start||""));
  box.innerHTML=courses.length?courses.map(course=>{
    const progress=studyTaskProgress(course),tasks=studyTasks(course),current=selected?.id===course.id;
    const status=progress===100?"Concluída":current?"Atual":"Disponível";
    return `<article class="puc-course-card ${current?"current":""} ${progress===100?"done":""}" data-puc-course="${escapeHTML(course.id)}"><span class="puc-course-status">${status}</span><h4>${escapeHTML(course.title||"Sem nome")}</h4><div class="puc-course-dates"><label>INÍCIO<input type="date" data-puc-start value="${escapeHTML(course.start||"")}"></label><label>FIM<input type="date" data-puc-end value="${escapeHTML(course.end||"")}"></label></div><div class="puc-course-progress"><progress max="100" value="${progress}" aria-label="Progresso de ${escapeHTML(course.title)}">${progress}%</progress><b>${progress}%</b></div><p class="note">${tasks.length?`${tasks.filter(x=>x.done).length} de ${tasks.length} tarefas concluídas`:"Sem tarefas cadastradas"}</p><div class="study-course-actions"><button class="text-button" data-puc-current ${current?'disabled aria-current="true"':""}>${current?"Matéria atual":"Definir como atual"}</button><button class="text-button" data-puc-edit>Editar matéria</button></div></article>`;
  }).join(""):'<div class="study-empty"><b>Nenhuma matéria cadastrada.</b><p>Use “Adicionar matéria” para criar seu cronograma.</p></div>';
  $$('[data-puc-course]',box).forEach(card=>{
    const course=state.pucCourses.find(x=>x.id===card.dataset.pucCourse);
    for(const [selector,key] of [["[data-puc-start]","start"],["[data-puc-end]","end"]])card.querySelector(selector).addEventListener("change",e=>{const proposed=e.target.value,other=key==="start"?course.end:course.start;if(proposed&&other&&(key==="start"?proposed>other:proposed<other)){e.target.value=course[key]||"";toast("Revise as datas.","O término deve ser igual ou posterior ao início.");return;}course[key]=proposed;saveState();renderPUCCourses();});
    card.querySelector('[data-puc-current]').addEventListener("click",()=>{selectStudyCourse(course);renderStudyToolkit();toast("Matéria atual atualizada.",course.title)});
    card.querySelector('[data-puc-edit]').addEventListener("click",()=>openStudyCourseDialog(course));
  });renderPUCTrack();
}
function renderPUCTrack(){
  const box=$("#pucTrackModules");if(!box)return;
  const course=currentStudyCourse(),tasks=studyTasks(course),progress=studyTaskProgress(course),done=tasks.filter(x=>x.done).length;
  $("#pucTrackTitle").textContent="Trilha atual";
  $("#pucTrackCourse").textContent=course?`Matéria atual: ${course.title}`:"Nenhuma matéria selecionada.";
  $("#pucTrackPercent").textContent=`${progress}%`;$("#pucTrackProgressValue").textContent=`${progress}%`;$("#pucTrackProgressRange").value=progress;
  $("#pucTrackAddTask").disabled=!course;
  $("#pucTrackSummary").textContent=!course?"Adicione uma matéria no cronograma para começar.":!tasks.length?"Nenhuma tarefa cadastrada. O progresso começa em 0% e será atualizado ao concluir tarefas.":`${done} de ${tasks.length} tarefas concluídas. Marque uma tarefa para atualizar o progresso.`;
  box.innerHTML=tasks.map(task=>`<div class="study-task ${task.done?"done":""}" data-study-task="${escapeHTML(task.id)}"><label><input type="checkbox" data-task-done ${task.done?"checked":""}><span><small>${escapeHTML(task.type||"Tarefa")}</small><b>${escapeHTML(task.title)}</b></span></label><div><button class="text-button" data-task-edit aria-label="Editar tarefa ${escapeHTML(task.title)}">Editar</button><button class="text-button" data-task-delete aria-label="Excluir tarefa ${escapeHTML(task.title)}">Excluir</button></div></div>`).join("");
  $$('[data-study-task]',box).forEach(row=>{
    const task=tasks.find(x=>x.id===row.dataset.studyTask);
    row.querySelector('[data-task-done]').addEventListener("change",e=>{task.done=e.target.checked;updateStudyTaskProgress(course);saveState();renderPUCCourses();});
    row.querySelector('[data-task-edit]').addEventListener("click",()=>openStudyTaskDialog(task));
    row.querySelector('[data-task-delete]').addEventListener("click",async()=>{if(!await askConfirmation(`Excluir a tarefa “${task.title}”? O progresso será recalculado.`,"Excluir tarefa"))return;state.pucTrackModules=state.pucTrackModules.filter(x=>x.id!==task.id);updateStudyTaskProgress(course);saveState();renderPUCCourses();});
  });
}
$("#pucTrackAddTask")?.addEventListener("click",()=>openStudyTaskDialog());

function renderWeek(){
  const labels=["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
  const plans=["1 bloco de 25 min: vídeo ou leitura.","1 bloco de 25 min + leitura opcional.","LIVE 19h–21h. Ela já conta como estudo principal.","1 bloco de 25 min: continue exatamente de onde parou.","Recuperação. 10–15 min só se estiver bem.","Até 2 blocos de 25 min, separados.","Descanso + 10 min para organizar a semana."];
  const jsDays=[1,2,3,4,5,6,0];
  $("#weekGrid").innerHTML=labels.map((l,i)=>`<div class="week-day ${weekday(activeDate)===jsDays[i]?"today":""}"><span>${l}</span><p>${plans[i]}</p></div>`).join("");
}
function weekBounds(dateStr=activeDate){
  const [y,m,d]=dateStr.split("-").map(Number),dt=new Date(y,m-1,d),day=dt.getDay();
  const delta=day===0?-6:1-day;
  const start=new Date(y,m-1,d+delta), dates=[];
  for(let i=0;i<7;i++){const x=new Date(start);x.setDate(start.getDate()+i);dates.push(localISO(x));}
  return dates;
}
function renderPUCWeek(){
  if(!$("#pucWeekLessons"))return;
  const dates=new Set(weekBounds()), sessions=(state.studySessions||[]).filter(s=>dates.has(s.date));
  $("#pucWeekLessons").textContent=sessions.reduce((a,s)=>a+(Number(s.lessons)||0),0);
  $("#pucWeekMinutes").textContent=sessions.reduce((a,s)=>a+(Number(s.minutes)||0),0);
  $("#pucWeekSessions").textContent=sessions.length;
}

function renderSeries(){
  clampSeries();
  for(let i=1;i<=3;i++){
    const done=Number(state.settings[`series${i}Done`]||0), total=Number(state.settings[`series${i}Total`]||4);
    $(`#series${i}Text`).textContent=`${done} / ${total} vídeos`;
    const r=$(`#series${i}Done`);if(r){r.max=total;r.value=done}
  }
}
function renderStudyHistory(){
  const rows=state.studySessions.slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,8);
  $("#studyHistory").innerHTML=rows.length?rows.map(s=>`<div class="history-row"><span>${formatDateBR(s.date)}</span><b>${escapeHTML(s.description||s.subject||"Sessão de estudo")}</b><i>${s.minutes} min</i></div>`).join(""):"";
}

/* reports */
function monthEntries(ym){
  return Object.entries(state.days).filter(([date])=>date.startsWith(ym)).sort((a,b)=>a[0].localeCompare(b[0]));
}
function statsForMonth(ym){
  const entries=monthEntries(ym);
  const arrivals=entries.filter(([date,d])=>isWorkday(date)&&d.arrivalTime).map(([date,d])=>({date,delay:parseTime(d.arrivalTime)-parseTime(state.settings.workStart||"08:00")}));
  const study=entries.reduce((s,[,d])=>s+(Number(d.studyMinutes)||0),0);
  const returns=entries.reduce((s,[,d])=>s+(Number(d.returns)||0),0);
  const career=entries.reduce((s,[,d])=>s+(d.careerAction?1:0),0);
  const energies=entries.map(([,d])=>Number(d.energy)).filter(Boolean);
  const escapes=entries.map(([,d])=>Number(d.escapeUrge)).filter(Boolean);
  const english=state.englishSessions.filter(x=>x.date && x.date.startsWith(ym)).length;
  const contributions=state.financeEvents.filter(x=>x.date && x.date.startsWith(ym)).reduce((s,x)=>s+(Number(x.amount)||0),0);
  const nvPublished=(state.nvContent||[]).filter(x=>x.status==="published" && (x.publishedAt||x.date||"").startsWith(ym)).length;
  const water=entries.reduce((s,[,d])=>s+(Number(d.waterCups)||0),0);
  const walk=entries.reduce((s,[,d])=>s+(Number(d.walkMinutes)||0),0);
  const pages=entries.reduce((s,[,d])=>s+(Number(d.pagesRead)||0),0);
  const meditationDays=entries.reduce((s,[,d])=>s+(d.meditated?1:0),0);
  const punchComplete=entries.reduce((s,[,d])=>s+([d.punchIn,d.lunchOut,d.lunchIn,d.punchOut].filter(Boolean).length===4?1:0),0);
  const lessons=state.studySessions.filter(x=>x.date&&x.date.startsWith(ym)).reduce((s,x)=>s+(Number(x.lessons)||0),0);
  const monthNotes=(state.notes||[]).filter(n=>(n.dueDate||"").startsWith(ym));
  const tasksAttention=monthNotes.filter(n=>n.status==="attention").length;
  const tasksOpen=monthNotes.filter(n=>!["done","cancelled"].includes(n.status||"todo")).length;
  return {
    entries, days:entries.length, arrivals,
    avgDelay:arrivals.length?arrivals.reduce((s,x)=>s+x.delay,0)/arrivals.length:null,
    study, returns, career,
    avgEnergy:energies.length?energies.reduce((a,b)=>a+b,0)/energies.length:null,
    avgEscape:escapes.length?escapes.reduce((a,b)=>a+b,0)/escapes.length:null,
    english, contributions, nvPublished, tasksAttention, tasksOpen, water, walk, pages, meditationDays, punchComplete, lessons,
    goalsCompleted:state.goalEvents.filter(x=>x.event==='completed'&&x.date&&x.date.startsWith(ym)).length,
    goalsIncomplete:[...(state.books||[]),...(state.games||[]),...(state.customGoals||[])].filter(x=>Number(x.progress||0)<100).length
  };
}
function deltaText(current,prev,unit="",inverse=false){
  if(current==null || prev==null) return "sem comparação anterior";
  const diff=current-prev;
  if(Math.abs(diff)<0.01) return "igual ao mês anterior";
  const better=inverse?diff<0:diff>0;
  return `${diff>0?"+":""}${Number(diff.toFixed(1)).toLocaleString("pt-BR")} ${unit} vs. mês anterior${better?" · melhora":""}`;
}
function renderReports(){
  const ym=$("#reportMonth").value||monthKey(todayISO());
  const s=statsForMonth(ym), p=statsForMonth(previousMonthKey(ym));
  $("#rDays").textContent=s.days;$("#rDaysDelta").textContent=deltaText(s.days,p.days,"dias");
  $("#rDelay").textContent=s.avgDelay==null?"—":fmtMinutes(s.avgDelay);$("#rDelayDelta").textContent=deltaText(s.avgDelay,p.avgDelay,"min",true);
  $("#rStudy").textContent=`${s.study} min`;$("#rStudyDelta").textContent=deltaText(s.study,p.study,"min");
  $("#rReturns").textContent=s.returns;$("#rReturnsDelta").textContent=deltaText(s.returns,p.returns,"");
  $("#rCareer").textContent=s.career;$("#rCareerDelta").textContent=deltaText(s.career,p.career,"ações");
  $("#rEnergy").textContent=s.avgEnergy==null?"—":`${s.avgEnergy.toFixed(1)}/5`;$("#rEnergyDelta").textContent=deltaText(s.avgEnergy,p.avgEnergy,"",false);
  if($("#rEnglish")){$("#rEnglish").textContent=s.english;$("#rEnglishDelta").textContent=deltaText(s.english,p.english,"sessões");}
  if($("#rContrib")){$("#rContrib").textContent=money(s.contributions);$("#rContribDelta").textContent=deltaText(s.contributions,p.contributions,"R$");}
  if($("#rNV")){$("#rNV").textContent=s.nvPublished;$("#rNVDelta").textContent=deltaText(s.nvPublished,p.nvPublished,"vídeos");}
  if($("#rWater"))$("#rWater").textContent=s.water;
  if($("#rWalk"))$("#rWalk").textContent=s.walk;
  if($("#rPages"))$("#rPages").textContent=s.pages;
  if($("#rMeditation"))$("#rMeditation").textContent=s.meditationDays;

  const pieces=[];
  if(!s.days) pieces.push("Ainda não há registros suficientes neste mês.");
  else{
    pieces.push(`Você registrou ${s.days} dia${s.days===1?"":"s"}.`);
    if(s.avgDelay!=null) pieces.push(`Nas ${s.arrivals.length} chegadas de trabalho registradas, o atraso médio em relação a ${state.settings.workStart} foi de ${Math.max(0,Math.round(s.avgDelay))} minutos${s.avgDelay<=0?" ou menos":""}.`);
    pieces.push(`Foram ${s.study} minutos de estudo e ${s.returns} retornos depois de distração ou fuga.`);
    if(s.career) pieces.push(`Você marcou ${s.career} ação${s.career===1?"":"ões"} ligada${s.career===1?"":"s"} à saída profissional.`);
    if(s.english) pieces.push(`Também foram ${s.english} sessões de inglês.`);
    if(s.contributions) pieces.push(`Os aportes registrados no mês somaram ${money(s.contributions)}.`);
    if(s.nvPublished) pieces.push(`${state.settings.channelName||"O canal"} teve ${s.nvPublished} publicação${s.nvPublished===1?"":"ões"} registrada${s.nvPublished===1?"":"s"} no mês.`);
    if(s.pages) pieces.push(`Leitura registrada: ${s.pages} páginas.`);
    if(s.meditationDays) pieces.push(`Meditação registrada em ${s.meditationDays} dia(s).`);
    if(s.walk) pieces.push(`Caminhada registrada: ${s.walk} minutos.`);
    if(p.days){
      if(s.avgDelay!=null&&p.avgDelay!=null){
        const diff=s.avgDelay-p.avgDelay;
        pieces.push(diff<0?`O atraso médio caiu ${Math.abs(Math.round(diff))} minutos frente ao mês anterior.`:diff>0?`O atraso médio aumentou ${Math.round(diff)} minutos frente ao mês anterior.`:"O atraso médio ficou praticamente estável.");
      }
      const st=s.study-p.study;
      if(st!==0) pieces.push(st>0?`O tempo de estudo aumentou ${st} minutos.`:`O tempo de estudo caiu ${Math.abs(st)} minutos.`);
    }
  }
  $("#reportNarrative").textContent=pieces.join(" ");
  renderAttentionReport(s,ym);renderMonthlyArchive();

  renderDelayChart(s.arrivals);
  renderWeeklyChart(s.entries,"studyMinutes","#studyChart",$("#studyChartLabel"),"min");
  renderWeeklyChart(s.entries,"returns","#returnsChart",$("#returnsChartLabel"),"");
}
function attentionItems(s){
  const out=[];
  if(s.days<7)out.push({level:'warn',title:'Poucos dados no mês',text:`Só ${s.days} dias foram registrados. O diagnóstico fica mais confiável com check-ins frequentes.`});
  if(s.avgDelay!=null&&s.avgDelay>20)out.push({level:'warn',title:'Pontualidade está drenando margem',text:`Atraso médio de ${Math.round(s.avgDelay)} min. Trabalhe primeiro a saída de casa, não a culpa depois de chegar.`});
  else if(s.avgDelay!=null&&s.avgDelay<=10)out.push({level:'good',title:'Pontualidade em boa direção',text:`Atraso médio de ${Math.max(0,Math.round(s.avgDelay))} min no período registrado.`});
  if(s.study<300)out.push({level:'warn',title:`${state.settings.educationLabel||'Estudos'} abaixo da meta-base`,text:`${s.study} min no mês. Referência do painel: 300 min/mês, além de encontros/aulas ao vivo.`});
  const recorded=Math.max(1,s.days);
  if(Number(state.settings.waterGoalCups||0)>0 && s.water/recorded < Number(state.settings.waterGoalCups)*.65)out.push({level:'neutral',title:'Água abaixo da meta configurada',text:`Média registrada: ${(s.water/recorded).toFixed(1)} copos por dia com meta de ${state.settings.waterGoalCups}.`});
  if(s.walk===0&&s.days>=5)out.push({level:'neutral',title:'Sem caminhada registrada',text:'Nenhum minuto de caminhada foi registrado no período.'});
  if(s.meditationDays===0&&s.days>=5)out.push({level:'neutral',title:'Sem meditação registrada',text:'Nenhum dia de meditação foi marcado no período.'});
  if(s.english<4)out.push({level:'warn',title:'Inglês com pouca repetição',text:`${s.english} sessões. Quatro sessões curtas já criam uma frequência mínima mensal.`});
  if(s.avgEscape!=null&&s.avgEscape>=4)out.push({level:'warn',title:'Vontade de fuga alta',text:`Média ${s.avgEscape.toFixed(1)}/5 nos registros. Observe cansaço, horário e gatilhos que antecedem a anestesia.`});
  if(Number(state.settings.bankHours||0)<0)out.push({level:'warn',title:'Banco de horas ainda negativo',text:`Saldo informado: ${Number(state.settings.bankHours).toFixed(2)} h.`});
  const received=Number(state.settings.salaryAdvance||0)+Number(state.settings.salarySecondPayment||0);
  const knownCosts=Number(state.settings.cardBill||0)+Number(state.settings.claroMonthly||0)+Number(state.settings.pucMonthly||0)+Number(state.settings.transportMonthly||0);
  if(received>0 && Number(state.settings.cardBill||0)/received>=.20)out.push({level:'warn',title:'Cartão está pesado neste ciclo',text:`A fatura informada equivale a cerca de ${Math.round(Number(state.settings.cardBill||0)/received*100)}% dos recebimentos líquidos cadastrados. Fecha dia ${state.settings.cardCloseDay||19}.`});
  if(received>0 && knownCosts/received>=.40)out.push({level:'neutral',title:'Despesas conhecidas já consomem parte relevante da renda',text:`Os itens cadastrados somam ${money(knownCosts)} de ${money(received)} recebidos. Alimentação, moradia e outros gastos ainda não estão incluídos.`});
  const target=Number(state.settings.monthlyContribution||0);if(target>0&&s.contributions<target)out.push({level:'warn',title:'Aportes registrados abaixo da meta',text:`${money(s.contributions)} registrados para uma meta mensal de ${money(target)}.`});
  const nvTarget=Number(state.settings.nvMonthlyTarget||0);if(nvTarget>0&&s.nvPublished<nvTarget)out.push({level:'neutral',title:`${state.settings.channelName||'Canal'} abaixo da meta de publicação`,text:`${s.nvPublished} publicado(s) no mês para uma meta de ${nvTarget}.`});
  if(s.tasksAttention)out.push({level:'warn',title:`${s.tasksAttention} tarefa(s) marcada(s) como “Precisa de Atenção”`,text:`Abra o widget e decida se precisa agir, delegar, remarcar ou cancelar.`});
  if(s.tasksOpen>=8)out.push({level:'neutral',title:`${s.tasksOpen} tarefas ainda abertas no mês`,text:`Se o quadro estiver pesado, mova deliberadamente itens para “Sem Pressa / Por Último” ou “Para Amanhã”.`});
  if(s.goalsCompleted)out.push({level:'good',title:`${s.goalsCompleted} meta(s) concluída(s)`,text:`Conclusões ficam preservadas no histórico mesmo que você troque suas metas depois.`});
  if(s.goalsIncomplete)out.push({level:'neutral',title:`${s.goalsIncomplete} meta(s) ainda abertas`,text:`Elas entram no fechamento como não concluídas; isso serve para decisão, não para punição.`});
  return out;
}
function renderAttentionReport(s,ym){
  const items=attentionItems(s),c=$("#attentionList");if(c)c.innerHTML=items.map((x,i)=>`<div class="attention-item ${x.level}"><i>${x.level==='good'?'✓':x.level==='warn'?'!':'·'}</i><div><strong>${escapeHTML(x.title)}</strong><span>${escapeHTML(x.text)}</span></div></div>`).join('')||`<div class="attention-item good"><i>✓</i><div><strong>Nenhum alerta relevante</strong><span>Com os dados disponíveis, não apareceu um ponto crítico neste mês.</span></div></div>`;
  const warn=items.find(x=>x.level==='warn')||items[0];if(warn&&$("#todayAttentionTitle")){$("#todayAttentionTitle").textContent=warn.title;$("#todayAttentionText").textContent=warn.text;}
}
function saveMonthReport(ym){
  if(state.monthlyReports.some(r=>r.month===ym))return false;
  const s=statsForMonth(ym);if(!s.days)return false;
  state.monthlyReports.unshift({id:cryptoId(),month:ym,createdAt:new Date().toISOString(),summary:{days:s.days,avgDelay:s.avgDelay,study:s.study,returns:s.returns,career:s.career,avgEnergy:s.avgEnergy,avgEscape:s.avgEscape,english:s.english,contributions:s.contributions,nvPublished:s.nvPublished,goalsCompleted:s.goalsCompleted,goalsIncomplete:s.goalsIncomplete,tasksAttention:s.tasksAttention,tasksOpen:s.tasksOpen,water:s.water,walk:s.walk,pages:s.pages,meditationDays:s.meditationDays,punchComplete:s.punchComplete,lessons:s.lessons},attentions:attentionItems(s)});saveState();
  toast('Fechamento mensal pronto.',`Relatório de ${ym.split('-').reverse().join('/')}.`);
  return true;
}
function ensureMonthlyReport(){
  const now=new Date(), current=monthKey(todayISO()), prev=previousMonthKey(current);
  saveMonthReport(prev);
  const tomorrow=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1);
  if(tomorrow.getMonth()!==now.getMonth())saveMonthReport(current);
}
function renderMonthlyArchive(){
  const c=$("#monthlyArchive");if(!c)return;const edu=state.settings.educationLabel||"estudos",channel=state.settings.channelLabel||"canal";c.innerHTML=(state.monthlyReports||[]).slice(0,12).map(r=>{const s=r.summary||{};return `<div class="monthly-archive-row"><time>${r.month.split('-').reverse().join('/')}</time><p>${s.study||0} min ${escapeHTML(edu)} · ${s.english||0} inglês · ${s.nvPublished||0} ${escapeHTML(channel)} · ${s.goalsCompleted||0} metas concluídas · ${s.goalsIncomplete||0} abertas · ${s.pages||0} pág. lidas · ${s.meditationDays||0} meditação${s.tasksAttention?` · ${s.tasksAttention} tarefa(s) em atenção`:''}</p><strong>${(r.attentions||[]).filter(x=>x.level==='warn').length} atenção(ões)</strong></div>`}).join('')||`<div class="history-row"><span>—</span><b>O primeiro fechamento aparece ao virar o mês.</b><i></i></div>`;
}
function svgWrap(inner){return `<svg viewBox="0 0 420 210" preserveAspectRatio="none" role="img">${inner}</svg>`}
function renderDelayChart(arrivals){
  const target=$("#delayChart");
  if(!arrivals.length){target.innerHTML=svgWrap(`<text x="20" y="105">Sem chegadas registradas.</text>`);$("#delayChartLabel").textContent="";return}
  const vals=arrivals.map(x=>Math.max(0,x.delay));
  const max=Math.max(10,...vals), w=380/(vals.length||1);
  let inner=`<line class="gridline" x1="20" y1="185" x2="405" y2="185"/>`;
  vals.forEach((v,i)=>{
    const h=(v/max)*145, x=22+i*w, y=185-h;
    inner+=`<rect class="bar" x="${x}" y="${y}" width="${Math.max(4,w*.55)}" height="${h}" rx="2"/><text x="${x}" y="202">${arrivals[i].date.slice(8)}</text>`;
  });
  target.innerHTML=svgWrap(inner);
  $("#delayChartLabel").textContent=`média ${Math.round(vals.reduce((a,b)=>a+b,0)/vals.length)} min`;
}
function weeklyBuckets(entries,field){
  const b=[0,0,0,0,0];
  entries.forEach(([date,d])=>{
    const day=Number(date.slice(8));
    const idx=Math.min(4,Math.floor((day-1)/7));
    b[idx]+=Number(d[field])||0;
  });
  return b;
}
function renderWeeklyChart(entries,field,selector,labelEl,unit){
  const b=weeklyBuckets(entries,field), max=Math.max(1,...b);
  let inner=`<line class="gridline" x1="20" y1="185" x2="405" y2="185"/>`;
  b.forEach((v,i)=>{
    const h=(v/max)*145,x=36+i*76,y=185-h;
    inner+=`<rect class="bar alt" x="${x}" y="${y}" width="38" height="${h}" rx="2"/><text x="${x+8}" y="202">S${i+1}</text>`;
  });
  $(selector).innerHTML=svgWrap(inner);
  labelEl.textContent=`total ${b.reduce((a,c)=>a+c,0)}${unit?" "+unit:""}`;
}


