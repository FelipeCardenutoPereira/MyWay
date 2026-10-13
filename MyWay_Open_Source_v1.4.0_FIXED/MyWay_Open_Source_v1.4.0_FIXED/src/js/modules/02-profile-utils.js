function syncInputsFromState(){
  $$('[data-setting]').forEach(el=>{const k=el.dataset.setting;if(!(k in state.settings))return;if(el.type==='checkbox')el.checked=!!state.settings[k];else el.value=state.settings[k]??'';});
}
async function nativeJSON(url,options){try{const r=await fetch(url,options);
let data=null;
try{data=await r.json()}catch(e){const t=await r.text().catch(()=>"");
data=t?{error:t}:null}return data;
}catch(e){return null;
}}
function applyTheme(theme=state.settings.theme||"light"){
  state.settings.theme=theme;
  document.documentElement.dataset.theme=theme;
  const dark=theme==="dark";
  if($("#themeToggle"))$("#themeToggle").textContent=dark?"☀":"◐";
  if($("#nativeTheme"))$("#nativeTheme").textContent=dark?"☀":"◐";
  applyAppearance();
}
function toggleTheme(){applyTheme((state.settings.theme||"light")==="dark"?"light":"dark");
saveState();
}
$("#themeToggle")?.addEventListener("click",toggleTheme);
$("#nativeTheme")?.addEventListener("click",toggleTheme);
async function toggleFullscreen(){
  if(document.documentElement.classList.contains('native-available')){await nativeWindowAction("fullscreen");
return;
}
  try{if(!document.fullscreenElement){await document.documentElement.requestFullscreen();
}else{await document.exitFullscreen();
}}catch(e){toast('Tela cheia não está disponível neste modo.');
}
}
$("#fullscreenToggle")?.addEventListener("click",toggleFullscreen);
$("#nativeFullscreen")?.addEventListener("click",toggleFullscreen);

const FEATURE_SETTINGS={
  games:"featureGames",gym:"featureGym",nutrition:"featureNutrition",rewards:null,resilience:null,work:"featureWork",puc:"featurePuc",habits:"featureHabits",future:"featureGoals",finance:"featureFinance",relationships:"featureRelationships",
  english:"featureEnglish",meditation:"featureMeditation",notes:"featureNotes",journal:"featureJournal",psychoanalysis:"featurePsychoanalysis",inspiration:"featureInspiration",channel:"featureChannel",
  reports:"featureReports",reminders:"featureReminders"
};
const MASTER_LOGINS=new Set();
function normalizedLogin(){return String(state.account?.loginId||"").trim().toLowerCase()}
function isMasterUser(){return MASTER_LOGINS.has(normalizedLogin())}
function ensureMasterWorkspaceDefaults(){
  if(!isMasterUser())return false;
  state.meta=state.meta||{};
let changed=false;
  if(state.settings.featureChannel===false){state.settings.featureChannel=true;
changed=true}
  if(state.meta.masterChannelV31Restored!==true){
    state.settings.channelLabel="Canal";
state.settings.channelName="Meu Canal";
state.settings.channelHandle="";
state.settings.channelPlatform="YouTube";
    state.settings.channelUrl="";
state.settings.channelPillars="Cinema, Games, HQs, Submundos";
state.settings.channelTagline="Cultura pop sem ser básica.";
    state.settings.channelPrimary="#000000";
state.settings.channelAccent="#b01a1a";
state.settings.channelFontPreset="impact";
    state.settings.channelLogo="";
state.settings.channelIcon="";
state.settings.channelBanner="";
    state.meta.masterChannelV31Restored=true;
changed=true;
  }
  if(changed){state.meta.updatedAt=new Date().toISOString();
localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
  return changed;
}
function applyAccessProfile(){
  const master=isMasterUser();
if(master)ensureMasterWorkspaceDefaults();
document.body.classList.toggle("master-user",master);
document.body.classList.toggle("standard-user",!master);
  const set=(sel,text)=>{const el=$(sel);
if(el)el.textContent=text};
  set("#relationshipNavLabel","Relacionamentos");
set("#relationshipLauncherLabel","Relacionamentos");
set("#relationshipLauncherSub",master?"casamento + viagens":"planos + memórias");
  set("#wellnessNavLabel",master?"Meditação":"Bem-estar");
set("#wellnessLauncherLabel",master?"Meditação":"Bem-estar");
set("#wellnessLauncherSub",master?"desafio 22 dias":"práticas + sessões");
  set("#relationshipEyebrow","RELACIONAMENTOS");
set("#relationshipHeading",master?"Nós.":"Vida a dois.");
set("#relationshipDescription",master?"Casamento, viagens, imóveis, sessão de fotos e arquivos privados do casal.":"Planos, datas importantes, viagens, imóveis favoritos, fotos e arquivos privados do relacionamento.");
  set("#relationshipDateLabel",master?"CASAMENTO":"DATA IMPORTANTE");
set("#relationshipPlanKicker",master?"CASAMENTO":"PLANOS JUNTOS");
set("#relationshipPlanTitle",master?"Planejamento.":"Próximos planos.");
set("#relationshipDateFieldLabel",master?"Data do casamento":"Data importante");
  set("#wellnessEyebrow","BEM-ESTAR");
set("#wellnessHeading","Uma prática de cada vez.");
set("#wellnessDescription","Pausas, atenção e aprendizagem no seu ritmo.");
if($("#wellnessGeneric"))$("#wellnessGeneric").hidden=false;
  const channelLabel=String(state.settings.channelLabel||"Canal").trim()||"Canal";
  set("#channelNavLabel",channelLabel);
  set("#channelLauncherLabel",channelLabel);
}
function featureEnabled(target){const key=FEATURE_SETTINGS[target];
return state.settings.navigationMode==="full"||!key||state.settings[key]!==false}
function initialsFromName(name="Meu perfil"){
  const parts=String(name).trim().split(/\s+/).filter(Boolean);
if(!parts.length)return "MW";
  return (parts[0][0]+(parts.length>1?parts[parts.length-1][0]:parts[0].slice(1,2))).toUpperCase();
}
function renderProfileIdentity(){
  const name=state.settings.profileName||"Seu perfil",photo=state.settings.profilePhoto||"",avatar=photo||DEFAULT_AVATAR,initials=initialsFromName(name);
  if($("#profileNavInitials"))$("#profileNavInitials").textContent=initials;
  if($("#profilePhotoInitials"))$("#profilePhotoInitials").textContent=initials;
  [["#profileNavPhoto","#profileNavInitials"],["#profilePhotoImage","#profilePhotoInitials"]].forEach(([imgSel,txtSel])=>{
    const img=$(imgSel),txt=$(txtSel);if(!img)return;img.src=avatar;img.hidden=false;if(txt)txt.hidden=true;
  });
  if($("#controlProfileName")&&document.activeElement!==$("#controlProfileName"))$("#controlProfileName").value=name;
  if($("#controlProfileRole")&&document.activeElement!==$("#controlProfileRole"))$("#controlProfileRole").value=state.settings.profileRole||"";
  const role=state.settings.profileRole||"perfil",login=state.account?.loginId||"";
  if($("#topAccountInitials"))$("#topAccountInitials").textContent=initials;
if($("#topAccountName"))$("#topAccountName").textContent=name;
if($("#topAccountRole"))$("#topAccountRole").textContent=role;
  if($("#accountDropdownName"))$("#accountDropdownName").textContent=name;
if($("#accountDropdownLogin"))$("#accountDropdownLogin").textContent=login||role;
  const topPhoto=$("#topAccountPhoto");
if(topPhoto){topPhoto.src=avatar;
topPhoto.hidden=false;
if($("#topAccountInitials"))$("#topAccountInitials").hidden=true}
  if($("#loginProfileInitials"))$("#loginProfileInitials").textContent=initials;
if($("#loginProfileName"))$("#loginProfileName").textContent=name;
if($("#loginProfileRole"))$("#loginProfileRole").textContent=role;
  const loginPhoto=$("#loginProfilePhoto");
if(loginPhoto){loginPhoto.src=avatar;
loginPhoto.hidden=false;
if($("#loginProfileInitials"))$("#loginProfileInitials").hidden=true}
  if($("#controlLastLogin"))$("#controlLastLogin").textContent=state.account?.lastLoginAt?new Date(state.account.lastLoginAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"—";
}
function applyFeatureVisibility(){
  Object.entries(FEATURE_SETTINGS).forEach(([target,key])=>{
    const enabled=featureEnabled(target);
    $$(`[data-view-target="${target}"]`).forEach(el=>el.classList.toggle("feature-disabled",!enabled));
  });
}
function applyInterfacePreferences(){
  document.body.classList.toggle("hide-daily-quote",state.settings.dailyQuoteEnabled===false);
  document.body.classList.toggle("hide-routine-header",state.settings.routineHeaderEnabled===false);
  document.body.classList.toggle("no-animations",state.settings.animationsEnabled===false);
  document.documentElement.classList.toggle("reduce-motion",state.settings.animationsEnabled===false);
  if(state.settings.sidebarPinned===true)setSidebarCollapsed(false);
else if(state.settings.sidebarAutoCollapse===false)document.body.classList.remove("sidebar-collapsed");
  applyAppearance();
applyFeatureVisibility();
renderProfileIdentity();
applyProductLabels();
applyChannelBrand();
}
async function profilePhotoData(file){
  return new Promise((resolve,reject)=>{const r=new FileReader(),img=new Image();r.onerror=reject;img.onerror=reject;r.onload=()=>img.src=r.result;img.onload=()=>{
    const size=320,c=document.createElement("canvas");c.width=size;c.height=size;const ctx=c.getContext("2d");
    const scale=Math.max(size/img.width,size/img.height),w=img.width*scale,h=img.height*scale,x=(size-w)/2,y=(size-h)/2;
    ctx.drawImage(img,x,y,w,h);resolve(c.toDataURL("image/jpeg",.8));
  };r.readAsDataURL(file)});
}
async function refreshControlSystem(){
  const s=await nativeJSON("/api/system/preferences");
  const status=$("#controlSystemStatus");
  if(!s){if(status)status.textContent="recursos nativos indisponíveis neste modo";
return}
  $("#controlStartupToggle")?.classList.toggle("on",!!s.startup);
  $("#controlNotificationsToggle")?.classList.toggle("on",!!s.notificationsEnabled);
  $("#controlNotesStartupToggle")?.classList.toggle("on",!!s.openNotesAtStartup);
  $("#controlCloudToggle")?.classList.toggle("on",!!s.cloudSync);
  if(status)status.textContent=`Windows conectado · salvamento local · Notes ${s.openNotesAtStartup?"no início":"manual"}`;
}
function renderControlPanel(){
  if(!$("#view-control"))return;
  renderProfileIdentity();
renderAppearanceControls();
renderProductConfigInputs();
renderInterestControls();
applyProductLabels();
applyChannelBrand();
  $("#controlDarkToggle")?.classList.toggle("on",(state.settings.theme||"light")==="dark");
  if($("#controlAutoLock"))$("#controlAutoLock").value=String(Number(state.settings.autoLockMinutes||0));
  $$('[data-control-setting]').forEach(btn=>btn.classList.toggle("on",state.settings[btn.dataset.controlSetting]!==false));
  $$('[data-feature-toggle]').forEach(btn=>{const key=FEATURE_SETTINGS[btn.dataset.featureToggle];btn.classList.toggle("on",!key||state.settings[key]!==false)});
  refreshControlSystem();
refreshIntegrationStatus();
}
$("#profilePhotoUpload")?.addEventListener("change",async e=>{const f=e.target.files?.[0];if(!f)return;try{state.settings.profilePhoto=await profilePhotoData(f);saveState();renderProfileIdentity();toast("Foto de perfil atualizada.")}catch(err){toast("Não consegui processar essa imagem.")}e.target.value=""});
$("#profilePhotoRemove")?.addEventListener("click",()=>{state.settings.profilePhoto="";saveState();renderProfileIdentity()});
$("#controlProfileName")?.addEventListener("input",e=>{state.settings.profileName=e.target.value;saveState();renderProfileIdentity()});
$("#controlProfileRole")?.addEventListener("input",e=>{state.settings.profileRole=e.target.value;saveState()});
$("#controlDarkToggle")?.addEventListener("click",()=>{toggleTheme();renderControlPanel()});
$$('[data-control-setting]').forEach(btn=>btn.addEventListener("click",()=>{const key=btn.dataset.controlSetting;state.settings[key]=state.settings[key]===false;saveState();applyInterfacePreferences();renderControlPanel()}));
$$('[data-feature-toggle]').forEach(btn=>btn.addEventListener("click",()=>{const key=FEATURE_SETTINGS[btn.dataset.featureToggle];if(!key)return;state.settings[key]=state.settings[key]===false;saveState();applyFeatureVisibility();renderControlPanel()}));
async function setSystemPreference(key,value){const body={};
body[key]=value;
await nativeJSON("/api/system/preferences",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
await refreshNativeStatus();
await refreshControlSystem();
}
$("#controlStartupToggle")?.addEventListener("click",()=>setSystemPreference("startup",!$("#controlStartupToggle").classList.contains("on")));
$("#controlNotificationsToggle")?.addEventListener("click",()=>setSystemPreference("notificationsEnabled",!$("#controlNotificationsToggle").classList.contains("on")));
$("#controlNotesStartupToggle")?.addEventListener("click",()=>setSystemPreference("openNotesAtStartup",!$("#controlNotesStartupToggle").classList.contains("on")));
$("#controlCloudToggle")?.addEventListener("click",()=>toast("Salvamento local ativo. Use exportação/importação para outro PC."));
$("#controlTestNotification")?.addEventListener("click",async()=>{await nativeJSON('/api/system/notifications',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({test:true})});toast("Teste enviado.","O Windows deve exibir uma notificação do MyWay.")});
bindProductConfig();
$("#educationAddCourse")?.addEventListener("click",()=>openStudyCourseDialog());
async function lockWorkspace(reason="manual"){
  sessionStorage.setItem(authForcedLockKey(),"1");
$("#loginPassword").value="";
$("#loginUser").value=state.account.loginId||"";
  if($("#loginError"))$("#loginError").textContent=reason==="inactivity"?"Workspace bloqueado por inatividade.":"";
  setAuthMode("login");
renderProfileIdentity();
setTimeout(()=>$("#loginPassword")?.focus(),80);
}
async function logoutWorkspace(){
  if(!await askConfirmation("Sair deste dispositivo? Seus dados permanecem salvos e sincronizados.","Sair"))return;
  try{await fetch("/api/state",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(state)})}catch(e){}
  state.account.lastLogoutAt=new Date().toISOString();
await forgetCurrentDevice();
sessionStorage.setItem(authForcedLockKey(),"1");
saveState();
  $("#loginPassword").value="";
$("#loginUser").value=state.account.loginId||"";
setAuthMode("login");
renderProfileIdentity();
}
$("#controlLock")?.addEventListener("click",()=>lockWorkspace("manual"));
$("#controlLogout")?.addEventListener("click",logoutWorkspace);
$("#controlRerunOnboarding")?.addEventListener("click",async()=>{if(!await askConfirmation("Abrir novamente a configuração inicial? Seus dados atuais serão preservados."))return;prefillOnboarding();$("#onboardPassword").value="";onboardingStep=1;renderOnboardStep();setAuthMode("onboarding")});
$("#controlAutoLock")?.addEventListener("change",e=>{state.settings.autoLockMinutes=Number(e.target.value||0);saveState();startAutoLockWatch()});
let autoLockLastActivity=Date.now(),autoLockInterval=null;
function noteUserActivity(){autoLockLastActivity=Date.now()}
["pointerdown","keydown","wheel","touchstart"].forEach(ev=>window.addEventListener(ev,noteUserActivity,{passive:true}));
function startAutoLockWatch(){
  if(autoLockInterval)clearInterval(autoLockInterval);
autoLockLastActivity=Date.now();
  autoLockInterval=setInterval(()=>{const mins=Number(state.settings.autoLockMinutes||0);if(!mins||!$("#authGate")?.hidden)return;if(Date.now()-autoLockLastActivity>=mins*60000)lockWorkspace("inactivity")},15000);
}



$("#topAccountButton")?.addEventListener("click",e=>{e.stopPropagation();const d=$("#topAccountDropdown"),open=d.hidden;d.hidden=!open;$("#topAccountButton").setAttribute("aria-expanded",open?"true":"false")});
document.addEventListener("click",e=>{if(!e.target.closest("#topAccountMenu")){const d=$("#topAccountDropdown");if(d)d.hidden=true;$("#topAccountButton")?.setAttribute("aria-expanded","false")}});
$("#accountMenuControl")?.addEventListener("click",()=>{$("#topAccountDropdown").hidden=true;showView("control")});
$("#accountMenuLock")?.addEventListener("click",()=>{$("#topAccountDropdown").hidden=true;lockWorkspace("manual")});
$("#accountMenuLogout")?.addEventListener("click",()=>{$("#topAccountDropdown").hidden=true;logoutWorkspace()});

function ensureDay(date=activeDate){
  if(!state.days[date]){
    state.days[date] = {
      arrivalTime:"", energy:"", escapeUrge:"", studyMinutes:0, drainNote:"", responseNote:"",
      morningNoScroll:false, studyMinimum:false, careerAction:false, preparedTomorrow:false,
      focusTask:"", returns:0, bankRecoveryMinutes:0,
      waterCups:0, walkMinutes:0, eggs:0, proteinMeals49:0, meditated:false, pagesRead:0, readingBookId:"",
      punchIn:"", lunchOut:"", lunchIn:"", punchOut:"",
      adhdNextAction:"", adhdEnergyNow:"", distractions:[], studyPomodoros:0
    };
  }
  return state.days[date];
}
function escapeHTML(s=""){
  return String(s).replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
function parseTime(t){
  if(!t || !t.includes(":")) return null;
  const [h,m]=t.split(":").map(Number);
  return h*60+m;
}
function fmtMinutes(mins){
  if(mins == null || Number.isNaN(mins)) return "—";
  const sign=mins<0?"−":"";
  mins=Math.abs(Math.round(mins));
  if(mins<60) return `${sign}${mins} min`;
  const h=Math.floor(mins/60), m=mins%60;
  return `${sign}${h}h${m?String(m).padStart(2,"0"):""}`;
}
function money(v){
  return Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:2});
}
const DAILY_QUOTES=[
  {text:"Concentre energia no que depende de você; deixe o restante seguir seu curso.",author:"Epicteto · adaptação"},
  {text:"A qualidade da vida acompanha a qualidade dos pensamentos que você cultiva.",author:"Marco Aurélio · adaptação"},
  {text:"Enquanto adiamos, a vida passa.",author:"Sêneca · adaptação"},
  {text:"Uma vida sem exame não merece ser vivida.",author:"Sócrates · Apologia"},
  {text:"Quem tem um porquê suporta quase qualquer como.",author:"Nietzsche · adaptação"},
  {text:"Não importa a velocidade, desde que você não pare.",author:"Confúcio · adaptação"},
  {text:"Uma longa jornada começa com um único passo.",author:"Lao-Tsé · adaptação"},
  {text:"Nenhum homem entra duas vezes no mesmo rio.",author:"Heráclito · adaptação"},
  {text:"Sofremos mais vezes na imaginação do que na realidade.",author:"Sêneca · adaptação"},
  {text:"Você governa sua mente; os acontecimentos externos não obedecem a você.",author:"Marco Aurélio · adaptação"},
  {text:"Não são as coisas que perturbam, mas os julgamentos que fazemos sobre elas.",author:"Epicteto · adaptação"},
  {text:"A vida é compreendida olhando para trás, mas precisa ser vivida olhando para frente.",author:"Kierkegaard · adaptação"},
  {text:"O começo é a parte mais importante do trabalho.",author:"Platão · adaptação"},
  {text:"A dificuldade mostra aquilo de que uma pessoa é feita.",author:"Epicteto · adaptação"},
  {text:"Tempo perdido não volta; escolha bem onde coloca sua atenção.",author:"Sêneca · adaptação"},
  {text:"Nós nos tornamos aquilo que praticamos repetidamente.",author:"Aristóteles · ideia adaptada"}
];
function quoteIndexForDate(iso=todayISO()){
  let h=2166136261;
  for(const ch of String(iso)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
  return Math.abs(h)%DAILY_QUOTES.length;
}
function renderDailyQuote(){
  const iso=todayISO(),q=DAILY_QUOTES[quoteIndexForDate(iso)];
  document.body.dataset.quoteDate=iso;
  if($("#dailyQuoteText"))$("#dailyQuoteText").textContent=q.text;
  if($("#dailyQuoteAuthor"))$("#dailyQuoteAuthor").textContent=q.author;
}
setInterval(()=>{if(document.body.dataset.quoteDate!==todayISO())renderDailyQuote()},60000);
function celebrateElement(target,label="100%"){if(document.body.classList.contains('auth-locked')||state.settings.rewardFeedback==='off'||state.settings.animationsEnabled===false||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  if(!target)return;
  const el=target.closest?.(".custom-goal-card,.editable-goal-row,.book-row-v11,.puc-course-card,.nv-content-card,.paper-card")||target;
  const rect=el.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+Math.min(rect.height/2,80);
  el.classList.remove("completion-celebrate");void el.offsetWidth;el.classList.add("completion-celebrate");
  const layer=$("#celebrationLayer")||document.body;
  for(let i=0;i<14;i++){
    const p=document.createElement("i");p.className="completion-particle";
    const a=(Math.PI*2*i/14)+(Math.random()*.3-.15),d=42+Math.random()*72;
    p.style.setProperty("--x",`${cx}px`);p.style.setProperty("--y",`${cy}px`);
    p.style.setProperty("--dx",`${Math.cos(a)*d}px`);
    p.style.setProperty("--dy",`${Math.sin(a)*d}px`);
    p.style.setProperty("--rot",`${Math.round(Math.random()*420-210)}deg`);
    layer.appendChild(p);setTimeout(()=>p.remove(),950);
  }
  const badge=document.createElement("div");badge.className="completion-badge-float";badge.textContent="100% ✓";badge.style.left=`${cx}px`;badge.style.top=`${cy}px`;layer.appendChild(badge);setTimeout(()=>badge.remove(),1000);
  setTimeout(()=>el.isConnected&&el.classList.remove("completion-celebrate"),1000);
}
function formatDateBR(iso){
  if(!iso) return "";
  const [y,m,d]=iso.split("-");
  return `${d}/${m}/${y}`;
}
function monthKey(date=activeDate){ return date.slice(0,7); }
function previousMonthKey(ym){
  const [y,m]=ym.split("-").map(Number);
  const d=new Date(y,m-2,1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
}
function weekday(dateStr){
  const [y,m,d]=dateStr.split("-").map(Number);
  return new Date(y,m-1,d).getDay();
}
function isWorkday(dateStr){
  const d=weekday(dateStr);
  return d>=1 && d<=5;
}
function toast(title, detail=""){
  const el=document.createElement("div");
  el.className="toast";
  el.innerHTML=`<b>${escapeHTML(title)}</b>${detail?`<span>${escapeHTML(detail)}</span>`:""}`;
  $("#toastStack").appendChild(el);
  setTimeout(()=>{el.style.opacity="0";el.style.transform="translateY(8px)";},4200);
  setTimeout(()=>el.remove(),4700);
}

