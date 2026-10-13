/* =========================================================
   V5 — METAS / EVENTOS DE CONCLUSÃO
   ========================================================= */
function logGoalTransition(item,type,previousProgress,target=null){
  const now=Number(item.progress||0);
  if(previousProgress<100 && now>=100){
    item.completedAt=new Date().toISOString();
    state.goalEvents.push({id:cryptoId(),date:activeDate,event:'completed',type,title:item.title,createdAt:new Date().toISOString()});
    toast("100% concluído.",item.title);
    celebrateElement(target,item.title);
  }else if(previousProgress>=100 && now<100){
    item.completedAt=null;
    state.goalEvents.push({id:cryptoId(),date:activeDate,event:'reopened',type,title:item.title,createdAt:new Date().toISOString()});
  }
}

/* =========================================================
   V4 — LIVROS / JOGOS / METAS EDITÁVEIS
   ========================================================= */
function mediaStatuses(type){return type==='books'?['Quero ler','Lendo','Concluído']:type==='games'?['Quero jogar','Jogando','Concluído']:['Quero assistir','Assistindo','Concluído'];}
function syncBookProgress(item){
  item.pagesRead=Math.max(0,Number(item.pagesRead||0));
  item.totalPages=Math.max(0,Number(item.totalPages||0));
  item.progress=item.totalPages?Math.min(100,Math.round(item.pagesRead/item.totalPages*100)):Math.max(0,Number(item.progress||0));
  if(item.progress>=100)item.status="Concluído";
}
function renderMediaList(type,selector){
  const list=state[type]||[], statuses=mediaStatuses(type), c=$(selector);
  if(!c)return;
  if(type==="books"){
    list.forEach(syncBookProgress);
    c.innerHTML=list.map(item=>`
      <div class="book-row-v11 media-row media-book-row" data-media-id="${item.id}" data-media-type="books">
        <input class="media-title" type="text" value="${escapeHTML(item.title)}" data-media-field="title">
        <select class="media-status" data-media-field="status">${statuses.map(s=>`<option ${s===item.status?"selected":""}>${s}</option>`).join("")}</select>
        <label class="field inline book-pages-read"><span>Lidas</span><input type="number" min="0" value="${Number(item.pagesRead)||0}" data-book-pages></label>
        <label class="field inline book-pages-total"><span>Total</span><input type="number" min="0" value="${Number(item.totalPages)||0}" data-book-total></label>
        <div class="book-progress-v11"><div class="bar"><i style="width:${Number(item.progress)||0}%"></i></div><small>${Number(item.progress)||0}% · ${Number(item.pagesRead)||0}/${Number(item.totalPages)||"?"} páginas</small></div>
        <button class="goal-delete" data-media-delete>×</button>
      </div>`).join("");
    $$("[data-media-id]",c).forEach(row=>{
      const item=state.books.find(x=>x.id===row.dataset.mediaId);
      row.querySelector('[data-media-field="title"]').addEventListener("input",e=>{item.title=e.target.value;saveState()});
      row.querySelector('[data-media-field="status"]').addEventListener("change",e=>{const prev=Number(item.progress||0);item.status=e.target.value;if(item.status==="Concluído"&&item.totalPages)item.pagesRead=item.totalPages;syncBookProgress(item);logGoalTransition(item,"books",prev,row);saveState();renderGoals()});
      const updatePages=()=>{const prev=Number(item.progress||0);item.pagesRead=Number(row.querySelector("[data-book-pages]").value||0);item.totalPages=Number(row.querySelector("[data-book-total]").value||0);syncBookProgress(item);logGoalTransition(item,"books",prev,row);saveState();renderGoals();renderHabits()};
      row.querySelector("[data-book-pages]").addEventListener("change",updatePages);
      row.querySelector("[data-book-total]").addEventListener("change",updatePages);
      row.querySelector("[data-media-delete]").addEventListener("click",()=>{state.books=state.books.filter(x=>x.id!==item.id);saveState();renderGoals();renderHabits()});
    });
    return;
  }
  c.innerHTML=list.map(item=>`
    <div class="editable-goal-row media-row media-game-row" data-media-id="${item.id}" data-media-type="${type}">
      <input class="media-title" type="text" value="${escapeHTML(item.title)}" data-media-field="title">
      <select class="media-status" data-media-field="status">${statuses.map(s=>`<option ${s===item.status?"selected":""}>${s}</option>`).join("")}</select>
      <div class="goal-progress"><input type="range" min="0" max="100" value="${Number(item.progress)||0}" data-media-field="progress"><small>${Number(item.progress)||0}%</small></div>
      <button class="goal-delete" data-media-delete>×</button>
    </div>`).join("");
  $$("[data-media-id]",c).forEach(row=>{
    const id=row.dataset.mediaId, arr=state[row.dataset.mediaType], item=arr.find(x=>x.id===id);
    row.querySelectorAll("[data-media-field]").forEach(el=>{
      const evt=el.type==="range"?"input":"change";
      if(el.tagName==="INPUT"&&el.type==="text") el.addEventListener("input",()=>{item.title=el.value;saveState()});
      else el.addEventListener(evt,()=>{const prev=Number(item.progress||0);item[el.dataset.mediaField]=el.type==="range"?Number(el.value):el.value;if(el.dataset.mediaField==="status"&&/Concluído/.test(el.value)) item.progress=100;if(el.type==="range")el.parentElement.querySelector("small").textContent=`${item.progress}%`;logGoalTransition(item,type,prev,row);saveState();if(el.dataset.mediaField==="status"&&/Concluído/.test(el.value))renderGoals();});
    });
    row.querySelector("[data-media-delete]").addEventListener("click",()=>{state[row.dataset.mediaType]=arr.filter(x=>x.id!==id);saveState();renderGoals();});
  });
}
function addMedia(type){
  const title=({books:"Novo livro",games:"Novo jogo",films38:"Novo filme",series38:"Nova série"})[type]||"Novo título";state[type]=Array.isArray(state[type])?state[type]:[];
  state[type].push(type==="books"?{id:cryptoId(),title,status:mediaStatuses(type)[0],progress:0,pagesRead:0,totalPages:0}:{id:cryptoId(),title,status:mediaStatuses(type)[0],progress:0});
  saveState();renderGoals();
}
$("#addBook")?.addEventListener("click",()=>addMedia("books"));
$("#addGame")?.addEventListener("click",()=>addMedia("games"));

function renderCustomGoals(){
  const c=$("#customGoalsList");if(!c)return;
  c.innerHTML=state.customGoals.length?state.customGoals.map(g=>`
    <div class="custom-goal-card" data-custom-goal="${g.id}">
      <input type="text" value="${escapeHTML(g.title)}" data-custom-title>
      <input type="range" min="0" max="100" value="${Number(g.progress)||0}" data-custom-progress>
      <footer><span>${Number(g.progress)||0}%</span><button class="goal-delete" data-custom-delete>×</button></footer>
    </div>`).join(""):`<p class="note">Nenhuma meta livre ainda. Use “+ meta” para criar.</p>`;
  $$("[data-custom-goal]",c).forEach(card=>{
    const g=state.customGoals.find(x=>x.id===card.dataset.customGoal);
    card.querySelector("[data-custom-title]").addEventListener("input",e=>{g.title=e.target.value;saveState()});
    card.querySelector("[data-custom-progress]").addEventListener("input",e=>{const prev=Number(g.progress||0);g.progress=Number(e.target.value);card.querySelector("footer span").textContent=`${g.progress}%`;logGoalTransition(g,"custom",prev,card);saveState()});
    card.querySelector("[data-custom-delete]").addEventListener("click",()=>{state.customGoals=state.customGoals.filter(x=>x.id!==g.id);saveState();renderCustomGoals()});
  });
}
$("#addCustomGoal")?.addEventListener("click",()=>{
  state.customGoals.push({id:cryptoId(),title:"Nova meta",progress:0});saveState();renderCustomGoals();
});
function renderGoals(){
  renderMediaList("books","#booksList");renderMediaList("games","#gamesList");renderMediaList("films38","#filmsList38");renderMediaList("series38","#seriesList38");renderCustomGoals();
}


/* =========================================================
   V11 — HÁBITOS
   ========================================================= */
function renderHabits(){
  if(!$("#habitWaterValue"))return;
  const d=ensureDay(), week=weekBounds();
  $("#habitWaterValue").textContent=Number(d.waterCups)||0;
  $("#habitWalkValue").textContent=Number(d.walkMinutes)||0;
  $("#habitProtein49").textContent=Number(d.proteinMeals49)||0; const legacy49=$("#proteinLegacy49");legacy49.hidden=!Number(d.eggs);legacy49.textContent=`Histórico anterior: ${Number(d.eggs)||0} ovo(s) registrado(s).`;
  $("#habitMeditatedValue").textContent=d.meditated?"sim":"não";
  $("#toggleMeditated").textContent=d.meditated?"desmarcar":"marcar como feita";
  const weekDays=week.map(x=>[x,state.days[x]||{}]);
  $("#habitWeekWater").textContent=weekDays.reduce((a,[,x])=>a+(Number(x.waterCups)||0),0);
  $("#habitWeekWalk").textContent=weekDays.reduce((a,[,x])=>a+(Number(x.walkMinutes)||0),0);
  $("#habitWeekPages").textContent=weekDays.reduce((a,[,x])=>a+(Number(x.pagesRead)||0),0);
  $("#habitWeekMeditation").textContent=weekDays.reduce((a,[,x])=>a+(x.meditated?1:0),0);
  const sel=$("#habitBookSelect");
  if(sel){
    const options36=(state.books||[]).map(b=>`<option value="${b.id}" ${d.readingBookId===b.id?"selected":""}>${escapeHTML(b.title)}</option>`).join("");
    if(sel.dataset.options36!==options36&&document.activeElement!==sel){sel.innerHTML=options36;sel.dataset.options36=options36;}
    if(d.readingBookId&&document.activeElement!==sel)sel.value=d.readingBookId;
    const chosen=state.books.find(b=>b.id===sel.value)||state.books[0];
    if(chosen){
      if(!d.readingBookId)d.readingBookId=chosen.id;
      $("#bookTotalPagesInput").value=Number(chosen.totalPages)||"";
      const pct=Number(chosen.progress)||0;
      $("#readingFeedback").textContent=chosen.totalPages?`${chosen.pagesRead||0} de ${chosen.totalPages} páginas · ${pct}% concluído`:"Informe o total de páginas deste livro.";
    }
  }
  $("#punchSummary").textContent=[d.punchIn,d.lunchOut,d.lunchIn,d.punchOut].filter(Boolean).length===4
    ?`Entrada ${d.punchIn} · almoço ${d.lunchOut} · retorno ${d.lunchIn} · saída ${d.punchOut}`
    :"Registre os quatro horários.";
  $("#habitWeekHistory").innerHTML=weekDays.map(([date,x])=>`<div class="habit-day ${date===activeDate?"today":""}"><b>${formatDateBR(date)}</b><span>${Number(x.waterCups)||0} copos</span><span>${Number(x.walkMinutes)||0} min caminhada</span><span>${Number(x.pagesRead)||0} pág.</span><span>${x.meditated?"meditação ✓":"meditação —"}</span></div>`).join("");
}
$$("[data-habit-step]").forEach(btn=>btn.addEventListener("click",()=>{
  const d=ensureDay(),key=btn.dataset.habitStep,delta=Number(btn.dataset.delta||0);
  d[key]=Math.max(0,(Number(d[key])||0)+delta);saveState();renderHabits();renderToday();
}));
$("#addWalkMinutes")?.addEventListener("click",()=>{const v=Math.max(0,Number($("#walkMinutesInput").value||0));if(!v)return;const d=ensureDay();d.walkMinutes=(Number(d.walkMinutes)||0)+v;$("#walkMinutesInput").value="";saveState();renderHabits();renderToday();});
$("#toggleMeditated")?.addEventListener("click",()=>{const d=ensureDay();d.meditated=!d.meditated;saveState();renderHabits();renderToday();});
$("#habitBookSelect")?.addEventListener("change",e=>{const d=ensureDay();d.readingBookId=e.target.value;saveState();renderHabits();});
$("#bookTotalPagesInput")?.addEventListener("change",()=>{const id=$("#habitBookSelect").value,b=state.books.find(x=>x.id===id);if(!b)return;const prev=Number(b.progress||0);b.totalPages=Math.max(0,Number($("#bookTotalPagesInput").value||0));syncBookProgress(b);logGoalTransition(b,"books",prev,$("#readingFeedback")?.closest("article"));saveState();renderHabits();renderGoals();});
$("#registerReading")?.addEventListener("click",()=>{
  const id=$("#habitBookSelect").value,b=state.books.find(x=>x.id===id),pages=Math.max(0,Number($("#pagesReadInput").value||0));
  if(!b)return toast("Selecione um livro."); if(!pages)return toast("Informe quantas páginas leu.");
  const total=Math.max(0,Number($("#bookTotalPagesInput").value||b.totalPages||0)); if(total)b.totalPages=total;
  const prev=Number(b.progress||0);b.pagesRead=(Number(b.pagesRead)||0)+pages;syncBookProgress(b);logGoalTransition(b,"books",prev,$("#readingFeedback")?.closest("article"));
  const d=ensureDay();d.pagesRead=(Number(d.pagesRead)||0)+pages;d.readingBookId=id;
  $("#pagesReadInput").value="";saveState();renderHabits();renderGoals();renderToday();toast("Leitura registrada.",`${pages} páginas · ${b.progress}% do livro`);
});


/* =========================================================
   V12 — ROTINA SINCRONIZADA COM O RELÓGIO DO SISTEMA
   ========================================================= */
function routineDayLabels(days){const n=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];return (days||[]).map(d=>n[Number(d)]).join(" · ")}
function routineItems(){return (state.reminders||[]).filter(r=>r.routine)}
function routineDateActive(r,dateISO){
  if(r.startDate && dateISO<r.startDate)return false;
  if(r.endDate && dateISO>r.endDate)return false;
  return true;
}
function routineRangeLabel(r){
  const a=r.startDate?formatDateBR(r.startDate):"sem início";
  const b=r.endDate?formatDateBR(r.endDate):"sem fim";
  return `${a} → ${b}`;
}
function renderRoutine(){
  const c=$("#routineList"); if(!c)return;
  const items=routineItems().slice().sort((a,b)=>(a.time||"").localeCompare(b.time||""));
  c.innerHTML=items.length?items.map(r=>`<div class="routine-row" data-routine-id="${r.id}">
    <time>${escapeHTML(r.time||"--:--")}</time>
    <div><b>${escapeHTML(r.title||"Rotina")}</b><small>${routineDayLabels(r.days)}</small></div>
    <span class="routine-tag">${escapeHTML(r.routineType||"pessoal")}${Number(r.leadMinutes||0)>0?` · ${Number(r.leadMinutes)} min antes`:''}</span>
    <span class="routine-date-range">${routineRangeLabel(r)}</span>
    <button class="toggle ${r.enabled?"on":""}" data-routine-toggle aria-label="Ativar/desativar"></button>
    <button class="routine-delete" data-routine-delete>excluir</button>
  </div>`).join(""):`<div class="history-row"><span>—</span><b>Nenhum horário definido.</b><i></i></div>`;
  $$("[data-routine-id]",c).forEach(row=>{
    const r=state.reminders.find(x=>x.id===row.dataset.routineId); if(!r)return;
    row.querySelector("[data-routine-toggle]").addEventListener("click",()=>{r.enabled=!r.enabled;saveState();renderRoutine();renderReminders();renderRoutineNow()});
    row.querySelector("[data-routine-delete]").addEventListener("click",()=>{state.reminders=state.reminders.filter(x=>x.id!==r.id);saveState();renderRoutine();renderReminders();renderRoutineNow()});
  });
}
function addRoutineItem(title,time,days,type="personal",leadMinutes=0,startDate="",endDate=""){
  if(!title||!time||!days?.length)return false;
  state.reminders.push({id:cryptoId(),title,time,days:[...days].map(Number).sort(),enabled:true,lastFired:"",routine:true,routineType:type,leadMinutes:Number(leadMinutes||0),startDate:startDate||activeDate,endDate:endDate||""});
  saveState();renderRoutine();renderReminders();renderRoutineNow();return true;
}
$$("[data-routine-day]").forEach(btn=>btn.addEventListener("click",()=>{
  const d=Number(btn.dataset.routineDay);
  if(selectedRoutineDays.has(d))selectedRoutineDays.delete(d); else selectedRoutineDays.add(d);
  btn.classList.toggle("selected",selectedRoutineDays.has(d));
}));
$("#addRoutine")?.addEventListener("click",()=>{
  const title=$("#routineTitle").value.trim(),time=$("#routineTime").value,type=$("#routineType").value||"personal",leadMinutes=Number($("#routineLead")?.value||0);
  const startDate=$("#routineStartDate")?.value||activeDate,endDate=$("#routineEndDate")?.value||"";
  if(endDate&&startDate&&endDate<startDate)return toast("Confira o período.","A data final não pode ser anterior à inicial.");
  if(!title||!time||!selectedRoutineDays.size)return toast("Complete a rotina.","Informe atividade, horário e pelo menos um dia.");
  addRoutineItem(title,time,[...selectedRoutineDays],type,leadMinutes,startDate,endDate);
  $("#routineTitle").value="";$("#routineTime").value="";if($("#routineStartDate"))$("#routineStartDate").value=activeDate;if($("#routineEndDate"))$("#routineEndDate").value="";
  selectedRoutineDays.clear();$$("[data-routine-day]").forEach(b=>b.classList.remove("selected"));toast("Rotina sincronizada.",`${time} · ${formatDateBR(startDate)}${endDate?` até ${formatDateBR(endDate)}`:" em diante"}.`);
});
$$(".routine-template").forEach(btn=>btn.addEventListener("click",()=>{
  $("#routineTitle").value=btn.dataset.routineTitle||"";
  $("#routineTime").value=btn.dataset.routineTime||"";
  $("#routineType").value=btn.dataset.routineType||"personal";if($("#routineLead"))$("#routineLead").value=btn.dataset.routineLead||"0";
  if($("#routineStartDate"))$("#routineStartDate").value=activeDate;
  if($("#routineEndDate"))$("#routineEndDate").value="";
  selectedRoutineDays=new Set((btn.dataset.routineDays||"").split(",").filter(Boolean).map(Number));
  $$("[data-routine-day]").forEach(b=>b.classList.toggle("selected",selectedRoutineDays.has(Number(b.dataset.routineDay))));
}));
function nextRoutineOccurrence(now=new Date()){
  const items=routineItems().filter(r=>r.enabled&&r.time&&Array.isArray(r.days)&&r.days.length);
  let best=null;
  for(const r of items){
    const [hh,mm]=(r.time||"00:00").split(":").map(Number);
    for(let add=0;add<32;add++){
      const d=new Date(now);d.setHours(0,0,0,0);d.setDate(d.getDate()+add);
      const iso=localISO(d);
      if(!routineDateActive(r,iso))continue;
      if(!r.days.map(Number).includes(d.getDay()))continue;
      d.setHours(hh||0,mm||0,0,0);
      if(d<=now)continue;
      if(!best||d<best.when)best={item:r,when:d};
      break;
    }
  }
  return best;
}
function currentRoutineOccurrence(now=new Date()){
  const iso=localISO(now),minute=now.getHours()*60+now.getMinutes();
  const items=routineItems().filter(r=>r.enabled&&routineDateActive(r,iso)&&r.days?.map(Number).includes(now.getDay()));
  for(const r of items){
    const [hh,mm]=(r.time||"00:00").split(":").map(Number),target=(hh||0)*60+(mm||0);
    if(minute>=target&&minute<target+5)return {item:r,when:new Date(now.getFullYear(),now.getMonth(),now.getDate(),hh||0,mm||0)};
  }
  return null;
}
function renderRoutineNow(){
  const now=new Date(), clock=now.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
  if($("#routineClock"))$("#routineClock").textContent=clock;
  if($("#routineLiveClock"))$("#routineLiveClock").textContent=now.toLocaleTimeString("pt-BR");
  const current=currentRoutineOccurrence(now),next=nextRoutineOccurrence(now),show=current||next;
  if($("#routineNextTitle"))$("#routineNextTitle").textContent=show?show.item.title:"Nenhum próximo item.";
  if($("#routineNextTime"))$("#routineNextTime").textContent=show?`${current?"agora":show.when.toLocaleDateString("pt-BR",{weekday:"short"})+" · "+show.item.time}`:"Defina sua rotina em Hábitos.";

  if($("#globalRoutineClock"))$("#globalRoutineClock").textContent=clock;
  if($("#globalRoutineMode"))$("#globalRoutineMode").textContent=current?"AGORA":"PRÓXIMO";
  if($("#globalRoutineTitle"))$("#globalRoutineTitle").textContent=show?show.item.title:"Nenhum horário próximo.";
  if($("#globalRoutineWhen"))$("#globalRoutineWhen").textContent=show?(current?`${show.item.time} · ${routineRangeLabel(show.item)}`:`${show.when.toLocaleDateString("pt-BR",{weekday:"short",day:"2-digit",month:"2-digit"})} · ${show.item.time}`):"Defina sua rotina em Hábitos.";
  if($("#globalRoutineProgress")){
    let pct=0;
    if(current)pct=100;
    else if(next){const mins=(next.when-now)/60000;pct=mins<=60?Math.max(4,100-(mins/60*100)):4}
    $("#globalRoutineProgress").style.width=`${pct}%`;
  }
}
setInterval(()=>renderRoutineNow(),1000);
renderRoutineNow();
$("#globalRoutineStrip")?.addEventListener("click",()=>showView("habits"));
if($("#routineStartDate"))$("#routineStartDate").value=activeDate;

