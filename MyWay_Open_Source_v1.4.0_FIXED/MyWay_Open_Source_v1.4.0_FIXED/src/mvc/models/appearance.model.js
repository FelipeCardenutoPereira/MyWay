/* MVC · Model de Aparência
   Dados de visual do painel. v1.3.7 mantém aparência robusta e torna o modo enxuto persistente e independente. */
const MyWayAppearanceModel={
  wallpapers:{
    none:{label:'Sem wallpaper',src:''},
    surreal:{label:'Montanha surreal',src:'assets/wallpapers/mountain-surreal.jpg'},
    sunset:{label:'Lago ao pôr do sol',src:'assets/wallpapers/misurina-sunset.jpg'},
    lake:{label:'Montanhas e lago',src:'assets/wallpapers/mountain-lake.jpg'}
  },
  fits:new Set(['cover','contain','stretch','original']),
  positions:new Set(['center','top','bottom','left','right','top-left','top-right','bottom-left','bottom-right']),
  settings(){
    const s=state.settings;
    s.wallpaper127 ||= 'none';
    s.wallpaperBlur127=Number.isFinite(Number(s.wallpaperBlur127))?Math.min(14,Math.max(0,Number(s.wallpaperBlur127))):0;
    s.wallpaperFit134=this.fits.has(s.wallpaperFit134)?s.wallpaperFit134:'cover';
    s.wallpaperPosition134=this.positions.has(s.wallpaperPosition134)?s.wallpaperPosition134:'center';
    s.wallpaperMotion134=['fixed','scroll'].includes(s.wallpaperMotion134)?s.wallpaperMotion134:'fixed';
    s.wallpaperZoom134=Number.isFinite(Number(s.wallpaperZoom134))?Math.min(160,Math.max(70,Number(s.wallpaperZoom134))):100;
    s.wallpaperTintOpacity135=Number.isFinite(Number(s.wallpaperTintOpacity135))?Math.min(100,Math.max(0,Number(s.wallpaperTintOpacity135))):0;
    s.wallpaperPanelOpacity136=Number.isFinite(Number(s.wallpaperPanelOpacity136))?Math.min(100,Math.max(0,Number(s.wallpaperPanelOpacity136))):45;
    if(typeof s.compactCopy134!=='boolean')s.compactCopy134=false;
    return s;
  },
  source(){
    const s=this.settings();
    if(s.wallpaper127==='custom'&&s.wallpaperCustom127)return s.wallpaperCustom127;
    return this.wallpapers[s.wallpaper127]?.src||'';
  },
  select(key){
    const s=this.settings();
    s.wallpaper127=(key==='custom'&&s.wallpaperCustom127)||this.wallpapers[key]?key:'none';
    saveState();
  },
  custom(data){const s=this.settings();s.wallpaperCustom127=data;s.wallpaper127='custom';saveState();},
  blur(value){this.settings().wallpaperBlur127=Math.min(14,Math.max(0,Number(value)||0));},
  fit(value){if(this.fits.has(value))this.settings().wallpaperFit134=value;},
  position(value){if(this.positions.has(value))this.settings().wallpaperPosition134=value;},
  motion(value){if(['fixed','scroll'].includes(value))this.settings().wallpaperMotion134=value;},
  zoom(value){this.settings().wallpaperZoom134=Math.min(160,Math.max(70,Number(value)||100));},
  tintOpacity(value){this.settings().wallpaperTintOpacity135=Math.min(100,Math.max(0,Number(value)||0));},
  panelOpacity(value){this.settings().wallpaperPanelOpacity136=Math.min(100,Math.max(0,Number(value)||0));},
  compactCopy(on){this.settings().compactCopy134=!!on;saveState();}
};
