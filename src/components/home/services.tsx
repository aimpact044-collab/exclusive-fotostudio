"use client";

import { useTranslations } from "next-intl";
import {
  Camera,
  Video,
  HeartHandshake,
  Baby,
  Users,
  Aperture,
  Film,
  Heart,
} from "lucide-react";

import { AnimatedSection } from "@/components/shared/animated-section";
import { SERVICE_ITEM_KEYS } from "@/lib/constants";

const SERVICE_ICONS: Record<(typeof SERVICE_ITEM_KEYS)[number], typeof Camera> = {
  weddingPhoto: Camera,
  weddingVideo: Video,
  cumatrii: HeartHandshake,
  baptisms: Baby,
  loveStory: Heart,
  familySessions: Users,
  individualSessions: Aperture,
  eventPhoto: Camera,
  eventVideo: Film,
};

const SESSION_TYPES = ["individual", "couple", "family", "pregnancy", "seasonal"] as const;

export function Services({ prices }: { prices?: Record<string, string> | null }) {
  const t = useTranslations("services");

  return (
    <section id="services" className="scroll-mt-24 bg-secondary/50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <AnimatedSection className="mx-auto mb-16 max-w-2xl text-center">
        <p className="eyebrow mb-4">{t("eyebrow")}</p>
        <h2 className="font-serif text-4xl leading-tight sm:text-5xl">{t("title")}</h2>
        <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_ITEM_KEYS.map((key, i) => {
          const Icon = SERVICE_ICONS[key];
          const price = prices?.[key];
          return (
            <AnimatedSection key={key} delay={i * 0.05} className="flex flex-col items-start gap-4">
              <div className="flex size-12 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                <Icon className="size-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl">{t(`items.${key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`items.${key}.description`)}
                </p>
                {price && (
                  <p className="mt-3 text-2xl font-serif font-semibold tracking-wide text-accent">{price}</p>
                )}
              </div>
            </AnimatedSection>
          );
        })}
      </div>

      <AnimatedSection
        delay={0.15}
        className="mt-20 border-t border-border pt-14 text-center"
      >
        <p className="eyebrow mb-4">{t("sessionsEyebrow")}</p>
        <h3 className="font-serif text-3xl leading-tight sm:text-4xl">{t("sessionsTitle")}</h3>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">{t("sessionsSubtitle")}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {SESSION_TYPES.map((type) => (
            <span
              key={type}
              className="rounded-full border border-border bg-card px-5 py-2 text-sm tracking-wide text-foreground/80"
            >
              {t(`sessionTypes.${type}`)}
            </span>
          ))}
        </div>
      </AnimatedSection>
      </div>
    </section>
  );
}
