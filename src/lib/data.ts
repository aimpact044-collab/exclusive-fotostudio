import { getSupabasePublicClient } from "@/lib/supabase/client";
import type { EventType, PricingPackage, Photo, SiteSettings, WinterLocationPhoto } from "@/types";
import { FALLBACK_SETTINGS } from "@/lib/constants";

/**
 * All data-fetching for public pages lives here. Every function degrades
 * gracefully to curated demo content when Supabase environment variables are
 * not yet configured, so the site is fully explorable immediately after
 * `npm install` — the studio owner can wire up the real database whenever
 * they're ready, without the site ever showing a broken/empty page.
 */

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

const DEMO_EVENT_TYPES: EventType[] = [
  {
    id: "demo-type-weddings",
    slug: "nunti",
    name: "Свадьбы",
    description: "Свадебная фотография и видеография полного дня.",
    price: "от 500 €",
    position: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name_ro: "Nunți",
    name_en: "Weddings",
    description_ro: "Fotografie și videografie de nuntă pe parcursul întregii zile.",
    description_en: "Full-day wedding photography and videography.",
  },
  {
    id: "demo-type-cumatrii",
    slug: "cumatrii",
    name: "Кумэтрии",
    description: "Тёплая съёмка традиционного семейного праздника.",
    price: "от 300 €",
    position: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name_ro: "Cumătrii",
    name_en: "Godparent Ceremonies",
    description_ro: "Filmare caldă a unei sărbători tradiționale de familie.",
    description_en: "A warm take on this traditional family celebration.",
  },
  {
    id: "demo-type-baptisms",
    slug: "krestiny",
    name: "Крестины",
    description: "Нежные кадры одного из самых важных дней семьи.",
    price: "от 250 €",
    position: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name_ro: "Botez",
    name_en: "Baptisms",
    description_ro: "Cadre delicate dintr-una din cele mai importante zile ale familiei.",
    description_en: "Tender frames from one of a family's most important days.",
  },
  {
    id: "demo-type-events",
    slug: "meropriyatiya",
    name: "Мероприятия",
    description: "Фото и видео съёмка мероприятий любого масштаба.",
    price: null,
    position: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    name_ro: "Evenimente",
    name_en: "Events",
    description_ro: "Foto și video pentru evenimente de orice amploare.",
    description_en: "Photo and video coverage for events of any scale.",
  },
];

// Demo mode never had real uploaded media either — every category simply
// renders an empty gallery until Supabase is configured.

export async function getSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) {
    return { id: 1, updated_at: new Date().toISOString(), ...FALLBACK_SETTINGS };
  }

  const supabase = getSupabasePublicClient();
  const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();

  if (error || !data) {
    return { id: 1, updated_at: new Date().toISOString(), ...FALLBACK_SETTINGS };
  }

  return data as SiteSettings;
}

export async function getEventTypes(): Promise<EventType[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_EVENT_TYPES;
  }

  const supabase = getSupabasePublicClient();
  const { data, error } = await supabase
    .from("event_types")
    .select("*")
    .order("position", { ascending: true });

  if (error || !data) return DEMO_EVENT_TYPES;
  return data as EventType[];
}

/** Event types that have at least one published photo/video — used to decide which
 * categories actually appear as Portfolio tabs (a service with no media yet is only
 * shown in the homepage Services section, not in Portfolio). */
export async function getEventTypesWithMedia(): Promise<EventType[]> {
  const eventTypes = await getEventTypes();
  if (!isSupabaseConfigured()) return eventTypes;

  const supabase = getSupabasePublicClient();
  const { data, error } = await supabase
    .from("photos")
    .select("event_type_id")
    .eq("is_published", true);

  if (error || !data) return [];

  const idsWithMedia = new Set(data.map((row) => row.event_type_id).filter(Boolean));
  return eventTypes.filter((eventType) => idsWithMedia.has(eventType.id));
}

export async function getEventTypeBySlug(slug: string): Promise<EventType | null> {
  // Next.js sometimes hands dynamic route params through still URL-encoded
  // (observed with non-ASCII/Cyrillic slugs) — decode defensively so lookups
  // against the raw DB value succeed either way.
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    // slug wasn't encoded / already decoded — use as-is.
  }

  const types = await getEventTypes();
  return types.find((t) => t.slug === decodedSlug) ?? null;
}

/** For the homepage "featured" section: the first few categories that already have media, each paired with one cover photo. */
export async function getFeaturedCategories(
  limit = 4
): Promise<{ eventType: EventType; cover: Photo | null }[]> {
  const eventTypes = (await getEventTypesWithMedia()).slice(0, limit);

  if (!isSupabaseConfigured()) {
    return eventTypes.map((eventType) => ({ eventType, cover: null }));
  }

  const supabase = getSupabasePublicClient();
  return Promise.all(
    eventTypes.map(async (eventType) => {
      const { data } = await supabase
        .from("photos")
        .select("*")
        .eq("event_type_id", eventType.id)
        .eq("media_type", "photo")
        .eq("is_published", true)
        .order("position", { ascending: true })
        .limit(1);

      return { eventType, cover: (data?.[0] as Photo | undefined) ?? null };
    })
  );
}

export async function getWinterLocationPhotos(): Promise<WinterLocationPhoto[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = getSupabasePublicClient();
  const { data, error } = await supabase
    .from("winter_location_photos")
    .select("*")
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (error || !data) return [];
  return data as WinterLocationPhoto[];
}

const DEMO_PRICING_PACKAGES: PricingPackage[] = [
  {
    id: "demo-package-classic",
    name: "Classic",
    name_ro: "Classic",
    name_en: "Classic",
    price: null,
    features: [
      "Один фотограф",
      "Один видеограф",
      "Неограниченное время работы для съёмки всех важных моментов события",
      "Профессиональная обработка всех фото и видео материалов",
      "Выезд фотографа и видеографа включён в стоимость",
      "Возможность заключить договор для прозрачности и безопасности",
      "Срок сдачи готового материала — до 3 месяцев",
    ],
    features_ro: [
      "Un fotograf",
      "Un videograf",
      "Timp nelimitat de lucru pentru filmarea tuturor momentelor importante ale evenimentului",
      "Procesare profesională a tuturor materialelor foto și video",
      "Deplasarea fotografului și videografului este inclusă în preț",
      "Posibilitatea de a încheia un contract pentru transparență și siguranță",
      "Termen de predare a materialului final — până la 3 luni",
    ],
    features_en: [
      "One photographer",
      "One videographer",
      "Unlimited working time to capture all the important moments of the event",
      "Professional editing of all photo and video materials",
      "Photographer and videographer travel included in the price",
      "Option to sign a contract for transparency and security",
      "Final material delivery time — up to 3 months",
    ],
    is_featured: false,
    position: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-package-premium",
    name: "Premium",
    name_ro: "Premium",
    name_en: "Premium",
    price: null,
    features: [
      "Один фотограф",
      "Один видеограф",
      "Фотоальбом",
      "Съёмка с дрона",
      "Печать фотографий прямо во время мероприятия",
      "Неограниченное время работы для съёмки всех важных моментов события",
      "Профессиональная обработка всех фото и видео материалов",
      "Выезд фотографа и видеографа включён в стоимость",
      "Возможность заключить договор для прозрачности и безопасности",
      "Срок сдачи готового материала — до 3 месяцев",
    ],
    features_ro: [
      "Un fotograf",
      "Un videograf",
      "Album foto",
      "Filmare cu drona",
      "Printare foto chiar în timpul evenimentului",
      "Timp nelimitat de lucru pentru filmarea tuturor momentelor importante ale evenimentului",
      "Procesare profesională a tuturor materialelor foto și video",
      "Deplasarea fotografului și videografului este inclusă în preț",
      "Posibilitatea de a încheia un contract pentru transparență și siguranță",
      "Termen de predare a materialului final — până la 3 luni",
    ],
    features_en: [
      "One photographer",
      "One videographer",
      "Photo album",
      "Drone filming",
      "Photo printing right during the event",
      "Unlimited working time to capture all the important moments of the event",
      "Professional editing of all photo and video materials",
      "Photographer and videographer travel included in the price",
      "Option to sign a contract for transparency and security",
      "Final material delivery time — up to 3 months",
    ],
    is_featured: true,
    position: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getPricingPackages(): Promise<PricingPackage[]> {
  if (!isSupabaseConfigured()) return DEMO_PRICING_PACKAGES;

  const supabase = getSupabasePublicClient();
  const { data, error } = await supabase
    .from("pricing_packages")
    .select("*")
    .order("position", { ascending: true });

  if (error || !data?.length) return DEMO_PRICING_PACKAGES;
  return data as PricingPackage[];
}

/** All published photos/videos for one category (or every category if no slug is given), split into photos vs. videos. */
export async function getMediaByCategory(
  eventTypeSlug?: string
): Promise<{ photos: Photo[]; videos: Photo[] }> {
  // Next.js sometimes hands dynamic route params through still URL-encoded
  // (observed with non-ASCII/Cyrillic slugs) — decode defensively so lookups
  // against the raw DB value succeed either way.
  let decodedSlug = eventTypeSlug;
  if (decodedSlug) {
    try {
      decodedSlug = decodeURIComponent(decodedSlug);
    } catch {
      // slug wasn't encoded / already decoded — use as-is.
    }
  }

  const empty = { photos: [] as Photo[], videos: [] as Photo[] };
  if (!isSupabaseConfigured()) return empty;

  let eventTypeId: string | undefined;
  if (decodedSlug) {
    const eventType = await getEventTypeBySlug(decodedSlug);
    if (!eventType) return empty;
    eventTypeId = eventType.id;
  }

  const supabase = getSupabasePublicClient();
  let query = supabase
    .from("photos")
    .select("*")
    .eq("is_published", true)
    .order("position", { ascending: true });
  if (eventTypeId) query = query.eq("event_type_id", eventTypeId);

  const { data, error } = await query;
  if (error || !data) return empty;

  const media = data as Photo[];
  return {
    photos: media.filter((p) => p.media_type !== "video"),
    videos: media.filter((p) => p.media_type === "video"),
  };
}

