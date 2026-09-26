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
      instant_printing_description: str(formData, "instant_printing_description"),
      instant_printing_description_ro: str(formData, "instant_printing_description_ro"),
      instant_printing_description_en: str(formData, "instant_printing_description_en"),
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

