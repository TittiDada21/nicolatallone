-- Create a new storage bucket for event images
insert into storage.buckets (id, name, public)
values ('events-images', 'events-images', true)
on conflict (id) do nothing;

-- Enable RLS
alter table storage.objects enable row level security;

-- Policy: Public can view images
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'events-images' );

-- Policy: Authenticated users can upload images
create policy "Authenticated Export"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'events-images' );

-- Policy: Authenticated users can update images
create policy "Authenticated Update"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'events-images' );

-- Policy: Authenticated users can delete images
create policy "Authenticated Delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'events-images' );
