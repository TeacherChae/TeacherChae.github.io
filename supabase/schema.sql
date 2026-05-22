-- ============================================================
--  청첩장 백엔드 스키마
--  Supabase 대시보드 → SQL Editor 에 통째로 붙여넣고 "Run".
-- ============================================================

-- 1) RSVP (참석 여부) -----------------------------------------
--    응답은 비공개. anon(공개 키)은 INSERT 만 가능, 조회는 불가.
--    → 부부는 Supabase 대시보드 Table editor 에서 응답을 확인.
create table if not exists public.rsvp (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  side        text    not null check (side in ('groom','bride')),     -- 신랑측/신부측
  name        text    not null check (char_length(name) between 1 and 40),
  attending   boolean not null,                                        -- 참석(true)/불참(false)
  party_size  int     not null default 1 check (party_size between 0 and 30), -- 본인 포함 총 인원
  meal        text             check (meal in ('yes','no','maybe')),   -- 식사 예정/안함/미정
  companions  text             check (char_length(companions) <= 100), -- 동반자 이름
  message     text             check (char_length(message) <= 500)     -- 전하고 싶은 말
);

alter table public.rsvp enable row level security;

-- anon 은 INSERT 만 허용. SELECT 정책이 없으므로 공개 키로는 읽을 수 없음.
create policy "rsvp anon insert" on public.rsvp
  for insert to anon with check (true);


-- 2) 방명록 (Guestbook) ---------------------------------------
--    공개 표시. anon 은 INSERT + SELECT 가능. 수정/삭제는 불가.
create table if not exists public.guestbook (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 20),
  message     text not null check (char_length(message) between 1 and 300)
);

alter table public.guestbook enable row level security;

create policy "guestbook anon insert" on public.guestbook
  for insert to anon with check (true);

create policy "guestbook anon select" on public.guestbook
  for select to anon using (true);
