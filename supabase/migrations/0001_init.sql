-- Bhakti Darshan: प्रारंभिक डेटाबेस। Supabase SQL Editor में पूरा चलाएँ।
create extension if not exists pgcrypto;

create table owners (user_id uuid primary key references auth.users(id) on delete cascade);
create or replace function is_owner() returns boolean language sql security definer stable set search_path = public as
$$ select exists (select 1 from owners where user_id = auth.uid()) $$;

create table katha_videos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  title text not null check (char_length(title) <= 200),
  description text, category text not null, duration text,
  youtube_url text, video_url text, thumbnail_url text,
  is_festival_highlight boolean not null default false,
  published boolean not null default false,
  published_at timestamptz, created_at timestamptz not null default now()
);
create index on katha_videos (published, published_at desc);
create index on katha_videos (category);

create table temples (id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, location text, description text, history text, darshan_details text, images text[] default '{}', published boolean not null default false, created_at timestamptz default now());
create table festivals (id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null, date date, significance text, puja_vidhi text, mantra text, aarti text, published boolean not null default false, created_at timestamptz default now());
create table music_tracks (id uuid primary key default gen_random_uuid(), title text not null, category text not null, audio_url text not null, license_note text, published boolean not null default false, created_at timestamptz default now());

create table panchang_cache (city text not null, date date not null, data jsonb not null, source text not null, fetched_at timestamptz not null default now(), primary key (city, date));
create table api_cache (cache_key text primary key, data jsonb not null, expires_at timestamptz not null, fetched_at timestamptz not null default now());

-- निजी दान तालिकाएँ: कोई सार्वजनिक policy नहीं। केवल सर्वर (service role) पहुँच सकता है।
create table donations (
  id uuid primary key default gen_random_uuid(),
  amount_inr integer not null check (amount_inr between 1 and 100000),
  purpose text, donor_name text, donor_contact text,
  show_name_publicly boolean not null default false,
  status text not null default 'pending' check (status in ('pending','success','failed')),
  receipt_ref text unique, created_at timestamptz not null default now()
);
create table payment_transactions (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null references donations(id),
  provider text not null, provider_ref text not null,
  status text not null default 'pending' check (status in ('pending','success','failed')),
  verified_at timestamptz, created_at timestamptz not null default now(),
  unique (provider, provider_ref) -- डुप्लिकेट callback से सुरक्षा
);
create table contact_messages (id uuid primary key default gen_random_uuid(), name text not null, email text, message text not null, created_at timestamptz default now());
create table favorites (user_id uuid not null references auth.users(id) on delete cascade, item_type text not null, item_id text not null, primary key (user_id, item_type, item_id));

alter table owners enable row level security;
alter table katha_videos enable row level security;
alter table temples enable row level security;
alter table festivals enable row level security;
alter table music_tracks enable row level security;
alter table panchang_cache enable row level security;
alter table api_cache enable row level security;
alter table donations enable row level security;
alter table payment_transactions enable row level security;
alter table contact_messages enable row level security;
alter table favorites enable row level security;

create policy "owner reads self" on owners for select using (user_id = auth.uid());
create policy "public reads published" on katha_videos for select using (published or is_owner());
create policy "owner writes" on katha_videos for all using (is_owner()) with check (is_owner());
create policy "public reads published" on temples for select using (published or is_owner());
create policy "owner writes" on temples for all using (is_owner()) with check (is_owner());
create policy "public reads published" on festivals for select using (published or is_owner());
create policy "owner writes" on festivals for all using (is_owner()) with check (is_owner());
create policy "public reads published" on music_tracks for select using (published or is_owner());
create policy "owner writes" on music_tracks for all using (is_owner()) with check (is_owner());
create policy "user manages own favorites" on favorites for all using (user_id = auth.uid()) with check (user_id = auth.uid());
-- panchang_cache, api_cache, donations, payment_transactions, contact_messages: कोई policy नहीं = केवल सर्वर।
