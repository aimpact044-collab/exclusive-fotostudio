"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/auth";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function str(formData: FormData, key: string): string | null {
  return String(formData.get(key) ?? "") || null;
}

/** Parses a textarea with one item per line into a Postgres text[], or null if empty. */
function list(formData: FormData, key: string): string[] | null {
  const items = String(formData.get(key) ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return items.length ? items : null;
}

export async function updateHomepageSettings(formData: FormData) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) throw new Error("Not authenticated");

  if (!isSupabaseConfigured()) {
    // Supabase isn't configured in this environment — nothing to persist.
    revalidatePath("/", "layout");
    revalidatePath("/admin-portal/homepage");
    return;
  }

  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from("settings")
    .update({
      hero_image_url: str(formData, "hero_image_url"),
      hero_image_public_id: str(formData, "hero_image_public_id"),
      hero_title: str(formData, "hero_title"),
      hero_subtitle: str(formData, "hero_subtitle"),
      hero_cta_text: str(formData, "hero_cta_text"),
      hero_cta_href: str(formData, "hero_cta_href"),
      hero_title_ro: str(formData, "hero_title_ro"),
      hero_title_en: str(formData, "hero_title_en"),
      hero_subtitle_ro: str(formData, "hero_subtitle_ro"),
      hero_subtitle_en: str(formData, "hero_subtitle_en"),
      hero_cta_text_ro: str(formData, "hero_cta_text_ro"),
      hero_cta_text_en: str(formData, "hero_cta_text_en"),
      instant_printing_image_url: str(formData, "instant_printing_image_url"),
      instant_printing_image_public_id: str(formData, "instant_printing_image_public_id"),
      about_eyebrow: str(formData, "about_eyebrow"),
      about_eyebrow_ro: str(formData, "about_eyebrow_ro"),
      about_eyebrow_en: str(formData, "about_eyebrow_en"),
      about_title: str(formData, "about_title"),
      about_title_ro: str(formData, "about_title_ro"),
      about_title_en: str(formData, "about_title_en"),
      about_description: str(formData, "about_description"),
      about_description_ro: str(formData, "about_description_ro"),
      about_description_en: str(formData, "about_description_en"),
      about_stat_values: list(formData, "about_stat_values"),
      about_stat_values_ro: list(formData, "about_stat_values_ro"),
      about_stat_values_en: list(formData, "about_stat_values_en"),
      about_stat_labels: list(formData, "about_stat_labels"),
      about_stat_labels_ro: list(formData, "about_stat_labels_ro"),
      about_stat_labels_en: list(formData, "about_stat_labels_en"),
      about_cta: str(formData, "about_cta"),
      about_cta_ro: str(formData, "about_cta_ro"),
      about_cta_en: str(formData, "about_cta_en"),
      instant_printing_badge: str(formData, "instant_printing_badge"),
      instant_printing_badge_ro: str(formData, "instant_printing_badge_ro"),
      instant_printing_badge_en: str(formData, "instant_printing_badge_en"),
      instant_printing_eyebrow: str(formData, "instant_printing_eyebrow"),
      instant_printing_eyebrow_ro: str(formData, "instant_printing_eyebrow_ro"),
      instant_printing_eyebrow_en: str(formData, "instant_printing_eyebrow_en"),
      instant_printing_title: str(formData, "instant_printing_title"),
      instant_printing_title_ro: str(formData, "instant_printing_title_ro"),
      instant_printing_title_en: str(formData, "instant_printing_title_en"),
      instant_printing_description: str(formData, "instant_printing_description"),
      instant_printing_description_ro: str(formData, "instant_printing_description_ro"),
      instant_printing_description_en: str(formData, "instant_printing_description_en"),
      instant_printing_points: list(formData, "instant_printing_points"),
      instant_printing_points_ro: list(formData, "instant_printing_points_ro"),
      instant_printing_points_en: list(formData, "instant_printing_points_en"),
      instant_printing_cta: str(formData, "instant_printing_cta"),
      instant_printing_cta_ro: str(formData, "instant_printing_cta_ro"),
      instant_printing_cta_en: str(formData, "instant_printing_cta_en"),
      winter_eyebrow: str(formData, "winter_eyebrow"),
      winter_eyebrow_ro: str(formData, "winter_eyebrow_ro"),
      winter_eyebrow_en: str(formData, "winter_eyebrow_en"),
      winter_title: str(formData, "winter_title"),
      winter_title_ro: str(formData, "winter_title_ro"),
      winter_title_en: str(formData, "winter_title_en"),
      winter_description: str(formData, "winter_description"),
      winter_description_ro: str(formData, "winter_description_ro"),
      winter_description_en: str(formData, "winter_description_en"),
      winter_cta: str(formData, "winter_cta"),
      winter_cta_ro: str(formData, "winter_cta_ro"),
      winter_cta_en: str(formData, "winter_cta_en"),
      featured_eyebrow: str(formData, "featured_eyebrow"),
      featured_eyebrow_ro: str(formData, "featured_eyebrow_ro"),
      featured_eyebrow_en: str(formData, "featured_eyebrow_en"),
      featured_title: str(formData, "featured_title"),
      featured_title_ro: str(formData, "featured_title_ro"),
      featured_title_en: str(formData, "featured_title_en"),
      featured_subtitle: str(formData, "featured_subtitle"),
      featured_subtitle_ro: str(formData, "featured_subtitle_ro"),
      featured_subtitle_en: str(formData, "featured_subtitle_en"),
      featured_view_all: str(formData, "featured_view_all"),
      featured_view_all_ro: str(formData, "featured_view_all_ro"),
      featured_view_all_en: str(formData, "featured_view_all_en"),
      contact_cta_eyebrow: str(formData, "contact_cta_eyebrow"),
      contact_cta_eyebrow_ro: str(formData, "contact_cta_eyebrow_ro"),
      contact_cta_eyebrow_en: str(formData, "contact_cta_eyebrow_en"),
      contact_cta_title: str(formData, "contact_cta_title"),
      contact_cta_title_ro: str(formData, "contact_cta_title_ro"),
      contact_cta_title_en: str(formData, "contact_cta_title_en"),
      contact_cta_subtitle: str(formData, "contact_cta_subtitle"),
      contact_cta_subtitle_ro: str(formData, "contact_cta_subtitle_ro"),
      contact_cta_subtitle_en: str(formData, "contact_cta_subtitle_en"),
      contact_cta_button: str(formData, "contact_cta_button"),
      contact_cta_button_ro: str(formData, "contact_cta_button_ro"),
      contact_cta_button_en: str(formData, "contact_cta_button_en"),
      show_services: formData.get("show_services") === "on",
      show_instant_printing: formData.get("show_instant_printing") === "on",
      show_winter_locations: formData.get("show_winter_locations") === "on",
      show_featured_projects: formData.get("show_featured_projects") === "on",
      show_pricing: formData.get("show_pricing") === "on",
    })
    .eq("id", 1);

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin-portal/homepage");
}

