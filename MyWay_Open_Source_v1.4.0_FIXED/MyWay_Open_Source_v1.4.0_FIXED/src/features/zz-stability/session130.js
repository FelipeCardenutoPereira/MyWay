/* v1.3.0 · sessão persistente no shell Windows. Android mantém o armazenamento do WebView. */
async function mwNativePrefs130(patch){
  if(!document.documentElement.classList.contains('native-available') || window.MyWayAndroid)return null;
  try{
    const options=patch===undefined?{}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(patch)};
    const r=await fetch('/api/system/preferences',options);if(!r.ok)return null;return await r.json();
  }catch{return null;}
}
function mwSessionValid130(raw){
  try{const s=JSON.parse(raw||'null');return !!(s?.access_token&&s?.refresh_token&&s?.user?.id);}catch{return false;}
}
const mwCloudStoreSession130=cloudStoreSession53;
cloudStoreSession53=function(data,remember=cloudRemember53){
  const result=mwCloudStoreSession130(data,remember);
  if(remember){
    const raw=localStorage.getItem(CLOUD_SESSION53);
    if(mwSessionValid130(raw))mwNativePrefs130({cloudSession130:raw}).catch(()=>{});
  }
  return result;
};
const mwCloudLogout130=cloudLogout53;
cloudLogout53=async function(...args){
  const result=await mwCloudLogout130(...args);mwNativePrefs130({cloudSession130:''}).catch(()=>{});return result;
};
const mwInitAuth130=initAuthFlow;
initAuthFlow=async function(...args){
  if(!localStorage.getItem(CLOUD_SESSION53)&&!sessionStorage.getItem(CLOUD_SESSION53)){
    const prefs=await mwNativePrefs130();const raw=prefs?.cloudSession130;
    if(mwSessionValid130(raw))localStorage.setItem(CLOUD_SESSION53,raw);
  }
  return mwInitAuth130(...args);
};
