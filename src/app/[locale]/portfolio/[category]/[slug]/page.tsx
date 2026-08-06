import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { ru, ro, enUS } from "date-fns/locale";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getProjectBySlug, localize } from "@/lib/data";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { Gallery } from "@/components/portfolio/gallery";
import { YoutubeEmbed } from "@/components/shared/youtube-embed";
import { ArrowLeft } from "lucide-react";

const DATE_LOCALES = { ru, ro, en: enUS };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; category: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  const { title, description } = localize(project, locale);
  return {
    title,
    description: description ?? undefined,
    openGraph: project.cover_url ? { images: [project.cover_url] } : undefined,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: Locale; category: string; slug: string }>;
}) {
  const { locale, category, slug } = await params;
  setRequestLocale(locale);

  const project = await getProjectBySlug(slug);
  if (!project || project.category !== category) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "project" });
  const { title, description } = localize(project, locale);
  const photos = (project.photos ?? []).slice().sort((a, b) => a.position - b.position);

  const formattedDate = project.event_date
    ? format(new Date(project.event_date), "d MMMM yyyy", {
        locale: DATE_LOCALES[locale],
      })
    : null;

  return (
    <article>
      <div className="relative h-[70vh] min-h-[420px] w-full">
        {project.cover_url ? (
          <Image
            src={project.cover_url}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <PlaceholderImage category={project.category} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-12 text-cream lg:px-10">
          <div className="mx-auto max-w-5xl">
            <Link
              href="/portfolio"
              className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-cream/80 hover:text-cream"
            >
              <ArrowLeft className="size-3.5" />
              {t("backToPortfolio")}
            </Link>
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {formattedDate && (
              <p className="mt-3 text-sm uppercase tracking-widest text-cream/80">
                {formattedDate}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-24">
        {description && (
          <p className="prose-measure mx-auto text-center text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}

        {project.youtube_url && (
          <div className="mt-16">
            <p className="eyebrow mb-4">{t("video")}</p>
            <YoutubeEmbed url={project.youtube_url} title={title} />
          </div>
        )}

        {photos.length > 0 && (
          <div className="mt-16">
            <p className="eyebrow mb-6">{t("gallery")}</p>
            <Gallery photos={photos} title={title} />
          </div>
        )}
      </div>
    </article>
  );
}
