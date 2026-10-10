(async()=>{
 const q=s=>document.querySelector(s),https=v=>typeof v==='string'&&/^https:\/\//.test(v);
 try{
  const response=await fetch('config.json',{cache:'no-store'});if(!response.ok)throw Error('Configuração indisponível');const c=await response.json(),o=c.offer;
  const ready=c.salesEnabled===true&&c.enforceAccess===true&&c.distribution==='direct'&&o&&Number.isFinite(o.priceBRL)&&o.priceBRL>0&&Number.isInteger(o.accessDays)&&o.accessDays>0&&https(c.checkoutUrl)&&https(c.privacyUrl)&&https(c.termsUrl)&&c.ownerName?.trim()&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.supportEmail);
  if(c.ownerName)q('#owner').textContent=c.ownerName+(c.supportEmail?' · '+c.supportEmail:'');
  if(ready){q('#price').textContent=o.priceBRL.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});q('#duration').textContent=o.accessDays+' dias de acesso · pagamento único';q('#buy').href=c.checkoutUrl;q('#buy').hidden=false;q('#support').href='mailto:'+c.supportEmail;q('#support').hidden=false;q('#readiness').textContent='Liberação manual após conferência. Use o mesmo e-mail da conta MyWay.';q('#download').textContent='Baixar aplicativo Android';document.querySelector('footer a[href="privacidade.html"]').href=c.privacyUrl;document.querySelector('footer a[href="termos.html"]').href=c.termsUrl;}
 }catch{q('#readiness').textContent='Oferta em preparação. Pagamento indisponível.';}
})();
