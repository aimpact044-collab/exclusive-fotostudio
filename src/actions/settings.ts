"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/auth";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function updateSettings(formData: FormData) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) throw new Error("Not authenticated");

  if (!isSupabaseConfigured()) {
    // Supabase isn't configured in this environment — nothing to persist.
    revalidatePath("/", "layout");
    revalidatePath("/admin/settings");
    return;
  }

  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from("settings")
    .update({
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      address: String(formData.get("address") ?? ""),
      instagram_url: String(formData.get("instagram_url") ?? "") || null,
      facebook_url: String(formData.get("facebook_url") ?? "") || null,
      tiktok_url: String(formData.get("tiktok_url") ?? "") || null,
      whatsapp_url: String(formData.get("whatsapp_url") ?? "") || null,
      hero_video_url: String(formData.get("hero_video_url") ?? "") || null,
    })
    .eq("id", 1);

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}
