/* reminders */
function cryptoId(){return (crypto&&crypto.randomUUID)?crypto.randomUUID():`${Date.now()}-${Math.random().toString(16).slice(2)}`}
$$(".days-picker button").forEach(btn=>btn.addEventListener("click",()=>{
  const d=Number(btn.dataset.daynum);
  if(selectedReminderDays.has(d))selectedReminderDays.delete(d);else selectedReminderDays.add(d);
  btn.classList.toggle("selected",selectedReminderDays.has(d));
}));
$(".reminder-template")?.addEventListener?.("click",()=>{});
$$(".reminder-template").forEach(btn=>btn.addEventListener("click",()=>{
  $("#reminderTitle").value=btn.dataset.title;
  $("#reminderTime").value=btn.dataset.time;
  selectedReminderDays=new Set(btn.dataset.days.split(",").map(Number));
  $$(".days-picker button").forEach(b=>b.classList.toggle("selected",selectedReminderDays.has(Number(b.dataset.daynum))));
}));
$("#addReminder").addEventListener("click",()=>{
  const title=$("#reminderTitle").value.trim(), time=$("#reminderTime").value;
  if(!title||!time||!selectedReminderDays.size)return toast("Complete o lembrete.","Texto, horário e pelo menos um dia.");
  state.reminders.push({id:cryptoId(),title,time,days:[...selectedReminderDays].sort(),enabled:true,lastFired:""});
  $("#reminderTitle").value="";$("#reminderTime").value="";selectedReminderDays.clear();$$(".days-picker button").forEach(b=>b.classList.remove("selected"));
  saveState();renderReminders();toast("Lembrete criado.");
});
function dayLabels(days){const n=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];return days.map(d=>n[d]).join(" · ")}
function renderReminders(){
  const c=$("#remindersList");
  c.innerHTML=state.reminders.length?state.reminders.slice().sort((a,b)=>a.time.localeCompare(b.time)).map(r=>`
    <div class="reminder-row">
      <time>${escapeHTML(r.time)}</time>
      <div><p>${escapeHTML(r.title)}</p><small>${dayLabels(r.days)}</small></div>
      <button class="toggle ${r.enabled?"on":""}" data-toggle-reminder="${r.id}" aria-label="Ativar/desativar"></button>
      <button class="delete-reminder" data-delete-reminder="${r.id}">excluir</button>
    </div>`).join(""):`<div class="history-row"><span>—</span><b>Nenhum lembrete criado.</b><i></i></div>`;
  $$("[data-toggle-reminder]").forEach(b=>b.addEventListener("click",()=>{
    const r=state.reminders.find(x=>x.id===b.dataset.toggleReminder);if(r){r.enabled=!r.enabled;saveState();renderReminders()}
  }));
  $$("[data-delete-reminder]").forEach(b=>b.addEventListener("click",()=>{
    state.reminders=state.reminders.filter(x=>x.id!==b.dataset.deleteReminder);saveState();renderReminders()
  }));
}
function notificationSupported(){return "Notification" in window}
function updateNotificationStatus(){
  const el=$("#notificationStatus");
  if(!notificationSupported()){el.textContent="Este navegador não oferece notificações do sistema neste modo.";return}
  el.textContent=Notification.permission==="granted"?"Notificações do sistema: ativas":Notification.permission==="denied"?"Notificações do sistema: bloqueadas":"Notificações do sistema: aguardando permissão";
}
$("#requestNotifications").addEventListener("click",async()=>{
  if(!notificationSupported()) return toast("Notificação do sistema indisponível.","Os avisos internos continuam funcionando.");
  try{
    const p=await Notification.requestPermission();updateNotificationStatus();
    toast(p==="granted"?"Notificações ativadas.":"Permissão não concedida.");
  }catch(e){toast("Não foi possível ativar.","Use os avisos internos do aplicativo.");}
});
async function notifySystem(title,body){
  try{
    const native=await nativeJSON('/api/system/status');
    if(native?.nativeNotifications){await nativeJSON('/api/system/notify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,body})});return;}
  }catch(e){}
  try{if(notificationSupported()&&Notification.permission==="granted")new Notification(title,{body});}catch(e){}
}
function checkReminders(){
  const now=new Date(), day=now.getDay(), hh=String(now.getHours()).padStart(2,"0"), mm=String(now.getMinutes()).padStart(2,"0");
  const stamp=`${localISO(now)}-${hh}:${mm}`;
  state.reminders.forEach(r=>{
    if(r.enabled&&r.days.includes(day)&&r.time===`${hh}:${mm}`&&r.lastFired!==stamp){
      r.lastFired=stamp;toast(r.title,`Lembrete · ${r.time}`);notifySystem("MyWay",r.title);saveState();
    }
  });
}
setInterval(checkReminders,15000);

/* export/import */
function download(name,text,type="application/json"){
  const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
$("#exportBackup").addEventListener("click",()=>download(`MyWay-backup-${todayISO()}.json`,JSON.stringify(state,null,2)));
$("#importBackup").addEventListener("change",async e=>{
  const file=e.target.files?.[0];if(!file)return;
  try{
    const parsed=JSON.parse(await file.text());
    if(!parsed||typeof parsed!=="object"||!parsed.settings||!parsed.days)throw new Error();
    if(!await askConfirmation("Substituir os dados atuais pelo backup selecionado? Exporte um backup antes de continuar.","Importar backup"))return;
    state={...deepClone(DEFAULT_STATE),...parsed,settings:{...deepClone(DEFAULT_STATE.settings),...(parsed.settings||{})},account:{...deepClone(DEFAULT_STATE.account),...(parsed.account||{})},days:parsed.days||{},studySessions:parsed.studySessions||[],bankEvents:parsed.bankEvents||[],financeEvents:parsed.financeEvents||[],financeFixedExpenses:parsed.financeFixedExpenses||[],financeTransactions:parsed.financeTransactions||[],financeDebts:parsed.financeDebts||[],journalEntries:parsed.journalEntries||[],savedProperties:parsed.savedProperties||[],goalEvents:parsed.goalEvents||[],monthlyReports:parsed.monthlyReports||[],reminders:parsed.reminders||[],notes:parsed.notes||[],relationshipsWeddingPlans:parsed.relationshipsWeddingPlans||[],relationshipsIdeas:parsed.relationshipsIdeas||[],relationshipsTrips:parsed.relationshipsTrips||[],relationshipsPhotoOrder:parsed.relationshipsPhotoOrder||[],pucCourses:parsed.pucCourses||deepClone(DEFAULT_STATE.pucCourses),pucTrackModules:parsed.pucTrackModules||deepClone(DEFAULT_STATE.pucTrackModules),nvResearchFavorites:parsed.nvResearchFavorites||[],nvInsights:parsed.nvInsights||[],inspirationPins:parsed.inspirationPins||[],inspirationBoards:parsed.inspirationBoards?.length?parsed.inspirationBoards:deepClone(DEFAULT_STATE.inspirationBoards),inspirationTaste:{...deepClone(DEFAULT_STATE.inspirationTaste),...(parsed.inspirationTaste||{}),interestScores:{...(parsed.inspirationTaste?.interestScores||{})},termScores:{...(parsed.inspirationTaste?.termScores||{})},domainScores:{...(parsed.inspirationTaste?.domainScores||{})},dismissed:parsed.inspirationTaste?.dismissed||[],actions:parsed.inspirationTaste?.actions||[]},books:parsed.books||deepClone(DEFAULT_STATE.books),games:parsed.games||deepClone(DEFAULT_STATE.games),customGoals:parsed.customGoals||[],englishSessions:parsed.englishSessions||[],englishXP:Number(parsed.englishXP||0),meditationProgress:parsed.meditationProgress||{},wellnessPractices:parsed.wellnessPractices||[],nvContent:parsed.nvContent||[],nvAnalytics:{...deepClone(DEFAULT_STATE.nvAnalytics),...(parsed.nvAnalytics||{})},meta:{...deepClone(DEFAULT_STATE.meta),...(parsed.meta||{})}};
    saveState();location.reload();
  }catch(err){toast("Backup inválido.","Não foi possível ler esse arquivo.");}
});
$("#resetAll").addEventListener("click",async()=>{
  if(!await askConfirmation("Apagar TODO o histórico do MyWay neste navegador?","Continuar"))return;
  if(!await askConfirmation("Última confirmação: essa ação não pode ser desfeita sem um backup.","Apagar histórico"))return;
  localStorage.removeItem(STORAGE_KEY);for(const key of LEGACY_STORAGE_KEYS)localStorage.removeItem(key);location.reload();
});
$("#exportMonthCsv").addEventListener("click",()=>{
  const ym=$("#reportMonth").value||monthKey(todayISO()), rows=[["data","chegada","atraso_min","estudo_min","retornos","energia","vontade_fuga","acao_saida","agua_copos","caminhada_min","paginas_lidas","refeicoes_com_proteina","ovos_historico","meditou","ponto_entrada","almoco_saida","almoco_retorno","ponto_saida"]];
  monthEntries(ym).forEach(([date,d])=>{
    const delay=d.arrivalTime?parseTime(d.arrivalTime)-parseTime(state.settings.workStart):"";
    rows.push([date,d.arrivalTime||"",delay,Number(d.studyMinutes)||0,Number(d.returns)||0,d.energy||"",d.escapeUrge||"",d.careerAction?1:0,Number(d.waterCups)||0,Number(d.walkMinutes)||0,Number(d.pagesRead)||0,Number(d.proteinMeals49)||0,Number(d.eggs)||0,d.meditated?1:0,d.punchIn||"",d.lunchOut||"",d.lunchIn||"",d.punchOut||""]);
  });
  const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(";")).join("\n");
  download(`MyWay-${ym}.csv`,"\uFEFF"+csv,"text/csv;charset=utf-8");
});

/* report month */
$("#reportMonth").value=monthKey(todayISO());
$("#reportMonth").addEventListener("change",renderReports);

/* storage */
function updateStorageInfo(snapshot=saveSnapshot40){
  const n=Object.keys(state.days).length;
  const bytes=new Blob([snapshot||JSON.stringify(state)]).size;
  if($("#storageCount"))$("#storageCount").textContent=`${n} dia${n===1?"":"s"} registrado${n===1?"":"s"}.`;
  if($("#storageInfo"))$("#storageInfo").textContent=`Aproximadamente ${(bytes/1024).toFixed(1)} KB armazenados localmente. Última gravação: ${new Date(state.meta.updatedAt).toLocaleString("pt-BR")}.`;
}

/* reveal */
function revealVisible(){
  $$(".reveal").forEach((el,i)=>{
    if(!el.dataset.revealBound){
      el.dataset.revealBound="1";
      setTimeout(()=>el.classList.add("visible"),Math.min(i*45,260));
    }else el.classList.add("visible");
  });
}

/* master render */

/* =========================================================
   V29 — PRODUCT POLISH / ADHD / STUDY TOOLKIT / INTEGRATIONS
   ========================================================= */
function normalizeV29Product(){
  state.meta=state.meta||{};state.flashcards=Array.isArray(state.flashcards)?state.flashcards:[];state.studyYoutube=Array.isArray(state.studyYoutube)?state.studyYoutube:[];state.wellnessPractices=Array.isArray(state.wellnessPractices)?state.wellnessPractices:[];
  if(state.settings.sidebarAutoCollapse===undefined)state.settings.sidebarAutoCollapse=true;if(state.settings.sidebarPinned===undefined)state.settings.sidebarPinned=false;if(state.settings.tutorialSeen===undefined)state.settings.tutorialSeen=false;
  for(const d of Object.values(state.days||{})){if(!Array.isArray(d.distractions))d.distractions=[];if(d.studyPomodoros==null)d.studyPomodoros=0;}
  if(!state.meta.productV31Migrated){state.meta.productV31Migrated=true;state.version=31;localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
}


function normalizeV32Product(){
  state.financeFixedExpenses=Array.isArray(state.financeFixedExpenses)?state.financeFixedExpenses:[];
  state.financeTransactions=Array.isArray(state.financeTransactions)?state.financeTransactions:[];
  state.financeDebts=Array.isArray(state.financeDebts)?state.financeDebts:[];
  state.journalEntries=Array.isArray(state.journalEntries)?state.journalEntries:[];
  if(state.settings.featureFinance===undefined)state.settings.featureFinance=true;
  if(state.settings.featureJournal===undefined)state.settings.featureJournal=true;
  if(state.settings.salaryHasAdvance===undefined)state.settings.salaryHasAdvance=Number(state.settings.salaryAdvance||0)>0;
  if(state.settings.salaryAdvanceDay===undefined)state.settings.salaryAdvanceDay=15;
  if(state.settings.salarySecondDay===undefined)state.settings.salarySecondDay=30;
  if(state.settings.cashBalance===undefined)state.settings.cashBalance=0;
  if(state.settings.financeSavePercent===undefined)state.settings.financeSavePercent=20;
  if(state.settings.financeEmergencyMonths===undefined)state.settings.financeEmergencyMonths=6;
  if(state.settings.careCity===undefined)state.settings.careCity="";
  if(state.settings.careUF===undefined)state.settings.careUF="";
  if(!state.financeFixedExpenses.length){
    const legacy=[['Claro',state.settings.claroMonthly],['Estudos',state.settings.pucMonthly],['Transporte',state.settings.transportMonthly]];
    legacy.forEach(([name,value])=>{if(Number(value||0)>0)state.financeFixedExpenses.push({id:cryptoId(),name,amount:Number(value),day:1,active:true})});
  }
  state.meta=state.meta||{};
  if(!state.meta.productV32Migrated){state.meta.productV32Migrated=true;state.version=32;localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
}

