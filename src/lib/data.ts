import type { Locale } from "@/i18n/routing";
import { getSupabasePublicClient } from "@/lib/supabase/client";
import type { Project, ProjectCategory, SiteSettings, WinterLocationPhoto } from "@/types";
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

/** Picks the localized override for a field, falling back to the Russian base value. */
export function localize(
  project: Pick<Project, "title" | "title_ro" | "title_en" | "description" | "description_ro" | "description_en">,
  locale: Locale
) {
  const title =
    (locale === "ro" ? project.title_ro : locale === "en" ? project.title_en : null) ||
    project.title;
  const description =
    (locale === "ro"
      ? project.description_ro
      : locale === "en"
        ? project.description_en
        : null) || project.description;

  return { title, description };
}

const DEMO_PROJECTS: Project[] = [
  {
    id: "demo-1",
    slug: "andrei-si-maria",
    category: "weddings",
    title: "Андрей и Мария",
    title_ro: "Andrei și Maria",
    title_en: "Andrei & Maria",
    description:
      "Тёплая осенняя свадьба в винограднике под Кишинёвом — с закатом, объятиями родителей и танцами до рассвета.",
    description_ro:
      "O nuntă caldă de toamnă într-o vie lângă Chișinău — cu apus, îmbrățișările părinților și dans până în zori.",
    description_en:
      "A warm autumn wedding at a vineyard near Chișinău — sunset, parents' embraces and dancing until dawn.",
    event_date: "2025-09-14",
    cover_url: null,
    cover_public_id: null,
    youtube_url: null,
    is_published: true,
    is_featured: true,
    position: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    slug: "familia-rusu-cumatrie",
    category: "cumatrii",
    title: "Кумэтрия семьи Русу",
    title_ro: "Cumătria familiei Rusu",
    title_en: "The Rusu family cumătrie",
    description: "Радостный семейный праздник с традициями и большим столом.",
    description_ro: "O sărbătoare de familie plină de bucurie, tradiții și o masă mare.",
    description_en: "A joyful family celebration full of tradition and a long table.",
    event_date: "2025-06-02",
    cover_url: null,
    cover_public_id: null,
    youtube_url: null,
    is_published: true,
    is_featured: true,
    position: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-3",
    slug: "sofia-botez",
    category: "baptisms",
    title: "Крестины Софии",
    title_ro: "Botezul Sofiei",
    title_en: "Sofia's baptism",
    description: "Нежный день, полный улыбок и семейного тепла.",
    description_ro: "O zi delicată, plină de zâmbete și căldură familială.",
    description_en: "A gentle day full of smiles and family warmth.",
    event_date: "2025-05-11",
    cover_url: null,
    cover_public_id: null,
    youtube_url: null,
    is_published: true,
    is_featured: true,
    position: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-4",
    slug: "ion-si-ana-love-story",
    category: "love-stories",
    title: "Ион и Анна",
    title_ro: "Ion și Ana",
    title_en: "Ion & Ana",
    description: "Прогулка по старому городу и recreare искренних чувств перед свадьбой.",
    description_ro: "O plimbare prin orașul vechi și emoții sincere înainte de nuntă.",
    description_en: "A walk through the old town and genuine emotion before the wedding.",
    event_date: "2025-04-20",
    cover_url: null,
    cover_public_id: null,
    youtube_url: null,
    is_published: true,
    is_featured: true,
    position: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

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

export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_PROJECTS.slice(0, limit);
  }

  const supabase = getSupabasePublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, photos(*)")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("position", { ascending: true })
    .limit(limit);

  if (error || !data?.length) {
    return DEMO_PROJECTS.slice(0, limit);
  }

  return data as Project[];
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

export async function getProjects(category?: ProjectCategory): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return category ? DEMO_PROJECTS.filter((p) => p.category === category) : DEMO_PROJECTS;
  }

  const supabase = getSupabasePublicClient();
  let query = supabase
    .from("projects")
    .select("*, photos(*)")
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    return category ? DEMO_PROJECTS.filter((p) => p.category === category) : DEMO_PROJECTS;
  }

  return (data as Project[]) ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  // Next.js sometimes hands dynamic route params through still URL-encoded
  // (observed with non-ASCII/Cyrillic slugs) — decode defensively so lookups
  // against the raw DB value succeed either way.
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    // slug wasn't encoded / already decoded — use as-is.
  }

  if (!isSupabaseConfigured()) {
    return DEMO_PROJECTS.find((p) => p.slug === decodedSlug) ?? null;
  }

  const supabase = getSupabasePublicClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, photos(*)")
    .eq("slug", decodedSlug)
    .eq("is_published", true)
    .single();

  if (error || !data) {
    console.error("getProjectBySlug failed", { slug: decodedSlug, error });
    return null;
  }

  return data as Project;
}
