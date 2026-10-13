function loadBundledMPEG40(){return window.mpegts;
}
const IS_ANDROID = new URLSearchParams(location.search).get("android")==="1";
if(IS_ANDROID) document.body.classList.add("android-app");

const STORAGE_KEY = "myway_v1_state";
const LEGACY_STORAGE_KEYS = [];
const DEFAULT_STATE = {
  version: 35,
  settings: {
    workStart: "09:00",
    phaseArrival: "09:00",
    bankHours: 0,
    subjectName: "",
    series1Done: 0, series1Total: 4, series1Reading: false,
    series2Done: 0, series2Total: 4, series2Reading: false,
    series3Done: 0, series3Total: 4, series3Reading: false,
    live1: false, live2: false, live3: false,
    nextLesson: "",
    careerProject: "",
    careerNext: "",
    exitReason: "",
    apartmentGoal: 0,
    apartmentSaved: 0,
    monthlyContribution: 0,
    householdIncome: 0,
    propertyValue: 0,
    propertyType: "new",
    propertyRegion: "SE",
    amortizationSystem: "SAC",
    termMonths: 420,
    mcmvIncomeLimit: 13000,
    mcmvPropertyCap: 600000,
    mcmvAnnualRate: 10,
    mcmvMaxTerm: 420,
    bankRateCaixaMCMV: 10,
    bankRateCaixaSBPE: 10.99,
    bankRateSantander: 11.69,
    bankRateItau: 13.85,
    bankRateBradesco: 0,
    bankRateBB: 0,
    currentSavings: 0,
    fgtsBalance: 0,
    otherEntry: 0,
    salaryBase: 0,
    salaryHasAdvance: false,
    salaryAdvanceDay: 15,
    salaryAdvance: 0,
    salarySecondDay: 30,
    salarySecondPayment: 0,
    cashBalance: 0,
    financeSavePercent: 20,
    financeEmergencyMonths: 6,
    cardBill: 0,
    cardCloseDay: 19,
    claroMonthly: 0,
    pucMonthly: 0,
    transportMonthly: 0,
    coverImage: "",
    cdiAnnual: 13.65,
    cdbPercent: 102,
    englishLevel: "A1",
    waterGoalCups: 8,
    walkGoalMinutes: 20,
    eggsGoal: 2, proteinGoal49: 1,
    meditationFolderUrl: "",
    nvMonthlyTarget: 0,
    nvSubscribers: 0,
    nvMonthlyViews: 0,
    theme: "light",
    profileName: "Seu nome",
    profileRole: "Seu foco",
    profilePhoto: "",
    uiThemePreset: "editorial",
    uiFontPreset: "editorial",
    uiPrimary: "#20384f",
    uiAccent: "#3e7a83",
    uiPaper: "#e7e4de",
    educationLabel: "Estudos",
    institutionName: "",
    programName: "",
    studyStructure: "subjects",
    channelLabel: "Canal",
    channelName: "Meu Canal",
    channelHandle: "",
    channelPlatform: "YouTube",
    channelUrl: "",
    channelPillars: "Ideias, Projetos, Conteúdo",
    channelTagline: "",
    channelPrimary: "#000000",
    channelAccent: "#b01a1a",
    channelFontPreset: "impact",
    channelLogo: "",
    channelIcon: "",
    channelBanner: "",
    interests: [],
    inspirationAutoload: true,
    autoLockMinutes: 0,
    dailyQuoteEnabled: true,
    routineHeaderEnabled: true,
    animationsEnabled: true,
    sidebarAutoCollapse: true,
    sidebarPinned: false,
    tutorialSeen: false,
    featureWork: true,
    featurePuc: true,
    featureHabits: true,
    featureGoals: true,
    featureFinance: true,
    featureRelationships: false,
    featureEnglish: true,
    featureMeditation: false,
    featureNutrition: true,
    featureNotes: true,
    featureJournal: true,
    featurePsychoanalysis: true,
    featureInspiration: true,
    featureChannel: false,
    featureReports: true,
    featureReminders: true,
    coupleWeddingDate: "",
    couplePhotoDate: "",
    couplePhotoLocation: "",
    couplePhotoConcept: "",
    couplePhotographer: "",
    couplePhotoNotes: "",
    leisureWindow: "",
    leisureRule: "",
    careCity: "",
    careUF: ""
  },
  account: {configured:false, loginId:"", salt:"", passwordHash:"", createdAt:"", lastLoginAt:"", lastLogoutAt:"", trustedDevices:{}},
  days: {},
  studySessions: [],
  bankEvents: [],
  financeEvents: [],
  financeFixedExpenses: [],
  financeTransactions: [],
  financeDebts: [],
  journalEntries: [],
  psychoAssociations: [],
  psychoDreams: [],
  psychoTraumas: [],
  savedProperties: [],
  goalEvents: [],
  monthlyReports: [],
  reminders: [],
  notes: [],
  relationshipsWeddingPlans: [],
  relationshipsIdeas: [],
  relationshipsTrips: [],
  relationshipsPhotoOrder: [],
  pucCourses: [],
  pucTrackModules: [],
  nvResearchFavorites: [],
  nvInsights: [],
  inspirationPins: [],
  inspirationBoards: [{id:"general",name:"Geral",color:"#3e7a83"}],
  inspirationTaste: {version:1,signals:0,interestScores:{},termScores:{},domainScores:{},dismissed:[],actions:[],updatedAt:""},
  flashcards: [],
  studyYoutube: [],
  books: [],
  games: [],
  customGoals: [],
  englishSessions: [],
  englishXP: 0,
  meditationProgress: {},
  wellnessPractices: [],
  nutritionEntries: [],
  nvContent: [],
  nvAnalytics: {views:0,watchHours:0,subscribersGained:0,impressions:0,ctr:0,dailyViews:[],topVideos:[]},
  meta: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
};

const $ = (s, c=document) => c===document&&/^#[A-Za-z][\w-]*$/.test(s)?document.getElementById(s.slice(1)):c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];
const deepClone = obj => JSON.parse(JSON.stringify(obj));
// One dialog at a time; native dialog handles focus, inert background and Escape.
let activeAppDialog=null;
function openFormDialog({title,description="",fields=[],submitLabel="Salvar",validate,confirmation=false}){
  if(activeAppDialog)return Promise.resolve(null);
  return new Promise(resolve=>{
    const previousFocus=document.activeElement,dialog=document.createElement("dialog");
    activeAppDialog=dialog;dialog.className="myway-dialog";
    dialog.setAttribute("aria-labelledby","mywayDialogTitle");
    dialog.setAttribute("aria-describedby","mywayDialogDescription");
    dialog.innerHTML=`<form novalidate><header><div><span class="eyebrow">MYWAY</span><h3 id="mywayDialogTitle">${escapeHTML(title)}</h3></div><button type="button" class="modal-close" data-dialog-cancel aria-label="Fechar janela">×</button></header><p id="mywayDialogDescription">${escapeHTML(description)}</p><div class="myway-dialog-fields"></div><p class="myway-dialog-error" role="alert" hidden></p><footer>${confirmation?"":'<small>Os campos opcionais podem ficar vazios.</small>'}<div><button type="button" class="ghost" data-dialog-cancel>Cancelar</button><button type="submit" class="primary">${escapeHTML(submitLabel)}</button></div></footer></form>`;
    const form=dialog.querySelector("form"),fieldBox=dialog.querySelector(".myway-dialog-fields"),controls={};
    for(const field of fields){
      const label=document.createElement("label"),span=document.createElement("span");label.className="myway-dialog-field";
      span.textContent=field.label.replace(/\s*\((?:opcional|obrigat[oó]rio)\)\s*$/i,"")+(field.required?" (obrigatório)":" (opcional)");label.append(span);
      let control;
      if(field.options){control=document.createElement("select");for(const opt of field.options){const option=document.createElement("option");option.value=opt.value;option.textContent=opt.label;control.append(option);}}
      else control=document.createElement(field.type==="textarea"?"textarea":"input");
      if(control.tagName==="INPUT"){control.type=field.type||"text";if(control.type==="number")control.step=String(field.step??"any");if(field.min!==undefined)control.min=String(field.min);if(field.max!==undefined)control.max=String(field.max);}
      control.name=field.key;control.value=field.value??"";control.required=!!field.required;control.autocomplete="off";
      if(field.placeholder)control.placeholder=field.placeholder;
      if(field.maxLength)control.maxLength=field.maxLength;
      control.setAttribute("aria-label",span.textContent);label.append(control);fieldBox.append(label);controls[field.key]=control;
    }
    const error=dialog.querySelector(".myway-dialog-error");
    let settled61=false;function finish(result){if(settled61)return;settled61=true;dialog.close();dialog.remove();activeAppDialog=null;if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});resolve(result);}
    dialog.querySelectorAll("[data-dialog-cancel]").forEach(button=>button.addEventListener("click",()=>finish(null)));
    dialog.addEventListener("cancel",event=>{event.preventDefault();finish(null)});
    dialog.addEventListener('close',()=>finish(null),{once:true});
    form.addEventListener("submit",event=>{
      event.preventDefault();const values={};let message="",invalidControl=null;
      for(const field of fields){const control=controls[field.key];values[field.key]=control.value.trim();control.removeAttribute("aria-invalid");if(!message&&field.required&&!values[field.key]){message=`Preencha ${field.label.toLowerCase()}.`;invalidControl=control;}else if(!message&&!control.checkValidity()){message=`Revise ${field.label.toLowerCase()}.`;invalidControl=control;}}
      message=message||validate?.(values)||"";
      if(message){playSound58('error');error.textContent=message;error.hidden=false;invalidControl?.setAttribute("aria-invalid","true");invalidControl?.focus();return;}
      finish(values);
    });
    document.body.append(dialog);dialog.showModal();(Object.values(controls)[0]||dialog.querySelector('button[type="submit"]')).focus();
  });
}
async function askConfirmation(description,submitLabel="Confirmar"){return !!await openFormDialog({title:"Confirmar ação",description,submitLabel,confirmation:true})}
function showMessage(description){return openFormDialog({title:"Ajuda para entrar",description,submitLabel:"Entendi",confirmation:true})}

const DEFAULT_AVATAR="assets/default-user.jpg";

let state = loadState();
let activeDate = todayISO();
let timerSeconds = 25 * 60;
let timerHandle = null;
let timerStarted35=false,timerBlockMinutes35=25;
let selectedReminderDays = new Set();
let selectedRoutineDays = new Set();

function todayISO(){
  const d = new Date();
  return localISO(d);
}
function localISO(date){
  const y=date.getFullYear(), m=String(date.getMonth()+1).padStart(2,"0"), d=String(date.getDate()).padStart(2,"0");
  return `${y}-${m}-${d}`;
}
function loadState(){
  try{
    let raw = localStorage.getItem(STORAGE_KEY);
    if(!raw){
      for(const legacyKey of LEGACY_STORAGE_KEYS){
        const legacy=localStorage.getItem(legacyKey);
        if(legacy){raw=legacy;
localStorage.setItem(STORAGE_KEY,legacy);
break;
}
      }
    }
    if(!raw) return deepClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw);
    return {
      ...deepClone(DEFAULT_STATE),
      ...parsed,
      settings: {...deepClone(DEFAULT_STATE.settings), ...(parsed.settings||{})},
      account: {...deepClone(DEFAULT_STATE.account), ...(parsed.account||{})},
      days: parsed.days || {},
      studySessions: parsed.studySessions || [],
      bankEvents: parsed.bankEvents || [],
      financeEvents: parsed.financeEvents || [],
      financeFixedExpenses: parsed.financeFixedExpenses || [],
      financeTransactions: parsed.financeTransactions || [],
      financeDebts: parsed.financeDebts || [],
      journalEntries: parsed.journalEntries || [],
      savedProperties: parsed.savedProperties || [],
      goalEvents: parsed.goalEvents || [],
      monthlyReports: parsed.monthlyReports || [],
      reminders: parsed.reminders || [],
      notes: parsed.notes || [],
      relationshipsWeddingPlans: parsed.relationshipsWeddingPlans || [],
      relationshipsIdeas: parsed.relationshipsIdeas || [],
      relationshipsTrips: parsed.relationshipsTrips || [],
      relationshipsPhotoOrder: parsed.relationshipsPhotoOrder || [],
      pucCourses: parsed.pucCourses || deepClone(DEFAULT_STATE.pucCourses),
      pucTrackModules: parsed.pucTrackModules || deepClone(DEFAULT_STATE.pucTrackModules),
      nvResearchFavorites: parsed.nvResearchFavorites || [],
      nvInsights: parsed.nvInsights || [],
      inspirationPins: parsed.inspirationPins || [],
      inspirationBoards: parsed.inspirationBoards?.length ? parsed.inspirationBoards : deepClone(DEFAULT_STATE.inspirationBoards),
      inspirationTaste: {...deepClone(DEFAULT_STATE.inspirationTaste), ...(parsed.inspirationTaste||{}), interestScores:{...(parsed.inspirationTaste?.interestScores||{})}, termScores:{...(parsed.inspirationTaste?.termScores||{})}, domainScores:{...(parsed.inspirationTaste?.domainScores||{})}, dismissed:parsed.inspirationTaste?.dismissed||[], actions:parsed.inspirationTaste?.actions||[]},
      books: parsed.books || deepClone(DEFAULT_STATE.books),
      games: parsed.games || deepClone(DEFAULT_STATE.games),
      customGoals: parsed.customGoals || [],
      englishSessions: parsed.englishSessions || [],
      englishXP: Number(parsed.englishXP || 0),
      meditationProgress: parsed.meditationProgress || {},wellnessPractices:parsed.wellnessPractices||[],
      nvContent: parsed.nvContent || [],
      nvAnalytics: {...deepClone(DEFAULT_STATE.nvAnalytics), ...(parsed.nvAnalytics||{})},
      meta: {...deepClone(DEFAULT_STATE.meta), ...(parsed.meta||{})}
    };
  }catch(e){ return deepClone(DEFAULT_STATE);
 }
}
function saveState(){
  syncRewardXP34();
  state.meta.updatedAt = new Date().toISOString();
  const serialized40=JSON.stringify(state);
saveSnapshot40=serialized40;
  const cached36=cacheLocal36(serialized40);
  queueNativeSync();
  const status=$("#saveStatus");
  if(status){
    status.textContent="salvando...";
    clearTimeout(saveState._t);
    saveState._t=setTimeout(()=>status.textContent=cached36?"salvo local":"salvando em arquivo local…",450);
  }
  updateStorageInfo(serialized40);
}
let nativeSyncTimer=null;
function queueNativeSync(){
  clearTimeout(nativeSyncTimer);
  nativeSyncTimer=setTimeout(async()=>{
    try{
      const r=await fetch("/api/state",{method:"POST",headers:{"Content-Type":"application/json"},body:saveSnapshot40||JSON.stringify(state)});
      const data=await r.json().catch(()=>null);
      const status=$("#saveStatus");
      if(status&&data?.ok)status.textContent="salvo no computador";
      if(state.settings.cloudSync===true&&!document.hidden)refreshCloudStatus();
    }catch(e){const status=$("#saveStatus");if(status)status.textContent=localCacheOK36?"salvo local":"Não foi possível salvar. Exporte um backup agora."}
  },350);
}
function mergeNativePins137(localPins,remotePins){
  const out=[],seen=new Set();
  for(const rows of [Array.isArray(remotePins)?remotePins:[],Array.isArray(localPins)?localPins:[]]){
    for(const pin of rows){
      if(!pin||typeof pin!=="object")continue;
      const key=String(pin.source||pin.image||pin.thumb||pin.id||"").trim()||JSON.stringify([pin.title||"",pin.savedAt||pin.createdAt||""]);
      if(seen.has(key))continue;seen.add(key);out.push(pin);
    }
  }
  return out;
}
async function hydrateFromNative(){
  const localPinsBefore137=Array.isArray(state?.inspirationPins)?state.inspirationPins.slice():[];
  const localBoardsBefore137=Array.isArray(state?.inspirationBoards)?state.inspirationBoards.slice():[];
  const localAppearanceBefore137={};
  for(const key of ["wallpaper127","wallpaperCustom127","wallpaperBlur127","wallpaperFit134","wallpaperPosition134","wallpaperMotion134","wallpaperZoom134","wallpaperTintOpacity135","wallpaperPanelOpacity136","compactCopy134","panelColorR2"]){
    if(state?.settings&&Object.prototype.hasOwnProperty.call(state.settings,key))localAppearanceBefore137[key]=state.settings[key];
  }
  try{
    const r=await fetch("/api/state",{cache:"no-store"});
    if(!r.ok)return;
    const remote=await r.json();
    if(!remote || !remote.settings){queueNativeSync();
return;
}
    const localTime=Date.parse(state.meta?.updatedAt||0)||0, remoteTime=Date.parse(remote.meta?.updatedAt||0)||0;
    if(remoteTime>localTime || !localStorage.getItem(STORAGE_KEY)){
      const hydratedSettings137={...deepClone(DEFAULT_STATE.settings),...(remote.settings||{})};
      // Se a pessoa alterou Aparência enquanto o estado nativo ainda carregava, a UI local vence.
      if(window.__MYWAY_APPEARANCE_DIRTY137){Object.assign(hydratedSettings137,localAppearanceBefore137,state.settings||{});}
      else{
        if(localAppearanceBefore137.wallpaper127&&localAppearanceBefore137.wallpaper127!=="none")Object.assign(hydratedSettings137,localAppearanceBefore137);
        if(localAppearanceBefore137.compactCopy134===true)hydratedSettings137.compactCopy134=true;
      }
      state={...deepClone(DEFAULT_STATE),...remote,settings:hydratedSettings137,account:{...deepClone(DEFAULT_STATE.account),...(remote.account||{})},days:remote.days||{},studySessions:remote.studySessions||[],bankEvents:remote.bankEvents||[],financeEvents:remote.financeEvents||[],financeFixedExpenses:remote.financeFixedExpenses||[],financeTransactions:remote.financeTransactions||[],financeDebts:remote.financeDebts||[],journalEntries:remote.journalEntries||[],savedProperties:remote.savedProperties||[],goalEvents:remote.goalEvents||[],monthlyReports:remote.monthlyReports||[],reminders:remote.reminders||[],notes:remote.notes||[],relationshipsWeddingPlans:remote.relationshipsWeddingPlans||[],relationshipsIdeas:remote.relationshipsIdeas||[],relationshipsTrips:remote.relationshipsTrips||[],relationshipsPhotoOrder:remote.relationshipsPhotoOrder||[],pucCourses:remote.pucCourses||deepClone(DEFAULT_STATE.pucCourses),pucTrackModules:remote.pucTrackModules||deepClone(DEFAULT_STATE.pucTrackModules),nvResearchFavorites:remote.nvResearchFavorites||[],nvInsights:remote.nvInsights||[],inspirationPins:mergeNativePins137(localPinsBefore137,remote.inspirationPins),inspirationBoards:remote.inspirationBoards?.length?remote.inspirationBoards:(localBoardsBefore137.length?localBoardsBefore137:deepClone(DEFAULT_STATE.inspirationBoards)),inspirationTaste:{...deepClone(DEFAULT_STATE.inspirationTaste),...(remote.inspirationTaste||{}),interestScores:{...(remote.inspirationTaste?.interestScores||{})},termScores:{...(remote.inspirationTaste?.termScores||{})},domainScores:{...(remote.inspirationTaste?.domainScores||{})},dismissed:remote.inspirationTaste?.dismissed||[],actions:remote.inspirationTaste?.actions||[]},books:remote.books||deepClone(DEFAULT_STATE.books),games:remote.games||deepClone(DEFAULT_STATE.games),customGoals:remote.customGoals||[],englishSessions:remote.englishSessions||[],englishXP:Number(remote.englishXP||0),meditationProgress:remote.meditationProgress||{},wellnessPractices:remote.wellnessPractices||[],nvContent:remote.nvContent||[],nvAnalytics:{...deepClone(DEFAULT_STATE.nvAnalytics),...(remote.nvAnalytics||{})},meta:{...deepClone(DEFAULT_STATE.meta),...(remote.meta||{})}};
      normalizeV27InspirationProfile();
normalizeV28TasteProfile();
localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
      syncInputsFromState();
loadDayIntoUI();
    }
  }catch(e){}
}
let cloudPollBusy=false;
function formatCloudTime(iso){
  if(!iso)return "—";
  const d=new Date(iso);
if(Number.isNaN(d.getTime()))return "—";
  return d.toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"});
}
async function refreshCloudStatus(){if($("#cloudSyncCard"))$("#cloudSyncCard").hidden=true;
return;
}
async function legacyRefreshCloudStatus(){
  const s=await nativeJSON("/api/cloud/status");
  if(!s)return;
  const dot=$("#cloudStateDot"),label=$("#cloudStateLabel"),last=$("#cloudLastSync"),device=$("#cloudDevice"),path=$("#cloudPath"),note=$("#cloudSyncNote");
  if(dot){dot.className="cloud-dot "+(s.available&&!s.error?"ok":s.enabled?"error":"warn")}
  if(label)label.textContent=s.available?(s.error?"sincronização com erro":"OneDrive conectado"):(s.enabled?"OneDrive não encontrado":"sincronização desativada");
  if(last)last.textContent=formatCloudTime(s.lastSync||s.cloudUpdatedAt);
  if(device)device.textContent=s.device||"Windows";
  if(path)path.textContent=s.path||"Pasta MyWay ainda não disponível neste computador.";
  if(note&&s.error)note.textContent=s.error;
}
async function cloudSyncNow(){return toast("Use Exportar backup para transferir seus dados.");
}
async function legacyCloudSyncNow(){
  const b=$("#cloudSyncNow");
if(b){b.disabled=true;
b.textContent="atualizando..."}
  const r=await nativeJSON("/api/cloud/sync",{method:"POST"});
  if(b){b.disabled=false;
b.textContent="Sincronizar só os dados"}
  if(!r?.ok){toast("OneDrive não sincronizou.",r?.error||"");
refreshCloudStatus();
return}
  if(r.state?.settings){
    const remoteTime=Date.parse(r.state.meta?.updatedAt||0)||0,localTime=Date.parse(state.meta?.updatedAt||0)||0;
    if(remoteTime>localTime){localStorage.setItem(STORAGE_KEY,JSON.stringify(r.state));
toast("Dados atualizados do OneDrive.","Recarregando o painel...");
setTimeout(()=>location.reload(),650);
return}
  }
  toast("OneDrive sincronizado.",r.direction==="local_to_cloud"?"Dados deste computador enviados para a pasta MyWay.":r.direction==="cloud_to_local"?"Dados mais novos baixados da pasta MyWay.":"Tudo já estava atualizado.");
  refreshCloudStatus();
}
$("#cloudSyncNow")?.addEventListener("click",cloudSyncNow);
function setCloudAllStep(name,state,text){
  const el=document.querySelector(`[data-cloud-step="${name}"]`);
if(!el)return;
  el.classList.remove("active","done","error");
if(state)el.classList.add(state);
  const b=el.querySelector("b");
if(b&&text)b.textContent=text;
}
async function cloudSyncAll(){return toast("Use Exportar backup para transferir seus dados.");
}
async function legacyCloudSyncAll(){return cloudSyncAll();
}
$("#cloudSyncAll")?.addEventListener("click",cloudSyncAll);
$("#cloudOpenFolder")?.addEventListener("click",async()=>{const r=await nativeJSON("/api/cloud/open",{method:"POST"});if(!r?.ok)toast("Pasta OneDrive indisponível.",r?.error||"")});
$("#cloudOpenShare")?.addEventListener("click",async()=>{const r=await nativeJSON("/api/cloud/share",{method:"POST"});if(!r?.ok)toast("Não consegui abrir o OneDrive.",r?.error||"")});
async function pollCloudState(){
  if(cloudPollBusy||document.hidden)return;
cloudPollBusy=true;
  try{
    const r=await fetch("/api/state",{cache:"no-store"});
if(!r.ok)return;
    const remote=await r.json();
if(!remote?.settings)return;
    const remoteTime=Date.parse(remote.meta?.updatedAt||0)||0,localTime=Date.parse(state.meta?.updatedAt||0)||0;
    if(remoteTime>localTime+750){
      localStorage.setItem(STORAGE_KEY,JSON.stringify(remote));
      toast("Atualização recebida do OneDrive.","O painel será atualizado.");
      setTimeout(()=>location.reload(),800);
    }
  }catch(e){}finally{cloudPollBusy=false}
}
// v36: manual export/import only.
// Local-only: no periodic external storage polling.


const THEME_PRESETS={
  editorial:{name:"Editorial",primary:"#20384f",accent:"#3e7a83",paper:"#e7e4de",font:"editorial",desc:"Clássico e editorial"},
  graphite:{name:"Graphite",primary:"#23272f",accent:"#d47745",paper:"#ece9e3",font:"modern",desc:"Escuro, direto e técnico"},
  sage:{name:"Sage",primary:"#315b50",accent:"#b58b45",paper:"#eeece3",font:"literary",desc:"Natural e sofisticado"},
  violet:{name:"Violet",primary:"#554579",accent:"#518a96",paper:"#f0edf2",font:"soft",desc:"Criativo e contemporâneo"},
  mono:{name:"Mono",primary:"#1a1a1a",accent:"#70757d",paper:"#f0f0ee",font:"geometric",desc:"Minimalista e neutro"},
  ocean:{name:"Ocean",primary:"#17445b",accent:"#2b8c8e",paper:"#e8eff0",font:"modern",desc:"Azul, leve e digital"}
};
const FONT_PRESETS={
  editorial:{name:"Editorial",body:'"DM Sans","Segoe UI",Arial,sans-serif',display:'"Playfair Display",Georgia,serif'},
  modern:{name:"Modern",body:'"Inter","Segoe UI",Arial,sans-serif',display:'"Space Grotesk","Segoe UI",Arial,sans-serif'},
  geometric:{name:"Geometric",body:'"Montserrat","Segoe UI",Arial,sans-serif',display:'"Montserrat","Segoe UI",Arial,sans-serif'},
  literary:{name:"Literary",body:'"Inter","Segoe UI",Arial,sans-serif',display:'"Libre Baskerville",Georgia,serif'},
  soft:{name:"Soft",body:'"Montserrat","Segoe UI",Arial,sans-serif',display:'"Lora",Georgia,serif'}
};
