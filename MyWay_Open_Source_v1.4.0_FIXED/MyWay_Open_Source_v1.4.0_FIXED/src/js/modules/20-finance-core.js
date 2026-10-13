/* =========================================================
   V4 — CASA / MCMV + CDB
   ========================================================= */
function financingQuota(){
  const used=state.settings.propertyType==="used";
  const region=state.settings.propertyRegion;
  if(used && (region==="SE" || region==="S")) return .60;
  return state.settings.amortizationSystem==="SAC" ? .90 : .80;
}
function futureValue(initial,monthly,annualPct,months){
  const r=Math.pow(1+Math.max(-.99,annualPct)/100,1/12)-1;
  if(Math.abs(r)<1e-9) return initial+monthly*months;
  return initial*Math.pow(1+r,months)+monthly*((Math.pow(1+r,months)-1)/r);
}
function monthsToTarget(initial,monthly,annualPct,target){
  if(initial>=target)return 0;
  const r=Math.pow(1+Math.max(-.99,annualPct)/100,1/12)-1;
  let bal=initial;
  for(let m=1;m<=600;m++){
    bal=bal*(1+r)+monthly;
    if(bal>=target)return m;
  }
  return null;
}
function pmt(pv,annualNominal,months){
  if(pv<=0||months<=0)return 0;
  const i=(annualNominal/100)/12;
  if(i===0)return pv/months;
  return pv*i/(1-Math.pow(1+i,-months));
}
function financingMonthlyRate(annualPct,mode="nominal"){
  const a=Math.max(0,Number(annualPct||0))/100;
  return mode==="effective"?Math.pow(1+a,1/12)-1:a/12;
}
function financingMath(principal,annualPct,months,mode="nominal"){
  principal=Math.max(0,Number(principal||0));months=Math.max(1,Number(months||1));
  const i=financingMonthlyRate(annualPct,mode);
  const amort=principal/months;
  const sacFirst=amort+principal*i;
  const sacLast=amort+amort*i;
  const sacInterest=i*principal*(months+1)/2;
  const sacTotal=principal+sacInterest;
  const price=i===0?principal/months:principal*i/(1-Math.pow(1+i,-months));
  const priceTotal=price*months;
  return {i,amort,sacFirst,sacLast,sacInterest,sacTotal,price,priceTotal,priceInterest:priceTotal-principal};
}
const BANK_PRESETS=[
  {
    id:"caixa-mcmv",name:"CAIXA · MCMV Classe Média",rateSetting:"bankRateCaixaMCMV",
    rateMode:"nominal",rateLabel:"10,00% nominal a.a.",maxPct:()=>financingQuota(),term:420,
    source:"Ministério das Cidades / CAIXA",url:"https://www.caixa.gov.br/voce/habitacao/minha-casa-minha-vida/classe-media/Paginas/default.aspx",
    note:"Programa: renda até R$ 13 mil, imóvel até R$ 600 mil; cota varia por imóvel/região e SAC/PRICE."
  },
  {
    id:"caixa-sbpe",name:"CAIXA · SBPE + TR",rateSetting:"bankRateCaixaSBPE",
    rateMode:"effective",rateLabel:"10,99% efetiva a.a. + TR",maxPct:null,term:420,
    source:"CAIXA",url:"https://www.caixa.gov.br/voce/habitacao/financiamento-de-imoveis/Paginas/default.aspx",
    note:"Taxa pública 'a partir de'. A cota real varia conforme modalidade, perfil e sistema."
  },
  {
    id:"santander",name:"Santander",rateSetting:"bankRateSantander",
    rateMode:"nominal",rateLabel:"11,69% a.a. + TR",maxPct:.90,term:420,
    source:"Santander",url:"https://www.santander.com.br/hotsite/credito-financiamento-imobiliario/",
    note:"Página pública informa até 90% do imóvel e prazo de até 35 anos, sujeito à análise."
  },
  {
    id:"itau",name:"Itaú · pré-fixada + TR",rateSetting:"bankRateItau",
    rateMode:"nominal",rateLabel:"13,85% a.a. + TR",maxPct:null,term:420,
    source:"Itaú",url:"https://www.itau.com.br/emprestimos-financiamentos/credito-imobiliario",
    note:"Taxa pública 'a partir de'. O banco também possui linha vinculada à poupança."
  },
  {
    id:"bradesco",name:"Bradesco",rateSetting:"bankRateBradesco",
    rateMode:"nominal",rateLabel:"preencha a taxa da proposta",maxPct:.80,term:420,
    source:"Bradesco",url:"https://banco.bradesco/html/classic/produtos-servicos/emprestimo-e-financiamento/imoveis/credito-imobiliario-aquisicao-de-imoveis.shtm",
    note:"Página pública informa até 80% e até 35 anos; taxa depende da simulação/relacionamento."
  },
  {
    id:"bb",name:"Banco do Brasil",rateSetting:"bankRateBB",
    rateMode:"nominal",rateLabel:"preencha a taxa da proposta",maxPct:.80,term:420,
    source:"Banco do Brasil",url:"https://blog.bb.com.br/financiamento-imobiliario/",
    note:"Referência pública do SFH indica até 80%; use a taxa obtida no simulador do banco."
  }
];
function bankFinanceAmount(bank,price,available){
  const pct=typeof bank.maxPct==="function"?bank.maxPct():bank.maxPct;
  const minEntry=pct!=null?price*(1-pct):0;
  const entry=Math.min(price,Math.max(Math.min(available,price),minEntry));
  const finance=Math.max(0,price-entry);
  return {pct,minEntry,entry,finance};
}
function renderAmortizationComparison(finance,annual,term){
  if(!$("#compareSacFirst"))return;
  const m=financingMath(finance,annual,term,"nominal");
  $("#compareSacFirst").textContent=money(m.sacFirst);
  $("#compareSacLast").textContent=money(m.sacLast);
  $("#compareSacInterest").textContent=money(m.sacInterest);
  $("#compareSacTotal").textContent=money(m.sacTotal);
  $("#comparePricePayment").textContent=money(m.price);
  $("#comparePriceLast").textContent=money(m.price);
  $("#comparePriceInterest").textContent=money(m.priceInterest);
  $("#comparePriceTotal").textContent=money(m.priceTotal);
  $$("[data-system-box]").forEach(x=>x.classList.toggle("active",x.dataset.systemBox===state.settings.amortizationSystem));
}
function renderBankSimulations(){
  const c=$("#bankSimulationGrid");if(!c)return;
  const price=Math.max(0,Number(state.settings.propertyValue||0));
  const available=Math.max(0,Number(state.settings.currentSavings||0)+Number(state.settings.fgtsBalance||0)+Number(state.settings.otherEntry||0));
  const userTerm=Math.max(12,Math.min(Number(state.settings.termMonths||420),420));
  $("#bankPropertyValue").textContent=money(price);
  $("#bankEntryAvailable").textContent=money(Math.min(available,price));
  $("#bankTerm").textContent=`${userTerm} meses`;
  c.innerHTML=BANK_PRESETS.map(bank=>{
    const rate=Number(state.settings[bank.rateSetting]||0);
    const term=Math.min(userTerm,bank.term||userTerm);
    const f=bankFinanceAmount(bank,price,available);
    const math=rate>0?financingMath(f.finance,rate,term,bank.rateMode):null;
    const pctText=f.pct!=null?`${Math.round(f.pct*100)}%`:"conforme análise";
    return `<article class="bank-sim-card" data-bank="${bank.id}">
      <header><div><h4>${escapeHTML(bank.name)}</h4><small>${escapeHTML(bank.source)}</small></div><a href="${escapeHTML(bank.url)}" target="_blank" rel="noopener">oficial ↗</a></header>
      <div class="bank-rate-line">
        <label><span>TAXA ANUAL PARA SIMULAR</span><input type="number" min="0" step=".01" data-bank-rate value="${rate||""}" placeholder="ex.: 11,50"></label>
        <div class="bank-rate-mode">${escapeHTML(bank.rateLabel)}</div>
      </div>
      <div class="bank-finance-meta">
        <div><span>cota ref.</span><strong>${pctText}</strong></div>
        <div><span>entrada usada</span><strong>${money(f.entry)}</strong></div>
        <div><span>financiado</span><strong>${money(f.finance)}</strong></div>
        <div><span>prazo</span><strong>${term} meses</strong></div>
      </div>
      <div class="bank-system-results">
        <div class="bank-system-result"><b>SAC</b><span>1ª parcela</span><strong>${math?money(math.sacFirst):"informe taxa"}</strong><small>${math?`última ${money(math.sacLast)} · juros ${money(math.sacInterest)}`:""}</small></div>
        <div class="bank-system-result"><b>PRICE</b><span>parcela</span><strong>${math?money(math.price):"informe taxa"}</strong><small>${math?`juros ${money(math.priceInterest)} · total ${money(math.priceTotal)}`:""}</small></div>
      </div>
      <p class="bank-sim-note">${escapeHTML(bank.note)}</p>
    </article>`;
  }).join("");
  $$("[data-bank]",c).forEach(card=>{
    const bank=BANK_PRESETS.find(x=>x.id===card.dataset.bank);
    card.querySelector("[data-bank-rate]")?.addEventListener("change",e=>{
      state.settings[bank.rateSetting]=Math.max(0,Number(e.target.value||0));
      saveState();renderBankSimulations();
    });
  });
}
function renderHousing(){
  if(!$("#mcmvQuota")) return;
  const price=Number(state.settings.propertyValue||0);
  const income=Number(state.settings.householdIncome||0);
  const quota=financingQuota();
  const maxFinance=price*quota;
  const minEntry=price-maxFinance;
  const current=Number(state.settings.currentSavings||0);
  const fgts=Number(state.settings.fgtsBalance||0);
  const other=Number(state.settings.otherEntry||0);
  const available=current+fgts+other;
  const gap=Math.max(0,minEntry-available);
  const monthly=Number(state.settings.monthlyContribution||0);
  const grossAnnual=Number(state.settings.cdiAnnual||0)*(Number(state.settings.cdbPercent||0)/100);
  const months=monthsToTarget(available,monthly,grossAnnual,minEntry);
  const plannedEntry=Math.min(price,available);
  const neededFinance=Math.max(0,price-plannedEntry);
  const finance=Math.min(neededFinance,maxFinance);
  const term=Math.min(Number(state.settings.termMonths||420),Number(state.settings.mcmvMaxTerm||420));
  const annual=Number(state.settings.mcmvAnnualRate||10);

  $("#mcmvQuota").textContent=`${Math.round(quota*100)}%`;
  $("#mcmvQuotaNote").textContent=(state.settings.propertyType==="used"&&(state.settings.propertyRegion==="SE"||state.settings.propertyRegion==="S"))
    ?"usado no Sul/Sudeste · até 60%"
    :state.settings.amortizationSystem==="SAC"
      ?"SAC · regra geral do programa até 90%"
      :"PRICE · regra geral do programa até 80%";
  $("#mcmvMinEntry").textContent=money(minEntry);
  $("#mcmvAvailable").textContent=money(available);
  $("#mcmvGap").textContent=gap?money(gap):"entrada coberta";
  $("#mcmvGapTime").textContent=gap?(months==null?"mais de 50 anos na hipótese informada":`~${months} meses na projeção bruta`):"com os valores informados";
  $("#financeAmount").textContent=money(finance);

  const pricePay=pmt(finance,annual,term);
  const i=(annual/100)/12;
  const amort=term?finance/term:0;
  $("#pricePayment").textContent=money(pricePay);
  $("#sacFirst").textContent=money(amort+finance*i);
  $("#sacLast").textContent=money(amort+amort*i);
  $("#incomeReference").textContent=income?money(income*.30):"—";

  const projected=futureValue(current,monthly,grossAnnual,12);
  $("#savings12m").textContent=money(projected);

  const eligibleIncome=!income || income<=Number(state.settings.mcmvIncomeLimit||13000);
  const eligiblePrice=!price || price<=Number(state.settings.mcmvPropertyCap||600000);
  const band=!income?"":income<=3200?"Faixa 1":income<=5000?"Faixa 2":income<=9600?"Faixa 3":income<=13000?"Classe Média":"Acima do MCMV";
  const enoughEntry=available>=minEntry;
  const el=$("#mcmvEligibility");
  const reasons=[];
  if(!eligibleIncome)reasons.push(`renda acima do teto informado (${money(state.settings.mcmvIncomeLimit)})`);
  if(!eligiblePrice)reasons.push(`imóvel acima do teto informado (${money(state.settings.mcmvPropertyCap)})`);
  if(!enoughEntry)reasons.push(`faltam ${money(gap)} para a entrada mínima pela cota usada`);
  if(!reasons.length && income && price){
    el.className="eligibility-box good";
    el.textContent=`Enquadramento de renda estimado: ${band}. Renda e valor do imóvel cabem nos limites gerais informados e a entrada de referência está coberta. ${band!=="Classe Média"?"Como a renda cai em outra faixa do programa, as condições efetivas podem ser diferentes ou melhores que esta simulação conservadora do Classe Média. ":""}A aprovação real depende da análise de crédito, CET e regras do banco.`;
  }else if(reasons.length){
    el.className="eligibility-box warn";
    el.textContent=`Ponto(s) a resolver: ${reasons.join("; ")}.`;
  }else{
    el.className="eligibility-box";
    el.textContent="Preencha renda e imóvel para verificar os limites básicos.";
  }
  renderAmortizationComparison(finance,annual,term);renderBankSimulations();renderPropertyGame();
}
$("#addContribution")?.addEventListener("click",()=>{
  const amount=Number($("#contributionInput").value||0);
  if(amount<=0)return toast("Informe o valor do aporte.");
  state.settings.currentSavings=Number(state.settings.currentSavings||0)+amount;
  const input=$('[data-setting="currentSavings"]');if(input)input.value=state.settings.currentSavings;
  state.financeEvents.push({id:cryptoId(),date:activeDate,amount,createdAt:new Date().toISOString()});
  $("#contributionInput").value="";
  saveState();renderHousing();renderReports();toast("Aporte registrado.",money(amount));
});

function renderCashflow(){
  if(!$("#cashflowAvailable"))return;
  const received=Number(state.settings.salaryAdvance||0)+Number(state.settings.salarySecondPayment||0);
  const costs=Number(state.settings.cardBill||0)+Number(state.settings.claroMonthly||0)+Number(state.settings.pucMonthly||0)+Number(state.settings.transportMonthly||0);
  $("#cashflowAvailable").textContent=money(received-costs);
}

let pendingProperty=null;
function propertyEntryFor(prop){
  const price=Number(prop.price||0);
  const used=prop.used!==false;
  let quota;
  if(used && (prop.region||"SE") in {SE:1,S:1}) quota=.60;
  else quota=.80;
  const entry=price*(1-quota);
  const available=Number(state.settings.currentSavings||0)+Number(state.settings.fgtsBalance||0)+Number(state.settings.otherEntry||0);
  return {quota,entry,available,gap:Math.max(0,entry-available)};
}
async function importPropertyFromURL(){
  const url=$("#propertyUrl")?.value.trim();if(!url)return toast("Cole o link do imóvel.");
  const st=$("#propertyImportStatus");st.className="property-import-status loading";st.textContent="Lendo o anúncio...";
  const data=await nativeJSON('/api/scrape',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url})});
  if(!data){st.className="property-import-status error";st.textContent="Não consegui ler essa página automaticamente. O importador funciona no MyWay.exe; alguns sites também podem bloquear robôs.";return;}
  pendingProperty={id:cryptoId(),savedAt:new Date().toISOString(),used:true,region:"SE",...data,url};
  st.className="property-import-status";st.textContent=`${data.portal||'Portal'} lido. Confira antes de salvar.`;renderPropertyPreview();
}
function renderPropertyPreview(){
  const c=$("#propertyPreview");if(!c||!pendingProperty)return;c.hidden=false;
  const p=pendingProperty,f=propertyEntryFor(p);
  c.innerHTML=`<div class="property-preview-grid">${p.image?`<img class="property-preview-image" src="${escapeHTML(p.image)}" alt="">`:`<div class="property-preview-image"></div>`}<div class="property-preview-content"><h4>${escapeHTML(p.title||'Imóvel importado')}</h4><div class="property-preview-meta"><span>${money(p.price)}</span>${p.area?`<span>${p.area} m²</span>`:''}${p.bedrooms?`<span>${p.bedrooms} quartos</span>`:''}${p.parking?`<span>${p.parking} vaga(s)</span>`:''}<span>entrada estimada ${money(f.entry)}</span></div><div class="property-preview-actions"><button class="primary" id="savePendingProperty">Salvar opção</button><button class="ghost" id="usePendingProperty">Usar no simulador</button></div></div></div>`;
  $("#savePendingProperty").onclick=()=>{state.savedProperties.unshift(pendingProperty);saveState();renderSavedProperties();c.hidden=true;$("#propertyUrl").value="";toast("Imóvel salvo.",`${money(p.price)} · entrada estimada ${money(f.entry)}`);pendingProperty=null;};
  $("#usePendingProperty").onclick=()=>{state.settings.propertyValue=Number(p.price||0);state.settings.propertyType=p.used===false?'new':'used';syncInputsFromState();saveState();renderHousing();toast("Imóvel aplicado ao simulador.");};
}
function renderSavedProperties(){
  const c=$("#savedPropertiesList");if(!c)return;$("#savedPropertiesCount").textContent=state.savedProperties.length;
  c.innerHTML=state.savedProperties.length?state.savedProperties.map(p=>{const f=propertyEntryFor(p);return `<article class="property-card ${p.favorite?'favorite-property':''}" data-property-id="${p.id}"><div class="property-image">${p.image?`<img src="${escapeHTML(p.image)}" alt="">`:''}<span class="property-source">${escapeHTML(p.portal||'IMÓVEL')}</span></div><div class="property-body"><div class="property-title-line"><h4>${escapeHTML(p.title||p.address||'Imóvel')}</h4><button class="property-favorite ${p.favorite?'on':''}" data-favorite-property title="Mostrar em Relacionamentos / Nossos imóveis">${p.favorite?'♥':'♡'}</button></div><div class="property-price">${money(p.price)}</div><div class="property-details">${p.area?`<span>${p.area} m²</span>`:''}${p.bedrooms?`<span>${p.bedrooms} quartos</span>`:''}${p.parking?`<span>${p.parking} vaga</span>`:''}${p.condo?`<span>cond. ${money(p.condo)}</span>`:''}</div><div class="property-finance"><div><span>Entrada MCMV estimada</span><strong>${money(f.entry)}</strong></div><div><span>Falta com sua reserva</span><strong>${f.gap?money(f.gap):'coberta'}</strong></div></div><div class="property-actions"><a href="${escapeHTML(p.url)}" target="_blank" rel="noreferrer">abrir anúncio ↗</a><button data-use-property>simular</button><button class="delete-property" data-delete-property>excluir</button></div></div></article>`}).join(''):`<p class="note">Nenhum imóvel salvo. Cole um link acima para começar sua comparação.</p>`;
  $$('[data-property-id]',c).forEach(card=>{const p=state.savedProperties.find(x=>x.id===card.dataset.propertyId);card.querySelector('[data-use-property]').onclick=()=>{state.settings.propertyValue=Number(p.price||0);state.settings.propertyType=p.used===false?'new':'used';syncInputsFromState();saveState();renderHousing();toast('Imóvel aplicado ao simulador.');};card.querySelector('[data-favorite-property]')?.addEventListener('click',()=>{p.favorite=!p.favorite;saveState();renderSavedProperties();if($('#view-relationships')?.classList.contains('active'))renderRelationships();toast(p.favorite?'Imóvel favoritado.':'Imóvel removido dos favoritos.',p.favorite?'Ele agora aparece na área Relacionamentos.':'');});card.querySelector('[data-delete-property]').onclick=()=>{state.savedProperties=state.savedProperties.filter(x=>x.id!==p.id);saveState();renderSavedProperties();if($('#view-relationships')?.classList.contains('active'))renderRelationships();};});
}
$("#importProperty")?.addEventListener("click",importPropertyFromURL);
$("#propertyUrl")?.addEventListener("keydown",e=>{if(e.key==='Enter')importPropertyFromURL();});
$$('[data-property-example]').forEach(b=>b.addEventListener('click',()=>{$('#propertyUrl').value=b.dataset.propertyExample;importPropertyFromURL();}));

