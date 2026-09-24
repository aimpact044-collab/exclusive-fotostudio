// One-off local script: resizes/compresses photos from local folders and
// uploads them straight to R2 + Supabase, bypassing the admin UI for bulk
// imports. Run with: node scripts/bulk-upload-photos.mjs
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnvLocal() {
  const text = readFileSync(path.join(root, ".env.local"), "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnvLocal();

const {
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
} = process.env;

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  requestChecksumCalculation: "WHEN_REQUIRED",
});

// Keep well within the R2 free tier (10 GB storage): resize long edge down
// and re-encode as JPEG q82 instead of uploading raw ~5-15 MB DSLR originals.
const MAX_DIMENSION = 2200;
const JPEG_QUALITY = 82;

async function assertSchemaReady() {
  const { error } = await supabase.from("photos").select("event_type_id, is_published").limit(1);
  if (error) {
    console.error("\nSchema check failed:", error.message);
    console.error("Re-run supabase/schema.sql in the Supabase SQL editor first, then retry.\n");
    process.exit(1);
  }
}

async function getOrCreateEventType(name, { description, slug } = {}) {
  const { data: existing, error: selectError } = await supabase
    .from("event_types")
    .select("id, name")
    .ilike("name", name)
    .limit(1);
  if (selectError) throw new Error(selectError.message);
  if (existing?.length) return existing[0].id;

  const { data: last } = await supabase
    .from("event_types")
    .select("position")
    .order("position", { ascending: false })
    .limit(1);
  const nextPosition = (last?.[0]?.position ?? -1) + 1;

  const { data: created, error: insertError } = await supabase
    .from("event_types")
    .insert({
      slug: slug ?? `${name.toLowerCase()}-${Date.now().toString(36)}`,
      name,
      description: description ?? null,
      position: nextPosition,
    })
    .select("id")
    .single();
  if (insertError) throw new Error(insertError.message);

  console.log(`Created event type "${name}" (${created.id})`);
  return created.id;
}

async function nextPositionFor(eventTypeId) {
  const { data } = await supabase
    .from("photos")
    .select("position")
    .eq("event_type_id", eventTypeId)
    .order("position", { ascending: false })
    .limit(1);
  return (data?.[0]?.position ?? -1) + 1;
}

async function uploadOne(filePath) {
  const original = readFileSync(filePath);
  const resized = await sharp(original)
    .rotate() // respect EXIF orientation
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();

  const key = randomUUID();
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: resized,
      ContentType: "image/jpeg",
    })
  );

  return { url: `${R2_PUBLIC_URL}/${key}`, public_id: key, size: resized.length, originalSize: original.length };
}

async function importFolder(eventTypeId, folderPath, label) {
  const files = readdirSync(folderPath)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort();

  console.log(`\n${label}: ${files.length} files from ${folderPath}`);

  let position = await nextPositionFor(eventTypeId);
  let uploaded = 0;
  let totalOriginal = 0;
  let totalResized = 0;
  const rows = [];

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    try {
      const { url, public_id, size, originalSize } = await uploadOne(filePath);
      rows.push({
        event_type_id: eventTypeId,
        url,
        public_id,
        media_type: "photo",
        position: position++,
        is_published: true,
      });
      totalOriginal += originalSize;
      totalResized += size;
      uploaded++;
      if (uploaded % 20 === 0) process.stdout.write(`  ${uploaded}/${files.length}\n`);
    } catch (error) {
      console.error(`  Failed: ${file} —`, error.message);
    }
  }

  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100);
    const { error } = await supabase.from("photos").insert(chunk);
    if (error) throw new Error(error.message);
  }

  console.log(
    `  Done: ${uploaded}/${files.length} uploaded — ${(totalOriginal / 1e6).toFixed(0)}MB -> ${(totalResized / 1e6).toFixed(0)}MB`
  );
}

async function main() {
  await assertSchemaReady();

  const venchanieId = await getOrCreateEventType("Венчание");
  const nuntiId = await getOrCreateEventType("Nunți");
  const botezId = await getOrCreateEventType("Botez", {
    description: "Съёмка обряда крещения — светлый и трогательный день для всей семьи.",
  });

  const downloads = "C:/Users/aprodan1/Downloads";

  await importFolder(venchanieId, path.join(downloads, "Венчание фото -20260923T193231Z-1-001/Венчание фото"), "Венчание");
  await importFolder(nuntiId, path.join(downloads, "Свадебная Фотосессия -20260923T193233Z-1-001/Свадебная Фотосессия"), "Nunți (Свадебная Фотосессия)");
  await importFolder(nuntiId, path.join(downloads, "Зал -20260923T193231Z-1-001/Зал"), "Nunți (Зал)");
  await importFolder(botezId, path.join(downloads, "Крещения -20260923T193232Z-1-001/Крещения"), "Botez (Крещения)");

  console.log("\nAll done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
