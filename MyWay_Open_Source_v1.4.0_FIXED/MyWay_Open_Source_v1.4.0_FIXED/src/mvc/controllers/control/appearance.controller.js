/* MVC · Controller de Aparência / Controle
   v1.3.7: seleção robusta por delegação + modo enxuto independente do ciclo do wallpaper.
   Wallpaper, tonalização e transparência dos painéis são controles independentes. */
function mvcWallpaperMarkup(){
  const presets=[['none','', 'Sem imagem'],['surreal',MyWayAppearanceModel.wallpapers.surreal.src,'Surreal'],['sunset',MyWayAppearanceModel.wallpapers.sunset.src,'Pôr do sol'],['lake',MyWayAppearanceModel.wallpapers.lake.src,'Lago']];
  const custom=MyWayAppearanceModel.settings().wallpaperCustom127;
  if(custom)presets.push(['custom',custom,'Minha imagem']);
  return presets.map(([key,src,label])=>`<button type="button" class="wallpaper-option127" data-wallpaper127="${key}" aria-label="${label}" aria-pressed="false">${src?`<img src="${src}" alt="">`:'<span class="wallpaper-none127">×</span>'}<small>${label}</small><span class="wallpaper-check134" aria-hidden="true">✓</span><span class="wallpaper-active-label136" aria-hidden="true">ATIVO</span></button>`).join('');
}
function wallpaperLayer127(){
  let layer=$('#wallpaperLayer127');
  if(!layer){
    layer=document.createElement('div');
    layer.id='wallpaperLayer127';layer.className='wallpaper-layer127';layer.setAttribute('aria-hidden','true');
    document.body.insertBefore(layer,document.body.firstChild);
  }
  return layer;
}
function resolveWallpaper127(src){if(!src)return '';if(/^data:|^blob:|^https?:/i.test(src))return src;try{return new URL(src,document.baseURI).href}catch{return src}}
function wallpaperPositionCss134(value){return ({center:'50% 50%',top:'50% 0%',bottom:'50% 100%',left:'0% 50%',right:'100% 50%','top-left':'0% 0%','top-right':'100% 0%','bottom-left':'0% 100%','bottom-right':'100% 100%'})[value]||'50% 50%'}
function wallpaperSizeCss134(fit){if(fit==='stretch')return '100% 100%';if(fit==='original')return 'auto';return fit==='contain'?'contain':'cover'}
function wallpaperTintColor135(){
  const raw=state?.settings?.panelColorR2;
  const normalized=typeof hexR2==='function'?hexR2(raw):raw;
  return normalized||(state?.settings?.theme==='dark'?'#101c27':'#e7e4de');
}
function markAppearanceDirty137(){window.__MYWAY_APPEARANCE_DIRTY137=true;}
function selectWallpaper137(key){
  markAppearanceDirty137();
  MyWayAppearanceModel.select(key);
  const s=MyWayAppearanceModel.settings();
  if(!Number.isFinite(Number(s.wallpaperPanelOpacity136)))s.wallpaperPanelOpacity136=45;
  applyWallpaper127();
  const status=$('#wallpaperStatus127');if(status)status.textContent=key==='none'?'Wallpaper removido.':'Wallpaper selecionado e ativo.';
}
function applyCompactCopy134(){
  const s=MyWayAppearanceModel.settings(),on=!!s.compactCopy134;
  document.documentElement.classList.toggle('compact-copy134',on);
  document.body.classList.toggle('compact-copy134',on);
  document.documentElement.dataset.compactCopy134=on?'on':'off';
  document.body.dataset.compactCopy134=on?'on':'off';
  const b=$('#controlCompactCopy134');
  if(b){
    b.classList.toggle('on',on);
    b.setAttribute('aria-pressed',String(on));
    b.setAttribute('aria-label',on?'Desativar modo enxuto':'Ativar modo enxuto');
    b.dataset.active=on?'1':'0';
  }
  const status=$('#controlCompactState137');
  if(status){status.textContent=on?'Ativado':'Desativado';status.classList.toggle('is-active',on);}
  return on;
}
function applyWallpaper127(){
  const s=MyWayAppearanceModel.settings(),raw=MyWayAppearanceModel.source(),src=resolveWallpaper127(raw),active=!!src;
  const root=document.documentElement,body=document.body,layer=wallpaperLayer127();
  root.classList.toggle('wallpaper-enabled127',active);body.classList.toggle('wallpaper-enabled127',active);
  root.dataset.wallpaperMode127=body.dataset.wallpaperMode127=active?'image':'color';
  root.style.setProperty('--mw-wallpaper-image',active?`url("${String(src).replaceAll('"','%22')}")`:'none');
  root.style.setProperty('--mw-wallpaper-blur',`${s.wallpaperBlur127}px`);
  root.style.setProperty('--mw-wallpaper-position',wallpaperPositionCss134(s.wallpaperPosition134));
  root.style.setProperty('--mw-wallpaper-fit',wallpaperSizeCss134(s.wallpaperFit134));
  root.style.setProperty('--mw-wallpaper-zoom',String((Number(s.wallpaperZoom134)||100)/100));
  root.style.setProperty('--mw-wallpaper-tint-color',wallpaperTintColor135());
  root.style.setProperty('--mw-wallpaper-tint-opacity',String((Number(s.wallpaperTintOpacity135)||0)/100));
  root.style.setProperty('--mw-panel-opacity-pct',`${Math.round(Number(s.wallpaperPanelOpacity136)||0)}%`);
  body.classList.toggle('wallpaper-scroll134',s.wallpaperMotion134==='scroll');
  if(active){layer.style.setProperty('background-image',`url("${String(src).replaceAll('"','%22')}")`);layer.hidden=false;}
  else{layer.style.removeProperty('background-image');layer.hidden=true;}
  const selected=$('#wallpaperPresets127');
  if(selected)selected.querySelectorAll('[data-wallpaper127]').forEach(b=>{const on=b.dataset.wallpaper127===s.wallpaper127;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
  const blur=$('#wallpaperBlur127');if(blur)blur.value=String(s.wallpaperBlur127);
  const fit=$('#wallpaperFit134');if(fit)fit.value=s.wallpaperFit134;
  const pos=$('#wallpaperPosition134');if(pos)pos.value=s.wallpaperPosition134;
  const motion=$('#wallpaperMotion134');if(motion)motion.value=s.wallpaperMotion134;
  const zoom=$('#wallpaperZoom134');if(zoom)zoom.value=String(s.wallpaperZoom134);
  const zoomOut=$('#wallpaperZoomValue134');if(zoomOut)zoomOut.textContent=`${Math.round(s.wallpaperZoom134)}%`;
  const tint=$('#wallpaperTintOpacity135');if(tint)tint.value=String(s.wallpaperTintOpacity135);
  const tintOut=$('#wallpaperTintValue135');if(tintOut)tintOut.textContent=`${Math.round(s.wallpaperTintOpacity135)}%`;
  const panel=$('#wallpaperPanelOpacity136');if(panel)panel.value=String(s.wallpaperPanelOpacity136);
  const panelOut=$('#wallpaperPanelOpacityValue136');if(panelOut)panelOut.textContent=`${Math.round(s.wallpaperPanelOpacity136)}%`;
  const label=MyWayAppearanceModel.wallpapers[s.wallpaper127]?.label||(s.wallpaper127==='custom'?'Minha imagem':'Sem imagem');
  const badge=$('#wallpaperActiveBadge136');if(badge){badge.textContent=active?`ATIVO · ${label}`:'SEM IMAGEM';badge.classList.toggle('is-active',active);}
  const mode=$('#wallpaperModeStatusMvc');if(mode)mode.textContent=active?`Wallpaper ativo: ${label}. Cor ${Math.round(s.wallpaperTintOpacity135)}% · painéis ${Math.round(s.wallpaperPanelOpacity136)}%.`:'Sem wallpaper. O fundo usa a cor/tema do painel.';
  const colorInput=$('#panelColorR2');if(colorInput){colorInput.disabled=false;colorInput.closest('.panel-color-r2')?.classList.remove('is-suspended127');}
}
function bindWallpaperControls127(){
  const presets=$('#wallpaperPresets127');if(!presets)return false;
  // Regera só quando necessário; o binding principal é delegado e sobrevive a qualquer re-render.
  if(!presets.querySelector('.wallpaper-active-label136'))presets.innerHTML=mvcWallpaperMarkup();
  presets.dataset.bound127='1';
  presets.querySelectorAll('[data-wallpaper127]').forEach(button=>{
    if(button.dataset.directWallpaper137==='1')return;
    button.dataset.directWallpaper137='1';
    button.addEventListener('click',e=>{e.preventDefault();selectWallpaper137(button.dataset.wallpaper127);});
  });
  const upload=$('#wallpaperUpload127');if(upload&&!upload.dataset.bound136){upload.dataset.bound136='1';upload.addEventListener('change',async e=>{
    const file=e.target.files?.[0];if(!file)return;
    if(!/^image\/(png|jpeg|webp)$/.test(file.type)||file.size>12*1024*1024){toast('Use PNG, JPG ou WebP de até 12 MB.');e.target.value='';return;}
    const status=$('#wallpaperStatus127');if(status)status.textContent='Preparando imagem…';
    try{const data=await resizeImageFile(file,2560,.84);markAppearanceDirty137();MyWayAppearanceModel.custom(data);presets.innerHTML=mvcWallpaperMarkup();applyWallpaper127();if(status)status.textContent='Imagem aplicada e ativa.';}
    catch{if(status)status.textContent='Não consegui ler essa imagem.';toast('Não consegui preparar o wallpaper.');}
    e.target.value='';
  });}
  const compact=$('#controlCompactCopy134');
  if(compact&&!compact.dataset.directCompact137){
    compact.dataset.directCompact137='1';
    compact.addEventListener('click',e=>{e.preventDefault();markAppearanceDirty137();const next=!MyWayAppearanceModel.settings().compactCopy134;MyWayAppearanceModel.compactCopy(next);applyCompactCopy134();});
  }
  const input=$('#panelColorR2');if(input){const v=typeof hexR2==='function'?hexR2(state.settings.panelColorR2):null;input.value=v||(state.settings.theme==='dark'?'#101c27':'#e7e4de');}
  applyCompactCopy134();applyWallpaper127();return true;
}
function bindWallpaperDelegation136(){
  if(document.documentElement.dataset.wallpaperDelegation136==='1')return;
  document.documentElement.dataset.wallpaperDelegation136='1';
  document.addEventListener('click',e=>{
    const compact=e.target.closest?.('#controlCompactCopy134');
    if(compact){
      e.preventDefault();e.stopImmediatePropagation();
      markAppearanceDirty137();
      const next=!MyWayAppearanceModel.settings().compactCopy134;
      MyWayAppearanceModel.compactCopy(next);
      applyCompactCopy134();
      const status=$('#controlCompactState137');if(status)status.animate?.([{opacity:.45},{opacity:1}],{duration:160});
      return;
    }
    const button=e.target.closest?.('[data-wallpaper127]');if(!button)return;
    e.preventDefault();e.stopPropagation();
    selectWallpaper137(button.dataset.wallpaper127);
  },true);
  document.addEventListener('input',e=>{
    const id=e.target?.id;if(!id)return;
    if(['wallpaperBlur127','wallpaperZoom134','wallpaperTintOpacity135','wallpaperPanelOpacity136'].includes(id))markAppearanceDirty137();
    if(id==='wallpaperBlur127')MyWayAppearanceModel.blur(e.target.value);
    else if(id==='wallpaperZoom134')MyWayAppearanceModel.zoom(e.target.value);
    else if(id==='wallpaperTintOpacity135')MyWayAppearanceModel.tintOpacity(e.target.value);
    else if(id==='wallpaperPanelOpacity136')MyWayAppearanceModel.panelOpacity(e.target.value);
    else return;
    applyWallpaper127();
  },true);
  document.addEventListener('change',e=>{
    const id=e.target?.id;
    if(['wallpaperFit134','wallpaperPosition134','wallpaperMotion134','wallpaperBlur127','wallpaperZoom134','wallpaperTintOpacity135','wallpaperPanelOpacity136'].includes(id))markAppearanceDirty137();
    if(id==='wallpaperFit134')MyWayAppearanceModel.fit(e.target.value);
    else if(id==='wallpaperPosition134')MyWayAppearanceModel.position(e.target.value);
    else if(id==='wallpaperMotion134')MyWayAppearanceModel.motion(e.target.value);
    else if(!['wallpaperBlur127','wallpaperZoom134','wallpaperTintOpacity135','wallpaperPanelOpacity136'].includes(id))return;
    saveState();applyWallpaper127();
  },true);
}
function initAppearanceMvc(){
  bindWallpaperDelegation136();
  // Corrige o bug real da v1.3.5: os controles existiam no HTML, mas o binding dependia de uma mutação futura.
  // Agora tenta imediatamente e também quando a aba Controle é exibida/re-renderizada.
  bindWallpaperControls127();applyCompactCopy134();applyWallpaper127();
  queueMicrotask(()=>bindWallpaperControls127());
  requestAnimationFrame(()=>bindWallpaperControls127());
  const baseApply=applyInterfacePreferences;
  applyInterfacePreferences=function(...args){const r=baseApply(...args);applyCompactCopy134();applyWallpaper127();return r;};
  const baseTheme=applyTheme;applyTheme=function(...args){const r=baseTheme(...args);applyWallpaper127();return r;};
  if(typeof applyPanelColorR2==='function'){const basePanel=applyPanelColorR2;applyPanelColorR2=function(...args){const r=basePanel(...args);applyWallpaper127();return r;};}
  new MutationObserver(()=>{const box=$('#wallpaperPresets127');if(box&&!box.dataset.bound127)bindWallpaperControls127();}).observe(document.body,{subtree:true,childList:true});
  // O estado nativo pode terminar de hidratar depois da UI. Reaplica o visual e o modo enxuto
  // para que uma resposta tardia não devolva o wallpaper para 'Sem imagem'.
  window.addEventListener('myway:hydrated',()=>{
    bindWallpaperControls127();
    applyCompactCopy134();
    applyWallpaper127();
  });
}
initAppearanceMvc();
