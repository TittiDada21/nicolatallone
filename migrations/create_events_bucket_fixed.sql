-- Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('events-images', 'events-images', true)
on conflict (id) do nothing;

-- Remove the line that alters RLS on the system table, as it often causes permission errors
-- alter table storage.objects enable row level security; <--- REMOVED

-- Drop existing policies if they exist (to allow re-running without errors)
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Export" on storage.objects;
drop policy if exists "Authenticated Update" on storage.objects;
drop policy if exists "Authenticated Delete" on storage.objects;

-- Re-create Policies
-- 1. Public Read Access
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'events-images' );

-- 2. Authenticated Upload (Insert)
create policy "Authenticated Export"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'events-images' );

-- 3. Authenticated Update
create policy "Authenticated Update"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'events-images' );

-- 4. Authenticated Delete
create policy "Authenticated Delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'events-images' );
