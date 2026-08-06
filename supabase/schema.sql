-- =============================================================================
-- Lumina Studio — Supabase schema
-- =============================================================================
-- Design notes:
-- * Media files are NEVER stored in Postgres. `photos.url` / `projects.cover_url`
--   hold Cloudinary secure URLs, `public_id` holds the Cloudinary asset id so it
--   can be replaced/deleted through the Cloudinary API from the admin panel.
-- * The admin area uses a single hardcoded account (see src/lib/auth.ts) rather
--   than Supabase Auth, so no `auth.users` dependency is required. Row Level
--   Security still fully locks down writes: all mutations happen through
--   Server Actions using the `service_role` key on the server, never from the
--   browser.
-- * `contact_submissions` is a light CRM inbox. The public contact form writes
--   here via a Server Action AND optionally forwards to Google Sheets / email
--   (see src/actions/contact.ts) — both are free-tier services so the whole
--   stack has $0 fixed monthly cost at low/medium traffic.
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
-- Wrapped in a DO block so the whole schema file can be safely re-run against
-- an already-provisioned database (plain `create type` has no `if not exists`
-- support in Postgres and errors with 42710 on a second run).
do $$ begin
  create type project_category as enum (
    'weddings',
    'cumatrii',
    'baptisms',
    'love-stories',
    'events'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category project_category not null,

  -- Multilingual fields: `title`/`description` hold the Russian (default)
  -- copy, the `_ro` / `_en` columns are optional overrides for the other
  -- locales. When null, the UI falls back to the Russian value.
  title text not null,
  title_ro text,
  title_en text,
  description text,
  description_ro text,
  description_en text,

  event_date date,
  cover_url text,
  cover_public_id text,
  youtube_url text,

  is_published boolean not null default false,
  is_featured boolean not null default false,
  position integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_category_idx on public.projects (category);
create index if not exists projects_published_idx on public.projects (is_published);
create index if not exists projects_featured_idx on public.projects (is_featured);

-- ---------------------------------------------------------------------------
-- photos — gallery images that belong to a project
-- ---------------------------------------------------------------------------
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  url text not null,
  public_id text not null,
  alt text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists photos_project_id_idx on public.photos (project_id);

-- ---------------------------------------------------------------------------
-- settings — single-row table for site-wide content editable from /admin
-- ---------------------------------------------------------------------------
create table if not exists public.settings (
  id integer primary key default 1,
  phone text not null default '+373 60 000 000',
  email text not null default 'hello@exclusivefotostudio.md',
  address text not null default 'Chișinău, Moldova',
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  whatsapp_url text,
  hero_video_url text,
  -- homepage hero: editable from /admin/homepage, no code changes required
  hero_image_url text,
  hero_image_public_id text,
  hero_title text,
  hero_subtitle text,
  hero_cta_text text,
  hero_cta_href text,
  -- homepage section visibility toggles
  show_services boolean not null default true,
  show_instant_printing boolean not null default true,
  show_winter_locations boolean not null default true,
  show_featured_projects boolean not null default true,
  -- display price per service, keyed by service item key (e.g. "weddingPhoto")
  service_prices jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);

insert into public.settings (id) values (1)
on conflict (id) do nothing;

-- migration for already-deployed databases: add new columns if they don't exist yet
alter table public.settings add column if not exists hero_image_url text;
alter table public.settings add column if not exists hero_image_public_id text;
alter table public.settings add column if not exists hero_title text;
alter table public.settings add column if not exists hero_subtitle text;
alter table public.settings add column if not exists hero_cta_text text;
alter table public.settings add column if not exists hero_cta_href text;
alter table public.settings add column if not exists show_services boolean not null default true;
alter table public.settings add column if not exists show_instant_printing boolean not null default true;
alter table public.settings add column if not exists show_winter_locations boolean not null default true;
alter table public.settings add column if not exists show_featured_projects boolean not null default true;
alter table public.settings add column if not exists service_prices jsonb not null default '{}'::jsonb;
-- show_reviews is no longer used (Reviews section removed) — column left in place, harmless if it already exists.

-- ---------------------------------------------------------------------------
-- contact_submissions — inbox for the public contact form
-- ---------------------------------------------------------------------------
do $$ begin
  create type event_type as enum (
    'wedding',
    'cumatrie',
    'baptism',
    'love-story',
    'event'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text not null,
  event_type event_type,
  event_date date,
  message text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

-- ---------------------------------------------------------------------------
-- winter_location_photos — "photo zones" gallery shown in the homepage
-- "Зимний сезон" section. Each photo can be toggled on/off independently
-- without affecting the section's own show/hide switch (settings.show_winter_locations).
-- ---------------------------------------------------------------------------
create table if not exists public.winter_location_photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  public_id text not null,
  is_active boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists winter_location_photos_active_idx
  on public.winter_location_photos (is_active);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists set_settings_updated_at on public.settings;
create trigger set_settings_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- The public (anon) key is only ever used for READ access to published
-- content. All writes (create/update/delete project, photos, settings,
-- marking submissions as read) go through Server Actions running with the
-- `service_role` key, which bypasses RLS by design and never reaches the
-- client bundle.
alter table public.projects enable row level security;
alter table public.photos enable row level security;
alter table public.settings enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.winter_location_photos enable row level security;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
  on public.projects for select
  using (is_published = true);

drop policy if exists "Public can read photos of published projects" on public.photos;
create policy "Public can read photos of published projects"
  on public.photos for select
  using (
    exists (
      select 1 from public.projects p
      where p.id = photos.project_id and p.is_published = true
    )
  );

drop policy if exists "Public can read settings" on public.settings;
create policy "Public can read settings"
  on public.settings for select
  using (true);

drop policy if exists "Public can read active winter location photos" on public.winter_location_photos;
create policy "Public can read active winter location photos"
  on public.winter_location_photos for select
  using (is_active = true);

-- No public policy on contact_submissions: it is insert-only via the
-- service_role key inside the `submitContactForm` Server Action, and only
-- readable from the admin panel (also via service_role).
