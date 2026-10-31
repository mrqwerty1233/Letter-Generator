-- ============================================================================
-- Maison d'Amour — Supabase Database & Storage Setup Script
-- Copy and paste this entire script into your Supabase SQL Editor and click "Run"
-- ============================================================================

-- 1. Create the `letters` table to store generated gift websites & photo albums
create table if not exists public.letters (
  id text primary key,
  recipient_name text not null,
  sender_name text not null,
  occasion_date text not null,
  letter_data jsonb not null,
  created_at timestamptz not null default now()
);

-- 2. Enable Row Level Security (RLS) on `public.letters`
alter table public.letters enable row level security;

-- Allow anyone with the secret short link ID to view the letter
drop policy if exists "Allow public read of letters by id" on public.letters;
create policy "Allow public read of letters by id"
  on public.letters
  for select
  to anon, authenticated
  using (true);

-- Allow creating/saving new letters from the generator
drop policy if exists "Allow public insert of letters" on public.letters;
create policy "Allow public insert of letters"
  on public.letters
  for insert
  to anon, authenticated
  with check (true);

-- Allow updating existing letters by id
drop policy if exists "Allow public update of letters" on public.letters;
create policy "Allow public update of letters"
  on public.letters
  for update
  to anon, authenticated
  using (true);

-- 3. Create the `album-photos` public storage bucket for uploaded photos
insert into storage.buckets (id, name, public)
values ('album-photos', 'album-photos', true)
on conflict (id) do update set public = true;

-- Allow public viewing of uploaded album photos
drop policy if exists "Public read access for album-photos" on storage.objects;
create policy "Public read access for album-photos"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'album-photos');

-- Allow uploading photos from the generator to `album-photos`
drop policy if exists "Public upload access for album-photos" on storage.objects;
create policy "Public upload access for album-photos"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'album-photos');
