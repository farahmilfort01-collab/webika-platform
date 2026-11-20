-- WEBIKA : schéma de la base. À coller dans Supabase > SQL Editor > Run.
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text, company text, phone text,
  role text not null default 'client' check (role in ('client','admin')),
  created_at timestamptz not null default now());
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  template_id text not null, pack text not null check (pack in ('essentiel','pro','premium')),
  company jsonb not null default '{}'::jsonb,
  status text not null default 'demande' check (status in ('demande','en_cours','en_revision','livre')),
  created_at timestamptz not null default now());
create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  project_id uuid references public.projects on delete set null,
  kind text not null default 'modification' check (kind in ('modification','support')),
  message text not null,
  status text not null default 'ouverte' check (status in ('ouverte','traitee')),
  created_at timestamptz not null default now());
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  project_id uuid references public.projects on delete set null,
  label text not null, amount_cents integer not null,
  stripe_session_id text unique, status text not null default 'paye',
  created_at timestamptz not null default now());
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('devis','contact')),
  name text, company text, phone text, email text,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now());

-- Profil créé automatiquement à l'inscription
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, company, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'company', new.raw_user_meta_data->>'phone');
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_admin() returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

-- Un client ne peut pas se donner le rôle admin
create or replace function public.protect_role() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then new.role := old.role; end if;
  return new;
end $$;
drop trigger if exists protect_role on public.profiles;
create trigger protect_role before update on public.profiles for each row execute function public.protect_role();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.requests enable row level security;
alter table public.payments enable row level security;
alter table public.leads enable row level security;

create policy "profil: lire le sien ou admin" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profil: modifier le sien ou admin" on public.profiles for update using (id = auth.uid() or public.is_admin());
create policy "projets: lire" on public.projects for select using (user_id = auth.uid() or public.is_admin());
create policy "projets: créer le sien" on public.projects for insert with check (user_id = auth.uid());
create policy "projets: admin modifie" on public.projects for update using (public.is_admin());
create policy "demandes: lire" on public.requests for select using (user_id = auth.uid() or public.is_admin());
create policy "demandes: créer la sienne" on public.requests for insert with check (user_id = auth.uid());
create policy "demandes: admin modifie" on public.requests for update using (public.is_admin());
create policy "paiements: lire" on public.payments for select using (user_id = auth.uid() or public.is_admin());
create policy "leads: tout le monde peut envoyer" on public.leads for insert to anon, authenticated with check (true);
create policy "leads: admin lit" on public.leads for select using (public.is_admin());

-- Pour devenir administratrice après votre inscription, exécuter (avec votre e-mail) :
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'vous@exemple.fr');
