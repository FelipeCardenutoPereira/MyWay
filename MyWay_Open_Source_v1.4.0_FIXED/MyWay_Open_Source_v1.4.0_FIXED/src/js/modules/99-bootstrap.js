/* v1.3.7 · bootstrap tolerante a falhas.
   Um erro em um módulo antigo não pode impedir os módulos MVC/feature que vêm depois no bundle
   (wallpaper, modo enxuto, inspiração, etc.) de serem carregados. */
const MW_BOOT_ERRORS137=[];
function mwBootSafe137(name,fn){
  try{return fn();}
  catch(error){
    MW_BOOT_ERRORS137.push({name,message:String(error?.message||error)});
    try{console.error('[MyWay boot]',name,error);}catch{}
    return undefined;
  }
}
window.MYWAY_BOOT_ERRORS137=MW_BOOT_ERRORS137;

for(const [name,fn] of [
  ['init34',()=>init34()],['initResilience34',()=>initResilience34()],['init35',()=>init35()],['init36',()=>init36()],
  ['initTheme37',()=>initTheme37()],['initLearning37',()=>initLearning37()],['initWorkspaces38',()=>initWorkspaces38()],
  ['initAnxiety39',()=>initAnxiety39()],['initMedia40',()=>initMedia40()],['initPersonal40',()=>initPersonal40()],
  ['initFinance40',()=>initFinance40()],['initTriggerTree40',()=>initTriggerTree40()],['initCore40',()=>initCore40()],
  ['initGuides40',()=>initGuides40()],['initFeatures41',()=>initFeatures41()],['initNavigationTree41',()=>initNavigationTree41()],
  ['initEmployment41',()=>initEmployment41()],['initPlatform41',()=>initPlatform41()],['initFixes42',()=>initFixes42()],
  ['initMobile43',()=>initMobile43()],['initVisual44',()=>initVisual44()],['initBrand46',()=>initBrand46()],
  ['initConfig48',()=>initConfig48()],['initFeatures49',()=>initFeatures49()],['initAssistant51',()=>initAssistant51()],
  ['initFeatures52',()=>initFeatures52()],['initTypography53',()=>initTypography53()],['initCloud53',()=>initCloud53()],
  ['initAds54',()=>initAds54()],['initFeatures55',()=>initFeatures55()],['initAuth56',()=>initAuth56()],
  ['initExperience57',()=>initExperience57()],['initExperience58',()=>initExperience58()],['initRewards59',()=>initRewards59()],
  ['initInterface60',()=>initInterface60()],['initResilience61',()=>initResilience61()],['initAudioQuick62',()=>initAudioQuick62()],
  ['initCommercial62',()=>initCommercial62()],['initReleaseR1',()=>initReleaseR1()],['initAuthFix64',()=>initAuthFix64()],
  ['initAuthAccess125',()=>initAuthAccess125()],['initExperience65',()=>initExperience65()],['initExperience66',()=>initExperience66()],
  ['initPsychoanalysis67',()=>initPsychoanalysis67()],['initExperience68',()=>initExperience68()]
]) mwBootSafe137(name,fn);

for(const [name,fn] of [
  ['prepareV31Layout',()=>prepareV31Layout()],['clarifyForms',()=>clarifyForms()],
  ['finance-note',()=>$('#financeTxnNote')?.closest('label')?.classList.add('finance-note40')],
  ['auth-loading',()=>{document.body.classList.add('auth-locked');setAuthMode('loading');}],
  ['normalizeLegacyProductProfile',()=>normalizeLegacyProductProfile()],['normalizeV27InspirationProfile',()=>normalizeV27InspirationProfile()],
  ['normalizeV28TasteProfile',()=>normalizeV28TasteProfile()],['normalizeV29Product',()=>normalizeV29Product()],
  ['normalizeV32Product',()=>normalizeV32Product()],['applyTheme',()=>applyTheme(state.settings.theme||'light')],
  ['applyInterfacePreferences',()=>applyInterfacePreferences()],['loadDayIntoUI',()=>loadDayIntoUI()],
  ['clampSeries',()=>clampSeries()],['drawTimer',()=>drawTimer()],['ensureMonthlyReport',()=>ensureMonthlyReport()],
  ['initStickyMode',()=>initStickyMode()],['refreshNativeStatus',()=>refreshNativeStatus()]
]) mwBootSafe137(name,fn);

let hydration137;
try{hydration137=Promise.resolve(hydrateFromNative());}
catch(error){mwBootSafe137('hydrateFromNative',()=>{throw error});hydration137=Promise.resolve();}
hydration137.finally(()=>{
  for(const [name,fn] of [
    ['normalize34',()=>normalize34()],['syncRewardXP34',()=>syncRewardXP34()],['syncInputsFromState',()=>syncInputsFromState()],
    ['apply36',()=>apply36()],['ensureMasterWorkspaceDefaults',()=>{const changed=ensureMasterWorkspaceDefaults();if(changed)saveState();}],
    ['applyInterfacePreferences-final',()=>applyInterfacePreferences()],['renderAll',()=>renderAll()],['renderRoutineNow',()=>renderRoutineNow()],
    ['revealVisible',()=>revealVisible()],['checkReminders',()=>checkReminders()],
    ['sidebar-final',()=>{if(innerWidth>900)setSidebarCollapsed(state.settings.sidebarPinned!==true&&state.settings.sidebarAutoCollapse!==false);}],
    ['applyAccessProfile',()=>applyAccessProfile()],['initAuthFlow',()=>initAuthFlow()],
    ['finishPreloader',()=>setTimeout(finishPreloader,120)]
  ]) mwBootSafe137(name,fn);
  try{window.dispatchEvent(new CustomEvent('myway:hydrated',{detail:{errors:MW_BOOT_ERRORS137.slice()}}));}catch{}
});
setInterval(()=>mwBootSafe137('ensureMonthlyReport-interval',()=>ensureMonthlyReport()),30*60*1000);
window.MYWAY_BUILD_INFO=Object.freeze({version:'1.4.0',versionCode:88,uiParity:'single-auth-compact-nav-celebration',bootGuard:true});
