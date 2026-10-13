/* MVC · Model de Nutrição
   Organização e reflexão alimentar. Não calcula dieta, calorias ou metas clínicas. */
const MyWayNutritionModel={
  groups:{
    protein:{label:'Proteína',keywords:['ovo','ovos','frango','carne','peixe','atum','sardinha','feijão','feijao','lentilha','grão-de-bico','grao de bico','tofu','iogurte','queijo','leite']},
    vegetables:{label:'Verduras / legumes',keywords:['salada','alface','tomate','cenoura','brócolis','brocolis','couve','espinafre','abobrinha','berinjela','legume','legumes','verdura','verduras','pepino','beterraba','repolho']},
    fruit:{label:'Fruta',keywords:['banana','maçã','maca','laranja','mamão','mamao','morango','uva','melancia','melão','melao','pera','abacaxi','manga','kiwi','fruta','frutas']},
    carbs:{label:'Grãos / tubérculos',keywords:['arroz','batata','mandioca','aipim','macarrão','macarrao','massa','aveia','pão','pao','tapioca','milho','quinoa','cuscuz']},
    dairy:{label:'Laticínio',keywords:['leite','queijo','iogurte','requeijão','requeijao','coalhada']},
    ultra:{label:'Doce / ultraprocessado',keywords:['refrigerante','biscoito','bolacha','salgadinho','fast food','hambúrguer','hamburguer','pizza','doce','chocolate','sorvete','cup noodles','miojo','embutido','salsicha']}
  },
  meals:{cafe:'Café da manhã',lanche:'Lanche',almoco:'Almoço',jantar:'Jantar',ceia:'Ceia',outro:'Outro'},
  ensure(){
    if(!Array.isArray(state.nutritionEntries))state.nutritionEntries=[];
    if(!state.nutritionHydration133||typeof state.nutritionHydration133!=='object'||Array.isArray(state.nutritionHydration133))state.nutritionHydration133={};
    const goal=Number(state.settings.nutritionWaterGoal133);
    state.settings.nutritionWaterGoal133=Number.isFinite(goal)?Math.max(1,Math.min(20,Math.round(goal))):8;
    return state.nutritionEntries;
  },
  infer(text=''){
    const t=String(text).toLocaleLowerCase('pt-BR');
    return Object.entries(this.groups).filter(([,g])=>g.keywords.some(k=>t.includes(k))).map(([id])=>id);
  },
  add({date,meal,foods,categories,water,note,hungerBefore,satietyAfter}){
    const inferred=this.infer(foods),cats=[...new Set([...(categories||[]),...inferred])].filter(x=>this.groups[x]);
    const row={
      id:cryptoId(),date,meal,foods:String(foods||'').trim(),categories:cats,
      water:Math.max(0,Math.min(20,Number(water)||0)),note:String(note||'').trim(),
      hungerBefore:Math.max(0,Math.min(10,Number(hungerBefore)||0)),
      satietyAfter:Math.max(0,Math.min(10,Number(satietyAfter)||0)),
      createdAt:new Date().toISOString()
    };
    this.ensure().unshift(row);return row;
  },
  remove(id){state.nutritionEntries=this.ensure().filter(x=>x.id!==id);},
  forDate(date){return this.ensure().filter(x=>x.date===date).sort((a,b)=>String(a.createdAt||'').localeCompare(String(b.createdAt||'')));},
  dateOffset(iso,days){const [y,m,d]=String(iso).split('-').map(Number),x=new Date(y,m-1,d,12);x.setDate(x.getDate()+days);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;},
  window(end=activeDate,days=7){const start=this.dateOffset(end,-(days-1));return this.ensure().filter(x=>x.date>=start&&x.date<=end);},
  waterGoal(){this.ensure();return state.settings.nutritionWaterGoal133;},
  setWaterGoal(value){this.ensure();state.settings.nutritionWaterGoal133=Math.max(1,Math.min(20,Math.round(Number(value)||8)));return state.settings.nutritionWaterGoal133;},
  hydrationExtra(date){this.ensure();return Math.max(0,Number(state.nutritionHydration133[date])||0);},
  adjustHydration(date,delta){this.ensure();state.nutritionHydration133[date]=Math.max(0,Math.min(40,this.hydrationExtra(date)+(Number(delta)||0)));return state.nutritionHydration133[date];},
  waterForDate(date){return this.forDate(date).reduce((n,x)=>n+Number(x.water||0),0)+this.hydrationExtra(date);},
  stats(end=activeDate){
    const rows=this.window(end,7),counts=Object.fromEntries(Object.keys(this.groups).map(k=>[k,0]));
    for(const r of rows)for(const k of new Set(r.categories||[]))if(k in counts)counts[k]++;
    const days=new Set(rows.map(r=>r.date)).size;
    let water=0;for(let i=0;i<7;i++)water+=this.waterForDate(this.dateOffset(end,-i));
    return {rows,counts,water,days,meals:rows.length,waterPerLoggedDay:days?water/days:0};
  },
  foodItems(text=''){
    const cleaned=String(text).toLocaleLowerCase('pt-BR').replace(/[()\[\]]/g,' ').replace(/\s+/g,' ').trim();
    return cleaned.split(/\s*(?:,|;|\+|\/|\be\b)\s*/i).map(x=>x.replace(/^(um|uma|uns|umas|com|de|do|da)\s+/,'').trim()).filter(x=>x.length>2&&x.length<70);
  },
  variety(end=activeDate){
    const rows=this.window(end,7),freq=new Map();
    for(const r of rows)for(const item of this.foodItems(r.foods))freq.set(item,(freq.get(item)||0)+1);
    const sorted=[...freq.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'pt-BR'));
    return {unique:sorted.length,frequent:sorted.slice(0,8),items:sorted};
  },
  rhythm(end=activeDate){
    const counts=Object.fromEntries(Object.keys(this.meals).map(k=>[k,0]));
    for(const r of this.window(end,7))if(r.meal in counts)counts[r.meal]++;
    return counts;
  },
  signals(end=activeDate){
    const rows=this.window(end,7).filter(r=>Number.isFinite(Number(r.hungerBefore))&&Number.isFinite(Number(r.satietyAfter)));
    if(!rows.length)return {count:0,hunger:0,satiety:0};
    return {count:rows.length,hunger:rows.reduce((n,r)=>n+Number(r.hungerBefore),0)/rows.length,satiety:rows.reduce((n,r)=>n+Number(r.satietyAfter),0)/rows.length};
  },
  map(end=activeDate){
    const s=this.stats(end),m=s.meals||1;
    return [
      {id:'vegetables',observed:s.counts.vegetables,improve:s.counts.vegetables<Math.max(2,Math.ceil(m*.35))?'Apareceu pouco nos registros.':'Boa presença nos registros.',action:'Colocar uma verdura ou legume em uma refeição principal.'},
      {id:'fruit',observed:s.counts.fruit,improve:s.counts.fruit<Math.max(2,Math.ceil(m*.25))?'Frutas apareceram poucas vezes.':'Frutas aparecem com frequência.',action:'Usar uma fruta como parte de um lanche ou café da manhã.'},
      {id:'protein',observed:s.counts.protein,improve:s.counts.protein<Math.max(2,Math.ceil(m*.45))?'Proteína apareceu em poucas refeições.':'Proteína aparece de forma consistente.',action:'Incluir uma fonte de proteína em uma refeição que hoje costuma ficar sem.'},
      {id:'carbs',observed:s.counts.carbs,improve:s.counts.carbs===0?'Grãos/tubérculos não foram identificados.':'Há fontes de grãos ou tubérculos registradas.',action:'Variar entre arroz, aveia, milho, batata, mandioca ou outras opções que façam sentido para você.'},
      {id:'ultra',observed:s.counts.ultra,improve:s.counts.ultra>m*.4?'Doces/ultraprocessados aparecem em muitos registros.':'Frequência moderada ou baixa nos registros.',action:'Se quiser reduzir, troque apenas uma ocorrência por uma opção menos processada — sem tentar mudar tudo de uma vez.'}
    ];
  },
  suggestions(end=activeDate){
    const s=this.stats(end),map=this.map(end),out=[];
    if(!s.meals)return ['Registre algumas refeições para o MyWay encontrar padrões reais em vez de adivinhar.'];
    for(const r of map){if(['vegetables','fruit','protein'].includes(r.id)&&/pouco|poucas/i.test(r.improve))out.push(r.action);if(r.id==='ultra'&&/muitos/i.test(r.improve))out.push(r.action);}
    const recentWater=[0,1,2,3,4,5,6].map(i=>this.waterForDate(this.dateOffset(end,-i))).filter(x=>x>0);
    if(recentWater.length&&recentWater.reduce((a,b)=>a+b,0)/recentWater.length<this.waterGoal()*.6)out.push('Se água costuma passar despercebida, deixe uma garrafa visível e use o contador do MyWay ao longo do dia.');
    if(!out.length)out.push('Os registros estão relativamente variados. Escolha só uma pequena melhoria que seja fácil manter nesta semana.');
    return out.slice(0,5);
  },
  plateAdvice(selected=[]){
    const set=new Set(selected),out=[];
    if(!set.size)return 'Marque os grupos que você já pretende colocar. O MyWay mostra apenas o que talvez esteja faltando no seu rascunho.';
    if(!set.has('vegetables'))out.push('algum legume ou verdura');
    if(!set.has('protein'))out.push('uma fonte de proteína');
    if(!set.has('carbs'))out.push('um grão ou tubérculo que combine com a refeição');
    if(!set.has('fruit'))out.push('uma fruta em outro momento, se fizer sentido');
    if(!out.length)return 'Seu rascunho já inclui vários grupos. Agora vale pensar mais em praticidade, fome e preferências do que em “perfeição”.';
    return `Se fizer sentido, você ainda pode considerar ${out.slice(0,3).join(', ')}.`;
  },
  shopping(end=activeDate){
    const s=this.stats(end),m=s.meals||1,out=[];
    if(s.counts.vegetables<Math.max(2,Math.ceil(m*.35)))out.push('Verduras/legumes que você realmente goste: folhas, tomate, cenoura, brócolis, abobrinha ou similares.');
    if(s.counts.fruit<Math.max(2,Math.ceil(m*.25)))out.push('2 ou 3 frutas práticas para a semana, escolhidas pelo que você de fato costuma comer.');
    if(s.counts.protein<Math.max(2,Math.ceil(m*.45)))out.push('Fontes de proteína que façam sentido para você: ovos, feijão/lentilha, frango/peixe, tofu, iogurte ou outras opções.');
    if(s.counts.carbs===0)out.push('Uma base prática de grãos/tubérculos: arroz, aveia, milho, batata, mandioca, cuscuz ou equivalente.');
    if(!out.length)out.push('Os principais grupos já aparecem nos registros. Use a próxima compra para variar sabores e opções práticas, sem aumentar a lista sem necessidade.');
    return out;
  }
};
