"use client";

import { useTranslations } from "next-intl";
import { Printer, Check, Sparkles } from "lucide-react";

import { AnimatedSection } from "@/components/shared/animated-section";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function InstantPrinting() {
  const t = useTranslations("instantPrinting");
  const points = [t("point1"), t("point2"), t("point3")];

  return (
    <section className="relative overflow-hidden bg-ink py-24 text-cream lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(171,138,92,0.3),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(171,138,92,0.2),transparent_50%)]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2 lg:gap-24 lg:px-10">
        <AnimatedSection>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-accent">
            <Sparkles className="size-3.5" />
            {t("badge")}
          </span>

          <p className="eyebrow mb-4 text-cream/70">{t("eyebrow")}</p>
          <h2 className="font-serif text-4xl leading-tight sm:text-5xl">{t("title")}</h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-cream/80">
            {t("description")}
          </p>

          <ul className="mt-8 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-cream/85">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <Button asChild size="lg" variant="gold" className="mt-10">
            <Link href="/contact">{t("cta")}</Link>
          </Button>
        </AnimatedSection>

        <AnimatedSection delay={0.15} className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-cream/15 bg-gradient-to-br from-[#4a3f32] via-[#2b2520] to-[#1c1712]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex size-28 items-center justify-center rounded-full border border-accent/40 bg-accent/10 backdrop-blur-sm">
                <Printer className="size-12 text-accent" />
              </div>
            </div>
            <div className="absolute inset-x-10 bottom-10 h-24 rounded-sm border border-cream/20 bg-cream/5 shadow-2xl backdrop-blur-sm" />
            <div className="absolute inset-x-16 bottom-16 h-24 rotate-3 rounded-sm border border-cream/25 bg-cream/10 shadow-2xl backdrop-blur-sm" />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
