"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { deleteObject } from "@/lib/r2";
import { isAdminAuthenticated } from "@/lib/auth";

async function assertAdmin() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) throw new Error("Not authenticated");
}

export async function addWinterLocationPhotos(photos: { url: string; public_id: string }[]) {
  await assertAdmin();
  const supabase = getSupabaseAdminClient();

  const { data: existing } = await supabase
    .from("winter_location_photos")
    .select("position")
    .order("position", { ascending: false })
    .limit(1);

  let nextPosition = (existing?.[0]?.position ?? -1) + 1;

  const rows = photos.map((photo) => ({
    url: photo.url,
    public_id: photo.public_id,
    position: nextPosition++,
  }));

  const { error } = await supabase.from("winter_location_photos").insert(rows);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/homepage");
}

export async function toggleWinterLocationPhoto(id: string, isActive: boolean) {
  await assertAdmin();
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from("winter_location_photos")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/homepage");
}

export async function deleteWinterLocationPhoto(id: string, publicId: string) {
  await assertAdmin();
  const supabase = getSupabaseAdminClient();

  await deleteObject(publicId);
  const { error } = await supabase.from("winter_location_photos").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/homepage");
}
