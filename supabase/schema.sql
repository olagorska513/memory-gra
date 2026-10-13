-- =====================================================================
-- Memoriada – baza danych w Supabase
--
-- Zakres:
--   1. Zapisywanie wyników rozegranych gier (historia + rekord na poziom).
--   2. Wznawianie przerwanej gry (np. po odświeżeniu strony / zamknięciu karty).
--
-- Gracz nie zakłada konta (13.1): gra loguje go po cichu przez
-- Supabase Anonymous Sign-in. Każda przeglądarka = osobny anonimowy gracz,
-- a RLS pilnuje, żeby gracz widział i zmieniał tylko swoje gry.
--
-- Jak uruchomić:
--   1. Dashboard → Authentication → Sign In / Providers →
--      włącz „Allow anonymous sign-ins”.
--   2. Dashboard → SQL Editor → wklej cały ten plik → Run.
--      Skrypt można uruchomić ponownie (nie dubluje obiektów).
-- =====================================================================


-- ===== Tabela gier =====
-- Jeden wiersz = jedna rozgrywka. Ten sam wiersz służy do wznowienia
-- (status 'in_progress') i jako wynik (status 'finished').

create table if not exists public.games (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid()
                   references auth.users (id) on delete cascade,

  level          text not null check (level in ('easy', 'medium', 'hard')),
  theme          text not null check (theme in ('animals', 'fruits', 'vehicles')),
  total_pairs    smallint not null,

  -- Układ kart na planszy, w kolejności pól (indeks w tablicy = pozycja):
  -- [{"pairId": 0, "emoji": "🐶", "name": "pies"}, ...]
  deck           jsonb not null,
  -- pairId par już znalezionych – te karty przy wznowieniu są pustymi polami
  matched_pairs  smallint[] not null default '{}',

  moves          integer not null default 0 check (moves >= 0),
  elapsed_ms     integer not null default 0 check (elapsed_ms >= 0),

  status         text not null default 'in_progress'
                   check (status in ('in_progress', 'finished', 'abandoned')),

  -- Ocena 1–3 gwiazdki (7.3), liczona przez bazę – te same progi co starsFor() w game.js
  stars          smallint generated always as (
                   case when status = 'finished' then
                     case
                       when moves <= round(total_pairs * 1.75) then 3
                       when moves <= round(total_pairs * 2.5)  then 2
                       else 1
                     end
                   end
                 ) stored,

  started_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  ended_at       timestamptz,

  -- poziom wyznacza liczbę par (4×4, 4×6, 6×6)
  constraint games_level_pairs check (
    (level, total_pairs) in (('easy', 8), ('medium', 12), ('hard', 18))
  ),
  constraint games_deck_size check (
    jsonb_typeof(deck) = 'array' and jsonb_array_length(deck) = total_pairs * 2
  ),
  constraint games_pairs_range check (
    cardinality(matched_pairs) <= total_pairs
  ),
  -- gra zakończona = wszystkie pary znalezione
  constraint games_finished_complete check (
    status <> 'finished' or cardinality(matched_pairs) = total_pairs
  )
);

comment on table public.games is
  'Rozgrywki Memoriady: gra w toku (do wznowienia), zakończona (wynik) lub porzucona.';

-- Gracz ma najwyżej jedną niedokończoną grę – to ją proponujemy do wznowienia.
create unique index if not exists games_one_in_progress
  on public.games (user_id)
  where status = 'in_progress';

-- Szybkie wyszukiwanie rekordu na poziom.
create index if not exists games_finished_best
  on public.games (user_id, level, moves, elapsed_ms)
  where status = 'finished';


-- ===== Trigger: updated_at i ended_at =====

create or replace function public.games_touch()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status <> 'in_progress' then
    raise exception 'Gra % jest już zamknięta (%).', old.id, old.status;
  end if;

  new.updated_at := now();
  if new.status <> 'in_progress' then
    new.ended_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists games_touch on public.games;
create trigger games_touch
  before update on public.games
  for each row execute function public.games_touch();


-- ===== Uprawnienia i RLS =====
-- Anonimowo zalogowany gracz ma rolę 'authenticated'.
-- Po utworzeniu gry można zmieniać tylko postęp – nie układ kart ani poziom.

alter table public.games enable row level security;

revoke all on public.games from anon, authenticated;
grant select, delete on public.games to authenticated;
grant insert (level, theme, total_pairs, deck) on public.games to authenticated;
grant update (matched_pairs, moves, elapsed_ms, status) on public.games to authenticated;

drop policy if exists games_select_own on public.games;
create policy games_select_own on public.games
  for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists games_insert_own on public.games;
create policy games_insert_own on public.games
  for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'in_progress');

-- zmieniać można tylko grę w toku; wynik zakończonej gry jest już niezmienny
drop policy if exists games_update_own on public.games;
create policy games_update_own on public.games
  for update to authenticated
  using (user_id = (select auth.uid()) and status = 'in_progress')
  with check (user_id = (select auth.uid()));

-- „Wyczyść rekordy” (7.6) usuwa zakończone gry gracza
drop policy if exists games_delete_own on public.games;
create policy games_delete_own on public.games
  for delete to authenticated
  using (user_id = (select auth.uid()));


-- ===== Rekordy: najlepszy wynik na każdy poziom (7.4) =====
-- Lepszy = mniej ruchów, przy remisie krótszy czas (jak isBetter() w game.js).
-- security_invoker → widok respektuje RLS, więc gracz widzi tylko swoje rekordy.

create or replace view public.best_results
with (security_invoker = true) as
select distinct on (user_id, level)
  user_id,
  level,
  moves,
  elapsed_ms,
  stars,
  ended_at,
  id as game_id
from public.games
where status = 'finished'
order by user_id, level, moves, elapsed_ms, ended_at;

revoke all on public.best_results from anon, authenticated;
grant select on public.best_results to authenticated;


-- ===== Start nowej gry =====
-- Atomowo porzuca poprzednią niedokończoną grę i zakłada nową.
-- Wywołanie z gry: POST /rest/v1/rpc/start_game
--   { "p_level": "easy", "p_theme": "animals", "p_deck": [...] }

create or replace function public.start_game(p_level text, p_theme text, p_deck jsonb)
returns public.games
language plpgsql
security invoker
set search_path = ''
as $$
declare
  result public.games;
begin
  update public.games
     set status = 'abandoned'
   where user_id = auth.uid()
     and status = 'in_progress';

  insert into public.games (level, theme, total_pairs, deck)
  values (
    p_level,
    p_theme,
    case p_level when 'easy' then 8 when 'medium' then 12 when 'hard' then 18 end,
    p_deck
  )
  returning * into result;

  return result;
end;
$$;

revoke all on function public.start_game(text, text, jsonb) from public, anon;
grant execute on function public.start_game(text, text, jsonb) to authenticated;
