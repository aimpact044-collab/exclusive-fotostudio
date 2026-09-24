import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  ContactSubmission,
  EventType,
  Photo,
  PricingPackage,
  SiteSettings,
  WinterLocationPhoto,
} from "@/types";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function getEventTypesAdmin(): Promise<EventType[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("event_types")
    .select("*")
    .order("position", { ascending: true });

  if (error) return [];
  return (data as EventType[]) ?? [];
}

export async function getEventTypeByIdAdmin(id: string): Promise<EventType | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("event_types").select("*").eq("id", id).single();

  if (error || !data) return null;
  return data as EventType;
}

export async function getPhotosByEventTypeAdmin(eventTypeId: string): Promise<Photo[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("event_type_id", eventTypeId)
    .order("position", { ascending: true });

  if (error) return [];
  return (data as Photo[]) ?? [];
}


export async function getSubmissions(): Promise<ContactSubmission[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data as ContactSubmission[]) ?? [];
}

export async function getSettingsAdmin(): Promise<SiteSettings | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
  if (error || !data) return null;
  return data as SiteSettings;
}

export async function getWinterLocationPhotosAdmin(): Promise<WinterLocationPhoto[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("winter_location_photos")
    .select("*")
    .order("position", { ascending: true });

  if (error) return [];
  return (data as WinterLocationPhoto[]) ?? [];
}

export async function getPricingPackagesAdmin(): Promise<PricingPackage[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("pricing_packages")
    .select("*")
    .order("position", { ascending: true });

  if (error) return [];
  return (data as PricingPackage[]) ?? [];
}
