-- Run these SQL statements in your Supabase SQL Editor to create the required tables.
-- Tables: profiles, web_projects, app_projects, blog_posts, skills

-- 1. Profiles table (single row for portfolio owner)
create table if not exists profiles (
  id             integer primary key default 1,
  name           text not null default 'Ali Hassan',
  profile_pic    text,
  tagline        text,
  bio            text,
  university     text,
  location       text,
  email          text,
  linkedin       text,
  github         text,
  available      boolean default true,
  years_exp      integer default 2,
  projects_count integer default 14
);

-- Seed default profile
insert into profiles (id, name, tagline, bio, university, location, email, linkedin, github)
values (
  1,
  'Ali Hassan',
  'Building modern web & app experiences',
  'Software Engineering student at COMSATS University Islamabad, Vehari Campus. I build high-quality web and Android applications using React, Node.js, Java and modern AI tools.',
  'COMSATS University, Vehari',
  'Vehari, Pakistan',
  'raoali.edu@gmail.com',
  'https://www.linkedin.com/in/ali-hassan-45b9b53b0',
  'https://github.com/Ali-Hassan-edu'
) on conflict (id) do nothing;

-- 2. Web projects table
create table if not exists web_projects (
  id           uuid primary key default gen_random_uuid(),
  type         text not null default 'web',
  title        text not null,
  description  text,
  technologies text,         -- comma-separated string
  live_link    text,
  github_link  text,
  image_url    text,
  category     text,
  year         text,
  color        text default '#4DFFB4',
  created_at   timestamptz default now()
);

-- 3. App projects table
create table if not exists app_projects (
  id           uuid primary key default gen_random_uuid(),
  type         text not null default 'app',
  title        text not null,
  tagline      text,
  description  text,
  technologies text,         -- comma-separated string
  features     text,         -- comma-separated features
  github_link  text,
  screenshots  text[],       -- array of screenshot URLs
  platform     text default 'Android',
  year         text,
  color        text default '#A78BFA',
  created_at   timestamptz default now()
);

-- 4. Blog posts table
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

-- 5. Skills table (optional, for dynamic skills management)
create table if not exists skills (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  category   text,
  color      text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table profiles      enable row level security;
alter table web_projects  enable row level security;
alter table app_projects  enable row level security;
alter table blog_posts    enable row level security;
alter table skills        enable row level security;

-- Allow public read access
create policy "public read profiles"      on profiles      for select using (true);
create policy "public read web_projects"  on web_projects  for select using (true);
create policy "public read app_projects"  on app_projects  for select using (true);
create policy "public read blog"          on blog_posts    for select using (published = true);
create policy "public read skills"        on skills        for select using (true);

-- Allow anon write (for demo – use Supabase Auth in production)
create policy "anon write profiles"      on profiles      for all using (true) with check (true);
create policy "anon write web_projects"  on web_projects  for all using (true) with check (true);
create policy "anon write app_projects"  on app_projects  for all using (true) with check (true);
create policy "anon write blog"          on blog_posts    for all using (true) with check (true);
create policy "anon write skills"        on skills        for all using (true) with check (true);
