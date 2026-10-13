/* v68 · Contrato de tema: uma cor escolhe automaticamente contraste e superfícies. */
function contrastTone68(hex){
 const L=lumR2(hex),white=1.05/(L+.05),black=(L+.05)/.05;
 return white>=black?'dark':'light';
}
function syncThemeControls68(){
 const dark=state.settings.theme==='dark';
 document.documentElement.dataset.theme=dark?'dark':'light';
 $('#controlDarkToggle')?.classList.toggle('on',dark);
 if($('#themeToggle'))$('#themeToggle').textContent=dark?'☀':'◐';
 if($('#nativeTheme'))$('#nativeTheme').textContent=dark?'☀':'◐';
 try{syncThemeControls37?.()}catch{}
}
function applyThemeContract68(){
 const root=document.documentElement,custom=hexR2(state.settings.panelColorR2);
 if(!custom){
  document.body.dataset.panelCustomR2='false';
  document.body.dataset.panelToneR2=state.settings.theme==='dark'?'dark':'light';
  root.style.removeProperty('--panel-input-r3');root.style.removeProperty('--panel-input-text-r3');root.style.removeProperty('--panel-control-r3');root.style.removeProperty('--panel-control-text-r3');root.style.removeProperty('--panel-focus-r3');root.style.removeProperty('--panel-strong-r3');root.style.removeProperty('--panel-strong-text-r3');
  try{applySurface58?.()}catch{}
  return;
 }
 const tone=contrastTone68(custom),dark=tone==='dark',white='#ffffff',black='#000000';
 // A cor personalizada passa a ser a fonte da verdade para claro/escuro.
 state.settings.theme=tone;document.documentElement.dataset.theme=tone;
 document.body.dataset.panelCustomR2='true';document.body.dataset.panelToneR2=tone;
 const surface=mixR2(custom,dark?white:black,dark?.09:.045);
 const surface2=mixR2(custom,dark?white:black,dark?.16:.085);
 const raised=mixR2(custom,white,dark?.21:.68);
 const sidebar=mixR2(custom,black,dark?.22:.11);
 const text=dark?'#f3f7fa':'#172630',muted=dark?'#afbec8':'#5d6972';
 const input=dark?mixR2(custom,black,.16):mixR2(custom,white,.48);
 const control=dark?mixR2(custom,white,.12):mixR2(custom,black,.07);
 const strong=dark?mixR2(custom,white,.14):mixR2(custom,black,.72);
 const strongText='#ffffff';
 root.style.setProperty('--panel-r2',custom);
 root.style.setProperty('--panel-surface-r2',surface);
 root.style.setProperty('--panel-surface2-r2',surface2);
 root.style.setProperty('--panel-white-r2',raised);
 root.style.setProperty('--panel-heading-r2',text);
 root.style.setProperty('--panel-line-r2',dark?'rgba(236,245,250,.16)':'rgba(20,38,50,.16)');
 root.style.setProperty('--panel-text-r2',text);
 root.style.setProperty('--panel-muted-r2',muted);
 root.style.setProperty('--panel-sidebar-r2',sidebar);
 root.style.setProperty('--panel-sidebar-text-r2',dark?'#f5f9fb':'#162631');
 root.style.setProperty('--panel-input-r3',input);
 root.style.setProperty('--panel-input-text-r3',text);
 root.style.setProperty('--panel-control-r3',control);
 root.style.setProperty('--panel-control-text-r3',text);
 root.style.setProperty('--panel-focus-r3',state.settings.uiAccent||'#4da7bd');
 root.style.setProperty('--panel-strong-r3',strong);
 root.style.setProperty('--panel-strong-text-r3',strongText);
 // Reaproveita as regras antigas de dark/light e depois ancora superfícies na cor escolhida.
 applyAppearance();
 try{applySurface58?.()}catch{}
 root.style.setProperty('--surface-solid58',surface);
 syncThemeControls68();
}
function initThemeContract68(){
 const previous=applyPanelColorR2;
 applyPanelColorR2=function(){
  // Mantém qualquer migração/limpeza da versão anterior, mas o contrato v68 ganha prioridade.
  try{previous?.()}catch{}
  applyThemeContract68();
 };
 const input=$('#panelColorR2');
 if(input){
  input.oninput=e=>{state.settings.panelColorR2=e.target.value;applyPanelColorR2();saveState();};
  input.onchange=e=>{state.settings.panelColorR2=e.target.value;applyPanelColorR2();saveState();renderAppearanceControls?.();};
 }
 const reset=$('#panelColorResetR2');if(reset)reset.onclick=()=>{delete state.settings.panelColorR2;applyTheme(state.settings.theme||'light');applyPanelColorR2();if(input)input.value=state.settings.theme==='dark'?'#101c27':'#e7e4de';saveState();};
 applyPanelColorR2();
}
