import type { ProjectCategory } from "@/types";

export const SITE_NAME = "Exclusive Foto Studio";

/** Fallback contact info, used until Supabase settings are configured. */
export const FALLBACK_SETTINGS = {
  phone: "+373 60 000 000",
  email: "hello@exclusivefotostudio.md",
  address: "Chișinău, Moldova",
  instagram_url: "https://instagram.com",
  facebook_url: "https://facebook.com",
  tiktok_url: null as string | null,
  whatsapp_url: null as string | null,
  hero_video_url: null as string | null,
  hero_image_url: null as string | null,
  hero_image_public_id: null as string | null,
  hero_title: null as string | null,
  hero_subtitle: null as string | null,
  hero_cta_text: null as string | null,
  hero_cta_href: null as string | null,
  show_services: true,
  show_instant_printing: true,
  show_winter_locations: true,
  show_featured_projects: true,
  service_prices: {} as Record<string, string>,
};

export const CATEGORY_SLUGS: ProjectCategory[] = [
  "weddings",
  "cumatrii",
  "baptisms",
  "love-stories",
  "events",
];

export const EVENT_TYPES = [
  "wedding",
  "cumatrie",
  "baptism",
  "love-story",
  "event",
] as const;

/** Keys of the fixed service list shown in the homepage "Услуги" section. */
export const SERVICE_ITEM_KEYS = [
  "weddingPhoto",
  "weddingVideo",
  "cumatrii",
  "baptisms",
  "loveStory",
  "familySessions",
  "individualSessions",
  "eventPhoto",
  "eventVideo",
] as const;

/** Russian labels for service items, used only in the admin panel. */
export const SERVICE_ITEM_LABELS: Record<(typeof SERVICE_ITEM_KEYS)[number], string> = {
  weddingPhoto: "Свадебная фотография",
  weddingVideo: "Свадебная видеография",
  cumatrii: "Кумэтрии",
  baptisms: "Крестины",
  loveStory: "Love Story",
  familySessions: "Семейные фотосессии",
  individualSessions: "Индивидуальные фотосессии",
  eventPhoto: "Фотосъёмка мероприятий",
  eventVideo: "Видеосъёмка мероприятий",
};
