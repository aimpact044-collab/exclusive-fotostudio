"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/auth";

async function assertAdmin() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    throw new Error("Not authenticated");
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const eventTypeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.string().optional(),
  name_ro: z.string().optional(),
  name_en: z.string().optional(),
  description_ro: z.string().optional(),
  description_en: z.string().optional(),
});

function parseEventTypeForm(formData: FormData) {
  return eventTypeSchema.parse({
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? "") || undefined,
    price: String(formData.get("price") ?? "") || undefined,
    name_ro: String(formData.get("name_ro") ?? "") || undefined,
    name_en: String(formData.get("name_en") ?? "") || undefined,
    description_ro: String(formData.get("description_ro") ?? "") || undefined,
    description_en: String(formData.get("description_en") ?? "") || undefined,
  });
}

export async function createEventType(formData: FormData) {
  await assertAdmin();
  const values = parseEventTypeForm(formData);
  const supabase = getSupabaseAdminClient();

  const { data: existing } = await supabase
    .from("event_types")
    .select("position")
    .order("position", { ascending: false })
    .limit(1);
  const nextPosition = (existing?.[0]?.position ?? -1) + 1;

  const { error } = await supabase.from("event_types").insert({
    slug: `${slugify(values.name)}-${Date.now().toString(36)}`,
    name: values.name,
    description: values.description ?? null,
    price: values.price ?? null,
    position: nextPosition,
    name_ro: values.name_ro ?? null,
    name_en: values.name_en ?? null,
    description_ro: values.description_ro ?? null,
    description_en: values.description_en ?? null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin-portal/event-types");
}

export async function updateEventType(eventTypeId: string, formData: FormData) {
  await assertAdmin();
  const values = parseEventTypeForm(formData);
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from("event_types")
    .update({
      name: values.name,
      description: values.description ?? null,
      price: values.price ?? null,
      name_ro: values.name_ro ?? null,
      name_en: values.name_en ?? null,
      description_ro: values.description_ro ?? null,
      description_en: values.description_en ?? null,
    })
    .eq("id", eventTypeId);

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin-portal/event-types");
}

export async function deleteEventType(eventTypeId: string) {
  await assertAdmin();
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase.from("event_types").delete().eq("id", eventTypeId);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin-portal/event-types");
}

export async function reorderEventTypes(orderedIds: string[]) {
  await assertAdmin();
  const supabase = getSupabaseAdminClient();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("event_types").update({ position: index }).eq("id", id)
    )
  );

  revalidatePath("/", "layout");
  revalidatePath("/admin-portal/event-types");
}
