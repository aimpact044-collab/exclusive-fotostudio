import { useTranslations } from "next-intl";

import { AnimatedSection } from "@/components/shared/animated-section";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function AboutTeam() {
  const t = useTranslations("about");

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
        <AnimatedSection>
          <p className="eyebrow mb-4">{t("eyebrow")}</p>
          <h2 className="max-w-md font-serif text-4xl leading-tight sm:text-5xl">
            {t("title")}
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15} className="flex flex-col justify-between gap-10">
          <p className="prose-measure text-base leading-relaxed text-muted-foreground">
            {t("description")}
          </p>

          <div className="grid grid-cols-3 gap-6 border-t border-border pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-2xl text-accent sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <Button asChild variant="outline" size="lg" className="w-fit">
            <Link href="/contact">{t("cta")}</Link>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
}
