-- ============================================================
--  청첩장 백엔드 스키마
--  Supabase 대시보드 → SQL Editor 에 통째로 붙여넣고 "Run".
-- ============================================================

-- RSVP 응답은 공개 조회하지 않는다.
-- 중복 확인/수정은 name + phone 정확히 일치할 때만 SECURITY DEFINER RPC로 처리한다.
create table if not exists public.rsvp (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  name             text    not null check (char_length(name) between 1 and 40),
  phone            text    not null check (phone ~ '^0[0-9]{9,10}$'),
  side             text    not null check (side in ('groom','bride')),
  attending        boolean not null,
  meal             boolean not null default false,
  companion_count  int     not null default 0 check (companion_count between 0 and 30),
  constraint rsvp_name_phone_unique unique (name, phone)
);

alter table public.rsvp enable row level security;

drop policy if exists "rsvp anon insert" on public.rsvp;
create policy "rsvp anon insert" on public.rsvp
  for insert to anon with check (true);

-- updated_at 자동 갱신
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists rsvp_set_updated_at on public.rsvp;
create trigger rsvp_set_updated_at
before update on public.rsvp
for each row execute function public.set_updated_at();

-- name + phone 이 정확히 일치할 때만 기존 응답 존재 여부를 알려준다.
create or replace function public.lookup_rsvp(p_name text, p_phone text)
returns table (
  id uuid,
  side text,
  attending boolean,
  meal boolean,
  companion_count int
)
language sql
security definer
set search_path = public
as $$
  select r.id, r.side, r.attending, r.meal, r.companion_count
  from public.rsvp r
  where r.name = btrim(p_name)
    and r.phone = regexp_replace(p_phone, '\\D', '', 'g')
  limit 1;
$$;

-- 사용자가 중복 제출 확인 후 기존 응답을 수정할 때 사용한다.
create or replace function public.update_rsvp_entry(
  p_id uuid,
  p_name text,
  p_phone text,
  p_side text,
  p_attending boolean,
  p_meal boolean,
  p_companion_count int
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.rsvp
  set
    name = btrim(p_name),
    phone = regexp_replace(p_phone, '\\D', '', 'g'),
    side = p_side,
    attending = p_attending,
    meal = p_meal,
    companion_count = p_companion_count
  where id = p_id;
end;
$$;

grant execute on function public.lookup_rsvp(text, text) to anon;
grant execute on function public.update_rsvp_entry(uuid, text, text, text, boolean, boolean, int) to anon;

-- 방명록은 공개 표시. anon 은 INSERT + SELECT 가능. 수정/삭제는 불가.
create table if not exists public.guestbook (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 20),
  message     text not null check (char_length(message) between 1 and 300)
);

alter table public.guestbook enable row level security;

drop policy if exists "guestbook anon insert" on public.guestbook;
create policy "guestbook anon insert" on public.guestbook
  for insert to anon with check (true);

drop policy if exists "guestbook anon select" on public.guestbook;
create policy "guestbook anon select" on public.guestbook
  for select to anon using (true);
