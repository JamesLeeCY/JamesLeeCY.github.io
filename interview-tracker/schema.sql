-- 面試追蹤 Interview Tracker — Supabase schema
-- 在 Supabase 專案的 SQL Editor 貼上整份執行一次即可（可重複執行）。
--
-- 安全模型
--   * 四張資料表全部開啟 RLS，只有登入的擁有者（owner_id = auth.uid()）能讀寫。
--   * 匿名訪客（anon key）對資料表沒有任何權限，只能讀下面幾個 public_* view。
--   * public_* view 只輸出「標記為公開」的列，且只輸出可公開的欄位：
--     聯絡人、面試官、薪資、私人筆記、私人心得永遠不會出現在 view 裡。
--   * view 以擁有者權限執行（security_invoker = false），這是刻意的設計，
--     Supabase Advisor 若提示 "Security Definer View" 可忽略。

create extension if not exists pgcrypto;

-- ---------- 資料表 ----------

create table if not exists public.companies (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name        text not null,
  industry    text,
  website     text,
  notes       text,                       -- 研究筆記（私人）
  created_at  timestamptz not null default now()
);

create table if not exists public.applications (
  id               uuid primary key default gen_random_uuid(),
  owner_id         uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company_id       uuid not null references public.companies(id) on delete cascade,
  role             text not null,
  channel          text,
  status           text not null default '想投'
                   check (status in ('想投','已投','筆試/OA','面試中','Offer','接受','婉拒','未通過','撤回')),
  priority         smallint not null default 2 check (priority between 1 and 3),
  applied_on       date,
  deadline         date,
  contact          text,                  -- 私人
  salary_note      text,                  -- 私人
  notes            text,                  -- 私人
  is_public        boolean not null default false,
  share_anonymous  boolean not null default false,
  public_note      text,                  -- 公開版說明
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table if not exists public.stages (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null default auth.uid() references auth.users(id) on delete cascade,
  application_id  uuid not null references public.applications(id) on delete cascade,
  seq             int not null default 1,
  name            text not null,
  kind            text,                   -- Behavioral / Case / Coding / Technical / HR / 筆試/OA / 其他
  format          text,                   -- 線上 / 現場 / 電話
  scheduled_at    timestamptz,
  is_expected     boolean not null default false,  -- 預期關卡、尚未排定
  result          text not null default '待定'
                  check (result in ('待定','通過','未通過','取消')),
  interviewer     text,                   -- 私人
  reflection      text,                   -- 私人心得
  self_rating     smallint check (self_rating between 1 and 5),
  improve         text,                   -- 可改進處（私人）
  is_public       boolean not null default true,   -- 應徵公開時，這一關是否顯示
  public_note     text,                   -- 公開版心得（題型、準備方式，不寫原題）
  created_at      timestamptz not null default now()
);

create table if not exists public.prep_logs (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null default auth.uid() references auth.users(id) on delete cascade,
  kind            text not null check (kind in ('Case','LeetCode','Behavioral','產業研究')),
  done_on         date not null default current_date,
  minutes         int check (minutes >= 0),
  topic           text,                   -- case 類型或 LeetCode 主題
  ref             text,                   -- 題號／題目名稱／練習夥伴
  difficulty      text,                   -- Easy / Medium / Hard
  rating          smallint check (rating between 1 and 5),
  weak_tags       text[] not null default '{}',
  review_on       date,
  application_id  uuid references public.applications(id) on delete set null,
  notes           text,                   -- 私人
  is_public       boolean not null default false,
  public_note     text,
  created_at      timestamptz not null default now()
);

create index if not exists applications_owner_idx on public.applications(owner_id);
create index if not exists stages_app_idx on public.stages(application_id);
create index if not exists stages_sched_idx on public.stages(scheduled_at);
create index if not exists prep_done_idx on public.prep_logs(done_on);

create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists applications_touch on public.applications;
create trigger applications_touch before update on public.applications
  for each row execute function public.touch_updated_at();

-- ---------- RLS：只有擁有者能讀寫 ----------

alter table public.companies    enable row level security;
alter table public.applications enable row level security;
alter table public.stages       enable row level security;
alter table public.prep_logs    enable row level security;

drop policy if exists owner_all on public.companies;
create policy owner_all on public.companies for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
drop policy if exists owner_all on public.applications;
create policy owner_all on public.applications for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
drop policy if exists owner_all on public.stages;
create policy owner_all on public.stages for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
drop policy if exists owner_all on public.prep_logs;
create policy owner_all on public.prep_logs for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

revoke all on public.companies, public.applications, public.stages, public.prep_logs from anon;

-- ---------- 公開 view：分享頁只讀這些 ----------

create or replace view public.public_applications with (security_invoker = false) as
select a.id,
       case when a.share_anonymous then null else c.name end as company,
       c.industry,
       a.role,
       a.status,
       a.applied_on,
       a.public_note,
       a.updated_at
from public.applications a
join public.companies c on c.id = a.company_id
where a.is_public;

create or replace view public.public_stages with (security_invoker = false) as
select s.id,
       s.application_id,
       s.seq,
       s.name,
       s.kind,
       s.format,
       (s.scheduled_at at time zone 'Asia/Taipei')::date as on_date,
       s.is_expected,
       s.result,
       s.public_note
from public.stages s
join public.applications a on a.id = s.application_id
where a.is_public and s.is_public;

-- 所有準備紀錄的彙總（不含任何文字內容），讓分享頁能顯示準備量
create or replace view public.public_prep_stats with (security_invoker = false) as
select kind,
       coalesce(nullif(topic, ''), '未分類') as topic,
       coalesce(nullif(difficulty, ''), '—') as difficulty,
       count(*)::int as sessions,
       coalesce(sum(minutes), 0)::int as minutes
from public.prep_logs
group by 1, 2, 3;

create or replace view public.public_prep_weekly with (security_invoker = false) as
select date_trunc('week', done_on)::date as week,
       kind,
       count(*)::int as sessions,
       coalesce(sum(minutes), 0)::int as minutes
from public.prep_logs
group by 1, 2;

-- 個別標記為公開的準備紀錄（只含公開欄位）
create or replace view public.public_prep with (security_invoker = false) as
select id, kind, done_on, minutes, topic, difficulty, rating, public_note
from public.prep_logs
where is_public;

grant select on public.public_applications, public.public_stages,
                public.public_prep_stats, public.public_prep_weekly, public.public_prep
  to anon, authenticated;
