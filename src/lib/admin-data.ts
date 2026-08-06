import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ContactSubmission, Project, SiteSettings, WinterLocationPhoto } from "@/types";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, photos(*)")
    .order("position", { ascending: true });

  if (error) return [];
  return (data as Project[]) ?? [];
}

export async function getProjectByIdAdmin(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, photos(*)")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Project;
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
