"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/auth";
import { SERVICE_ITEM_KEYS } from "@/lib/constants";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function updateHomepageSettings(formData: FormData) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) throw new Error("Not authenticated");

  if (!isSupabaseConfigured()) {
    // Supabase isn't configured in this environment — nothing to persist.
    revalidatePath("/", "layout");
    revalidatePath("/admin/homepage");
    return;
  }

  const supabase = getSupabaseAdminClient();

  const service_prices: Record<string, string> = {};
  for (const key of SERVICE_ITEM_KEYS) {
    const value = String(formData.get(`price_${key}`) ?? "").trim();
    if (value) service_prices[key] = value;
  }

  const { error } = await supabase
    .from("settings")
    .update({
      hero_image_url: String(formData.get("hero_image_url") ?? "") || null,
      hero_image_public_id: String(formData.get("hero_image_public_id") ?? "") || null,
      hero_title: String(formData.get("hero_title") ?? "") || null,
      hero_subtitle: String(formData.get("hero_subtitle") ?? "") || null,
      hero_cta_text: String(formData.get("hero_cta_text") ?? "") || null,
      hero_cta_href: String(formData.get("hero_cta_href") ?? "") || null,
      show_services: formData.get("show_services") === "on",
      show_instant_printing: formData.get("show_instant_printing") === "on",
      show_winter_locations: formData.get("show_winter_locations") === "on",
      show_featured_projects: formData.get("show_featured_projects") === "on",
      service_prices,
    })
    .eq("id", 1);

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/homepage");
}
