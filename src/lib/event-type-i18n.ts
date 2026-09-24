import type { EventType } from "@/types";
import type { Locale } from "@/i18n/routing";

/** Event type name in the given locale, falling back to the Russian default. */
export function localizedName(eventType: EventType, locale: Locale): string {
  if (locale === "ro" && eventType.name_ro) return eventType.name_ro;
  if (locale === "en" && eventType.name_en) return eventType.name_en;
  return eventType.name;
}

/** Event type description in the given locale, falling back to the Russian default. */
export function localizedDescription(eventType: EventType, locale: Locale): string | null {
  if (locale === "ro" && eventType.description_ro) return eventType.description_ro;
  if (locale === "en" && eventType.description_en) return eventType.description_en;
  return eventType.description;
}
