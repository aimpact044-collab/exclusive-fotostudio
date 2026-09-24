"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/auth";

export async function markSubmissionRead(id: string, isRead: boolean) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) throw new Error("Not authenticated");

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ is_read: isRead })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin-portal/submissions");
}
