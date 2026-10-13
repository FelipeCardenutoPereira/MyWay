/* v1.4.0 · cadastro em uma única etapa: um e-mail e uma senha. */
function wireStudyOptional126(){
  const toggle=$('#onboardStudyEnabled126'),fields=$('#onboardStudyFields126'),module=$('#onboardModules input[value="puc"]');
  if(!toggle||!fields||!module)return;
  const sync=source=>{
    const enabled=source==='module'?module.checked:toggle.checked;
    toggle.checked=enabled;module.checked=enabled;fields.hidden=!enabled;
  };
  toggle.onchange=()=>sync('toggle');
  module.addEventListener('change',()=>sync('module'));
  sync('toggle');
}
function initAuthUx126(){
  wireStudyOptional126();
  const observer=new MutationObserver(()=>wireStudyOptional126());
  observer.observe(document.body,{childList:true,subtree:true});
}
initAuthUx126();
