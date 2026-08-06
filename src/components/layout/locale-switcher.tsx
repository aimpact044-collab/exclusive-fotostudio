"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  ru: "RU",
  ro: "RO",
  en: "EN",
};

export function LocaleSwitcher({ transparent = false }: { transparent?: boolean }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={cn(
        "flex items-center gap-1 text-xs font-medium tracking-widest",
        transparent ? "text-white/90" : "text-foreground/80"
      )}
    >
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center">
          {i > 0 && <span className="mx-1 opacity-40">/</span>}
          <button
            type="button"
            onClick={() =>
              router.replace(
                // @ts-expect-error -- pathname + params are validated by next-intl at runtime
                { pathname, params },
                { locale: loc }
              )
            }
            className={cn(
              "transition-opacity hover:opacity-100",
              loc === locale ? "opacity-100 underline underline-offset-4" : "opacity-60"
            )}
          >
            {LABELS[loc]}
          </button>
        </span>
      ))}
    </div>
  );
}
