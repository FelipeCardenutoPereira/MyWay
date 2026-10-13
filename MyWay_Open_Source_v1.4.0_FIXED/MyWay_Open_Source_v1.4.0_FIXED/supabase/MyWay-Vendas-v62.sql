-- Execute uma vez no SQL Editor do seu projeto Supabase.
-- Não altera notas, hábitos, XP ou as tabelas de sincronização existentes.
begin;
create table if not exists public.myway_access62 (
 user_id uuid primary key references auth.users(id) on delete cascade,
 status text not null default 'active' check(status in ('active','suspended','refunded')),
 valid_until timestamptz not null,
 updated_at timestamptz not null default now()
);
create table if not exists public.myway_access_receipts62 (
 receipt_id text primary key check(length(receipt_id) between 3 and 160),
 user_id uuid not null references auth.users(id) on delete cascade,
 days integer not null check(days between 1 and 3660),
 granted_until timestamptz not null,
 created_at timestamptz not null default now()
);
alter table public.myway_access62 enable row level security;
alter table public.myway_access_receipts62 enable row level security;
revoke all on public.myway_access62,public.myway_access_receipts62 from public,anon,authenticated;

create or replace function public.myway_access_status62()
returns jsonb language plpgsql security definer set search_path=pg_catalog,public as $$
declare u uuid:=auth.uid(); r public.myway_access62%rowtype;
begin
 if u is null then raise exception 'Entre na sua conta.' using errcode='42501';end if;
 select * into r from public.myway_access62 where user_id=u;
 return jsonb_build_object('active',coalesce(r.status='active' and r.valid_until>now(),false),
  'status',case when r.user_id is null then 'not_activated' when r.status='active' and r.valid_until<=now() then 'expired' else r.status end,
  'valid_until',r.valid_until,'server_time',now());
end $$;
revoke all on function public.myway_access_status62() from public,anon;
grant execute on function public.myway_access_status62() to authenticated;

-- Apenas administrador/SQL Editor/service_role. Nunca execute pelo APK.
-- Use o identificador REAL do pagamento aprovado no Mercado Pago como recibo.
-- Repetir o mesmo recibo não estende o prazo novamente.
create or replace function public.myway_grant_access62(p_email text,p_days integer,p_receipt text)
returns jsonb language plpgsql security definer set search_path=pg_catalog,public as $$
declare u uuid; old public.myway_access_receipts62%rowtype; ending timestamptz;
begin
 if p_days is null or p_days not between 1 and 3660 or p_receipt is null or length(trim(p_receipt)) not between 3 and 160 then raise exception 'Dias ou recibo inválido.';end if;
 select id into u from auth.users where lower(email)=lower(trim(p_email));
 if u is null then raise exception 'A conta precisa ser criada e confirmada antes da ativação.';end if;
 if not exists(select 1 from auth.users where id=u and email_confirmed_at is not null) then raise exception 'O e-mail da conta ainda não foi confirmado.';end if;
 perform pg_advisory_xact_lock(hashtextextended(u::text,62));
 select * into old from public.myway_access_receipts62 where receipt_id=trim(p_receipt);
 if found then
  if old.user_id<>u or old.days<>p_days then raise exception 'Esse recibo já pertence a outra ativação.';end if;
  return jsonb_build_object('user_id',u,'valid_until',old.granted_until,'already_applied',true);
 end if;
 select case when status='active' then greatest(valid_until,now()) else now() end into ending from public.myway_access62 where user_id=u;
 ending:=coalesce(ending,now())+make_interval(days=>p_days);
 insert into public.myway_access62(user_id,status,valid_until) values(u,'active',ending)
 on conflict(user_id) do update set status='active',valid_until=excluded.valid_until,updated_at=now();
 insert into public.myway_access_receipts62(receipt_id,user_id,days,granted_until) values(trim(p_receipt),u,p_days,ending);
 return jsonb_build_object('user_id',u,'valid_until',ending,'already_applied',false);
end $$;
revoke all on function public.myway_grant_access62(text,integer,text) from public,anon,authenticated;
grant execute on function public.myway_grant_access62(text,integer,text) to service_role;

create or replace function public.myway_suspend_access62(p_email text)
returns void language plpgsql security definer set search_path=pg_catalog,public as $$
begin
 update public.myway_access62 set status='suspended',updated_at=now()
 where user_id=(select id from auth.users where lower(email)=lower(trim(p_email)));
end $$;
revoke all on function public.myway_suspend_access62(text) from public,anon,authenticated;
grant execute on function public.myway_suspend_access62(text) to service_role;
commit;

-- Depois de conferir um pagamento APROVADO na sua conta Mercado Pago:
-- select public.myway_grant_access62('email-do-cliente@exemplo.com',30,'MP-ID-REAL-DO-PAGAMENTO');
-- Se precisar suspender após reembolso/cancelamento:
-- select public.myway_suspend_access62('email-do-cliente@exemplo.com');
