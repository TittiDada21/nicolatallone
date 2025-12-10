-- Tabella cachet progetti
create table if not exists public.project_cachet (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  cachet_text text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indice per migliorare le performance delle query per page_key
create index if not exists idx_project_cachet_page_key on public.project_cachet(page_key);

-- RLS per project_cachet
alter table public.project_cachet enable row level security;

create policy "Project cachet viewable by everyone"
  on public.project_cachet for select
  using (true);

create policy "Project cachet insertable by authenticated users"
  on public.project_cachet for insert
  to authenticated
  with check (true);

create policy "Project cachet updatable by authenticated users"
  on public.project_cachet for update
  to authenticated
  using (true)
  with check (true);

create policy "Project cachet deletable by authenticated users"
  on public.project_cachet for delete
  to authenticated
  using (true);

-- Trigger per updated_at (usa la funzione già esistente se presente)
create trigger update_project_cachet_updated_at
  before update on public.project_cachet
  for each row
  execute function update_updated_at_column();
