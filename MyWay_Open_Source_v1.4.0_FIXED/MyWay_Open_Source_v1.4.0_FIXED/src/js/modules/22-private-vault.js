/* =========================================================
   Wellbeing
   ========================================================= */
function renderMeditation(){}

/* =========================================================
   V14 — RELACIONAMENTOS / NÓS
   ========================================================= */
function daysUntil(iso){
  if(!iso)return null;
  const [y,m,d]=iso.split("-").map(Number);
  const target=new Date(y,m-1,d);target.setHours(12,0,0,0);
  const now=new Date();now.setHours(12,0,0,0);
  return Math.ceil((target-now)/86400000);
}
function renderRelationships(){
  if(!$("#relationshipsWeddingPlans"))return;
  const date=state.settings.coupleWeddingDate||"";
  $("#relationshipsWeddingDateLabel").textContent=date?formatDateBR(date):"sem data";
  const left=daysUntil(date);
  $("#relationshipsWeddingCountdown").textContent=left==null?"defina a data":left>0?`${left} dias`:left===0?"é hoje":`${Math.abs(left)} dias atrás`;

  const plans=state.relationshipsWeddingPlans||[];
  $("#relationshipsOpenPlans").textContent=plans.filter(x=>!x.done).length;
  $("#relationshipsWeddingPlans").innerHTML=plans.length?plans.map(x=>`<div class="relationships-plan-row ${x.done?'done':''}" data-relationships-plan="${x.id}"><input type="checkbox" ${x.done?'checked':''} data-relationships-plan-done><input type="text" value="${escapeHTML(x.text||'')}" data-relationships-plan-text><button class="relationships-row-delete" data-relationships-plan-delete>×</button></div>`).join(""):`<p class="note">Nenhum item ainda.</p>`;
  $$("[data-relationships-plan]",$("#relationshipsWeddingPlans")).forEach(row=>{
    const item=plans.find(x=>x.id===row.dataset.relationshipsPlan);
    row.querySelector("[data-relationships-plan-done]").addEventListener("change",e=>{item.done=e.target.checked;item.completedAt=item.done?new Date().toISOString():"";saveState();renderRelationships()});
    row.querySelector("[data-relationships-plan-text]").addEventListener("input",e=>{item.text=e.target.value;saveState()});
    row.querySelector("[data-relationships-plan-delete]").addEventListener("click",()=>{state.relationshipsWeddingPlans=plans.filter(x=>x.id!==item.id);saveState();renderRelationships()});
  });

  const ideas=state.relationshipsIdeas||[];
  $("#relationshipsIdeas").innerHTML=ideas.length?ideas.map(x=>`<article class="relationships-idea" data-relationships-idea="${x.id}"><header><small>${escapeHTML(x.type||'Ideia')}</small><button class="relationships-row-delete" data-relationships-idea-delete>×</button></header><textarea data-relationships-idea-text>${escapeHTML(x.text||'')}</textarea></article>`).join(""):`<p class="note">Nenhuma ideia salva.</p>`;
  $$("[data-relationships-idea]",$("#relationshipsIdeas")).forEach(card=>{
    const item=ideas.find(x=>x.id===card.dataset.relationshipsIdea);
    card.querySelector("[data-relationships-idea-text]").addEventListener("input",e=>{item.text=e.target.value;saveState()});
    card.querySelector("[data-relationships-idea-delete]").addEventListener("click",()=>{state.relationshipsIdeas=ideas.filter(x=>x.id!==item.id);saveState();renderRelationships()});
  });

  const trips=state.relationshipsTrips||[];
  $("#relationshipsTripsCount").textContent=trips.length;
  $("#relationshipsTrips").innerHTML=trips.length?trips.map(x=>`<div class="relationships-trip" data-relationships-trip="${x.id}"><time>${x.date?formatDateBR(x.date):'sem data'}</time><div><input value="${escapeHTML(x.destination||'')}" data-relationships-trip-destination><textarea data-relationships-trip-note>${escapeHTML(x.note||'')}</textarea></div><button class="relationships-row-delete" data-relationships-trip-delete>×</button></div>`).join(""):`<p class="note">Nenhuma viagem planejada.</p>`;
  $$("[data-relationships-trip]",$("#relationshipsTrips")).forEach(row=>{
    const item=trips.find(x=>x.id===row.dataset.relationshipsTrip);
    row.querySelector("[data-relationships-trip-destination]").addEventListener("input",e=>{item.destination=e.target.value;saveState()});
    row.querySelector("[data-relationships-trip-note]").addEventListener("input",e=>{item.note=e.target.value;saveState()});
    row.querySelector("[data-relationships-trip-delete]").addEventListener("click",()=>{state.relationshipsTrips=trips.filter(x=>x.id!==item.id);saveState();renderRelationships()});
  });

  renderRelationshipsFavoriteProperties();
  renderRelationshipsPhotos();
  refreshAnaVault();
}
$("#relationshipsAddWeddingPlan")?.addEventListener("click",()=>{
  const el=$("#relationshipsWeddingPlanText"),text=el.value.trim();if(!text)return;
  state.relationshipsWeddingPlans.unshift({id:cryptoId(),text,done:false,createdAt:new Date().toISOString()});el.value="";saveState();renderRelationships();
});
$("#relationshipsWeddingPlanText")?.addEventListener("keydown",e=>{if(e.key==="Enter")$("#relationshipsAddWeddingPlan").click()});
function addAnaIdea(){
  const text=$("#relationshipsIdeaText")?.value.trim();if(!text)return;
  state.relationshipsIdeas.unshift({id:cryptoId(),text,type:$("#relationshipsIdeaType")?.value||"Outro",createdAt:new Date().toISOString()});
  $("#relationshipsIdeaText").value="";saveState();renderRelationships();
}
$("#relationshipsAddIdea")?.addEventListener("click",addAnaIdea);
$("#relationshipsIdeaText")?.addEventListener("keydown",e=>{if(e.key==="Enter")addAnaIdea()});
$("#relationshipsAddTrip")?.addEventListener("click",()=>{
  const dest=$("#relationshipsTripDestination")?.value.trim();if(!dest)return toast("Informe o destino.");
  state.relationshipsTrips.unshift({id:cryptoId(),destination:dest,date:$("#relationshipsTripDate")?.value||"",note:$("#relationshipsTripNote")?.value.trim()||"",createdAt:new Date().toISOString()});
  $("#relationshipsTripDestination").value="";$("#relationshipsTripDate").value="";$("#relationshipsTripNote").value="";saveState();renderRelationships();
});
function renderRelationshipsFavoriteProperties(){
  const c=$("#relationshipsFavoriteProperties");if(!c)return;
  const list=(state.savedProperties||[]).filter(p=>p.favorite);
  $("#relationshipsHomesCount").textContent=list.length;
  $("#relationshipsFavoritePropertiesCount").textContent=list.length;
  c.innerHTML=list.length?list.map(p=>{const f=propertyEntryFor(p);return `<article class="property-card favorite-property" data-relationships-property="${p.id}"><div class="property-image">${p.image?`<img src="${escapeHTML(p.image)}" alt="">`:''}<span class="property-source">${escapeHTML(p.portal||'IMÓVEL')}</span></div><div class="property-body"><div class="property-title-line"><h4>${escapeHTML(p.title||p.address||'Imóvel')}</h4><button class="property-favorite on" data-relationships-unfavorite>♥</button></div><div class="property-price">${money(p.price)}</div><div class="property-details">${p.area?`<span>${p.area} m²</span>`:''}${p.bedrooms?`<span>${p.bedrooms} quartos</span>`:''}${p.parking?`<span>${p.parking} vaga</span>`:''}</div><div class="property-finance"><div><span>Entrada estimada</span><strong>${money(f.entry)}</strong></div><div><span>Falta com reserva</span><strong>${f.gap?money(f.gap):'coberta'}</strong></div></div><div class="property-actions"><a href="${escapeHTML(p.url)}" target="_blank" rel="noreferrer">abrir anúncio ↗</a><button data-relationships-simulate>simular</button></div></div></article>`}).join(""):`<p class="note">Nenhum imóvel marcado com ♥. Vá em Metas → Imóveis salvos e favorite os que vocês gostaram.</p>`;
  $$("[data-relationships-property]",c).forEach(card=>{
    const p=state.savedProperties.find(x=>x.id===card.dataset.relationshipsProperty);
    card.querySelector("[data-relationships-unfavorite]").addEventListener("click",()=>{p.favorite=false;saveState();renderRelationships();});
    card.querySelector("[data-relationships-simulate]").addEventListener("click",()=>{state.settings.propertyValue=Number(p.price||0);state.settings.propertyType=p.used===false?'new':'used';syncInputsFromState();saveState();showView("future");renderHousing();});
  });
}


let relationshipsPhotosCache=[];
function orderedAnaPhotos(list){
  const order=state.relationshipsPhotoOrder||[];
  const by=new Map(list.map(x=>[x.id,x]));
  const out=[];
  for(const id of order){if(by.has(id)){out.push(by.get(id));by.delete(id)}}
  for(const x of list){if(by.has(x.id)){out.push(x);by.delete(x.id)}}
  state.relationshipsPhotoOrder=out.map(x=>x.id);
  return out;
}
async function renderRelationshipsPhotos(){
  const c=$("#relationshipsPhotoMosaic");if(!c)return;
  const r=await nativeJSON("/api/relationships/photos");
  if(!r?.ok){
    c.innerHTML=`<div class="relationships-photo-empty">O mosaico de fotos está disponível no MyWay.exe.</div>`;
    return;
  }
  relationshipsPhotosCache=orderedAnaPhotos(Array.isArray(r.files)?r.files:[]);
  c.innerHTML=relationshipsPhotosCache.length?relationshipsPhotosCache.map(x=>`<article class="relationships-photo" draggable="true" data-relationships-photo="${x.id}"><img src="/api/relationships/photo?id=${encodeURIComponent(x.id)}&t=${encodeURIComponent(x.updated||"")}" alt="${escapeHTML(x.name||"Foto do casal")}" loading="lazy"><div class="relationships-photo-actions"><button data-photo-open title="Abrir">↗</button><button data-photo-delete title="Excluir">×</button></div></article>`).join(""):`<div class="relationships-photo-empty">Ainda não há fotos. Arraste algumas para cá.</div>`;
  let dragging=null;
  $$("[data-relationships-photo]",c).forEach(card=>{
    const id=card.dataset.relationshipsPhoto;
    card.addEventListener("dragstart",()=>{dragging=id;card.classList.add("dragging")});
    card.addEventListener("dragend",()=>{dragging=null;card.classList.remove("dragging")});
    card.addEventListener("dragover",e=>e.preventDefault());
    card.addEventListener("drop",e=>{
      e.preventDefault();if(!dragging||dragging===id)return;
      const order=[...(state.relationshipsPhotoOrder||[])].filter(x=>x!==dragging);
      const at=order.indexOf(id);order.splice(Math.max(0,at),0,dragging);
      state.relationshipsPhotoOrder=order;saveState();renderRelationshipsPhotos();
    });
    card.querySelector("img").addEventListener("dblclick",()=>openAnaPhoto(id));
    card.querySelector("[data-photo-open]").addEventListener("click",()=>openAnaPhoto(id));
    card.querySelector("[data-photo-delete]").addEventListener("click",async()=>{
      if(!await askConfirmation("Excluir esta foto do mosaico?","Excluir foto"))return;
      const rr=await nativeJSON("/api/relationships/photo/delete?id="+encodeURIComponent(id),{method:"POST"});
      if(!rr?.ok)return toast("Não foi possível excluir a foto.");
      state.relationshipsPhotoOrder=(state.relationshipsPhotoOrder||[]).filter(x=>x!==id);saveState();renderRelationshipsPhotos();
    });
  });
}
function openAnaPhoto(id){
  const item=relationshipsPhotosCache.find(x=>x.id===id);if(!item)return;
  const box=document.createElement("div");box.className="relationships-photo-lightbox";
  box.innerHTML=`<button aria-label="Fechar">×</button><img src="/api/relationships/photo?id=${encodeURIComponent(id)}&t=${Date.now()}" alt="${escapeHTML(item.name||"Foto")}">`;
  box.addEventListener("click",e=>{if(e.target===box||e.target.tagName==="BUTTON")box.remove()});
  document.body.appendChild(box);
}
async function uploadAnaPhotos(files){
  const imgs=[...(files||[])].filter(f=>f.type.startsWith("image/"));
  if(!imgs.length)return;
  for(const file of imgs){
    const fd=new FormData();fd.append("file",file,file.name);
    const r=await fetch("/api/relationships/photo/upload",{method:"POST",body:fd});
    if(!r.ok){toast("Falha ao adicionar foto.",file.name);break}
  }
  renderRelationshipsPhotos();
}
$("#relationshipsPhotoFiles")?.addEventListener("change",e=>{uploadAnaPhotos(e.target.files);e.target.value=""});
$("#relationshipsPhotoDrop")?.addEventListener("dragover",e=>{e.preventDefault();e.currentTarget.classList.add("drag")});
$("#relationshipsPhotoDrop")?.addEventListener("dragleave",e=>e.currentTarget.classList.remove("drag"));
$("#relationshipsPhotoDrop")?.addEventListener("drop",e=>{e.preventDefault();e.currentTarget.classList.remove("drag");uploadAnaPhotos(e.dataTransfer.files)});

