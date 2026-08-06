"use server";

import { isAdminAuthenticated } from "@/lib/auth";
import { createStreamUploadUrl } from "@/lib/cloudflare";

/** Mints a one-time Cloudflare Stream upload URL for the admin panel to upload video directly from the browser. */
export async function requestStreamUploadUrl() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) throw new Error("Not authenticated");

  return createStreamUploadUrl();
}
