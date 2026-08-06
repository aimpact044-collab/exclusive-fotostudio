import { defineRouting } from "next-intl/routing";

/**
 * Central i18n configuration.
 *
 * - `ru` (Russian) is the default locale and is served without a URL prefix ("/").
 * - `ro` (Romanian) is served under "/ro".
 * - `en` (English) is reserved for the future and served under "/en".
 *
 * `localePrefix: "as-needed"` means the default locale never appears in the
 * URL, which keeps the primary Russian-speaking audience's links clean while
 * still giving every other locale an SEO-friendly, crawlable path.
 */
export const routing = defineRouting({
  locales: ["ru", "ro", "en"],
  defaultLocale: "ru",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/portfolio": {
      ru: "/portfolio",
      ro: "/portofoliu",
      en: "/portfolio",
    },
    "/portfolio/[category]": {
      ru: "/portfolio/[category]",
      ro: "/portofoliu/[category]",
      en: "/portfolio/[category]",
    },
    "/portfolio/[category]/[slug]": {
      ru: "/portfolio/[category]/[slug]",
      ro: "/portofoliu/[category]/[slug]",
      en: "/portfolio/[category]/[slug]",
    },
    "/contact": {
      ru: "/contact",
      ro: "/contact",
      en: "/contact",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
