(function(){
 'use strict';
 var local=location.protocol==='https:'&&location.hostname==='appassets.androidplatform.net';
 if(local){
  function call(action,data){var result=window.prompt('MYWAY41',JSON.stringify(Object.assign({action:action},data||{})));if(result==null||result==='denied')throw new Error('Recurso Android indisponível');return result;}
  window.MyWayAndroid={ads54:function(action,data){if(!/^ads(?:Info|Context|Enable|Privacy|Reward|Forget)54$/.test(action))throw new Error("Ação inválida");return call(action,data);},voice49:function(id){return call('voice49',{id:id});},persist:function(text){return call('persist',{text:text});},exportFile:function(name,text,type){return call('export',{name:name,text:text,type:type});},fullscreen:function(on){return call('fullscreen',{on:!!on});},ready:function(){return call('ready');}};
 }
 var firstError='';window.addEventListener('error',function(e){if(!window.MyWay41Ready)firstError=e.message||'Não foi possível carregar um arquivo do app.';});
 function show(){if(window.MyWay41Ready||document.getElementById('bootFailure41'))return;var panel=document.createElement('section');panel.id='bootFailure41';panel.setAttribute('role','alert');panel.style.cssText='position:fixed;inset:0;z-index:2147483646;background:#10202a;color:#edf4f7;padding:32px 24px;display:flex;flex-direction:column;justify-content:center;gap:18px;font:16px/1.6 Arial;';var h=document.createElement('h2');h.textContent='Vamos tentar abrir novamente';var p=document.createElement('p');p.textContent='O aplicativo não terminou de carregar. Seus dados não serão apagados. No Android, confira se o Android System WebView e o Chrome estão atualizados.';panel.append(h,p);if(firstError){var detail=document.createElement('small');detail.textContent='Detalhe: '+firstError;panel.append(detail);}var b=document.createElement('button');b.textContent='Tentar novamente';b.style.cssText='padding:14px;border:0;border-radius:12px;background:#79c5c4;color:#10202a;font:700 16px Arial';b.onclick=function(){location.reload();};panel.append(b);document.body.append(panel);}
 window.mywayShowBootFailure41=show;setTimeout(show,12000);
})();
