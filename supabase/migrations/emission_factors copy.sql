create table public.emission_factors (
  id                 uuid primary key default gen_random_uuid(),
  category           text not null check (category in ('Transport', 'Energy', 'Diet', 'Waste')),
  activity           text not null,            -- e.g. 'Car (average)'
  unit               text not null,            -- e.g. 'km', 'kWh', 'kg'
  kg_co2e_per_unit   numeric(10,4) not null check (kg_co2e_per_unit >= 0),
  source             text not null,            -- dataset name
  source_year        int,
  unique (category, activity, source)
);

alter table public.emission_factors enable row level security;

create policy "Anyone signed in can read factors"
  on public.emission_factors
  for select
  to authenticated
  using (true);