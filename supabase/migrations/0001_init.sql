-- 한국어 능력 테스트 풀이 로그
-- 한 Supabase 프로젝트에 여러 서비스를 스키마로 나눠 담으므로 이 서비스는 korean_test 스키마만 쓴다.
-- 쓰기는 Next.js 서버(service_role)만 한다. anon/authenticated 에게는 스키마 권한 자체를 주지 않는다.

create schema if not exists korean_test;

create table korean_test.quiz_sessions (
  id               uuid primary key,
  anon_id          uuid,                          -- 브라우저 단위 익명 ID(localStorage). 재응시 묶기용, 저장 불가 환경이면 null
  set_id           text not null,                 -- 출제 세트 (v1 = 보고서 10장 20문항)
  bank_hash        text not null,                 -- 문제은행 버전. 문항이 바뀌면 값이 달라진다
  age_group        text not null check (age_group in ('10s','20s','30s','40s','50s','60plus','undisclosed')),
  started_at       timestamptz not null default now(),
  finished_at      timestamptz,
  total_score      smallint,
  domain_scores    jsonb,                         -- {"어휘력":6,"표기":5,"문해력":3,"띄어쓰기":1}
  result_type      text,
  user_agent_hash  text                           -- 중복·봇 추정용 해시. 원문은 저장하지 않음
);

create table korean_test.quiz_answers (
  session_id   uuid not null references korean_test.quiz_sessions(id) on delete cascade,
  question_id  text not null,
  position     smallint not null,                 -- 세트 안 순서(0~19)
  chosen       char(1) not null check (chosen in ('A','B','C','D')),
  is_correct   boolean not null,                  -- 서버가 문제은행 정답으로 채점
  elapsed_ms   integer,                           -- 문항 표시 → 선택까지 걸린 시간
  answered_at  timestamptz not null default now(),
  primary key (session_id, question_id)
);

create table korean_test.quiz_shares (
  id          bigint generated always as identity primary key,
  session_id  uuid not null references korean_test.quiz_sessions(id) on delete cascade,
  channel     text not null,                      -- native / copy / x / image
  shared_at   timestamptz not null default now()
);

create index quiz_answers_question_idx on korean_test.quiz_answers (question_id);
create index quiz_sessions_set_age_idx on korean_test.quiz_sessions (set_id, age_group);
create index quiz_sessions_anon_idx on korean_test.quiz_sessions (anon_id, started_at);

alter table korean_test.quiz_sessions enable row level security;
alter table korean_test.quiz_answers  enable row level security;
alter table korean_test.quiz_shares   enable row level security;
-- 정책을 만들지 않으므로 anon/authenticated 는 읽기·쓰기 모두 불가. service_role 은 RLS 를 우회한다.

-- 세션별 시도 순번. 같은 anon_id 안에서 시작 순서대로 1, 2, 3 …
-- (anon_id가 없는 세션은 각자 1번째 시도로 본다)
-- 세트별로 따로 센다: 세트가 바뀌면 다시 1번째 시도.
create view korean_test.quiz_sessions_ranked
with (security_invoker = true) as
select
  s.*,
  row_number() over (
    partition by s.set_id, coalesce(s.anon_id, s.id)
    order by s.started_at, s.id
  ) as attempt_no
from korean_test.quiz_sessions s;

-- 문항 × 연령대 정답률 (나중에 '내 또래 정답률' 비교에 사용)
-- 재응시는 해설을 본 뒤라 정답률이 부풀므로 기본 집계는 is_first_attempt = true 로 거른다.
create view korean_test.question_accuracy_by_age
with (security_invoker = true) as
select
  s.set_id,
  s.bank_hash,
  a.question_id,
  s.age_group,
  (s.attempt_no = 1)                                 as is_first_attempt,
  count(*)                                           as answers,
  round(avg(a.is_correct::int) * 100, 1)             as accuracy_pct,
  count(*) filter (where a.chosen = 'A')             as chose_a,
  count(*) filter (where a.chosen = 'B')             as chose_b,
  count(*) filter (where a.chosen = 'C')             as chose_c,
  count(*) filter (where a.chosen = 'D')             as chose_d
from korean_test.quiz_answers a
join korean_test.quiz_sessions_ranked s on s.id = a.session_id
group by s.set_id, s.bank_hash, a.question_id, s.age_group, (s.attempt_no = 1);

-- 결과 유형 분포 (연령대별, 첫 시도/재시도 구분)
create view korean_test.result_type_by_age
with (security_invoker = true) as
select set_id, age_group, (attempt_no = 1) as is_first_attempt, result_type, count(*) as sessions
from korean_test.quiz_sessions_ranked
where finished_at is not null
group by set_id, age_group, (attempt_no = 1), result_type;

-- 재응시 점수 변화: 같은 브라우저의 첫 시도 대비 이후 시도
create view korean_test.retake_score_change
with (security_invoker = true) as
select
  set_id,
  attempt_no,
  count(*)                                   as sessions,
  round(avg(total_score), 2)                 as avg_total_score
from korean_test.quiz_sessions_ranked
where finished_at is not null and anon_id is not null
group by set_id, attempt_no;

-- 권한: service_role 만. (Data API로 접근하려면 대시보드 API 설정의 Exposed schemas에 korean_test 추가 필요)
revoke all on schema korean_test from public, anon, authenticated;
grant usage on schema korean_test to service_role;
grant select, insert, update, delete on all tables in schema korean_test to service_role;
grant usage, select on all sequences in schema korean_test to service_role;
