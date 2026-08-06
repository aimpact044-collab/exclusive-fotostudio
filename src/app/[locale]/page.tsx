import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/home/hero";
import { AboutTeam } from "@/components/home/about-team";
import { Services } from "@/components/home/services";
import { InstantPrinting } from "@/components/home/instant-printing";
import { WinterLocations } from "@/components/home/winter-locations";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { ContactCta } from "@/components/home/contact-cta";
import { getSettings } from "@/lib/data";
import type { Locale } from "@/i18n/routing";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const settings = await getSettings();

  return (
    <>
      <Hero
        imageUrl={settings.hero_image_url}
        title={settings.hero_title}
        subtitle={settings.hero_subtitle}
        ctaText={settings.hero_cta_text}
        ctaHref={settings.hero_cta_href}
      />
      {settings.show_featured_projects && <FeaturedProjects locale={locale} />}
      {settings.show_services && <Services prices={settings.service_prices} />}
      {settings.show_instant_printing && <InstantPrinting />}
      {settings.show_winter_locations && <WinterLocations />}
      <AboutTeam />
      <ContactCta />
    </>
  );
}

