"use client";

import { useLocale, useTranslations } from "next-intl";

import { AnimatedSection } from "@/components/shared/animated-section";
import { localizedName, localizedDescription } from "@/lib/event-type-i18n";
import type { Locale } from "@/i18n/routing";
import type { EventType } from "@/types";

export function Services({ eventTypes }: { eventTypes: EventType[] }) {
  const t = useTranslations("services");
  const locale = useLocale() as Locale;

  if (!eventTypes.length) return null;

  return (
    <section id="services" className="scroll-mt-24 bg-secondary/50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <AnimatedSection className="mx-auto mb-16 max-w-2xl text-center">
        <p className="eyebrow mb-4">{t("eyebrow")}</p>
        <h2 className="font-serif text-4xl leading-tight sm:text-5xl">{t("title")}</h2>
        <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
      </AnimatedSection>

      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {eventTypes.map((eventType, i) => {
          const description = localizedDescription(eventType, locale);
          return (
            <AnimatedSection key={eventType.id} delay={i * 0.05} className="flex flex-col items-start gap-4">
              <div>
                <h3 className="font-serif text-xl">{localizedName(eventType, locale)}</h3>
                {description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                )}
                {eventType.price && (
                  <p className="mt-2 text-sm font-medium text-accent">{eventType.price}</p>
                )}
              </div>
            </AnimatedSection>
          );
        })}
      </div>
      </div>
    </section>
  );
}

