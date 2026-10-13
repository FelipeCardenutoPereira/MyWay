/* Relacionamentos vault: encrypted at rest by native MyWay.exe */
async function refreshAnaVault(){
  if(!$("#relationshipsVaultStatus"))return;
  const s=await nativeJSON("/api/relationships/vault/status");
  if(!s){$("#relationshipsVaultStatus").textContent="disponível apenas no MyWay.exe";$("#relationshipsVaultSetup").hidden=true;$("#relationshipsVaultUnlock").hidden=true;$("#relationshipsVaultOpen").hidden=true;return}
  $("#relationshipsVaultStatus").textContent=s.unlocked?`desbloqueado · ${s.count||0} vídeo(s)`:s.configured?"bloqueado":"não configurado";
  $("#relationshipsVaultSetup").hidden=!!s.configured;
  $("#relationshipsVaultUnlock").hidden=!s.configured||!!s.unlocked;
  $("#relationshipsVaultOpen").hidden=!s.unlocked;
  if(s.unlocked)renderRelationshipsVaultList(s.files||[]);
}
$("#relationshipsVaultCreate")?.addEventListener("click",async()=>{
  const a=$("#relationshipsVaultNewPin").value,b=$("#relationshipsVaultNewPin2").value;
  if(a.length<4)return toast("Use um PIN com pelo menos 4 caracteres.");
  if(a!==b)return toast("Os PINs não conferem.");
  const r=await nativeJSON("/api/relationships/vault/setup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin:a})});
  $("#relationshipsVaultNewPin").value="";$("#relationshipsVaultNewPin2").value="";
  if(!r?.ok)return toast("Não foi possível criar o cofre.",r?.error||"");
  toast("Cofre criado.");refreshAnaVault();
});
$("#relationshipsVaultUnlockBtn")?.addEventListener("click",async()=>{
  const pin=$("#relationshipsVaultPin").value;const r=await nativeJSON("/api/relationships/vault/unlock",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin})});
  $("#relationshipsVaultPin").value="";
  if(!r?.ok)return toast("PIN incorreto ou cofre indisponível.");
  refreshAnaVault();
});
$("#relationshipsVaultLock")?.addEventListener("click",async()=>{await nativeJSON("/api/relationships/vault/lock",{method:"POST"});const v=$("#relationshipsVaultPlayer");v.pause();v.removeAttribute("src");v.load();refreshAnaVault()});
async function uploadAnaVaultFiles(files){
  if(!files?.length)return;
  for(const file of [...files]){
    const fd=new FormData();fd.append("file",file,file.name);
    const st=$("#relationshipsVaultStatus");st.textContent=`criptografando ${file.name}...`;
    try{
      const r=await fetch("/api/relationships/vault/upload",{method:"POST",body:fd});
      if(!r.ok){toast("Falha ao adicionar vídeo.",file.name);break}
    }catch(e){toast("Falha ao adicionar vídeo.",file.name);break}
  }
  refreshAnaVault();
}
$("#relationshipsVaultFiles")?.addEventListener("change",e=>{uploadAnaVaultFiles(e.target.files);e.target.value=""});
$("#relationshipsVaultDrop")?.addEventListener("dragover",e=>{e.preventDefault();e.currentTarget.classList.add("drag")});
$("#relationshipsVaultDrop")?.addEventListener("dragleave",e=>e.currentTarget.classList.remove("drag"));
$("#relationshipsVaultDrop")?.addEventListener("drop",e=>{e.preventDefault();e.currentTarget.classList.remove("drag");uploadAnaVaultFiles(e.dataTransfer.files)});
function renderRelationshipsVaultList(files){
  const c=$("#relationshipsVaultList");if(!c)return;
  c.innerHTML=files.length?files.map(f=>`<div class="vault-item" data-vault-id="${f.id}"><div><b>${escapeHTML(f.name)}</b><small>${(Number(f.size||0)/1048576).toFixed(1)} MB · ${f.created?new Date(f.created).toLocaleDateString("pt-BR"):""}</small></div><button data-vault-delete>excluir</button></div>`).join(""):`<div class="vault-item"><div><b>Cofre vazio</b><small>Adicione vídeos acima.</small></div></div>`;
  $$("[data-vault-id]",c).forEach(row=>{
    const id=row.dataset.vaultId;
    row.addEventListener("click",e=>{if(e.target.closest("[data-vault-delete]"))return;const wrap=$(".vault-player-wrap");const v=$("#relationshipsVaultPlayer");v.src=`/api/relationships/vault/file?id=${encodeURIComponent(id)}&t=${Date.now()}`;wrap.classList.add("has-video");v.play().catch(()=>{})});
    row.querySelector("[data-vault-delete]")?.addEventListener("click",async()=>{if(!await askConfirmation("Excluir este vídeo do cofre?","Excluir vídeo"))return;await nativeJSON(`/api/relationships/vault/delete?id=${encodeURIComponent(id)}`,{method:"POST"});refreshAnaVault()});
  });
}


/* =========================================================
   V4 — ENGLISH LAB
   ========================================================= */
const ENGLISH_LEVELS={
  A1:{name:"Básico",road:["frases de apresentação e rotina","verb to be / simple present","vocabulário de casa, trabalho e tempo"]},
  A2:{name:"Elementar",road:["passado e futuro básicos","comparações e frequência","conversas curtas do cotidiano"]},
  B1:{name:"Intermediário",road:["explicar opiniões e experiências","present perfect / conditionals básicos","leitura de textos curtos sem tradução palavra por palavra"]},
  B2:{name:"Intermediário alto",road:["argumentação profissional","phrasal verbs e collocations","e-mails, apresentações e textos mais longos"]},
  C1:{name:"Avançado",road:["nuance, registro e precisão","síntese e argumentação complexa","vocabulário profissional e leitura literária"]}
};
const ENGLISH_BANK={
  A1:[
    {type:"VOCABULARY",instruction:"Traduza para o inglês.",prompt:"Eu trabalho com marketing.",answer:"I work in marketing."},
    {type:"GRAMMAR",instruction:"Complete com am / is / are.",prompt:"I ___ tired, but I ___ ready to study.",answer:"I am tired, but I am ready to study."},
    {type:"WRITING",instruction:"Responda em 2 frases simples em inglês.",prompt:"What do you do after work?",answer:"Example: I go home after work. I study for my postgraduate course."}
  ],
  A2:[
    {type:"GRAMMAR",instruction:"Escolha o tempo verbal adequado.",prompt:"Right now, I ___ (study) English. I usually ___ (study) at night.",answer:"Right now, I am studying English. I usually study at night."},
    {type:"VOCABULARY",instruction:"Reescreva em inglês natural.",prompt:"Eu quero economizar dinheiro para comprar uma casa.",answer:"I want to save money to buy a house."},
    {type:"WRITING",instruction:"Escreva 3 frases sobre sua rotina durante a semana.",prompt:"Describe your weekday routine.",answer:"Example: I start work in the morning. I get home in the evening. On Wednesdays, I attend a live class."}
  ],
  B1:[
    {type:"READING",instruction:"Responda em inglês.",prompt:"A student decided to study for only twenty-five minutes because a smaller task felt easier to start. Why did the student choose a short session?",answer:"The student chose a short session because it felt easier to start and reduced the pressure of studying for a long time."},
    {type:"GRAMMAR",instruction:"Complete com uma conditional adequada.",prompt:"If I finish my work earlier, I ___ (study) for thirty minutes.",answer:"If I finish my work earlier, I will study for thirty minutes."},
    {type:"WRITING",instruction:"Explique uma meta profissional em 4–5 linhas.",prompt:"What would you like to change in your career during the next year?",answer:"There is no single correct answer. Use clear reasons, future forms, and linking words such as because, however and therefore."}
  ],
  B2:[
    {type:"PROFESSIONAL",instruction:"Reescreva com tom profissional e natural.",prompt:"Hey, I made the video. Tell me if you want changes.",answer:"Hi, I've finished the video. Please let me know if you'd like any adjustments or if there is anything else I should refine."},
    {type:"VOCABULARY",instruction:"Explique a diferença em inglês.",prompt:"What is the difference between 'efficient' and 'effective'?",answer:"Efficient means achieving a result with minimal waste of time or resources. Effective means successfully producing the intended result."},
    {type:"WRITING",instruction:"Argumente em 5–6 linhas.",prompt:"Can repetitive work reduce motivation even when the employee is technically capable?",answer:"There is no single model answer. Aim for a clear claim, evidence or example, a counterpoint, and a conclusion."}
  ],
  C1:[
    {type:"NUANCE",instruction:"Reescreva de modo mais preciso e sofisticado.",prompt:"My job is boring, so I cannot focus on anything after work.",answer:"The repetitive nature of my job leaves me mentally depleted, which makes it considerably harder to sustain attention on demanding tasks after work."},
    {type:"READING",instruction:"Resuma a ideia em uma frase concisa.",prompt:"Motivation tends to fluctuate, whereas systems can reduce the number of decisions required to begin a task. For people who struggle with task initiation, the practical value of a routine may therefore lie less in inspiration than in lowering friction.",answer:"Reliable routines can be more useful than motivation because they reduce the friction involved in starting tasks."},
    {type:"WRITING",instruction:"Escreva um parágrafo argumentativo com nuance.",prompt:"Is discipline primarily a personality trait or a skill shaped by environment and systems?",answer:"No single answer. Aim for qualification, contrast, precise vocabulary and a coherent conclusion rather than an absolute claim."}
  ]
};
let currentEnglishExercise=null;
function renderEnglish(){
  if(!$("#englishLevelLabel"))return;
  const level=state.settings.englishLevel||"A1", meta=ENGLISH_LEVELS[level];
  $("#englishLevelLabel").textContent=level;$("#englishLevelName").textContent=meta.name;
  $("#englishSessionsCount").textContent=state.englishSessions.length;
  $("#englishXP").textContent=Number(state.englishXP||0);
  const scored=state.englishSessions.filter(s=>s.score!=null);
  const acc=scored.length?(scored.reduce((a,s)=>a+Number(s.score),0)/(scored.length*2))*100:null;
  $("#englishAccuracy").textContent=acc==null?"—":`${Math.round(acc)}%`;
  $$("[data-english-level]").forEach(b=>b.classList.toggle("active",b.dataset.englishLevel===level));
  $("#englishRoadmap").innerHTML=meta.road.map((x,i)=>`<div class="roadmap-row"><b>${String(i+1).padStart(2,"0")}</b><span>${escapeHTML(x)}</span></div>`).join("");
  $("#englishHistory").innerHTML=state.englishSessions.slice().sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,10).map(s=>`<div class="history-row"><span>${formatDateBR(s.date)}</span><b>${escapeHTML(s.type)} · ${s.level}</b><i>${s.score===2?"acertei":s.score===1?"quase":"errei"}</i></div>`).join("")||`<div class="history-row"><span>—</span><b>Nenhum treino registrado ainda.</b><i></i></div>`;
}
$$("[data-english-level]").forEach(b=>b.addEventListener("click",()=>{
  state.settings.englishLevel=b.dataset.englishLevel;
  const select=$('[data-setting="englishLevel"]');if(select)select.value=state.settings.englishLevel;
  saveState();currentEnglishExercise=null;renderEnglish();newEnglishExercise();
}));
function newEnglishExercise(){
  const level=state.settings.englishLevel||"A1", bank=ENGLISH_BANK[level];
  currentEnglishExercise=bank[Math.floor(Math.random()*bank.length)];
  $("#englishExerciseType").textContent=currentEnglishExercise.type;
  $("#englishExerciseLevel").textContent=level;
  $("#englishPrompt").textContent=currentEnglishExercise.prompt;
  $("#englishInstruction").textContent=currentEnglishExercise.instruction;
  $("#englishUserAnswer").value="";
  $("#englishModelAnswer").hidden=true;$("#englishSelfScore").hidden=true;
}
$("#newEnglishExercise")?.addEventListener("click",newEnglishExercise);
$("#showEnglishAnswer")?.addEventListener("click",()=>{
  if(!currentEnglishExercise)return newEnglishExercise();
  $("#englishModelAnswer").textContent=currentEnglishExercise.answer;
  $("#englishModelAnswer").hidden=false;$("#englishSelfScore").hidden=false;
});
$("#speakEnglish")?.addEventListener("click",()=>{
  if(!currentEnglishExercise)return;
  if(!("speechSynthesis" in window))return toast("Leitura em voz alta indisponível.");
  speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(currentEnglishExercise.prompt);u.lang="en-US";u.rate=.9;speechSynthesis.speak(u);
});
$$("[data-english-score]").forEach(b=>b.addEventListener("click",()=>{
  if(!currentEnglishExercise)return;
  const score=Number(b.dataset.englishScore);
  state.englishSessions.push({id:cryptoId(),date:activeDate,level:state.settings.englishLevel||"A1",type:currentEnglishExercise.type,score,createdAt:new Date().toISOString()});
  state.englishXP=Number(state.englishXP||0)+(score===2?10:score===1?5:2);
  saveState();renderEnglish();toast("Treino registrado.",score===2?"+10 XP":score===1?"+5 XP":"+2 XP");newEnglishExercise();
}));


function renderWorkNotes(){
  const c=$("#workQuickNotes");if(!c)return;
  const notes=(state.notes||[]).filter(n=>n.area==="work");
  if($("#workQuickNotesCount"))$("#workQuickNotesCount").textContent=notes.length;
  renderNoteArea(notes,c);
}
$("#workQuickNoteAdd")?.addEventListener("click",()=>{
  const title=$("#workQuickNoteTitle")?.value.trim(),status=$("#workQuickNoteStatus")?.value||"todo";
  if(!title)return toast("Escreva a nota.");
  createNote("work",title,"",false,status,activeDate);
  $("#workQuickNoteTitle").value="";
  renderWorkNotes();
});
$("#workQuickNoteTitle")?.addEventListener("keydown",e=>{if(e.key==="Enter")$("#workQuickNoteAdd")?.click()});

/* =========================================================
   V4 — NOTAS + WIDGET
   ========================================================= */
const NOTE_STATUS={done:"Feito",waiting:"Aguardando",todo:"A Fazer",cancelled:"Cancelado",doing:"Fazendo",attention:"Precisa de Atenção",later:"Sem Pressa / Por Último",tomorrow:"Para Amanhã"};
function statusOptions(current){return Object.entries(NOTE_STATUS).map(([k,v])=>`<option value="${k}" ${k===current?'selected':''}>${v}</option>`).join('');}
function renderNotes(){
  renderWorkKanban35();
  renderDashboardNotes();
  if($("#workQuickNotes")){const workQuick=state.notes.filter(n=>n.area==="work");if($("#workQuickNotesCount"))$("#workQuickNotesCount").textContent=workQuick.length;renderNoteArea(workQuick,$("#workQuickNotes"));}
  if(!$("#workNotes"))return;
  state.notes.forEach(n=>{if(!n.status)n.status='todo'});
  const work=state.notes.filter(n=>n.area==="work"),life=state.notes.filter(n=>n.area==="life"),nv=state.notes.filter(n=>n.area==="channel");
  $("#workNotesCount").textContent=work.length;$("#lifeNotesCount").textContent=life.length;if($("#nvNotesCount"))$("#nvNotesCount").textContent=nv.length;
  renderNoteArea(work,$("#workNotes"));renderNoteArea(life,$("#lifeNotes"));if($("#nvNotesBoard"))renderNoteArea(nv,$("#nvNotesBoard"));
}
function renderNoteArea(notes,container){
  container.innerHTML=notes.length?notes.map(n=>`<article class="note-card" data-note-id="${n.id}" data-status="${n.status||'todo'}"><select class="note-status-select" data-note-status>${statusOptions(n.status||'todo')}</select><div class="note-date-line"><input type="date" value="${escapeHTML(n.dueDate||activeDate)}" data-note-date></div><textarea rows="2" maxlength="160" aria-label="Título da nota" data-note-title>${escapeHTML(n.title||'Sem título')}</textarea><textarea data-note-body>${escapeHTML(n.body||'')}</textarea><footer><button class="pin-note ${n.pinned?'pinned':''}" data-note-pin>${n.pinned?'● FIXADA':'○ FIXAR'}</button><button class="delete-note" data-note-delete>excluir</button></footer></article>`).join(""):`<p class="note">Nenhuma nota aqui ainda.</p>`;
  $$('[data-note-id]',container).forEach(card=>{const n=state.notes.find(x=>x.id===card.dataset.noteId);card.querySelector('[data-note-title]').addEventListener('input',e=>{n.title=e.target.value;saveState()});card.querySelector('[data-note-body]').addEventListener('input',e=>{n.body=e.target.value;saveState()});card.querySelector('[data-note-date]')?.addEventListener('change',e=>{n.dueDate=e.target.value||activeDate;saveState();renderStickyNotes();renderWorkCommand()});card.querySelector('[data-note-status]').addEventListener('change',e=>{const was=n.status;n.status=e.target.value;card.dataset.status=n.status;if(n.status==='done'&&was!=='done')n.completedAt=new Date().toISOString();if(n.status!=='done'&&was==='done')n.completedAt='';saveState();renderStickyNotes();renderWorkCommand()});card.querySelector('[data-note-pin]').addEventListener('click',()=>{n.pinned=!n.pinned;saveState();renderNotes();renderStickyNotes()});card.querySelector('[data-note-delete]').addEventListener('click',()=>{state.notes=state.notes.filter(x=>x.id!==n.id);saveState();renderNotes();renderStickyNotes()});});
}
function createNote(area="life",title="Nova nota",body="",pinned=false,status="todo",dueDate=activeDate){
  state.notes.unshift({id:cryptoId(),area,title,body,pinned,status,dueDate:dueDate||activeDate,createdAt:new Date().toISOString(),completedAt:status==='done'?new Date().toISOString():''});saveState();renderNotes();renderStickyNotes();renderWorkCommand();
}
$("#addNote")?.addEventListener("click",()=>{const title=$("#noteTitle").value.trim()||"Sem título",body=$("#noteBody").value.trim(),area=$("#noteArea").value,status=$("#noteStatus")?.value||'todo',dueDate=$("#noteDate")?.value||activeDate;createNote(area,title,body,false,status,dueDate);$("#noteTitle").value="";$("#noteBody").value="";toast("Nota criada.");});
async function openNotesWidget(){
  const native=await nativeJSON('/api/system/show?target=notes',{method:'POST'});
  if(!native){const base=location.href.split('#')[0];window.open(base+'#sticky','MyWayNotes','width=820,height=520,resizable=yes,scrollbars=no');}
}
$("#openNotesWidget")?.addEventListener("click",openNotesWidget);$("#openNotesWidget2")?.addEventListener("click",openNotesWidget);$("#showNotesFromSystem")?.addEventListener("click",openNotesWidget);
function stickyDateLabel(date){
  if(!date)return "Sem data";
  const [y,m,d]=date.split("-").map(Number),dt=new Date(y,m-1,d);
  const names=["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
  return `${names[dt.getDay()]} ${String(d).padStart(2,"0")}/${String(m).padStart(2,"0")}`;
}
function renderStickyNotes(){
  const c=$("#stickyNotesList");if(!c)return;
  const notes=[...(state.notes||[])].filter(n=>n.area==="work"||n.pinned).sort((a,b)=>(a.dueDate||"").localeCompare(b.dueDate||"")||String(a.createdAt||"").localeCompare(String(b.createdAt||"")));
  if(!notes.length){c.innerHTML=`<div class="sticky-day-group"><div class="sticky-day-title">Hoje</div><div class="sticky-task"><i class="status-dot todo"></i><div class="sticky-note-fields"><input value="" placeholder="Título da nota" disabled><textarea readonly>Use + para criar a primeira tarefa.</textarea></div><span></span></div></div>`;return;}
  const groups={};for(const n of notes){const key=n.dueDate||activeDate;(groups[key]||(groups[key]=[])).push(n)}
  c.innerHTML=Object.entries(groups).map(([date,items])=>`<section class="sticky-day-group"><div class="sticky-day-title">${escapeHTML(stickyDateLabel(date))}</div>${items.map(n=>`<div class="sticky-task" data-sticky-id="${n.id}"><i class="status-dot ${n.status||'todo'}"></i><div class="sticky-note-fields"><input data-sticky-title value="${escapeHTML(n.title||'')}" placeholder="Título da nota"><textarea data-sticky-body placeholder="Detalhes...">${escapeHTML(n.body||'')}</textarea></div><select data-sticky-status>${statusOptions(n.status||'todo')}</select></div>`).join("")}</section>`).join("");
  $$('[data-sticky-id]',c).forEach(row=>{const n=state.notes.find(x=>x.id===row.dataset.stickyId);if(!n)return;
    const title=row.querySelector('[data-sticky-title]'),body=row.querySelector('[data-sticky-body]'),status=row.querySelector('[data-sticky-status]');
    title.addEventListener('input',e=>{n.title=e.target.value;saveState()});
    body.addEventListener('input',e=>{n.body=e.target.value;saveState()});
    status.addEventListener('change',e=>{const was=n.status;n.status=e.target.value;if(n.status==='done'&&was!=='done')n.completedAt=new Date().toISOString();if(n.status!=='done'&&was==='done')n.completedAt='';saveState();renderStickyNotes();renderNotes();renderWorkCommand()});
  });
}
$("#stickyAdd")?.addEventListener("click",()=>{createNote("work","Nova tarefa","",true,"todo");renderStickyNotes()});
$("#stickyMinimize")?.addEventListener("click",()=>nativeWindowAction("minimize"));
$("#stickyClose")?.addEventListener("click",()=>nativeWindowAction("hide"));
$("#stickyDragHandle")?.addEventListener("pointerdown",e=>{if(e.button===0&&!e.target.closest("button,select,input,textarea"))nativeWindowAction("drag")});
function initStickyMode(){
  if(location.hash!=="#sticky")return;
  document.title='MyWay Notes';document.body.classList.add("widget-only");$("#stickyShell").hidden=false;renderStickyNotes();
  let lastRemote="";
  setInterval(async()=>{
    const active=document.activeElement;if(active?.closest?.("#stickyShell")&&active.matches("input,textarea,select"))return;
    const remote=await nativeJSON('/api/state');if(remote?.notes){const signature=JSON.stringify(remote.notes);if(signature!==lastRemote){lastRemote=signature;state.notes=remote.notes;renderStickyNotes();}}
  },2200);
}
window.addEventListener("storage",e=>{if(e.key===STORAGE_KEY){state=loadState();renderNotes();renderStickyNotes();renderAll();}});


/* =========================================================
   V5 — CAPA + INTEGRAÇÃO NATIVA
   ========================================================= */
function renderCover(){const img=$("#coverImage");if(img)img.src=state.settings.coverImage||'assets/cover-default.jpg';}
$("#coverUpload")?.addEventListener('change',e=>{const f=e.target.files?.[0];if(!f)return;const img=new Image(),r=new FileReader();r.onload=()=>img.src=r.result;img.onload=()=>{const maxW=1800,scale=Math.min(1,maxW/img.width),canvas=document.createElement('canvas');canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);state.settings.coverImage=canvas.toDataURL('image/jpeg',.82);saveState();renderCover();};r.readAsDataURL(f);});
$("#coverReset")?.addEventListener('click',()=>{state.settings.coverImage='';saveState();renderCover();});
// Parallax removed in v6 for smoother rendering on Windows and Android.
async function refreshNativeStatus(){
  const s=await nativeJSON('/api/system/status');
  if(!s){if($("#nativeHealth"))$("#nativeHealth").textContent='recursos nativos indisponíveis neste modo';return;}
  if(s.native)document.documentElement.classList.add('native-available');
  const b=$("#startupToggle");if(b)b.classList.toggle('on',!!s.startup);
  if($("#startupStatus"))$("#startupStatus").textContent=s.startup?'inicia com o Windows':'não inicia com o Windows';
  if($("#nativeHealth"))$("#nativeHealth").textContent=s.native?'processo nativo conectado · bandeja ativa · dados persistentes':'modo navegador';
  if($("#permTray"))$("#permTray").textContent=s.tray?'ativo':'indisponível';
  if($("#permStartup"))$("#permStartup").textContent=s.startup?'ativo':'desativado';
  if($("#permNativeNotify"))$("#permNativeNotify").textContent=s.nativeNotifications?(s.notificationsEnabled?'ativas':'desativadas'):'indisponível';
  refreshWindowsNotifications();
  if($("#permImporter"))$("#permImporter").textContent=s.propertyImporter?'disponível':'indisponível';
  if($("#controlStartupToggle"))$("#controlStartupToggle").classList.toggle("on",!!s.startup);
  if($("#controlNotificationsToggle"))$("#controlNotificationsToggle").classList.toggle("on",!!s.notificationsEnabled);
  if($("#controlNotesStartupToggle"))$("#controlNotesStartupToggle").classList.toggle("on",!!s.openNotesAtStartup);
  if($("#controlCloudToggle"))$("#controlCloudToggle").classList.toggle("on",!!s.cloudSync);
}
$("#startupToggle")?.addEventListener('click',async()=>{const current=$("#startupToggle").classList.contains('on');await nativeJSON('/api/system/startup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({enabled:!current})});refreshNativeStatus();});

async function refreshWindowsNotifications(){
  const s=await nativeJSON('/api/system/notifications');
  if(!s)return;
  const enabled=!!s.enabled;
  $("#windowsNotifyToggle")?.classList.toggle("on",enabled);
  if($("#windowsNotifyStatus"))$("#windowsNotifyStatus").textContent=enabled?"ativas · horários funcionam com o painel fechado":"desativadas";
}
$("#windowsNotifyToggle")?.addEventListener("click",async()=>{const enabled=!$("#windowsNotifyToggle").classList.contains("on");await nativeJSON('/api/system/notifications',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({enabled})});refreshWindowsNotifications();toast(enabled?'Notificações ativadas.':'Notificações desativadas.');});
$("#testWindowsNotification")?.addEventListener("click",async()=>{await nativeJSON('/api/system/notifications',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({test:true})});toast('Teste enviado.','O Windows deve exibir um alerta do MyWay.');});



function nativeTarget(){return document.body.classList.contains("widget-only")?"notes":"panel";}
async function nativeWindowAction(action){
  try{await fetch(`/api/system/window?action=${encodeURIComponent(action)}&target=${nativeTarget()}`,{method:"POST"});}catch(e){}
}
$("#nativeMinimize")?.addEventListener("click",()=>nativeWindowAction("minimize"));
$("#nativeMaximize")?.addEventListener("click",()=>nativeWindowAction("maximize"));
$("#nativeClose")?.addEventListener("click",()=>nativeWindowAction("hide"));
$("#nativeDrag")?.addEventListener("pointerdown",e=>{if(e.button===0)nativeWindowAction("drag")});


