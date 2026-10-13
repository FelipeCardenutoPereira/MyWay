/* MyWay 1.2.5 — acesso à conta sem depender da senha antiga.
 * Mantém login por senha, mas adiciona entrada por código/link de e-mail.
 * Nunca cria uma conta nova por esse atalho (create_user:false).
 */
const AUTH_EMAIL_ACCESS125='myway_auth_email_access125';
function authEmailProof125(value,email){
 const text=String(value||'').trim(),digits=text.replace(/[\s-]/g,'');
 if(/^[0-9]{6,10}$/.test(digits))return {email,token:digits,type:'email'};
 let url;try{url=new URL(text);}catch{throw new Error('Digite o código do e-mail ou cole o link completo.');}
 const server=new URL(CLOUD_CONFIG53.url);
 if(url.origin!==server.origin||url.username||url.password||!/^\/auth\/v1\/verify\/?$/.test(url.pathname))throw new Error('Cole somente o link de acesso enviado pelo MyWay.');
 const type=(url.searchParams.get('type')||'').toLowerCase(),token=url.searchParams.get('token_hash')||url.searchParams.get('token');
 if(!['email','magiclink','signup'].includes(type))throw new Error('Esse link não é um link de acesso por e-mail do MyWay.');
 if(!token||!(/^[A-Za-z0-9_-]{6,1024}$/.test(token)))throw new Error('O link parece incompleto. Copie o endereço inteiro do botão do e-mail.');
 return url.searchParams.get('token_hash')?{token_hash:token,type}:{email,token,type:type==='magiclink'?'email':type};
}
function authRememberEmail125(email){try{localStorage.setItem(AUTH_EMAIL_ACCESS125,String(email||'').trim().toLowerCase());}catch{}}
function authSavedEmail125(){try{return localStorage.getItem(AUTH_EMAIL_ACCESS125)||'';}catch{return '';}}
function initAuthAccess125(){
 const oldGroup=authGroup64;authGroup64=function(path,method='POST'){if(/^\/auth\/v1\/otp(\?|$)/.test(path))return 'email';return oldGroup(path,method);};
 const oldMessage=cloudMessage53;cloudMessage53=function(e){
  if(e?.code==='invalid_credentials')return 'A senha não conferiu com a sua conta em nuvem. Use “Entrar por código no e-mail” ou “Esqueci minha senha”. O PIN antigo do MyWay não funciona aqui.';
  return oldMessage(e);
 };
 let observer=null;
 function decorate(){
  const surface=$('#cloudAuth56'),form=surface?.querySelector('#cloudForm53');if(!surface||!form)return;
  const title=form.querySelector('h2')?.textContent?.trim()||'',email=form.querySelector('#cloudEmailInput53'),password=form.querySelector('#cloudPassword53');
  if(title!=='Entrar no MyWay'||!email||!password)return;
  if(!email.value)email.value=cloudEmail53||authSavedEmail125()||'';
  let hint=form.querySelector('#cloudAccountHint125');
  if(!hint){hint=document.createElement('p');hint.id='cloudAccountHint125';hint.className='note auth-account-hint125';hint.textContent='Use a senha da conta em nuvem. Se ela não funcionar, entre pelo código do e-mail sem apagar seus dados.';password.closest('label')?.after(hint);}
  const actions=surface.querySelector('.cloud-actions53');if(!actions||surface.querySelector('#cloudEmailLogin125'))return;
  const button=document.createElement('button');button.type='button';button.className='ghost auth-email-login125';button.id='cloudEmailLogin125';button.textContent='Entrar por código no e-mail';
  button.onclick=async()=>{
   if(!email.reportValidity())return;const address=email.value.trim().toLowerCase();if(!address)return;
   authRememberEmail125(address);const remember=surface.querySelector('#cloudRemember53')?.checked??true,status=form.querySelector('#cloudFormStatus53');
   button.disabled=true;if(status)status.textContent='Solicitando um código de acesso…';
   try{
    await cloudRequest53('/auth/v1/otp',{email:address,create_user:false});
    openEmailCode125(surface,address,remember);
   }catch(err){if(status)status.textContent=cloudMessage53(err);}finally{if(button.isConnected)button.disabled=false;}
  };
  actions.prepend(button);
 }
 async function openEmailCode125(surface,email,remember){
  const c=surface.querySelector('.tools-content49');if(!c)return;const epoch=cloudEpoch53;
  c.innerHTML='<form id="cloudEmailCodeForm125" class="auth-email-code125"><h2>Confira seu e-mail</h2><p class="note">Enviamos um acesso para <b></b>. Digite o código recebido ou cole o link completo da mensagem.</p><label>Código ou link<input id="cloudEmailCode125" type="text" required maxlength="2048" autocomplete="one-time-code" spellcheck="false" autocapitalize="none" placeholder="000000 ou link completo"></label><p id="cloudEmailStatus125" role="status" aria-live="polite"></p><button type="submit" class="primary">Entrar no MyWay</button></form><div class="cloud-actions53"><button type="button" class="ghost" id="cloudEmailResend125">Reenviar código</button><button type="button" class="text-button" id="cloudEmailBack125">Voltar para senha</button></div>';
  c.querySelector('b').textContent=email;const input=c.querySelector('#cloudEmailCode125'),status=c.querySelector('#cloudEmailStatus125'),submit=c.querySelector('button[type=submit]'),resend=c.querySelector('#cloudEmailResend125');
  c.querySelector('#cloudEmailBack125').onclick=()=>{surface.close();cloudOpen53('login');};
  resend.onclick=async()=>{if(resend.disabled)return;resend.disabled=true;status.textContent='Solicitando outro código…';try{await cloudRequest53('/auth/v1/otp',{email,create_user:false});status.textContent='Novo acesso solicitado. Use somente a mensagem mais recente.';}catch(err){status.textContent=cloudMessage53(err);}finally{resend.disabled=false;}};
  c.querySelector('#cloudEmailCodeForm125').onsubmit=async e=>{
   e.preventDefault();if(submit.disabled)return;let proof;try{proof=authEmailProof125(input.value,email);}catch(err){status.textContent=err.message;return;}
   submit.disabled=true;status.textContent='Validando acesso…';
   try{
    const result=await cloudRequest53('/auth/v1/verify',proof);if(epoch!==cloudEpoch53||!surface.isConnected)return;
    if(!result?.access_token||!result?.refresh_token||!result.user?.id)throw new Error('O servidor não retornou uma sessão válida.');
    if((result.user.email||'').toLowerCase()!==email)throw new Error('O código pertence a outro e-mail.');
    if(cloudOwner53&&result.user.id!==cloudOwner53)throw new Error('Este aparelho está com outro perfil aberto. Use “Usar outra conta” antes de trocar.');
    cloudStoreSession53(result,remember);authRememberEmail125(email);status.textContent='Conta validada. Abrindo seu painel…';await cloudAttach53(cloudSession53,surface);
   }catch(err){if(surface.isConnected)status.textContent=cloudMessage53(err);}finally{if(submit.isConnected)submit.disabled=false;}
  };
  input.focus();
 }
 const open=cloudOpen53;cloudOpen53=function(...args){const r=open(...args);queueMicrotask(decorate);return r;};
 observer=new MutationObserver(()=>decorate());observer.observe(document.body,{childList:true,subtree:true});decorate();
}
