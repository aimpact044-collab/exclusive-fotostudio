import "server-only";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Cloudflare R2 (S3-compatible object storage) client, used for photo
 * uploads. The admin panel uploads directly from the browser to R2 using a
 * short-lived presigned PUT URL — our access keys never reach the client.
 */

function getConfig() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
    return null;
  }

  return { accountId, accessKeyId, secretAccessKey, bucket, publicUrl };
}

export function isR2Configured() {
  return getConfig() !== null;
}

function getClient(config: NonNullable<ReturnType<typeof getConfig>>) {
  return new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    // R2 doesn't support the newer AWS SDK v3 default of auto-adding
    // checksum headers/trailers to every request — without this, presigned
    // PUT URLs end up requiring a checksum header the browser never sends.
    requestChecksumCalculation: "WHEN_REQUIRED",
  });
}

/** Mints a short-lived presigned PUT URL for uploading a single object directly from the browser. */
export async function createUploadUrl(contentType: string) {
  const config = getConfig();
  if (!config) {
    throw new Error("R2 не настроен (R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME / R2_PUBLIC_URL)");
  }

  const key = `${crypto.randomUUID()}`;
  const client = getClient(config);
  const command = new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });
  const publicUrl = `${config.publicUrl}/${key}`;

  return { uploadUrl, key, publicUrl };
}

/** Deletes an object from R2. Best-effort — never throws. */
export async function deleteObject(key: string) {
  const config = getConfig();
  if (!config || !key) return;

  try {
    const client = getClient(config);
    await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }));
  } catch (error) {
    console.error("Failed to delete R2 object", key, error);
  }
}
