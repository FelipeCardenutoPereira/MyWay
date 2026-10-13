function presetMarkup(active){return Object.entries(THEME_PRESETS).map(([id,p])=>`<button type="button" class="theme-preset ${active===id?"active":""}" data-theme-preset="${id}"><span class="theme-swatches"><i style="background:${p.primary}"></i><i style="background:${p.accent}"></i></span><span><b>${p.name}</b><small>${p.desc}</small></span></button>`).join("")}
function fontOptions(active){return Object.entries(FONT_PRESETS).map(([id,p])=>`<option value="${id}" ${active===id?"selected":""}>${p.name}</option>`).join("")}
function normalizeLegacyProductProfile(){
  state.meta=state.meta||{};
  if(state.meta.productV26Migrated)return;
  const hadEducation=(state.pucCourses||[]).length>0 || !!state.settings.subjectName;
  const hadChannel=(state.nvContent||[]).length>0 || (state.nvInsights||[]).length>0 || Number(state.nvAnalytics?.views||0)>0 || Number(state.settings.nvSubscribers||0)>0;
  if(hadEducation && (!state.settings.institutionName || state.settings.institutionName==="")){
    state.settings.educationLabel="PUC";
state.settings.institutionName="PUC";
    state.settings.programName=state.settings.programName||"Marketing: Estratégias de Negócio e Experiência do Cliente";
  }
  if(hadChannel && (!state.settings.channelName || state.settings.channelName==="Meu Canal")){
    state.settings.channelLabel="Canal";
state.settings.channelName="Meu Canal";
state.settings.channelHandle="";
state.settings.channelPlatform="YouTube";
    state.settings.channelUrl="";
state.settings.channelPillars="Cinema, Games, HQs, Submundos";
state.settings.channelTagline="Cultura pop sem ser básica.";
    state.settings.channelPrimary="#000000";
state.settings.channelAccent="#b01a1a";
  }
  if(!normalizeInterests(state.settings.interests).length){
    const seeds=[];
if(hadChannel)seeds.push(...String(state.settings.channelPillars||"").split(","));
if((state.games||[]).length)seeds.push("Games");
if((state.books||[]).length)seeds.push("Livros");
if(hadEducation)seeds.push("Marketing","Carreira");
state.settings.interests=normalizeInterests(seeds);
  }
  state.meta.productV26Migrated=true;
  localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
}
function normalizeV27InspirationProfile(){
  state.meta=state.meta||{};
if(state.meta.productV27InspirationMigrated)return;
  if(!normalizeInterests(state.settings.interests).length){
    const seeds=[];
    if((state.nvContent||[]).length || (state.nvInsights||[]).length)seeds.push(...String(state.settings.channelPillars||"").split(","));
    if((state.games||[]).length)seeds.push("Games");
    if((state.books||[]).length)seeds.push("Livros");
    if((state.savedProperties||[]).length)seeds.push("Casa e interiores","Arquitetura");
    if((state.pucCourses||[]).length)seeds.push("Marketing","Carreira");
    if((state.relationshipsTrips||[]).length)seeds.push("Viagens","Fotografia");
    state.settings.interests=normalizeInterests(seeds);
  }
  state.meta.productV27InspirationMigrated=true;
  localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
}
function normalizeV28TasteProfile(){
  state.meta=state.meta||{};
  state.inspirationTaste={...deepClone(DEFAULT_STATE.inspirationTaste),...(state.inspirationTaste||{}),interestScores:{...(state.inspirationTaste?.interestScores||{})},termScores:{...(state.inspirationTaste?.termScores||{})},domainScores:{...(state.inspirationTaste?.domainScores||{})},dismissed:[...(state.inspirationTaste?.dismissed||[])],actions:[...(state.inspirationTaste?.actions||[])]};
  if(state.meta.productV28TasteMigrated)return;
  for(const interest of normalizeInterests(state.settings.interests)) state.inspirationTaste.interestScores[interest]=(Number(state.inspirationTaste.interestScores[interest]||0)+1.5);
  for(const pin of (state.inspirationPins||[]).slice(0,80)){
    const interest=String(pin.interest||"").trim();
if(interest)state.inspirationTaste.interestScores[interest]=(Number(state.inspirationTaste.interestScores[interest]||0)+2.5);
    try{const d=new URL(pin.source||"").hostname.replace(/^www\./,"");
if(d)state.inspirationTaste.domainScores[d]=(Number(state.inspirationTaste.domainScores[d]||0)+1)}catch(e){}
  }
  state.inspirationTaste.signals=Math.max(Number(state.inspirationTaste.signals||0),(state.inspirationPins||[]).length);
  state.inspirationTaste.updatedAt=new Date().toISOString();
  state.meta.productV28TasteMigrated=true;
  localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
}
function mixColor(hex,target="#ffffff",ratio=.12){
  const norm=x=>String(x||"").replace("#","").padEnd(6,"0").slice(0,6),a=norm(hex),b=norm(target),out=[];
for(let i=0;i<3;i++){const x=parseInt(a.slice(i*2,i*2+2),16),y=parseInt(b.slice(i*2,i*2+2),16);
out.push(Math.round(x+(y-x)*ratio).toString(16).padStart(2,"0"))}return `#${out.join("")}`;
}
function applyAppearance(){
  const preset=THEME_PRESETS[state.settings.uiThemePreset]||THEME_PRESETS.editorial;
  const font=FONT_PRESETS[state.settings.uiFontPreset]||FONT_PRESETS[preset.font]||FONT_PRESETS.editorial;
  const root=document.documentElement.style;
  root.setProperty("--brand-navy",state.settings.uiPrimary||preset.primary);
  root.setProperty("--brand-blue",state.settings.uiAccent||preset.accent);
  root.setProperty("--brand-teal",state.settings.uiAccent||preset.accent);
  root.setProperty("--brand-wine",state.settings.uiAccent||preset.accent);
  if((state.settings.theme||"light")!=="dark"){
    const paper=state.settings.uiPaper||preset.paper;
root.setProperty("--paper2",paper);
root.setProperty("--paper",mixColor(paper,"#000000",.035));
root.setProperty("--paper3",mixColor(paper,"#ffffff",.24));
root.setProperty("--white",mixColor(paper,"#ffffff",.62));
  }else{for(const key of ["--paper","--paper2","--paper3","--white"])root.removeProperty(key);
}
  root.setProperty("--font-body",font.body);
root.setProperty("--font-display",font.display);
  root.setProperty("--channel-primary",state.settings.channelPrimary||"#000000");
root.setProperty("--channel-accent",state.settings.channelAccent||"#b01a1a");
}
function applyThemePreset(id,{save=true}={}){
  const p=THEME_PRESETS[id];
if(!p)return;
  state.settings.uiThemePreset=id;
state.settings.uiPrimary=p.primary;
state.settings.uiAccent=p.accent;
state.settings.uiPaper=p.paper;
state.settings.uiFontPreset=p.font;
  applyAppearance();
if(save)saveState();
renderAppearanceControls();
}
function channelPillars(){return String(state.settings.channelPillars||"").split(",").map(x=>x.trim()).filter(Boolean).slice(0,12)}
function channelUrl(){
  if(state.settings.channelUrl)return state.settings.channelUrl;
  const h=String(state.settings.channelHandle||"").trim();
if(!h)return "";
  const handle=h.startsWith("@")?h:`@${h}`;
  const p=state.settings.channelPlatform||"YouTube";
  if(p==="YouTube")return `https://www.youtube.com/${handle}`;
  if(p==="TikTok")return `https://www.tiktok.com/${handle}`;
  if(p==="Instagram")return `https://www.instagram.com/${handle.replace(/^@/,"")}/`;
  if(p==="Twitch")return `https://www.twitch.tv/${handle.replace(/^@/,"")}`;
  return "";
}
function applyProductLabels(){
  const edu=state.settings.educationLabel||state.settings.institutionName||"Estudos",inst=state.settings.institutionName||"",program=state.settings.programName||"";
  if($("#educationNavLabel"))$("#educationNavLabel").textContent=edu;
  if($("#educationLauncherLabel"))$("#educationLauncherLabel").textContent=edu;
  if($("#educationLauncherSub"))$("#educationLauncherSub").textContent=inst||program||"instituição / curso";
  if($("#educationModuleControlLabel"))$("#educationModuleControlLabel").textContent=edu;
  if($("#educationEyebrow"))$("#educationEyebrow").textContent=(inst||edu).toUpperCase();
  if($("#educationHeading"))$("#educationHeading").textContent=program||edu;
  if($("#educationDescription"))$("#educationDescription").textContent=inst?`${inst}${program?` · ${program}`:""}. Organize matérias, módulos, aulas, leituras e sessões do seu jeito.`:"Organize matérias, módulos, aulas, leituras e sessões conforme sua instituição ou curso.";
  if($("#educationTimelineTitle"))$("#educationTimelineTitle").textContent=inst?`Cronograma · ${inst}.`:"Cronograma.";
  if($("#todayStudyLabel"))$("#todayStudyLabel").textContent=edu.toUpperCase();
  if($("#studyMinutesLabel"))$("#studyMinutesLabel").textContent=`Minutos de ${edu.toLowerCase()} hoje`;
  if($("#educationMonthlyCostLabel"))$("#educationMonthlyCostLabel").textContent=`${edu} / mês`;

  const channelLabel=state.settings.channelLabel||state.settings.channelName||"Canal",channelName=state.settings.channelName||"Meu Canal",handle=state.settings.channelHandle||"@canal",platform=state.settings.channelPlatform||"YouTube",pillars=channelPillars();
  if($("#channelNavLabel"))$("#channelNavLabel").textContent=channelLabel;
  if($("#channelLauncherLabel"))$("#channelLauncherLabel").textContent=channelLabel;
  if($("#channelModuleControlLabel"))$("#channelModuleControlLabel").textContent=channelLabel;
  if($("#channelSnapshotHandle"))$("#channelSnapshotHandle").textContent=handle||channelName;
  if($("#channelSnapshotSubscribers"))$("#channelSnapshotSubscribers").textContent=`${Number(state.settings.nvSubscribers||0).toLocaleString("pt-BR")} seguidores`;
  if($("#channelSnapshotVideos"))$("#channelSnapshotVideos").textContent=`${(state.nvContent||[]).filter(x=>x.status==="published").length} publicados`;
  if($("#channelSnapshotMeta"))$("#channelSnapshotMeta").textContent=platform;
  if($("#channelPlatformShortcut"))$("#channelPlatformShortcut").textContent=platform;
  if($("#channelHandleShortcut"))$("#channelHandleShortcut").textContent=handle||channelName;
  if($("#channelHeroMeta"))$("#channelHeroMeta").textContent=[handle,...pillars].filter(Boolean).join(" · ");
  if($("#channelAnalyticsLabel"))$("#channelAnalyticsLabel").textContent=`${platform.toUpperCase()} / ANALYTICS`;
  if($("#reportChannelLabel"))$("#reportChannelLabel").textContent=channelLabel.toUpperCase();
  if($("#noteChannelAreaOption"))$("#noteChannelAreaOption").textContent=channelLabel;
  if($("#nvPillar")){const current=$("#nvPillar").value;
$("#nvPillar").innerHTML=(pillars.length?pillars:["Conteúdo"]).map(x=>`<option ${x===current?"selected":""}>${escapeHTML(x)}</option>`).join("");
}
}
function svgData(svg){return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
function genericChannelAsset(type){
  const name=state.settings.channelName||"Meu Canal",initials=initialsFromName(name),primary=state.settings.channelPrimary||"#111111",accent=state.settings.channelAccent||"#6f7c87";
  if(type==="icon")return svgData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="96" fill="${primary}"/><circle cx="256" cy="256" r="150" fill="none" stroke="${accent}" stroke-width="18"/><text x="256" y="290" text-anchor="middle" font-family="Arial,sans-serif" font-size="112" font-weight="700" fill="white">${initials}</text></svg>`);
  if(type==="logo")return svgData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300"><rect width="1200" height="300" fill="${primary}"/><rect x="0" y="282" width="1200" height="18" fill="${accent}"/><text x="70" y="190" font-family="Arial,sans-serif" font-size="118" font-weight="700" fill="white">${escapeHTML(name)}</text></svg>`);
  return svgData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 620"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="${primary}"/><stop offset="1" stop-color="${accent}" stop-opacity=".72"/></linearGradient></defs><rect width="1920" height="620" fill="url(#g)"/><circle cx="1470" cy="140" r="420" fill="none" stroke="white" stroke-opacity=".08" stroke-width="2"/><text x="100" y="350" font-family="Arial,sans-serif" font-size="180" font-weight="700" fill="white" fill-opacity=".15">${escapeHTML(name)}</text></svg>`);
}
function applyChannelBrand(){
  applyAppearance();
  const chFont=state.settings.channelFontPreset==="impact"?"Impact,'Arial Black',sans-serif":(FONT_PRESETS[state.settings.channelFontPreset]?.display||"Impact,'Arial Black',sans-serif");
document.documentElement.style.setProperty("--channel-font",chFont);
  const legacy=false;
  const logo=state.settings.channelLogo||(legacy?"assets/nv-logo-user.png":genericChannelAsset("logo")),icon=state.settings.channelIcon||(legacy?"assets/nv-icon-user.png":genericChannelAsset("icon")),banner=state.settings.channelBanner||(legacy?"assets/nv-banner.png":genericChannelAsset("banner"));
  ["#channelBrandLogo","#channelHeroLogo"].forEach(s=>{const el=$(s);if(el)el.src=logo});
  ["#channelBrandIcon","#channelHeroIcon"].forEach(s=>{const el=$(s);if(el)el.src=icon});
  if($("#channelBannerImage"))$("#channelBannerImage").src=banner;
  const navImg=$(".nv-nav-item .nv-image-icon img"),launchImg=$(".launcher-nv .nv-image-icon img");
if(navImg)navImg.src=icon;
if(launchImg)launchImg.src=icon;
}
function renderAppearanceControls(){
  if($("#controlThemePresets")){ $("#controlThemePresets").innerHTML=presetMarkup(state.settings.uiThemePreset);
 $$('[data-theme-preset]',$("#controlThemePresets")).forEach(b=>b.addEventListener("click",()=>applyThemePreset(b.dataset.themePreset)));
 }
  if($("#onboardThemePresets")&&!$("#onboardThemePresets").dataset.ready){$("#onboardThemePresets").innerHTML=presetMarkup(state.settings.uiThemePreset);
$("#onboardThemePresets").dataset.ready="1";
}
  if($("#controlFontPreset"))$("#controlFontPreset").innerHTML=fontOptions(state.settings.uiFontPreset);
  if($("#onboardFontPreset"))$("#onboardFontPreset").innerHTML=fontOptions(state.settings.uiFontPreset);
  if($("#controlPrimaryColor"))$("#controlPrimaryColor").value=state.settings.uiPrimary||"#20384f";
  if($("#controlAccentColor"))$("#controlAccentColor").value=state.settings.uiAccent||"#3e7a83";
  if($("#onboardPrimaryColor"))$("#onboardPrimaryColor").value=state.settings.uiPrimary||"#20384f";
  if($("#onboardAccentColor"))$("#onboardAccentColor").value=state.settings.uiAccent||"#3e7a83";
}
function renderProductConfigInputs(){
  const pairs={controlEducationLabel:"educationLabel",controlInstitutionName:"institutionName",controlProgramName:"programName",controlStudyStructure:"studyStructure",controlChannelLabel:"channelLabel",controlChannelName:"channelName",controlChannelHandle:"channelHandle",controlChannelPlatform:"channelPlatform",channelConfigName:"channelName",channelConfigHandle:"channelHandle",channelConfigPlatform:"channelPlatform",channelConfigPillars:"channelPillars",channelConfigTagline:"channelTagline",channelConfigUrl:"channelUrl"};
  Object.entries(pairs).forEach(([id,key])=>{const el=$("#"+id);if(el&&document.activeElement!==el)el.value=state.settings[key]??""});
  if($("#channelColorPrimary"))$("#channelColorPrimary").value=state.settings.channelPrimary||"#000000";
  if($("#channelColorAccent"))$("#channelColorAccent").value=state.settings.channelAccent||"#b01a1a";
  if($("#channelFontPreset"))$("#channelFontPreset").value=state.settings.channelFontPreset||"impact";
}
function bindProductConfig(){
  const pairs={controlEducationLabel:"educationLabel",controlInstitutionName:"institutionName",controlProgramName:"programName",controlStudyStructure:"studyStructure",controlChannelLabel:"channelLabel",controlChannelName:"channelName",controlChannelHandle:"channelHandle",controlChannelPlatform:"channelPlatform",channelConfigName:"channelName",channelConfigHandle:"channelHandle",channelConfigPlatform:"channelPlatform",channelConfigPillars:"channelPillars",channelConfigTagline:"channelTagline",channelConfigUrl:"channelUrl"};
  Object.entries(pairs).forEach(([id,key])=>$("#"+id)?.addEventListener("input",e=>{state.settings[key]=e.target.value;saveState();applyProductLabels();renderProductConfigInputs();if(key.startsWith("channel"))applyChannelBrand()}));
  $("#controlFontPreset")?.addEventListener("change",e=>{state.settings.uiFontPreset=e.target.value;saveState();applyAppearance();renderAppearanceControls()});
  $("#controlPrimaryColor")?.addEventListener("input",e=>{state.settings.uiThemePreset="custom";state.settings.uiPrimary=e.target.value;saveState();applyAppearance()});
  $("#controlAccentColor")?.addEventListener("input",e=>{state.settings.uiThemePreset="custom";state.settings.uiAccent=e.target.value;saveState();applyAppearance()});
  $("#controlResetAppearance")?.addEventListener("click",()=>applyThemePreset("editorial"));
  $("#channelColorPrimary")?.addEventListener("input",e=>{state.settings.channelPrimary=e.target.value;saveState();applyChannelBrand()});
  $("#channelColorAccent")?.addEventListener("input",e=>{state.settings.channelAccent=e.target.value;saveState();applyChannelBrand()});
  $("#channelFontPreset")?.addEventListener("change",e=>{state.settings.channelFontPreset=e.target.value;saveState();applyChannelBrand()});
  const imgBind=(id,key,maxW)=>$(id)?.addEventListener("change",async e=>{const f=e.target.files?.[0];if(!f)return;try{state.settings[key]=await resizeImageFile(f,maxW,.82);saveState();applyChannelBrand();toast("Identidade do canal atualizada.")}catch(err){toast("Não consegui processar a imagem.")}e.target.value=""});
  imgBind("#channelLogoUpload","channelLogo",1200);
imgBind("#channelIconUpload","channelIcon",480);
imgBind("#channelBannerUpload","channelBanner",1920);
  $("#channelBrandReset")?.addEventListener("click",()=>{state.settings.channelLogo="";state.settings.channelIcon="";state.settings.channelBanner="";state.settings.channelPrimary="#000000";state.settings.channelAccent="#b01a1a";state.settings.channelFontPreset="impact";saveState();applyChannelBrand();renderProductConfigInputs()});
}

function bytesToB64(bytes){let s="";
bytes.forEach(b=>s+=String.fromCharCode(b));
return btoa(s)}
function b64ToBytes(s){const raw=atob(s),a=new Uint8Array(raw.length);
for(let i=0;i<raw.length;i++)a[i]=raw.charCodeAt(i);
return a}
async function authHash(password,saltB64){
  const enc=new TextEncoder(),salt=b64ToBytes(saltB64),key=await crypto.subtle.importKey("raw",enc.encode(password),"PBKDF2",false,["deriveBits"]),bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt,iterations:120000,hash:"SHA-256"},key,256);
return bytesToB64(new Uint8Array(bits));
}
function newSalt(){const a=new Uint8Array(16);
crypto.getRandomValues(a);
return bytesToB64(a)}
async function sha256B64(value){const data=new TextEncoder().encode(String(value||"")),bits=await crypto.subtle.digest("SHA-256",data);
return bytesToB64(new Uint8Array(bits))}
function authDeviceId(){let id=localStorage.getItem("myway_device_id");
if(!id){const a=new Uint8Array(16);
crypto.getRandomValues(a);
id=bytesToB64(a).replace(/[+/=]/g,"").slice(0,22);
localStorage.setItem("myway_device_id",id)}return id}
function authDeviceTokenKey(){return `myway_device_token_${String(state.account?.loginId||"user").toLowerCase()}`}
function authForcedLockKey(){return "myway_forced_lock"}
function randomAuthToken(){const a=new Uint8Array(32);
crypto.getRandomValues(a);
return bytesToB64(a)}
async function rememberCurrentDevice(){
  if(!state.account?.configured)return;
  const token=randomAuthToken(),hash=await sha256B64(token),id=authDeviceId();
  state.account.trustedDevices={...(state.account.trustedDevices||{})};
  state.account.trustedDevices[id]={hash,createdAt:state.account.trustedDevices[id]?.createdAt||new Date().toISOString(),lastUsedAt:new Date().toISOString()};
  localStorage.setItem(authDeviceTokenKey(),token);
localStorage.removeItem(authDeviceKey());
saveState();
}
async function forgetCurrentDevice(){
  const id=authDeviceId();
localStorage.removeItem(authDeviceTokenKey());
localStorage.removeItem(authDeviceKey());
  if(state.account?.trustedDevices?.[id]){delete state.account.trustedDevices[id];
saveState()}
}
async function currentDeviceTrusted(){
  if(sessionStorage.getItem(authForcedLockKey())==="1")return false;
  const id=authDeviceId(),token=localStorage.getItem(authDeviceTokenKey()),record=state.account?.trustedDevices?.[id];
  if(token&&record?.hash){const hash=await sha256B64(token);
if(hash===record.hash){record.lastUsedAt=new Date().toISOString();
return true}}
  // One-time migration from the old v26/v27 remembered-login token.
  const legacy=localStorage.getItem(authDeviceKey());
  if(legacy&&legacy===String(state.account?.passwordHash||"").slice(0,24)){await rememberCurrentDevice();
return true}
  return false;
}
let onboardingStep=1;
function authDeviceKey(){return `myway_auth_${(state.account?.loginId||"user").toLowerCase()}`}
function setAuthMode(mode){
  if(mode!=="loading")window.MyWay41Ready=true;
  $("#authLoadingPanel").hidden=mode!=="loading";
$("#loginPanel").hidden=mode!=="login";
$("#onboardingPanel").hidden=mode!=="onboarding";
  if(mode==="off"){document.body.classList.remove("auth-locked");
$("#authGate").hidden=true}else{document.body.classList.add("auth-locked");
$("#authGate").hidden=false}
}
const INTEREST_PRESETS=["Design","Cinema","Games","Tecnologia","Marketing","Casa e interiores","Viagens","Moda","Fotografia","Arquitetura","Livros","Fitness","Carreira","Arte"];
let onboardingInterestSelection=new Set();
function normalizeInterests(value=state.settings.interests){
  const raw=Array.isArray(value)?value:String(value||"").split(",");
  const seen=new Set(),out=[];
  for(const item of raw){const x=String(item||"").trim();
if(!x)continue;
const k=x.toLowerCase();
if(seen.has(k))continue;
seen.add(k);
out.push(x)}
  return out.slice(0,30);
}
function collectOnboardInterests(){
  const custom=String($("#onboardInterests")?.value||"").split(",").map(x=>x.trim()).filter(Boolean);
  return normalizeInterests([...onboardingInterestSelection,...custom]);
}
function renderOnboardInterestPresets(){
  const box=$("#onboardInterestPresets");
if(!box)return;
  $$('[data-interest]',box).forEach(btn=>btn.classList.toggle("selected",onboardingInterestSelection.has(btn.dataset.interest)));
}
function prefillOnboarding(){
  $("#onboardName").value=state.settings.profileName==="Seu nome"?"":state.settings.profileName||"";
$("#onboardRole").value=state.settings.profileRole==="Seu foco"?"":state.settings.profileRole||"";
if($("#onboardUser"))$("#onboardUser").value=state.account?.loginId||"";
  $("#onboardInstitution").value=state.settings.institutionName||"";
$("#onboardProgram").value=state.settings.programName||"";
$("#onboardEducationLabel").value=state.settings.educationLabel||"Estudos";
$("#onboardStudyStructure").value=state.settings.studyStructure||"subjects";
const studyEnabled126=state.settings.featurePuc===true;
if($("#onboardStudyEnabled126"))$("#onboardStudyEnabled126").checked=studyEnabled126;
if($("#onboardStudyFields126"))$("#onboardStudyFields126").hidden=!studyEnabled126;
  $("#onboardChannelName").value=state.settings.channelName||"";
$("#onboardChannelHandle").value=state.settings.channelHandle||"";
$("#onboardChannelPlatform").value=state.settings.channelPlatform||"YouTube";
$("#onboardChannelPillars").value=state.settings.channelPillars||"";
$("#onboardChannelTagline").value=state.settings.channelTagline||"";
  const currentInterests=normalizeInterests();
onboardingInterestSelection=new Set(currentInterests.filter(x=>INTEREST_PRESETS.includes(x)));
if($("#onboardInterests"))$("#onboardInterests").value=currentInterests.filter(x=>!INTEREST_PRESETS.includes(x)).join(", ");
renderOnboardInterestPresets();
  Object.entries(FEATURE_SETTINGS).forEach(([target,key])=>{const enabled=key==='featurePuc'?state.settings[key]===true:state.settings[key]!==false;$(`#onboardModules input[value="${target}"]`)?.toggleAttribute("checked",enabled);const el=$(`#onboardModules input[value="${target}"]`);if(el)el.checked=enabled});
  prefillNavigationSetup34();
prefillProfile35();
renderAppearanceControls();
}
function renderOnboardStep(){
 const route=typeof onboardingSteps38==='function'?onboardingSteps38():[1,2,3,4,5,7],index=Math.max(0,route.indexOf(onboardingStep)),last=route[route.length-1];
 $$('[data-onboard-step]').forEach(x=>x.classList.toggle('active',Number(x.dataset.onboardStep)===onboardingStep));
 $('#onboardingStepLabel').textContent=`${index+1} / ${route.length}`;
 $('#onboardingProgress').style.width=`${((index+1)/route.length)*100}%`;
 $('#onboardBack').disabled=index===0;
 $('#onboardNext').textContent=onboardingStep===last?'Concluir configuração':'Continuar';
 if(onboardingStep===1)renderOnboardInterestPresets();
if(onboardingStep===3)renderNavigationSetup34();
 if(onboardingStep===5){
  const study=$("#onboardStudyEnabled126"),fields=$("#onboardStudyFields126"),module=$('#onboardModules input[value="puc"]');
  if(study&&module&&study.checked!==module.checked)study.checked=module.checked;
  if(fields&&study)fields.hidden=!study.checked;
 }
 if(onboardingStep===7){
  const full=$('input[name="onboardNavigationMode"]:checked')?.value==='full',interests=collectOnboardInterests().join(' · '),priorities=$$('[data-onboard-priority34]').map(x=>V34_MODULE_NAMES[x.value]).filter(Boolean).join(' · ');
  const rows=[['Área',WORKSPACES38.find(p=>p.id===$('[name=onboardGoal38]:checked')?.value)?.title||'Minha área'],['Aparência',state.settings.theme==='dark'?'Modo escuro':'Modo claro'],['Perfil',$('#onboardName').value],['Interesses',interests||'Escolher depois'],['Modo',full?'Completo · R$ 0':'Essencial'],['Painel',$('#onboardDashboardTitle35').value||'Uma coisa de cada vez.'],['Prioridades',full?'Todas as áreas disponíveis':priorities||'Escolher depois'],['Academia',({yes:'Já treino',start:'Quero começar',no:'Não é meu foco',private:'Prefiro não responder'})[$('#onboardGym35').value]||'Escolher depois'],['TDAH',({yes:'Sim',no:'Não',unsure:'Não sei / estou investigando',private:'Prefiro não responder'})[$('#onboardAdhd35').value]||'Escolher depois'],['Bloco de foco','25 minutos por padrão'],['Estudos',$('#onboardStudyEnabled126')?.checked?($('#onboardInstitution').value||'Ativado · configurar depois'):'Não usar agora'],['Pomodoro','Ajustável nas configurações do widget']];
  $('#onboardSummary').innerHTML=rows.map(([label,value])=>`<div><span>${escapeHTML(label)}</span><b>${escapeHTML(value)}</b></div>`).join('');
 }
 $('#onboardError').textContent='';
$('#onboardingPanel').scrollTop=0;
}

async function finishOnboarding(){
  const name=$("#onboardName")?.value.trim()||"";
  const cloudProfile=!!state.cloud53?.owner&&state.account?.configured===true;
  if(!name){$("#onboardError").textContent="Como você quer ser chamado(a)?";onboardingStep=1;renderOnboardStep();return;}
  if(!cloudProfile){$("#onboardError").textContent="Entre ou crie sua conta antes de configurar o MyWay.";setAuthMode("login");return;}
  state.settings.profileName=name;
  state.settings.profileRole=$("#onboardRole")?.value.trim()||"";
  state.settings.institutionName=$("#onboardInstitution")?.value.trim()||"";
  state.settings.programName=$("#onboardProgram")?.value.trim()||"";
  state.settings.educationLabel=$("#onboardEducationLabel")?.value.trim()||"Estudos";
  state.settings.studyStructure=$("#onboardStudyStructure")?.value||"subjects";
  state.settings.channelName=$("#onboardChannelName")?.value.trim()||"Meu Canal";
  state.settings.channelLabel=state.settings.channelName;
  state.settings.channelHandle=$("#onboardChannelHandle")?.value.trim()||"";
  state.settings.channelPlatform=$("#onboardChannelPlatform")?.value||"YouTube";
  state.settings.channelPillars=$("#onboardChannelPillars")?.value.trim()||"";
  state.settings.channelTagline=$("#onboardChannelTagline")?.value.trim()||"";
  state.settings.uiFontPreset=$("#onboardFontPreset")?.value||state.settings.uiFontPreset;
  state.settings.interests=collectOnboardInterests();
  const studyEnabledSave126=$("#onboardStudyEnabled126")?.checked===true;
  const studyModule126=$('#onboardModules input[value="puc"]');if(studyModule126)studyModule126.checked=studyEnabledSave126;
  Object.entries(FEATURE_SETTINGS).forEach(([target,key])=>{const el=$(`#onboardModules input[value="${target}"]`);if(el)state.settings[key]=el.checked});
  saveNavigationSetup34();saveProfile35();saveWorkspaceQuestion38();
  state.settings.tutorialSeen=false;
  ensureMasterWorkspaceDefaults();
  grantReward34("setup36:profile",20,"Perfil e prioridades configurados",todayISO());
  saveState();
  sessionStorage.removeItem(authForcedLockKey());
  applyInterfacePreferences();applyAccessProfile();renderAll();setAuthMode("off");startAutoLockWatch();showFirstRunTutorial();
  toast("MyWay configurado.","Você pode alterar tudo depois em Controle.");
}
async function initAuthFlow(){
  if(location.hash==="#sticky"){setAuthMode("off");
return;
}
  normalizeLegacyProductProfile();
applyInterfacePreferences();
renderProfileIdentity();
  if(!state.account?.configured){
    if($("#loginUser"))$("#loginUser").value="";
if($("#loginProfileName"))$("#loginProfileName").textContent="MyWay";
if($("#loginProfileRole"))$("#loginProfileRole").textContent="Entre ou crie seu workspace";
if($("#loginProfileHint"))$("#loginProfileHint").textContent="Entre em uma conta existente ou crie uma nova.";
if($("#loginDeviceStatus"))$("#loginDeviceStatus").textContent="Nenhuma conta configurada neste dispositivo.";
    prefillOnboarding();
onboardingStep=1;
renderOnboardStep();
setAuthMode("onboarding");
return
  }
  $("#loginUser").value=state.account.loginId||"";
  $("#loginProfileHint").textContent=state.settings.profileName?`Workspace de ${state.settings.profileName}.`:"Entre no seu workspace.";
  if($("#loginLastAccess"))$("#loginLastAccess").textContent=state.account.lastLoginAt?`Último acesso: ${new Date(state.account.lastLoginAt).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}`:"Primeiro acesso neste workspace";
  const trusted=await currentDeviceTrusted();
if($("#loginDeviceStatus"))$("#loginDeviceStatus").textContent=trusted?"Computador confiável.":"Senha necessária neste acesso.";
  if(trusted){state.account.lastLoginAt=new Date().toISOString();
ensureMasterWorkspaceDefaults();
saveState();
applyAccessProfile();
setAuthMode("off");
startAutoLockWatch();
if(state.settings.tutorialSeen!==true)showFirstRunTutorial();
return}
  setAuthMode("login");
setTimeout(()=>$("#loginPassword")?.focus(),80);
}
let loginFailures=0,loginCooldownUntil=0,loginCooldownTimer=null;
function loginCooldownTick(){
  const left=Math.max(0,Math.ceil((loginCooldownUntil-Date.now())/1000)),el=$("#loginCooldown"),btn=$("#loginSubmit");
  if(left>0){if(el){el.hidden=false;
el.textContent=`aguarde ${left}s`};
if(btn)btn.disabled=true}
  else{if(el)el.hidden=true;
if(btn)btn.disabled=false;
if(loginCooldownTimer){clearInterval(loginCooldownTimer);
loginCooldownTimer=null}}
}
async function submitLogin(){
  if(!state.account?.configured){$("#loginError").textContent="Ainda não existe uma conta local neste workspace. Use “Criar uma conta”.";
return}
  if(Date.now()<loginCooldownUntil){loginCooldownTick();
return}
  const login=$("#loginUser").value.trim(),password=$("#loginPassword").value;
if(!login||!password){$("#loginError").textContent="Informe usuário e senha.";
return}
  $("#loginError").textContent="Verificando...";
  try{
    const hash=await authHash(password,state.account.salt);
    if(login.toLowerCase()!==String(state.account.loginId||"").toLowerCase()||hash!==state.account.passwordHash){
      loginFailures++;
$("#loginError").textContent=loginFailures>=5?"Muitas tentativas incorretas. Aguarde 30 segundos.":"Usuário ou senha incorretos.";
      if(loginFailures>=5){loginFailures=0;
loginCooldownUntil=Date.now()+30000;
loginCooldownTimer=setInterval(loginCooldownTick,500);
loginCooldownTick()}
      return;
    }
    loginFailures=0;
state.account.lastLoginAt=new Date().toISOString();
sessionStorage.removeItem(authForcedLockKey());
ensureMasterWorkspaceDefaults();
    if($("#loginRemember").checked)await rememberCurrentDevice();
else await forgetCurrentDevice();
    saveState();
$("#loginError").textContent="";
$("#loginPassword").value="";
applyAccessProfile();
setAuthMode("off");
renderProfileIdentity();
renderAll();
startAutoLockWatch();
if(state.settings.tutorialSeen!==true)showFirstRunTutorial();
  }catch(e){$("#loginError").textContent="Não foi possível validar o acesso."}
}
$("#loginSubmit")?.addEventListener("click",submitLogin);
$("#loginCreateAccount")?.addEventListener("click",()=>{prefillOnboarding();onboardingStep=1;renderOnboardStep();setAuthMode("onboarding")});
$("#loginPassword")?.addEventListener("keydown",e=>{if(e.key==="Enter")submitLogin()});
$("#loginPasswordToggle")?.addEventListener("click",()=>{const input=$("#loginPassword"),show=input.type==="password";input.type=show?"text":"password";$("#loginPasswordToggle").textContent=show?"ocultar":"mostrar"});
$("#loginResetLocal")?.addEventListener("click",()=>{showMessage("Por segurança, o MyWay não redefine a senha silenciosamente pela tela de login. Se este é o seu workspace e você perdeu o acesso, restaure um backup/OneDrive conhecido ou use a configuração inicial a partir de um workspace novo.")});
$("#onboardBack")?.addEventListener("click",()=>{const route=onboardingSteps38(),index=route.indexOf(onboardingStep);if(index>0){onboardingStep=route[index-1];renderOnboardStep();}});
$("#onboardNext")?.addEventListener("click",async()=>{if(onboardingStep===1&&!$("#onboardName").value.trim()){$("#onboardError").textContent="Como você quer ser chamado(a)?";return}$("#onboardError").textContent="";const route=onboardingSteps38(),index=route.indexOf(onboardingStep);if(index<route.length-1){onboardingStep=route[index+1];renderOnboardStep()}else await finishOnboarding()});
$("#onboardInterestPresets")?.addEventListener("click",e=>{const b=e.target.closest("[data-interest]");if(!b)return;const x=b.dataset.interest;if(onboardingInterestSelection.has(x))onboardingInterestSelection.delete(x);else onboardingInterestSelection.add(x);renderOnboardInterestPresets()});
$("#onboardThemePresets")?.addEventListener("click",e=>{const b=e.target.closest("[data-theme-preset]");if(!b)return;const p=THEME_PRESETS[b.dataset.themePreset];state.settings.uiThemePreset=b.dataset.themePreset;state.settings.uiPrimary=p.primary;state.settings.uiAccent=p.accent;state.settings.uiPaper=p.paper;state.settings.uiFontPreset=p.font;applyAppearance();$("#onboardThemePresets").innerHTML=presetMarkup(state.settings.uiThemePreset);renderAppearanceControls()});
$("#onboardPrimaryColor")?.addEventListener("input",e=>{state.settings.uiThemePreset="custom";state.settings.uiPrimary=e.target.value;applyAppearance()});
$("#onboardAccentColor")?.addEventListener("input",e=>{state.settings.uiThemePreset="custom";state.settings.uiAccent=e.target.value;applyAppearance()});
$("#onboardFontPreset")?.addEventListener("change",e=>{state.settings.uiFontPreset=e.target.value;applyAppearance()});
