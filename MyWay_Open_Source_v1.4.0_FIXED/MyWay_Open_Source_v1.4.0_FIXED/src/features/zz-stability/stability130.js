/* v1.3.0 · estabilidade: contraste, marca, wallpaper e regressões do menu. */
function mwLum130(color){
  const m=String(color||'').match(/rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)/i);if(!m)return null;
  const c=[+m[1],+m[2],+m[3]].map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return .2126*c[0]+.7152*c[1]+.0722*c[2];
}
function mwContrast130(a,b){return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);}
function mwAccentContrast130(){
  const root=document.documentElement,probe=document.createElement('i');probe.style.cssText='position:fixed;left:-9999px;color:var(--accent)';document.body.append(probe);
  const L=mwLum130(getComputedStyle(probe).color);probe.remove();root.style.setProperty('--mw-accent-fg130',L!=null&&mwContrast130(L,0)>=mwContrast130(L,1)?'#101820':'#ffffff');
}
function mwFixLowContrast130(){
  mwAccentContrast130();
  const selectors='button,.ghost,.primary,.utility-button,.text-button,.icon-button,.paper-card,.control-card,.widget-card58,.myway-dialog,input,select,textarea';
  document.querySelectorAll(selectors).forEach(el=>{
    el.classList.remove('mw-force-dark130','mw-force-light130');if(!el.offsetParent&&getComputedStyle(el).position!=='fixed')return;
    const cs=getComputedStyle(el),bg=mwLum130(cs.backgroundColor),fg=mwLum130(cs.color);if(bg==null||fg==null||mwContrast130(bg,fg)>=3.2)return;
    el.classList.add(bg>.45?'mw-force-dark130':'mw-force-light130');
  });
}
function mwBrand130(){document.querySelectorAll('.myway-mark130').forEach(el=>el.remove());}
function mwWallpaperRepair130(){
  try{applyWallpaper127?.();}catch{}
  const enabled=document.body.classList.contains('wallpaper-enabled127');if(!enabled)return;
  const src=getComputedStyle(document.documentElement).getPropertyValue('--mw-wallpaper-image').trim();if(!src||src==='none'){document.body.classList.remove('wallpaper-enabled127');}
}
let mwAuditTimer130=0;
function mwAudit130(){clearTimeout(mwAuditTimer130);mwAuditTimer130=setTimeout(()=>{mwBrand130();mwWallpaperRepair130();mwFixLowContrast130();},40);}
function initStability130(){
  mwBrand130();mwAudit130();
  const oldApplyTheme=applyTheme;applyTheme=function(...args){const r=oldApplyTheme(...args);mwAudit130();return r;};
  if(typeof applyPanelColorR2==='function'){const oldPanel=applyPanelColorR2;applyPanelColorR2=function(...args){const r=oldPanel(...args);mwAudit130();return r;};}
  if(typeof applyInterfacePreferences==='function'){const oldPrefs=applyInterfacePreferences;applyInterfacePreferences=function(...args){const r=oldPrefs(...args);mwAudit130();return r;};}
  new MutationObserver(mwAudit130).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden']});
  window.addEventListener('resize',mwAudit130,{passive:true});
}
initStability130();
