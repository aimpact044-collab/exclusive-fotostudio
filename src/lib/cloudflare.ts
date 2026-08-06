import "server-only";

/**
 * Server-side Cloudflare Stream API client. Photo uploads use Cloudflare R2
 * instead (see src/lib/r2.ts) — this module is kept only for potential
 * future video uploads via Stream's direct creator upload flow.
 */

const API_BASE = "https://api.cloudflare.com/client/v4";

function getConfig() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) return null;
  return { accountId, apiToken };
}

export function isCloudflareConfigured() {
  return getConfig() !== null;
}

interface CloudflareApiResponse<T> {
  success: boolean;
  errors: { code: number; message: string }[];
  result: T;
}

/** Requests a one-time resumable (tus) direct-upload URL from Cloudflare Stream. */
export async function createStreamUploadUrl(maxDurationSeconds = 3600) {
  const config = getConfig();
  if (!config) {
    throw new Error("Cloudflare не настроен (CLOUDFLARE_ACCOUNT_ID / CLOUDFLARE_API_TOKEN)");
  }

  const res = await fetch(`${API_BASE}/accounts/${config.accountId}/stream/direct_upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ maxDurationSeconds }),
  });

  const json = (await res.json()) as CloudflareApiResponse<{ uid: string; uploadURL: string }>;
  if (!json.success) {
    throw new Error(json.errors?.[0]?.message ?? "Failed to create Cloudflare Stream upload URL");
  }

  return json.result;
}

/** Deletes a video from Cloudflare Stream. Best-effort — never throws. */
export async function deleteStreamVideo(uid: string) {
  const config = getConfig();
  if (!config || !uid) return;

  try {
    await fetch(`${API_BASE}/accounts/${config.accountId}/stream/${uid}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${config.apiToken}` },
    });
  } catch (error) {
    console.error("Failed to delete Cloudflare Stream video", uid, error);
  }
}
