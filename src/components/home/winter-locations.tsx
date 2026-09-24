import { useTranslations } from "next-intl";
import Image from "next/image";
import { Snowflake } from "lucide-react";

import { AnimatedSection } from "@/components/shared/animated-section";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getWinterLocationPhotos } from "@/lib/data";
import type { WinterLocationPhoto } from "@/types";

interface WinterLocationsProps {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  ctaText?: string | null;
}

export async function WinterLocations(props: WinterLocationsProps) {
  const photos = await getWinterLocationPhotos();
  return <WinterLocationsView photos={photos} {...props} />;
}

function WinterLocationsView({
  photos,
  eyebrow,
  title,
  description,
  ctaText,
}: WinterLocationsProps & { photos: WinterLocationPhoto[] }) {
  const t = useTranslations("winterLocations");

  return (
    <section className="relative overflow-hidden bg-cream py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(171,138,92,0.12),transparent_60%)]" />

      <AnimatedSection className="relative mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
        <div className="mb-6 flex size-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
          <Snowflake className="size-6" />
        </div>
        <p className="eyebrow mb-4">{eyebrow || t("eyebrow")}</p>
        <h2 className="font-serif text-4xl leading-tight sm:text-5xl">{title || t("title")}</h2>
        <p className="mx-auto mt-5 max-w-lg text-muted-foreground">{description || t("description")}</p>
        <Button asChild size="lg" variant="outline" className="mt-10">
          <Link href="/contact">{ctaText || t("cta")}</Link>
        </Button>
      </AnimatedSection>

      {photos.length > 0 && (
        <div className="relative mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 px-6 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((photo, i) => (
            <AnimatedSection
              key={photo.id}
              delay={i * 0.05}
              className="relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={photo.url}
                alt=""
                fill
                quality={90}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </AnimatedSection>
          ))}
        </div>
      )}
    </section>
  );
}
