import { useLocale, useTranslations } from "next-intl";
import { Check, Star } from "lucide-react";

import { AnimatedSection } from "@/components/shared/animated-section";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { localizedPricingName, localizedPricingFeatures } from "@/lib/pricing-i18n";
import type { Locale } from "@/i18n/routing";
import type { PricingPackage } from "@/types";

export function Pricing({ packages }: { packages: PricingPackage[] }) {
  const t = useTranslations("pricing");
  const locale = useLocale() as Locale;

  if (!packages.length) return null;

  const basePackage = packages.find((pkg) => !pkg.is_featured);
  const baseFeatures = new Set(basePackage ? localizedPricingFeatures(basePackage, locale) : []);

  return (
    <section id="pricing" className="scroll-mt-24 bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <AnimatedSection className="mx-auto mb-16 max-w-2xl text-center">
          <p className="eyebrow mb-4">{t("eyebrow")}</p>
          <h2 className="font-serif text-4xl leading-tight sm:text-5xl">{t("title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
        </AnimatedSection>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
          {packages.map((pkg, i) => {
            const features = localizedPricingFeatures(pkg, locale);
            return (
              <AnimatedSection
                key={pkg.id}
                delay={i * 0.05}
                className={cn(
                  "flex flex-col border p-8",
                  pkg.is_featured ? "border-accent bg-accent/5" : "border-border bg-card"
                )}
              >
                {pkg.is_featured && (
                  <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs uppercase tracking-widest text-accent-foreground">
                    <Star className="size-3.5" />
                    {t("featured")}
                  </span>
                )}
                <h3 className="font-serif text-2xl">{localizedPricingName(pkg, locale)}</h3>
                {pkg.price && <p className="mt-2 text-lg text-accent">{pkg.price}</p>}

                <ul className="mt-6 flex-1 space-y-3">
                  {features.map((feature, idx) => {
                    const isExclusiveToThisPackage = pkg.is_featured && !baseFeatures.has(feature);
                    return (
                      <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <Check
                          className={cn(
                            "mt-0.5 size-4 shrink-0",
                            isExclusiveToThisPackage ? "text-accent" : "text-accent/70"
                          )}
                        />
                        <span className={isExclusiveToThisPackage ? "font-medium text-foreground" : undefined}>
                          {feature}
                          {isExclusiveToThisPackage && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">
                              {t("premiumOnly")}
                            </span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <Button asChild size="lg" variant={pkg.is_featured ? "gold" : "outline"} className="mt-8">
                  <Link href="/contact">{t("cta")}</Link>
                </Button>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
