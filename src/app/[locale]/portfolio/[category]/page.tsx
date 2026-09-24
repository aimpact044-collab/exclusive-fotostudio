import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/shared/page-hero";
import { CategoryNav } from "@/components/portfolio/category-nav";
import { Gallery } from "@/components/portfolio/gallery";
import { VideoGrid } from "@/components/portfolio/video-grid";
import { getMediaByCategory, getEventTypesWithMedia, getEventTypeBySlug } from "@/lib/data";
import { localizedName } from "@/lib/event-type-i18n";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; category: string }>;
}) {
  const { locale, category } = await params;
  const eventType = await getEventTypeBySlug(category);
  if (!eventType) return {};

  const tPortfolio = await getTranslations({ locale, namespace: "portfolio" });
  return { title: `${localizedName(eventType, locale)} — ${tPortfolio("title")}` };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: Locale; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const eventType = await getEventTypeBySlug(category);
  if (!eventType) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "portfolio" });
  const tProject = await getTranslations({ locale, namespace: "project" });
  const [{ photos, videos }, eventTypes] = await Promise.all([
    getMediaByCategory(category),
    getEventTypesWithMedia(),
  ]);

  const categoryName = localizedName(eventType, locale);

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={categoryName} subtitle={t("subtitle")} />
      <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-10 lg:pb-32">
        <CategoryNav eventTypes={eventTypes} active={category} />

        {photos.length === 0 && videos.length === 0 ? (
          <p className="py-24 text-center text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="pt-14">
            {photos.length > 0 && <Gallery photos={photos} title={categoryName} />}
            {videos.length > 0 && (
              <div className={photos.length > 0 ? "mt-16" : undefined}>
                <p className="eyebrow mb-6">{tProject("video")}</p>
                <VideoGrid videos={videos} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}


