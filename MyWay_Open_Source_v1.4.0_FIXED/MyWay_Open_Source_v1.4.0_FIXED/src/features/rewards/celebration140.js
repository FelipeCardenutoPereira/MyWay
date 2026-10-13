/* v1.4.0 · feedback consistente para tarefa concluída e subida de nível. */
let mwCelebrateTimer140=0,mwLastTask140=0,mwLastLevel140=0;
function mwCelebration140(kind,title,detail){
 if(document.body.classList.contains('auth-locked'))return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches||state.settings.animationsEnabled===false;
 document.querySelector('.mw-celebration140')?.remove();clearTimeout(mwCelebrateTimer140);
 const box=document.createElement('div');box.className='mw-celebration140 mw-celebration-'+kind+(reduced?' reduced':'');box.setAttribute('role','status');box.setAttribute('aria-live','polite');
 const particles=!reduced?'<div class="mw-celebration-particles140" aria-hidden="true">'+Array.from({length:18},(_,i)=>'<i style="--i:'+i+'"></i>').join('')+'</div>':'';
 box.innerHTML=particles+'<div class="mw-celebration-card140"><span class="mw-celebration-symbol140">'+(kind==='level'?'★':'✓')+'</span><div><strong>'+escapeHTML(title)+'</strong><small>'+escapeHTML(detail||'')+'</small></div></div>';
 document.body.append(box);mwCelebrateTimer140=setTimeout(()=>box.remove(),kind==='level'?2700:1900);
}
function mwTaskDone140(label='Tarefa concluída'){
 const now=Date.now();if(now-mwLastTask140<280)return;mwLastTask140=now;mwCelebration140('task','Tarefa concluída',label==='Tarefa concluída'?'Progresso registrado.':label);
}
function mwLevelUp140(level){
 const now=Date.now();if(now-mwLastLevel140<500)return;mwLastLevel140=now;mwCelebration140('level','Nível '+level+' alcançado','Seu progresso foi atualizado.');
}
(function initCelebration140(){
 if(typeof celebrateXP34==='function'&&typeof level36==='function'){
  const old=celebrateXP34;celebrateXP34=function(xp,label,...rest){const gain=Math.max(0,Number(xp)||0),after=rewardTotal34(),before=Math.max(0,after-gain),from=level36(before).level,to=level36(after).level,r=old(xp,label,...rest);if(to>from)mwLevelUp140(to);return r;};
 }
 if(typeof moveWorkCard35==='function'){
  const old=moveWorkCard35;moveWorkCard35=function(note,status,...args){const before=note?.status,r=old(note,status,...args);if(before!=='done'&&status==='done')mwTaskDone140(note?.title||'Tarefa concluída');return r;};
 }
 if(typeof completeMainNote40==='function'){
  const old=completeMainNote40;completeMainNote40=function(note,...args){const before=note?.status,r=old(note,...args);if(before!=='done'&&note?.status==='done')mwTaskDone140(note?.title||'Tarefa concluída');return r;};
 }
 if(typeof completeDailyAction49==='function'){
  const old=completeDailyAction49;completeDailyAction49=function(...args){const row=typeof dailyAction49==='function'?dailyAction49():null,before=row?.done,r=old(...args);if(!before&&row?.done)mwTaskDone140(row.title||'Ação do dia');return r;};
 }
 document.addEventListener('change',e=>{const el=e.target;if(el?.matches?.('[data-note-status]')&&el.value==='done')queueMicrotask(()=>mwTaskDone140(el.closest('[data-note-id]')?.querySelector('h3,h4,strong')?.textContent?.trim()||'Tarefa concluída'));},true);
})();
