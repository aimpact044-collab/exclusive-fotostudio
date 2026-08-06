"use server";

import { isAdminAuthenticated } from "@/lib/auth";
import { createUploadUrl } from "@/lib/r2";

/** Mints a one-time R2 upload URL for the admin panel to upload a photo directly from the browser. */
export async function requestUploadUrl(contentType: string) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) throw new Error("Not authenticated");

  return createUploadUrl(contentType);
}
