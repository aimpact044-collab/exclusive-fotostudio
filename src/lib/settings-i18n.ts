import type { Locale } from "@/i18n/routing";

/** Russian is the default; picks the `_ro`/`_en` override for the current locale when set. */
export function localizedSetting(
  base: string | null,
  ro: string | null,
  en: string | null,
  locale: Locale
): string | null {
  if (locale === "ro" && ro) return ro;
  if (locale === "en" && en) return en;
  return base;
}

/** Same as `localizedSetting`, but for list fields — falls back per-line to the Russian default. */
export function localizedSettingList(
  base: string[] | null,
  ro: string[] | null,
  en: string[] | null,
  locale: Locale
): string[] | null {
  if (!base) return base;
  let overrides: string[] | null = null;
  if (locale === "ro") overrides = ro;
  else if (locale === "en") overrides = en;
  return base.map((line, i) => overrides?.[i] || line);
}

