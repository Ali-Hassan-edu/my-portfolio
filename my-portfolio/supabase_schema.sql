-- Run these SQL statements in your Supabase SQL Editor to create the required tables.

-- 1. Profile table (single row for portfolio owner)
create table if not exists profile (
  id         integer primary key default 1,
  name       text not null default 'Ali Hassan',
  tagline    text,
  bio        text,
  university text,
  location   text,
  email      text,
  linkedin   text,
  github     text,
  available  boolean default true,
  years_exp  integer default 2,
  projects_count integer default 14
);

-- Seed default profile
insert into profile (id, name, tagline, bio, university, location, email, linkedin, github)
values (
  1,
  'Ali Hassan',
  'Building modern web & app experiences',
  'Software Engineering student at COMSATS University Islamabad, Vehari Campus.',
  'COMSATS University, Vehari',
  'Vehari, Pakistan',
  'raoali.edu@gmail.com',
  'https://www.linkedin.com/in/ali-hassan-45b9b53b0',
  'https://github.com/Ali-Hassan-edu'
) on conflict (id) do nothing;

-- 2. Projects table (shared for both web and app)
create table if not exists projects (
  id           uuid primary key default gen_random_uuid(),
  type         text not null check (type in ('web','app')),
  title        text not null,
  tagline      text,
  description  text,
  technologies text,         -- comma-separated string
  features     text,         -- app: comma-separated features
  live_link    text,         -- web only
  github_link  text,
  image_url    text,         -- web: main image
  screenshots  text[],       -- app: array of screenshot URLs
  platform     text,         -- app: 'Android' | 'iOS' | 'Cross-platform'
  category     text,         -- web: category label
  year         text,
  color        text default '#4DFFB4',
  created_at   timestamptz default now()
);

-- 3. Blog posts table
create table if not exists blog_posts (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  description    text,
  content        text,
  category       text,
  tags           text[],          -- array of tag strings
  featured_image text,
  published      boolean default false,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- Enable Row Level Security (allow public read, authenticated write)
alter table profile enable row level security;
alter table projects enable row level security;
alter table blog_posts enable row level security;

-- Allow public read access
create policy "public read profile"   on profile    for select using (true);
create policy "public read projects"  on projects   for select using (true);
create policy "public read blog"      on blog_posts for select using (published = true);

-- Allow anon write (for demo – tighten in production with Supabase Auth)
create policy "anon write profile"    on profile    for all using (true) with check (true);
create policy "anon write projects"   on projects   for all using (true) with check (true);
create policy "anon write blog"       on blog_posts for all using (true) with check (true);
