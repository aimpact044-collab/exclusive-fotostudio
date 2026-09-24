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

const pricingPackageSchema = z.object({
  name: z.string().min(1),
  name_ro: z.string().optional(),
  name_en: z.string().optional(),
  price: z.string().optional(),
  features: z.array(z.string()),
  features_ro: z.array(z.string()).optional(),
  features_en: z.array(z.string()).optional(),
  is_featured: z.boolean(),
});

function linesToFeatures(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parsePricingPackageForm(formData: FormData) {
  const features = linesToFeatures(String(formData.get("features") ?? ""));
  const featuresRo = linesToFeatures(String(formData.get("features_ro") ?? ""));
  const featuresEn = linesToFeatures(String(formData.get("features_en") ?? ""));

  return pricingPackageSchema.parse({
    name: String(formData.get("name") ?? ""),
    name_ro: String(formData.get("name_ro") ?? "") || undefined,
    name_en: String(formData.get("name_en") ?? "") || undefined,
    price: String(formData.get("price") ?? "") || undefined,
    features,
    features_ro: featuresRo.length ? featuresRo : undefined,
    features_en: featuresEn.length ? featuresEn : undefined,
    is_featured: formData.get("is_featured") === "on",
  });
}

export async function createPricingPackage(formData: FormData) {
  await assertAdmin();
  const values = parsePricingPackageForm(formData);
  const supabase = getSupabaseAdminClient();

  const { data: existing } = await supabase
    .from("pricing_packages")
    .select("position")
    .order("position", { ascending: false })
    .limit(1);
  const nextPosition = (existing?.[0]?.position ?? -1) + 1;

  const { error } = await supabase.from("pricing_packages").insert({
    name: values.name,
    name_ro: values.name_ro ?? null,
    name_en: values.name_en ?? null,
    price: values.price ?? null,
    features: values.features,
    features_ro: values.features_ro ?? null,
    features_en: values.features_en ?? null,
    is_featured: values.is_featured,
    position: nextPosition,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin-portal/homepage");
}

export async function updatePricingPackage(packageId: string, formData: FormData) {
  await assertAdmin();
  const values = parsePricingPackageForm(formData);
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from("pricing_packages")
    .update({
      name: values.name,
      name_ro: values.name_ro ?? null,
      name_en: values.name_en ?? null,
      price: values.price ?? null,
      features: values.features,
      features_ro: values.features_ro ?? null,
      features_en: values.features_en ?? null,
      is_featured: values.is_featured,
    })
    .eq("id", packageId);

  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin-portal/homepage");
}

export async function deletePricingPackage(packageId: string) {
  await assertAdmin();
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase.from("pricing_packages").delete().eq("id", packageId);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin-portal/homepage");
}
