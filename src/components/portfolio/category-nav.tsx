import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { localizedName } from "@/lib/event-type-i18n";
import type { Locale } from "@/i18n/routing";
import type { EventType } from "@/types";

export function CategoryNav({
  eventTypes,
  active,
}: {
  eventTypes: EventType[];
  active?: string;
}) {
  const t = useTranslations("portfolio");
  const locale = useLocale() as Locale;

  return (
    <div className="border-b border-border pb-6">
      <nav className="flex flex-wrap gap-x-8 gap-y-3">
        <Link
          href="/portfolio"
          className={cn(
            "text-sm uppercase tracking-[0.15em] transition-colors",
            !active ? "text-accent" : "text-foreground/60 hover:text-foreground"
          )}
        >
          {t("all")}
        </Link>
        {eventTypes.map((eventType) => (
          <Link
            key={eventType.id}
            href={{ pathname: "/portfolio/[category]", params: { category: eventType.slug } }}
            className={cn(
              "text-sm uppercase tracking-[0.15em] transition-colors",
              active === eventType.slug ? "text-accent" : "text-foreground/60 hover:text-foreground"
            )}
          >
            {localizedName(eventType, locale)}
          </Link>
        ))}
      </nav>
      <p className="mt-4 text-sm text-muted-foreground">{t("moreEvents")}</p>
    </div>
  );
}

