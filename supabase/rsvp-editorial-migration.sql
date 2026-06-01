-- Existing Supabase projects that already ran the earlier schema can run this once.
-- Review existing RSVP rows first. Old RSVP rows did not collect phone numbers,
-- so this migration assigns a temporary legacy phone per row that you should
-- replace from your own records if those rows matter.

alter table public.rsvp add column if not exists updated_at timestamptz not null default now();
alter table public.rsvp add column if not exists phone text;
alter table public.rsvp add column if not exists companion_count int;

-- Preserve old party_size values where possible.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'rsvp' and column_name = 'party_size'
  ) then
    update public.rsvp set companion_count = coalesce(companion_count, party_size, 0);
  end if;
end $$;

-- Old schema stored meal as text ('yes'/'no'/'maybe'). New UI stores boolean.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'rsvp' and column_name = 'meal'
      and data_type <> 'boolean'
  ) then
    alter table public.rsvp add column if not exists meal_new boolean;
    update public.rsvp set meal_new = coalesce(meal_new, meal = 'yes');
    alter table public.rsvp drop column meal;
    alter table public.rsvp rename column meal_new to meal;
  elsif not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'rsvp' and column_name = 'meal'
  ) then
    alter table public.rsvp add column meal boolean;
  end if;
end $$;

-- Temporary phone values for legacy rows without phone. New submissions use real phones.
update public.rsvp
set phone = '010' || right(replace(id::text, '-', ''), 8)
where phone is null or phone = '';

alter table public.rsvp alter column phone set not null;
alter table public.rsvp alter column companion_count set not null;
alter table public.rsvp alter column companion_count set default 0;
alter table public.rsvp alter column meal set not null;
alter table public.rsvp alter column meal set default false;

alter table public.rsvp drop constraint if exists rsvp_name_phone_unique;
drop index if exists public.rsvp_name_phone_unique_idx;
alter table public.rsvp add constraint rsvp_name_phone_unique unique (name, phone);

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
