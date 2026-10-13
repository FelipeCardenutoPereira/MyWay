/* MVC · Controller da aba Nutrição */
const NutritionController={
  mounted:false,
  mount(root){
    MyWayNutritionModel.ensure();
    const hunger=$('#nutritionHunger133',root),satiety=$('#nutritionSatiety133',root);
    const syncRanges=()=>{if(hunger)$('#nutritionHungerValue133',root).textContent=hunger.value;if(satiety)$('#nutritionSatietyValue133',root).textContent=satiety.value;};
    hunger?.addEventListener('input',syncRanges);satiety?.addEventListener('input',syncRanges);syncRanges();

    const form=$('#nutritionForm127',root);
    form?.addEventListener('submit',e=>{
      e.preventDefault();
      const foods=$('#nutritionFoods127',root).value.trim();
      if(!foods)return toast('Conte o que você comeu para salvar a refeição.');
      const categories=$$('.nutrition-tags127 input:checked',root).map(x=>x.value);
      MyWayNutritionModel.add({
        date:activeDate,meal:$('#nutritionMeal127',root).value,foods,categories,
        water:$('#nutritionWater127',root).value,note:$('#nutritionNote127',root).value,
        hungerBefore:hunger?.value,satietyAfter:satiety?.value
      });
      $('#nutritionFoods127',root).value='';$('#nutritionWater127',root).value='0';$('#nutritionNote127',root).value='';
      if(hunger)hunger.value='5';if(satiety)satiety.value='5';syncRanges();
      $$('.nutrition-tags127 input',root).forEach(x=>x.checked=false);
      saveState();this.render(root);toast('Refeição registrada.','O mapa de 7 dias foi atualizado.');
    });

    root.addEventListener('click',async e=>{
      const del=e.target.closest('[data-nutrition-delete127]');
      if(del){
        const row=MyWayNutritionModel.ensure().find(x=>x.id===del.dataset.nutritionDelete127);if(!row)return;
        if(!await askConfirmation('Remover este registro de alimentação?','Remover registro'))return;
        MyWayNutritionModel.remove(row.id);saveState();this.render(root);return;
      }
      const water=e.target.closest('[data-water-add133]');
      if(water){MyWayNutritionModel.adjustHydration(activeDate,Number(water.dataset.waterAdd133));saveState();this.render(root);return;}
    });

    const goal=$('#nutritionWaterGoal133',root);if(goal)goal.addEventListener('change',()=>{MyWayNutritionModel.setWaterGoal(goal.value);saveState();this.render(root);});
    $$('.nutrition-plate-picks133 input',root).forEach(x=>x.addEventListener('change',()=>this.renderPlate(root)));
    $('#nutritionPlateClear133',root)?.addEventListener('click',()=>{$$('.nutrition-plate-picks133 input',root).forEach(x=>x.checked=false);this.renderPlate(root);});
    $('#nutritionCopyShopping133',root)?.addEventListener('click',async()=>{
      const text=MyWayNutritionModel.shopping(activeDate).map(x=>'• '+x).join('\n');
      try{await navigator.clipboard.writeText(text);toast('Lista copiada.');}catch{toast('Não consegui copiar automaticamente.','Selecione a lista na tela e copie manualmente.');}
    });
    $('#activeDate')?.addEventListener('change',()=>{if(root.classList.contains('active'))this.render(root);});
    $('#goToday')?.addEventListener('click',()=>queueMicrotask(()=>{if(root.classList.contains('active'))this.render(root);}));
    this.mounted=true;this.render(root);
  },
  show(root){this.render(root);},
  renderPlate(root){
    const selected=$$('.nutrition-plate-picks133 input:checked',root).map(x=>x.value),box=$('#nutritionPlateResult133',root);if(!box)return;
    box.innerHTML=`<strong>${selected.length} grupo(s) no rascunho</strong><p>${escapeHTML(MyWayNutritionModel.plateAdvice(selected))}</p>`;
  },
  render(root){
    MyWayNutritionModel.ensure();
    const date=$('#nutritionActiveDate127',root);if(date)date.textContent=formatDateBR(activeDate);
    const today=MyWayNutritionModel.forDate(activeDate),stats=MyWayNutritionModel.stats(activeDate),waterToday=MyWayNutritionModel.waterForDate(activeDate);
    const summary=$('#nutritionTodaySummary127',root);
    if(summary){
      const cats=new Set(today.flatMap(x=>x.categories||[]));
      summary.innerHTML=`<div><strong>${today.length}</strong><span>refeições</span></div><div><strong>${cats.size}</strong><span>grupos identificados</span></div><div><strong>${waterToday}</strong><span>copos registrados</span></div>`;
    }
    const entries=$('#nutritionEntries127',root);
    if(entries)entries.innerHTML=today.length?today.map(r=>`<article class="nutrition-entry127"><div><span>${escapeHTML(MyWayNutritionModel.meals[r.meal]||'Refeição')}</span><b>${escapeHTML(r.foods)}</b>${r.note?`<small>${escapeHTML(r.note)}</small>`:''}<div class="nutrition-entry-tags127">${(r.categories||[]).map(k=>`<i>${escapeHTML(MyWayNutritionModel.groups[k]?.label||k)}</i>`).join('')}</div><small>Fome ${Number(r.hungerBefore??0)}/10 · saciedade ${Number(r.satietyAfter??0)}/10${r.water?` · ${Number(r.water)} copo(s)`:''}</small></div><button class="text-button" type="button" data-nutrition-delete127="${escapeHTML(r.id)}" aria-label="Remover registro">Remover</button></article>`).join(''):'<p class="note">Nenhuma refeição registrada nesta data.</p>';

    const goal=MyWayNutritionModel.waterGoal(),goalInput=$('#nutritionWaterGoal133',root);if(goalInput)goalInput.value=String(goal);
    const total=$('#nutritionWaterTotal133',root);if(total)total.textContent=String(waterToday);
    const pct=Math.min(100,Math.round(waterToday/goal*100));const bar=$('#nutritionWaterBar133',root);if(bar)bar.style.width=pct+'%';
    const progress=$('#nutritionWaterProgressText133',root);if(progress)progress.textContent=`${waterToday} de ${goal} · ${pct}%`;

    this.renderPlate(root);
    const variety=MyWayNutritionModel.variety(activeDate),vk=$('#nutritionVarietyKpis133',root),vl=$('#nutritionVarietyList133',root);
    if(vk)vk.innerHTML=`<div><strong>${variety.unique}</strong><span>itens diferentes identificados</span></div><div><strong>${stats.days}</strong><span>dias com registros</span></div>`;
    if(vl)vl.innerHTML=variety.frequent.length?`<p class="note">Itens que mais se repetiram nos seus textos:</p><div>${variety.frequent.map(([name,n])=>`<span>${escapeHTML(name)} <b>${n}×</b></span>`).join('')}</div>`:'<p class="note">Registre algumas refeições para enxergar variedade e repetição.</p>';

    const rhythm=MyWayNutritionModel.rhythm(activeDate),rh=$('#nutritionRhythmList133',root),rmax=Math.max(1,...Object.values(rhythm));
    if(rh)rh.innerHTML=Object.entries(rhythm).map(([k,n])=>`<div class="nutrition-rhythm-row133"><span>${escapeHTML(MyWayNutritionModel.meals[k])}</span><i><u style="width:${Math.round(n/rmax*100)}%"></u></i><b>${n}</b></div>`).join('');

    const sig=MyWayNutritionModel.signals(activeDate),sigBox=$('#nutritionSignalsSummary133',root);
    if(sigBox)sigBox.innerHTML=sig.count?`<div><strong>${sig.hunger.toFixed(1)}</strong><span>fome média antes</span></div><div><strong>${sig.satiety.toFixed(1)}</strong><span>saciedade média depois</span></div><p>${sig.count} registro(s) com sinais nos últimos 7 dias.</p>`:'<p class="note">Os próximos registros vão começar a formar este histórico.</p>';

    const shop=MyWayNutritionModel.shopping(activeDate),shopBox=$('#nutritionShoppingList133',root);
    if(shopBox)shopBox.innerHTML=shop.map((x,i)=>`<label><input type="checkbox"><span><b>${String(i+1).padStart(2,'0')}</b>${escapeHTML(x)}</span></label>`).join('');

    const compare=$('#nutritionCompare127',root),map=MyWayNutritionModel.map(activeDate);
    if(compare)compare.innerHTML=`<div class="nutrition-compare-head127"><span>Grupo</span><span>O que apareceu</span><span>O que pode melhorar</span><span>Próxima ação</span></div>`+map.map(r=>`<div class="nutrition-compare-row127"><b>${escapeHTML(MyWayNutritionModel.groups[r.id]?.label||r.id)}</b><span>${r.observed} de ${stats.meals} registro(s)</span><span>${escapeHTML(r.improve)}</span><span>${escapeHTML(r.action)}</span></div>`).join('');
    const sug=$('#nutritionSuggestions127',root),suggestions=MyWayNutritionModel.suggestions(activeDate);
    if(sug)sug.innerHTML=suggestions.map((x,i)=>`<div class="nutrition-suggestion127"><span>${String(i+1).padStart(2,'0')}</span><p>${escapeHTML(x)}</p></div>`).join('');
    const week=$('#nutritionWeek127',root);
    if(week){
      const max=Math.max(1,...Object.values(stats.counts));
      week.innerHTML=Object.entries(MyWayNutritionModel.groups).map(([k,g])=>`<div class="nutrition-bar127"><div><b>${escapeHTML(g.label)}</b><span>${stats.counts[k]}</span></div><i><u style="width:${Math.round(stats.counts[k]/max*100)}%"></u></i></div>`).join('');
    }
  }
};
registerMvcController('nutrition',NutritionController);
