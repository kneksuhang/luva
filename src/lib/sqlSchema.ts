export const SUPABASE_SQL_SCHEMA = `-- ==========================================
-- LUVA WISHLIST PRIBADI - SUPABASE SQL SCHEMA
-- Jalankan skrip ini di Supabase SQL Editor
-- URL Project: https://iaaxlsbawfktkugngyxr.supabase.co
-- ==========================================

-- 1. Buat Tabel Kategori (Categories)
create table if not exists public.categories (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  description text,
  color text default '#E87A90',
  icon text default 'ph:sparkle-thin',
  created_at timestamp with time zone default now()
);

-- 2. Buat Tabel Tag (Tags)
create table if not exists public.tags (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  color text default '#75686C',
  created_at timestamp with time zone default now()
);

-- 3. Buat Tabel Produk (Products)
create table if not exists public.products (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  price numeric not null default 0,
  description text,
  image_url text,
  category_id text references public.categories(id) on delete set null,
  tags text[] default '{}',
  links jsonb default '[]'::jsonb,
  is_archived boolean default false,
  priority text default 'medium',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 4. Aktifkan Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.products enable row level security;

-- 5. Kebijakan Akses Penuh untuk Anon Public Key (Personal Wishlist)
create policy "Akses Penuh Publik Kategori" on public.categories
  for all using (true) with check (true);

create policy "Akses Penuh Publik Tag" on public.tags
  for all using (true) with check (true);

create policy "Akses Penuh Publik Produk" on public.products
  for all using (true) with check (true);

-- 6. Indeks untuk Performa Query Cepat
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_archived on public.products(is_archived);
create index if not exists idx_products_created on public.products(created_at desc);

-- Selesai! Schema database Luva siap digunakan.
`;
