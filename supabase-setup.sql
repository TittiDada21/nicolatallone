-- Tabella eventi
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  address text,
  is_free boolean not null default true,
  price numeric,
  external_url text,
  location_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabella galleria
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text check (type in ('image','video')) not null,
  url text not null,
  thumbnail_url text,
  created_at timestamptz default now()
);

-- RLS per events: lettura pubblica, scrittura solo per autenticati
alter table public.events enable row level security;

create policy "Events are viewable by everyone"
  on public.events for select
  using (true);

create policy "Events are insertable by authenticated users"
  on public.events for insert
  to authenticated
  with check (true);

create policy "Events are updatable by authenticated users"
  on public.events for update
  to authenticated
  using (true)
  with check (true);

create policy "Events are deletable by authenticated users"
  on public.events for delete
  to authenticated
  using (true);

-- RLS per gallery_items: stessa logica
alter table public.gallery_items enable row level security;

create policy "Gallery items are viewable by everyone"
  on public.gallery_items for select
  using (true);

create policy "Gallery items are insertable by authenticated users"
  on public.gallery_items for insert
  to authenticated
  with check (true);

create policy "Gallery items are updatable by authenticated users"
  on public.gallery_items for update
  to authenticated
  using (true)
  with check (true);

create policy "Gallery items are deletable by authenticated users"
  on public.gallery_items for delete
  to authenticated
  using (true);

-- Trigger per updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_events_updated_at
  before update on public.events
  for each row
  execute function update_updated_at_column();

-- Tabella repertorio progetti
create table if not exists public.project_repertoire (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  composer_first_name text not null,
  composer_last_name text not null,
  composer_birth_year integer,
  composer_death_year integer,
  piece_title text not null,
  composition_year integer,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.project_repertoire enable row level security;

create policy "Project repertoire viewable by everyone"
  on public.project_repertoire for select
  using (true);

create policy "Project repertoire insertable by authenticated users"
  on public.project_repertoire for insert
  to authenticated
  with check (true);

create policy "Project repertoire updatable by authenticated users"
  on public.project_repertoire for update
  to authenticated
  using (true)
  with check (true);

create policy "Project repertoire deletable by authenticated users"
  on public.project_repertoire for delete
  to authenticated
  using (true);

create trigger update_project_repertoire_updated_at
  before update on public.project_repertoire
  for each row
  execute function update_updated_at_column();
