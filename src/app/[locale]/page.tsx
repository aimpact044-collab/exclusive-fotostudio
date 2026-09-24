import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/home/hero";
import { AboutTeam } from "@/components/home/about-team";
import { Services } from "@/components/home/services";
import { Pricing } from "@/components/home/pricing";
import { InstantPrinting } from "@/components/home/instant-printing";
import { WinterLocations } from "@/components/home/winter-locations";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { ContactCta } from "@/components/home/contact-cta";
import { getSettings, getEventTypes, getPricingPackages } from "@/lib/data";
import { localizedSetting, localizedSettingList } from "@/lib/settings-i18n";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const settings = await getSettings();
  const eventTypes = await getEventTypes();
  const pricingPackages = await getPricingPackages();

  const s = (base: string | null, ro: string | null, en: string | null) =>
    localizedSetting(base, ro, en, locale);
  const l = (base: string[] | null, ro: string[] | null, en: string[] | null) =>
    localizedSettingList(base, ro, en, locale);

  return (
    <>
      <Hero
        imageUrl={settings.hero_image_url}
        title={s(settings.hero_title, settings.hero_title_ro, settings.hero_title_en)}
        subtitle={s(settings.hero_subtitle, settings.hero_subtitle_ro, settings.hero_subtitle_en)}
        ctaText={s(settings.hero_cta_text, settings.hero_cta_text_ro, settings.hero_cta_text_en)}
        ctaHref={settings.hero_cta_href}
      />
      {settings.show_featured_projects && (
        <FeaturedProjects
          eyebrow={s(settings.featured_eyebrow, settings.featured_eyebrow_ro, settings.featured_eyebrow_en)}
          title={s(settings.featured_title, settings.featured_title_ro, settings.featured_title_en)}
          subtitle={s(settings.featured_subtitle, settings.featured_subtitle_ro, settings.featured_subtitle_en)}
          viewAllText={s(settings.featured_view_all, settings.featured_view_all_ro, settings.featured_view_all_en)}
        />
      )}
      {settings.show_services && <Services eventTypes={eventTypes} />}
      {settings.show_pricing && <Pricing packages={pricingPackages} />}
      {settings.show_instant_printing && (
        <InstantPrinting
          imageUrl={settings.instant_printing_image_url}
          badge={s(settings.instant_printing_badge, settings.instant_printing_badge_ro, settings.instant_printing_badge_en)}
          eyebrow={s(settings.instant_printing_eyebrow, settings.instant_printing_eyebrow_ro, settings.instant_printing_eyebrow_en)}
          title={s(settings.instant_printing_title, settings.instant_printing_title_ro, settings.instant_printing_title_en)}
          description={s(
            settings.instant_printing_description,
            settings.instant_printing_description_ro,
            settings.instant_printing_description_en
          )}
          points={l(settings.instant_printing_points, settings.instant_printing_points_ro, settings.instant_printing_points_en)}
          ctaText={s(settings.instant_printing_cta, settings.instant_printing_cta_ro, settings.instant_printing_cta_en)}
        />
      )}
      {settings.show_winter_locations && (
        <WinterLocations
          eyebrow={s(settings.winter_eyebrow, settings.winter_eyebrow_ro, settings.winter_eyebrow_en)}
          title={s(settings.winter_title, settings.winter_title_ro, settings.winter_title_en)}
          description={s(settings.winter_description, settings.winter_description_ro, settings.winter_description_en)}
          ctaText={s(settings.winter_cta, settings.winter_cta_ro, settings.winter_cta_en)}
        />
      )}
      <AboutTeam
        eyebrow={s(settings.about_eyebrow, settings.about_eyebrow_ro, settings.about_eyebrow_en)}
        title={s(settings.about_title, settings.about_title_ro, settings.about_title_en)}
        description={s(settings.about_description, settings.about_description_ro, settings.about_description_en)}
        statValues={l(settings.about_stat_values, settings.about_stat_values_ro, settings.about_stat_values_en)}
        statLabels={l(settings.about_stat_labels, settings.about_stat_labels_ro, settings.about_stat_labels_en)}
        ctaText={s(settings.about_cta, settings.about_cta_ro, settings.about_cta_en)}
      />
      <ContactCta
        eyebrow={s(settings.contact_cta_eyebrow, settings.contact_cta_eyebrow_ro, settings.contact_cta_eyebrow_en)}
        title={s(settings.contact_cta_title, settings.contact_cta_title_ro, settings.contact_cta_title_en)}
        subtitle={s(settings.contact_cta_subtitle, settings.contact_cta_subtitle_ro, settings.contact_cta_subtitle_en)}
        ctaText={s(settings.contact_cta_button, settings.contact_cta_button_ro, settings.contact_cta_button_en)}
      />
    </>
  );
}

