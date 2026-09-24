-- =============================================================================
-- Exclusive Foto Studio — Supabase schema
-- =============================================================================
-- Design notes:
-- * Media files are NEVER stored in Postgres. `photos.url` holds the R2
--   public URL, `public_id` holds the R2 object key so it can be deleted
--   through the R2 API from the admin panel.
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
-- event_types — admin-manageable list of event categories (e.g. "Nunți",
-- "Zi de naștere"), each with an optional description and price. Replaces
-- the old fixed `project_category` / `event_type` enums so the studio owner
-- can add, rename or remove event types from the admin panel without a
-- code change.
-- ---------------------------------------------------------------------------
create table if not exists public.event_types (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  price text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- `name`/`description` are the Russian (default) values; these optional
  -- columns hold Romanian/English overrides. Public pages fall back to the
  -- Russian value whenever a translation hasn't been filled in yet.
  name_ro text,
  name_en text,
  description_ro text,
  description_en text
);

-- migration for already-deployed databases
alter table public.event_types add column if not exists name_ro text;
alter table public.event_types add column if not exists name_en text;
alter table public.event_types add column if not exists description_ro text;
alter table public.event_types add column if not exists description_en text;

-- ---------------------------------------------------------------------------
-- photos — gallery media (photos and videos) that belong directly to a
-- category (event type). There is no intermediate "project" grouping: every
-- upload attaches straight to a category and can be shown/hidden with
-- `is_published` without deleting it.
-- ---------------------------------------------------------------------------
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  event_type_id uuid references public.event_types (id) on delete cascade,
  url text not null,
  public_id text not null,
  media_type text not null default 'photo',
  alt text,
  is_published boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- migration for already-deployed databases: photos used to belong to a
-- `projects` row instead of directly to a category. Backfill event_type_id
-- from the old project's category before dropping the projects table so
-- existing uploads are not lost.
alter table public.photos add column if not exists event_type_id uuid references public.event_types (id) on delete cascade;
alter table public.photos add column if not exists is_published boolean not null default true;

do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'projects')
     and exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'photos' and column_name = 'project_id') then
    update public.photos ph
    set event_type_id = pr.event_type_id
    from public.projects pr
    where ph.project_id = pr.id and ph.event_type_id is null;
  end if;
end $$;

-- old RLS policy referenced project_id directly, so it must be dropped
-- before the column itself can be dropped.
drop policy if exists "Public can read photos of published projects" on public.photos;
alter table public.photos drop column if exists project_id;
drop table if exists public.projects cascade;

create index if not exists photos_event_type_id_idx on public.photos (event_type_id);
create index if not exists photos_published_idx on public.photos (is_published);

alter table public.photos drop constraint if exists photos_media_type_check;
alter table public.photos add constraint photos_media_type_check check (media_type in ('photo', 'video'));

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
  -- russian is the default (hero_title/hero_subtitle/hero_cta_text); these are optional overrides
  hero_title_ro text,
  hero_title_en text,
  hero_subtitle_ro text,
  hero_subtitle_en text,
  hero_cta_text_ro text,
  hero_cta_text_en text,
  -- instant printing section: optional photo replacing the default printer icon graphic
  instant_printing_image_url text,
  instant_printing_image_public_id text,
  -- about, instant printing text, winter locations, featured projects, contact cta,
  -- footer and contact page copy: all editable from /admin, russian is the default,
  -- _ro/_en are optional overrides, falling back to messages/*.json translations when null
  about_eyebrow text,
  about_eyebrow_ro text,
  about_eyebrow_en text,
  about_title text,
  about_title_ro text,
  about_title_en text,
  about_description text,
  about_description_ro text,
  about_description_en text,
  about_stat_values text[],
  about_stat_values_ro text[],
  about_stat_values_en text[],
  about_stat_labels text[],
  about_stat_labels_ro text[],
  about_stat_labels_en text[],
  about_cta text,
  about_cta_ro text,
  about_cta_en text,
  instant_printing_badge text,
  instant_printing_badge_ro text,
  instant_printing_badge_en text,
  instant_printing_eyebrow text,
  instant_printing_eyebrow_ro text,
  instant_printing_eyebrow_en text,
  instant_printing_title text,
  instant_printing_title_ro text,
  instant_printing_title_en text,
  instant_printing_description text,
  instant_printing_description_ro text,
  instant_printing_description_en text,
  instant_printing_points text[],
  instant_printing_points_ro text[],
  instant_printing_points_en text[],
  instant_printing_cta text,
  instant_printing_cta_ro text,
  instant_printing_cta_en text,
  winter_eyebrow text,
  winter_eyebrow_ro text,
  winter_eyebrow_en text,
  winter_title text,
  winter_title_ro text,
  winter_title_en text,
  winter_description text,
  winter_description_ro text,
  winter_description_en text,
  winter_cta text,
  winter_cta_ro text,
  winter_cta_en text,
  featured_eyebrow text,
  featured_eyebrow_ro text,
  featured_eyebrow_en text,
  featured_title text,
  featured_title_ro text,
  featured_title_en text,
  featured_subtitle text,
  featured_subtitle_ro text,
  featured_subtitle_en text,
  featured_view_all text,
  featured_view_all_ro text,
  featured_view_all_en text,
  contact_cta_eyebrow text,
  contact_cta_eyebrow_ro text,
  contact_cta_eyebrow_en text,
  contact_cta_title text,
  contact_cta_title_ro text,
  contact_cta_title_en text,
  contact_cta_subtitle text,
  contact_cta_subtitle_ro text,
  contact_cta_subtitle_en text,
  contact_cta_button text,
  contact_cta_button_ro text,
  contact_cta_button_en text,
  footer_tagline text,
  footer_tagline_ro text,
  footer_tagline_en text,
  contact_page_eyebrow text,
  contact_page_eyebrow_ro text,
  contact_page_eyebrow_en text,
  contact_page_title text,
  contact_page_title_ro text,
  contact_page_title_en text,
  contact_page_subtitle text,
  contact_page_subtitle_ro text,
  contact_page_subtitle_en text,
  -- homepage section visibility toggles
  show_services boolean not null default true,
  show_instant_printing boolean not null default true,
  show_winter_locations boolean not null default true,
  show_featured_projects boolean not null default true,
  show_pricing boolean not null default true,
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
alter table public.settings add column if not exists hero_title_ro text;
alter table public.settings add column if not exists hero_title_en text;
alter table public.settings add column if not exists hero_subtitle_ro text;
alter table public.settings add column if not exists hero_subtitle_en text;
alter table public.settings add column if not exists hero_cta_text_ro text;
alter table public.settings add column if not exists hero_cta_text_en text;
alter table public.settings add column if not exists instant_printing_image_url text;
alter table public.settings add column if not exists instant_printing_image_public_id text;
alter table public.settings add column if not exists about_eyebrow text;
alter table public.settings add column if not exists about_eyebrow_ro text;
alter table public.settings add column if not exists about_eyebrow_en text;
alter table public.settings add column if not exists about_title text;
alter table public.settings add column if not exists about_title_ro text;
alter table public.settings add column if not exists about_title_en text;
alter table public.settings add column if not exists about_description text;
alter table public.settings add column if not exists about_description_ro text;
alter table public.settings add column if not exists about_description_en text;
alter table public.settings add column if not exists about_stat_values text[];
alter table public.settings add column if not exists about_stat_values_ro text[];
alter table public.settings add column if not exists about_stat_values_en text[];
alter table public.settings add column if not exists about_stat_labels text[];
alter table public.settings add column if not exists about_stat_labels_ro text[];
alter table public.settings add column if not exists about_stat_labels_en text[];
alter table public.settings add column if not exists about_cta text;
alter table public.settings add column if not exists about_cta_ro text;
alter table public.settings add column if not exists about_cta_en text;
alter table public.settings add column if not exists instant_printing_badge text;
alter table public.settings add column if not exists instant_printing_badge_ro text;
alter table public.settings add column if not exists instant_printing_badge_en text;
alter table public.settings add column if not exists instant_printing_eyebrow text;
alter table public.settings add column if not exists instant_printing_eyebrow_ro text;
alter table public.settings add column if not exists instant_printing_eyebrow_en text;
alter table public.settings add column if not exists instant_printing_title text;
alter table public.settings add column if not exists instant_printing_title_ro text;
alter table public.settings add column if not exists instant_printing_title_en text;
alter table public.settings add column if not exists instant_printing_description text;
alter table public.settings add column if not exists instant_printing_description_ro text;
alter table public.settings add column if not exists instant_printing_description_en text;
alter table public.settings add column if not exists instant_printing_points text[];
alter table public.settings add column if not exists instant_printing_points_ro text[];
alter table public.settings add column if not exists instant_printing_points_en text[];
alter table public.settings add column if not exists instant_printing_cta text;
alter table public.settings add column if not exists instant_printing_cta_ro text;
alter table public.settings add column if not exists instant_printing_cta_en text;
alter table public.settings add column if not exists winter_eyebrow text;
alter table public.settings add column if not exists winter_eyebrow_ro text;
alter table public.settings add column if not exists winter_eyebrow_en text;
alter table public.settings add column if not exists winter_title text;
alter table public.settings add column if not exists winter_title_ro text;
alter table public.settings add column if not exists winter_title_en text;
alter table public.settings add column if not exists winter_description text;
alter table public.settings add column if not exists winter_description_ro text;
alter table public.settings add column if not exists winter_description_en text;
alter table public.settings add column if not exists winter_cta text;
alter table public.settings add column if not exists winter_cta_ro text;
alter table public.settings add column if not exists winter_cta_en text;
alter table public.settings add column if not exists featured_eyebrow text;
alter table public.settings add column if not exists featured_eyebrow_ro text;
alter table public.settings add column if not exists featured_eyebrow_en text;
alter table public.settings add column if not exists featured_title text;
alter table public.settings add column if not exists featured_title_ro text;
alter table public.settings add column if not exists featured_title_en text;
alter table public.settings add column if not exists featured_subtitle text;
alter table public.settings add column if not exists featured_subtitle_ro text;
alter table public.settings add column if not exists featured_subtitle_en text;
alter table public.settings add column if not exists featured_view_all text;
alter table public.settings add column if not exists featured_view_all_ro text;
alter table public.settings add column if not exists featured_view_all_en text;
alter table public.settings add column if not exists contact_cta_eyebrow text;
alter table public.settings add column if not exists contact_cta_eyebrow_ro text;
alter table public.settings add column if not exists contact_cta_eyebrow_en text;
alter table public.settings add column if not exists contact_cta_title text;
alter table public.settings add column if not exists contact_cta_title_ro text;
alter table public.settings add column if not exists contact_cta_title_en text;
alter table public.settings add column if not exists contact_cta_subtitle text;
alter table public.settings add column if not exists contact_cta_subtitle_ro text;
alter table public.settings add column if not exists contact_cta_subtitle_en text;
alter table public.settings add column if not exists contact_cta_button text;
alter table public.settings add column if not exists contact_cta_button_ro text;
alter table public.settings add column if not exists contact_cta_button_en text;
alter table public.settings add column if not exists footer_tagline text;
alter table public.settings add column if not exists footer_tagline_ro text;
alter table public.settings add column if not exists footer_tagline_en text;
alter table public.settings add column if not exists contact_page_eyebrow text;
alter table public.settings add column if not exists contact_page_eyebrow_ro text;
alter table public.settings add column if not exists contact_page_eyebrow_en text;
alter table public.settings add column if not exists contact_page_title text;
alter table public.settings add column if not exists contact_page_title_ro text;
alter table public.settings add column if not exists contact_page_title_en text;
alter table public.settings add column if not exists contact_page_subtitle text;
alter table public.settings add column if not exists contact_page_subtitle_ro text;
alter table public.settings add column if not exists contact_page_subtitle_en text;
alter table public.settings add column if not exists show_services boolean not null default true;
alter table public.settings add column if not exists show_instant_printing boolean not null default true;
alter table public.settings add column if not exists show_winter_locations boolean not null default true;
alter table public.settings add column if not exists show_featured_projects boolean not null default true;
alter table public.settings add column if not exists show_pricing boolean not null default true;
alter table public.settings add column if not exists service_prices jsonb not null default '{}'::jsonb;
-- show_reviews is no longer used (Reviews section removed) — column left in place, harmless if it already exists.

-- ---------------------------------------------------------------------------
-- pricing_packages — admin-managed packages (e.g. "Classic", "Premium") shown
-- in the homepage "Тарифы" section, each with a feature list.
-- ---------------------------------------------------------------------------
create table if not exists public.pricing_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price text,
  features jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- `name`/`features` are the Russian (default) values; these optional
  -- columns hold Romanian/English overrides, same fallback pattern as
  -- event_types. `features_ro`/`features_en` are index-aligned with
  -- `features` — an empty/missing entry at index N falls back to `features[N]`.
  name_ro text,
  name_en text,
  features_ro jsonb,
  features_en jsonb
);

-- migration for already-deployed databases
alter table public.pricing_packages add column if not exists name_ro text;
alter table public.pricing_packages add column if not exists name_en text;
alter table public.pricing_packages add column if not exists features_ro jsonb;
alter table public.pricing_packages add column if not exists features_en jsonb;

create index if not exists pricing_packages_position_idx on public.pricing_packages (position);

-- ---------------------------------------------------------------------------
-- contact_submissions — inbox for the public contact form
-- ---------------------------------------------------------------------------
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text not null,
  event_type text,
  event_date date,
  message text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

-- migration for already-deployed databases: event_type used to be a fixed enum.
alter table public.contact_submissions alter column event_type type text using event_type::text;
drop type if exists event_type;

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

drop trigger if exists set_event_types_updated_at on public.event_types;
create trigger set_event_types_updated_at
  before update on public.event_types
  for each row execute function public.set_updated_at();

drop trigger if exists set_settings_updated_at on public.settings;
create trigger set_settings_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

drop trigger if exists set_pricing_packages_updated_at on public.pricing_packages;
create trigger set_pricing_packages_updated_at
  before update on public.pricing_packages
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- The public (anon) key is only ever used for READ access to published
-- content. All writes (create/update/delete project, photos, settings,
-- marking submissions as read) go through Server Actions running with the
-- `service_role` key, which bypasses RLS by design and never reaches the
-- client bundle.
alter table public.photos enable row level security;
alter table public.settings enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.winter_location_photos enable row level security;
alter table public.event_types enable row level security;
alter table public.pricing_packages enable row level security;

drop policy if exists "Public can read event types" on public.event_types;
create policy "Public can read event types"
  on public.event_types for select
  using (true);

drop policy if exists "Public can read published photos" on public.photos;
create policy "Public can read published photos"
  on public.photos for select
  using (is_published = true);

drop policy if exists "Public can read settings" on public.settings;
create policy "Public can read settings"
  on public.settings for select
  using (true);

drop policy if exists "Public can read active winter location photos" on public.winter_location_photos;
create policy "Public can read active winter location photos"
  on public.winter_location_photos for select
  using (is_active = true);

drop policy if exists "Public can read pricing packages" on public.pricing_packages;
create policy "Public can read pricing packages"
  on public.pricing_packages for select
  using (true);

-- No public policy on contact_submissions: it is insert-only via the
-- service_role key inside the `submitContactForm` Server Action, and only
-- readable from the admin panel (also via service_role).
