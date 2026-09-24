"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { deleteObject } from "@/lib/r2";
import { isAdminAuthenticated } from "@/lib/auth";

async function assertAdmin() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    throw new Error("Not authenticated");
  }
}

export async function addPhotos(
  eventTypeId: string,
  photos: { url: string; public_id: string; media_type?: "photo" | "video" }[]
) {
  await assertAdmin();
  const supabase = getSupabaseAdminClient();

  const { data: existing } = await supabase
    .from("photos")
    .select("position")
    .eq("event_type_id", eventTypeId)
    .order("position", { ascending: false })
    .limit(1);

  let nextPosition = (existing?.[0]?.position ?? -1) + 1;

  const rows = photos.map((photo) => ({
    event_type_id: eventTypeId,
    url: photo.url,
    public_id: photo.public_id,
    media_type: photo.media_type ?? "photo",
    position: nextPosition++,
  }));

  const { error } = await supabase.from("photos").insert(rows);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath(`/admin-portal/event-types/${eventTypeId}`);
}

export async function deletePhoto(eventTypeId: string, photoId: string, publicId: string) {
  await assertAdmin();
  const supabase = getSupabaseAdminClient();

  await deleteObject(publicId);
  const { error } = await supabase.from("photos").delete().eq("id", photoId);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath(`/admin-portal/event-types/${eventTypeId}`);
}

export async function reorderPhotos(eventTypeId: string, orderedPhotoIds: string[]) {
  await assertAdmin();
  const supabase = getSupabaseAdminClient();

  await Promise.all(
    orderedPhotoIds.map((id, index) =>
      supabase.from("photos").update({ position: index }).eq("id", id)
    )
  );

  revalidatePath("/", "layout");
  revalidatePath(`/admin-portal/event-types/${eventTypeId}`);
}

export async function togglePhotoPublish(eventTypeId: string, photoId: string, isPublished: boolean) {
  await assertAdmin();
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from("photos")
    .update({ is_published: isPublished })
    .eq("id", photoId);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath(`/admin-portal/event-types/${eventTypeId}`);
}
