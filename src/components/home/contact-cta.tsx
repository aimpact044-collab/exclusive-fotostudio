import { useTranslations } from "next-intl";

import { AnimatedSection } from "@/components/shared/animated-section";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

interface ContactCtaProps {
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  ctaText?: string | null;
}

export function ContactCta({ eyebrow, title, subtitle, ctaText }: ContactCtaProps) {
  const t = useTranslations("contactSection");

  return (
    <section className="relative overflow-hidden bg-ink py-24 text-cream lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(171,138,92,0.25),transparent_55%)]" />
      <AnimatedSection className="relative mx-auto max-w-2xl px-6 text-center">
        <p className="eyebrow mb-4 text-accent">{eyebrow || t("eyebrow")}</p>
        <h2 className="font-serif text-4xl leading-tight sm:text-5xl">{title || t("title")}</h2>
        <p className="mx-auto mt-5 max-w-lg text-cream/80">{subtitle || t("subtitle")}</p>
        <Button asChild size="lg" variant="gold" className="mt-10">
          <Link href="/contact">{ctaText || t("cta")}</Link>
        </Button>
      </AnimatedSection>
    </section>
  );
}
