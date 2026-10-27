create table public.habit_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade default auth.uid(),
  category    text not null check (category in ('Transport', 'Energy', 'Diet', 'Waste')),
  description text not null check (char_length(description) > 0),
  co2_kg      numeric(8,2) not null check (co2_kg > 0),
  log_date    date not null default current_date,
  created_at  timestamptz not null default now()
);

create index habit_logs_user_date_idx on public.habit_logs (user_id, log_date desc);

alter table public.habit_logs enable row level security;

create policy "Users manage their own logs"
  on public.habit_logs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.habit_logs
  add column factor_id uuid references public.emission_factors (id),
  add column quantity  numeric(10,2) check (quantity > 0);