"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { HeroPlaceholder } from "@/components/home/hero-placeholder";

interface HeroProps {
  imageUrl?: string | null;
  title?: string | null;
  subtitle?: string | null;
  ctaText?: string | null;
  ctaHref?: string | null;
}

export function Hero({ imageUrl, title, subtitle, ctaText, ctaHref }: HeroProps) {
  const t = useTranslations("hero");
  const lines = (title || t("title")).split("\n");
  const subtitleText = subtitle || t("subtitle");
  const primaryCtaText = ctaText || t("ctaPrimary");
  const primaryCtaHref = ctaHref || "/portfolio";

  return (
    <section className="relative flex h-dvh min-h-[640px] w-full items-center justify-center overflow-hidden bg-ink">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover"
        />
      ) : (
        <HeroPlaceholder />
      )}

      <motion.div
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4, ease: "easeOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(171,138,92,0.3),transparent_60%)]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center text-cream">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mb-6 text-xs uppercase tracking-[0.35em] text-cream/80"
        >
          {t("eyebrow")}
        </motion.p>

        <h1 className="font-serif text-5xl leading-[1.1] sm:text-6xl md:text-7xl">
          {lines.map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.8, ease: "easeOut" }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mt-6 max-w-xl text-balance text-base text-cream/85 sm:text-lg"
        >
          {subtitleText}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button asChild size="lg" variant="gold">
            <a href={primaryCtaHref}>{primaryCtaText}</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-cream/40 text-cream hover:bg-cream hover:text-ink"
          >
            <Link href="/contact">{t("ctaSecondary")}</Link>
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-cream/70"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">{t("scroll")}</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <ChevronDown className="size-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
