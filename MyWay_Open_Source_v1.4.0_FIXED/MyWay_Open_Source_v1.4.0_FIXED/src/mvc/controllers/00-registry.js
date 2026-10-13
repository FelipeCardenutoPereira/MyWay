/* MVC · Registro de controllers por aba.
   A base antiga continua funcionando; este registro permite migrar cada aba sem voltar a concentrar tudo em app.js. */
const MyWayMvcControllers=new Map();
function registerMvcController(name,controller={}){MyWayMvcControllers.set(name,controller);}
function mountMvcController(name){
  const root=$('#view-'+name),controller=MyWayMvcControllers.get(name);
  if(!root||!controller)return;
  if(!controller.__mounted){controller.mount?.(root);controller.__mounted=true;}
  controller.show?.(root);
}
const mvcShowViewBase=showView;
showView=function(name,...args){const result=mvcShowViewBase(name,...args);mountMvcController(name);return result;};
queueMicrotask(()=>{const active=document.querySelector('.view.active[id^="view-"]');if(active)mountMvcController(active.id.slice(5));});
