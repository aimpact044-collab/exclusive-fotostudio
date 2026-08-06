"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { deleteObject } from "@/lib/r2";
import { isAdminAuthenticated } from "@/lib/auth";
import { CATEGORY_SLUGS } from "@/lib/constants";

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

const projectSchema = z.object({
  slug: z.string().min(1),
  category: z.enum(CATEGORY_SLUGS as [string, ...string[]]),
  title: z.string().min(1),
  title_ro: z.string().optional(),
  title_en: z.string().optional(),
  description: z.string().optional(),
  description_ro: z.string().optional(),
  description_en: z.string().optional(),
  event_date: z.string().optional(),
  youtube_url: z.string().optional(),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
  cover_url: z.string().optional(),
  cover_public_id: z.string().optional(),
});

function parseProjectForm(formData: FormData) {
  const rawTitle = String(formData.get("title") ?? "");
  const rawSlug = String(formData.get("slug") ?? "") || rawTitle;

  return projectSchema.parse({
    slug: slugify(rawSlug),
    category: String(formData.get("category") ?? ""),
    title: rawTitle,
    title_ro: String(formData.get("title_ro") ?? "") || undefined,
    title_en: String(formData.get("title_en") ?? "") || undefined,
    description: String(formData.get("description") ?? "") || undefined,
    description_ro: String(formData.get("description_ro") ?? "") || undefined,
    description_en: String(formData.get("description_en") ?? "") || undefined,
    event_date: String(formData.get("event_date") ?? "") || undefined,
    youtube_url: String(formData.get("youtube_url") ?? "") || undefined,
    is_published: formData.get("is_published") === "on",
    is_featured: formData.get("is_featured") === "on",
    cover_url: String(formData.get("cover_url") ?? "") || undefined,
    cover_public_id: String(formData.get("cover_public_id") ?? "") || undefined,
  });
}

export async function createProject(formData: FormData) {
  await assertAdmin();
  const values = parseProjectForm(formData);
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      slug: values.slug,
      category: values.category,
      title: values.title,
      title_ro: values.title_ro ?? null,
      title_en: values.title_en ?? null,
      description: values.description ?? null,
      description_ro: values.description_ro ?? null,
      description_en: values.description_en ?? null,
      event_date: values.event_date || null,
      youtube_url: values.youtube_url ?? null,
      is_published: values.is_published,
      is_featured: values.is_featured,
      cover_url: values.cover_url ?? null,
      cover_public_id: values.cover_public_id ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create project");
  }

  revalidatePath("/", "layout");
  redirect(`/admin/projects/${data.id}`);
}

export async function updateProject(projectId: string, formData: FormData) {
  await assertAdmin();
  const values = parseProjectForm(formData);
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from("projects")
    .update({
      slug: values.slug,
      category: values.category,
      title: values.title,
      title_ro: values.title_ro ?? null,
      title_en: values.title_en ?? null,
      description: values.description ?? null,
      description_ro: values.description_ro ?? null,
      description_en: values.description_en ?? null,
      event_date: values.event_date || null,
      youtube_url: values.youtube_url ?? null,
      is_published: values.is_published,
      is_featured: values.is_featured,
      cover_url: values.cover_url ?? null,
      cover_public_id: values.cover_public_id ?? null,
    })
    .eq("id", projectId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function togglePublish(projectId: string, isPublished: boolean) {
  await assertAdmin();
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("projects")
    .update({ is_published: isPublished })
    .eq("id", projectId);

  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  revalidatePath("/admin/projects");
}

export async function deleteProject(projectId: string) {
  await assertAdmin();
  const supabase = getSupabaseAdminClient();

  const { data: photos } = await supabase
    .from("photos")
    .select("public_id")
    .eq("project_id", projectId);

  const { data: project } = await supabase
    .from("projects")
    .select("cover_public_id")
    .eq("id", projectId)
    .single();

  await Promise.all([
    ...(photos ?? []).map((p) => deleteObject(p.public_id)),
    project?.cover_public_id ? deleteObject(project.cover_public_id) : Promise.resolve(),
  ]);

  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin/projects");
}

export async function addPhotos(
  projectId: string,
  photos: { url: string; public_id: string }[]
) {
  await assertAdmin();
  const supabase = getSupabaseAdminClient();

  const { data: existing } = await supabase
    .from("photos")
    .select("position")
    .eq("project_id", projectId)
    .order("position", { ascending: false })
    .limit(1);

  let nextPosition = (existing?.[0]?.position ?? -1) + 1;

  const rows = photos.map((photo) => ({
    project_id: projectId,
    url: photo.url,
    public_id: photo.public_id,
    position: nextPosition++,
  }));

  const { error } = await supabase.from("photos").insert(rows);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function deletePhoto(projectId: string, photoId: string, publicId: string) {
  await assertAdmin();
  const supabase = getSupabaseAdminClient();

  await deleteObject(publicId);
  const { error } = await supabase.from("photos").delete().eq("id", photoId);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function reorderPhotos(projectId: string, orderedPhotoIds: string[]) {
  await assertAdmin();
  const supabase = getSupabaseAdminClient();

  await Promise.all(
    orderedPhotoIds.map((id, index) =>
      supabase.from("photos").update({ position: index }).eq("id", id)
    )
  );

  revalidatePath("/", "layout");
  revalidatePath(`/admin/projects/${projectId}`);
}
