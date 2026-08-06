export type ProjectCategory =
  | "weddings"
  | "cumatrii"
  | "baptisms"
  | "love-stories"
  | "events";

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  "weddings",
  "cumatrii",
  "baptisms",
  "love-stories",
  "events",
];

export interface Photo {
  id: string;
  project_id: string;
  url: string;
  public_id: string;
  alt: string | null;
  position: number;
  created_at: string;
}

export interface Project {
  id: string;
  slug: string;
  category: ProjectCategory;
  title: string;
  title_ro: string | null;
  title_en: string | null;
  description: string | null;
  description_ro: string | null;
  description_en: string | null;
  event_date: string | null;
  cover_url: string | null;
  cover_public_id: string | null;
  youtube_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  position: number;
  created_at: string;
  updated_at: string;
  photos?: Photo[];
}

export interface SiteSettings {
  id: number;
  phone: string;
  email: string;
  address: string;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  whatsapp_url: string | null;
  hero_video_url: string | null;
  hero_image_url: string | null;
  hero_image_public_id: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  hero_cta_text: string | null;
  hero_cta_href: string | null;
  show_services: boolean;
  show_instant_printing: boolean;
  show_winter_locations: boolean;
  show_featured_projects: boolean;
  /** Display price per service, keyed by service item key (e.g. "weddingPhoto"). */
  service_prices: Record<string, string> | null;
  updated_at: string;
}

export type EventType =
  | "wedding"
  | "cumatrie"
  | "baptism"
  | "love-story"
  | "event";

export interface ContactSubmission {
  id: string;
  name: string | null;
  phone: string;
  event_type: EventType | null;
  event_date: string | null;
  message: string | null;
  created_at: string;
  is_read: boolean;
}

/** A single photo ("photo zone") shown in the homepage "Зимний сезон" section. */
export interface WinterLocationPhoto {
  id: string;
  url: string;
  public_id: string;
  is_active: boolean;
  position: number;
  created_at: string;
}
