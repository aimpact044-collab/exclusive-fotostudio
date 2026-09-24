import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

import { AnimatedSection } from "@/components/shared/animated-section";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getFeaturedCategories } from "@/lib/data";
import { localizedName } from "@/lib/event-type-i18n";
import type { Locale } from "@/i18n/routing";

interface FeaturedProjectsProps {
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  viewAllText?: string | null;
}

export async function FeaturedProjects(props: FeaturedProjectsProps) {
  const categories = await getFeaturedCategories(4);

  if (!categories.length) return null;

  return (
    <FeaturedProjectsView categories={categories} {...props} />
  );
}

function FeaturedProjectsView({
  categories,
  eyebrow,
  title,
  subtitle,
  viewAllText,
}: FeaturedProjectsProps & {
  categories: Awaited<ReturnType<typeof getFeaturedCategories>>;
}) {
  const t = useTranslations("featured");
  const locale = useLocale() as Locale;

  return (
    <section className="bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <AnimatedSection className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-4">{eyebrow || t("eyebrow")}</p>
            <h2 className="font-serif text-4xl sm:text-5xl">{title || t("title")}</h2>
            <p className="mt-3 max-w-md text-muted-foreground">{subtitle || t("subtitle")}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/portfolio">{viewAllText || t("viewAll")}</Link>
          </Button>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ eventType, cover }, i) => {
            const name = localizedName(eventType, locale);
            return (
              <AnimatedSection key={eventType.id} delay={i * 0.08}>
                <Link href={{ pathname: "/portfolio/[category]", params: { category: eventType.slug } }} className="group block">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-beige">
                    {cover ? (
                      <Image
                        src={cover.url}
                        alt={name}
                        fill
                        priority={i < 2}
                        quality={90}
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
                        <PlaceholderImage />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-serif text-xl text-foreground">{name}</h3>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

