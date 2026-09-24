import type { PricingPackage } from "@/types";
import type { Locale } from "@/i18n/routing";

/** Pricing package name in the given locale, falling back to the Russian default. */
export function localizedPricingName(pkg: PricingPackage, locale: Locale): string {
  if (locale === "ro" && pkg.name_ro) return pkg.name_ro;
  if (locale === "en" && pkg.name_en) return pkg.name_en;
  return pkg.name;
}

/** Pricing package features in the given locale, falling back per-line to the Russian default. */
export function localizedPricingFeatures(pkg: PricingPackage, locale: Locale): string[] {
  const overrides = locale === "ro" ? pkg.features_ro : locale === "en" ? pkg.features_en : null;
  return pkg.features.map((feature, i) => overrides?.[i] || feature);
}
