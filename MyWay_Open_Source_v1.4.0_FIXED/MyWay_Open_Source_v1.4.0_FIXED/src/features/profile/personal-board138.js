/* v1.4.0 · quadro pessoal editável no dashboard. */
function profileHighlights138(){
  if(!Array.isArray(state.profileHighlights138))state.profileHighlights138=[];
  return state.profileHighlights138;
}
function renderProfileBoard138(){
  const box=$('#profileBoardGrid138'),title=$('#profileBoardTitle138');if(!box)return;
  const name=String(state.settings.profileName||'').trim(),first=name&&name.toLowerCase()!=='seu nome'?name.split(/\s+/)[0]:'';
  if(title)title.textContent=first?`O que importa para ${first}.`:'O que importa agora.';
  const rows=profileHighlights138();
  box.innerHTML=rows.length?rows.map((row,i)=>`<article class="profile-highlight138"><button type="button" class="profile-highlight-main138" data-profile-edit138="${escapeHTML(row.id)}"><small>${escapeHTML(row.label||'Importante')}</small><b>${escapeHTML(row.value||'')}</b></button><button type="button" class="profile-highlight-remove138" data-profile-remove138="${escapeHTML(row.id)}" aria-label="Remover ${escapeHTML(row.label||'item')}">×</button></article>`).join(''):'<button type="button" class="profile-board-empty138" id="profileBoardEmpty138"><b>Seu espaço ainda está vazio.</b><span>Adicione algo que valha a pena manter visível.</span></button>';
}
async function editProfileHighlight138(id=''){
  const rows=profileHighlights138(),row=rows.find(x=>x.id===id);
  if(!row&&rows.length>=12)return toast('Você já tem 12 itens neste quadro.','Edite ou remova um antes de adicionar outro.');
  const result=await openFormDialog({title:row?'Editar item':'Adicionar ao meu espaço',description:'Use este quadro para o que você quer enxergar rápido no dia a dia.',submitLabel:row?'Salvar alterações':'Adicionar',fields:[{key:'label',label:'Título',required:true,maxLength:40,value:row?.label||'',placeholder:'Ex.: Meta principal'},{key:'value',label:'Conteúdo',required:true,type:'textarea',maxLength:180,value:row?.value||'',placeholder:'Ex.: Terminar meu portfólio até dezembro'}]});
  if(!result)return;
  if(row)Object.assign(row,{label:result.label,value:result.value,updatedAt:new Date().toISOString()});
  else rows.push({id:cryptoId(),label:result.label,value:result.value,createdAt:new Date().toISOString()});
  saveState();renderProfileBoard138();
}
async function removeProfileHighlight138(id){
  const row=profileHighlights138().find(x=>x.id===id);if(!row)return;
  if(!await askConfirmation(`Remover “${row.label}” do seu quadro?`,'Remover'))return;
  state.profileHighlights138=profileHighlights138().filter(x=>x.id!==id);saveState();renderProfileBoard138();
}
function initProfileBoard138(){
  document.addEventListener('click',e=>{
    const add=e.target.closest?.('#profileBoardAdd138,#profileBoardEmpty138');if(add){e.preventDefault();editProfileHighlight138();return;}
    const edit=e.target.closest?.('[data-profile-edit138]');if(edit){e.preventDefault();editProfileHighlight138(edit.dataset.profileEdit138);return;}
    const remove=e.target.closest?.('[data-profile-remove138]');if(remove){e.preventDefault();removeProfileHighlight138(remove.dataset.profileRemove138);}
  });
  const oldRenderAll=renderAll;renderAll=function(...args){const r=oldRenderAll(...args);renderProfileBoard138();return r;};
  const oldToday=renderToday;renderToday=function(...args){const r=oldToday(...args);renderProfileBoard138();return r;};
  window.addEventListener('myway:hydrated',renderProfileBoard138);renderProfileBoard138();
}
initProfileBoard138();
