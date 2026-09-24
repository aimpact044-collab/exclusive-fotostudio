export interface EventType {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: string | null;
  position: number;
  created_at: string;
  updated_at: string;
  /** Russian is the default (`name`/`description`); these are optional overrides. */
  name_ro: string | null;
  name_en: string | null;
  description_ro: string | null;
  description_en: string | null;
}

export interface Photo {
  id: string;
  event_type_id: string | null;
  event_type?: EventType | null;
  url: string;
  public_id: string;
  media_type: "photo" | "video";
  alt: string | null;
  is_published: boolean;
  position: number;
  created_at: string;
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
  /** Russian is the default (`hero_title`/`hero_subtitle`/`hero_cta_text`); these are optional overrides. */
  hero_title_ro: string | null;
  hero_title_en: string | null;
  hero_subtitle_ro: string | null;
  hero_subtitle_en: string | null;
  hero_cta_text_ro: string | null;
  hero_cta_text_en: string | null;
  instant_printing_image_url: string | null;
  instant_printing_image_public_id: string | null;
  /** All fields below: Russian is the default, `_ro`/`_en` are optional overrides, falling back to messages/*.json translations when null. */
  about_eyebrow: string | null;
  about_eyebrow_ro: string | null;
  about_eyebrow_en: string | null;
  about_title: string | null;
  about_title_ro: string | null;
  about_title_en: string | null;
  about_description: string | null;
  about_description_ro: string | null;
  about_description_en: string | null;
  about_stat_values: string[] | null;
  about_stat_values_ro: string[] | null;
  about_stat_values_en: string[] | null;
  about_stat_labels: string[] | null;
  about_stat_labels_ro: string[] | null;
  about_stat_labels_en: string[] | null;
  about_cta: string | null;
  about_cta_ro: string | null;
  about_cta_en: string | null;
  instant_printing_badge: string | null;
  instant_printing_badge_ro: string | null;
  instant_printing_badge_en: string | null;
  instant_printing_eyebrow: string | null;
  instant_printing_eyebrow_ro: string | null;
  instant_printing_eyebrow_en: string | null;
  instant_printing_title: string | null;
  instant_printing_title_ro: string | null;
  instant_printing_title_en: string | null;
  instant_printing_description: string | null;
  instant_printing_description_ro: string | null;
  instant_printing_description_en: string | null;
  instant_printing_points: string[] | null;
  instant_printing_points_ro: string[] | null;
  instant_printing_points_en: string[] | null;
  instant_printing_cta: string | null;
  instant_printing_cta_ro: string | null;
  instant_printing_cta_en: string | null;
  winter_eyebrow: string | null;
  winter_eyebrow_ro: string | null;
  winter_eyebrow_en: string | null;
  winter_title: string | null;
  winter_title_ro: string | null;
  winter_title_en: string | null;
  winter_description: string | null;
  winter_description_ro: string | null;
  winter_description_en: string | null;
  winter_cta: string | null;
  winter_cta_ro: string | null;
  winter_cta_en: string | null;
  featured_eyebrow: string | null;
  featured_eyebrow_ro: string | null;
  featured_eyebrow_en: string | null;
  featured_title: string | null;
  featured_title_ro: string | null;
  featured_title_en: string | null;
  featured_subtitle: string | null;
  featured_subtitle_ro: string | null;
  featured_subtitle_en: string | null;
  featured_view_all: string | null;
  featured_view_all_ro: string | null;
  featured_view_all_en: string | null;
  contact_cta_eyebrow: string | null;
  contact_cta_eyebrow_ro: string | null;
  contact_cta_eyebrow_en: string | null;
  contact_cta_title: string | null;
  contact_cta_title_ro: string | null;
  contact_cta_title_en: string | null;
  contact_cta_subtitle: string | null;
  contact_cta_subtitle_ro: string | null;
  contact_cta_subtitle_en: string | null;
  contact_cta_button: string | null;
  contact_cta_button_ro: string | null;
  contact_cta_button_en: string | null;
  footer_tagline: string | null;
  footer_tagline_ro: string | null;
  footer_tagline_en: string | null;
  contact_page_eyebrow: string | null;
  contact_page_eyebrow_ro: string | null;
  contact_page_eyebrow_en: string | null;
  contact_page_title: string | null;
  contact_page_title_ro: string | null;
  contact_page_title_en: string | null;
  contact_page_subtitle: string | null;
  contact_page_subtitle_ro: string | null;
  contact_page_subtitle_en: string | null;
  show_services: boolean;
  show_instant_printing: boolean;
  show_winter_locations: boolean;
  show_featured_projects: boolean;
  show_pricing: boolean;
  updated_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string | null;
  phone: string;
  event_type: string | null;
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

/** An admin-managed pricing package (e.g. "Classic", "Premium") shown on the homepage. */
export interface PricingPackage {
  id: string;
  name: string;
  price: string | null;
  features: string[];
  is_featured: boolean;
  position: number;
  created_at: string;
  updated_at: string;
  /** Russian is the default (`name`/`features`); these are optional overrides.
   *  `features_ro`/`features_en` are index-aligned with `features`. */
  name_ro: string | null;
  name_en: string | null;
  features_ro: string[] | null;
  features_en: string[] | null;
}
