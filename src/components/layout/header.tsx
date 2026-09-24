"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { localizedName } from "@/lib/event-type-i18n";
import { LocaleSwitcher } from "./locale-switcher";
import { SITE_NAME } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";
import type { EventType } from "@/types";

export function Header({ eventTypes }: { eventTypes: EventType[] }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !open;

  const servicesHref = `${locale === routing.defaultLocale ? "" : `/${locale}`}/#services`;

  const links = [
    { href: "/portfolio" as const, label: t("portfolio") },
    { href: "/contact" as const, label: t("contact") },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        transparent ? "bg-transparent" : "border-b border-border/60 bg-background/95 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center">
          <Image
            src="/exclusive.jpg"
            alt={SITE_NAME}
            width={160}
            height={40}
            priority
            className="h-9 w-auto rounded-sm object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          <Link
            href="/"
            className={cn(
              "text-sm uppercase tracking-[0.15em] transition-colors",
              transparent ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-foreground"
            )}
          >
            {t("home")}
          </Link>
          <a
            href={servicesHref}
            className={cn(
              "text-sm uppercase tracking-[0.15em] transition-colors",
              transparent ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-foreground"
            )}
          >
            {t("services")}
          </a>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm uppercase tracking-[0.15em] transition-colors",
                transparent
                  ? "text-white/90 hover:text-white"
                  : "text-foreground/80 hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <LocaleSwitcher transparent={transparent} />
        </div>

        <button
          type="button"
          aria-label={open ? t("close") : t("menu")}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "z-50 lg:hidden",
            transparent ? "text-white" : "text-foreground"
          )}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-0 z-40 flex h-dvh flex-col justify-center gap-8 bg-ink px-8 text-cream lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/" className="font-serif text-4xl tracking-wide">
                {t("home")}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
            >
              <a href={servicesHref} className="font-serif text-4xl tracking-wide">
                {t("services")}
              </a>
            </motion.div>

            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i + 0.26 }}
              >
                <Link
                  href={link.href}
                  className="font-serif text-4xl tracking-wide"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-6 flex flex-wrap gap-3"
            >
              {eventTypes.map((eventType) => (
                <Link
                  key={eventType.id}
                  href={{ pathname: "/portfolio/[category]", params: { category: eventType.slug } }}
                  className="border border-cream/30 px-4 py-2 text-xs uppercase tracking-widest text-cream/80"
                >
                  {localizedName(eventType, locale)}
                </Link>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <LocaleSwitcher transparent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
