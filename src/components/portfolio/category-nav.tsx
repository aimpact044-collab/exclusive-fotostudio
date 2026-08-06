import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { CATEGORY_SLUGS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ProjectCategory } from "@/types";

export function CategoryNav({ active }: { active?: ProjectCategory }) {
  const t = useTranslations("portfolio");
  const tCategories = useTranslations("categories");

  return (
    <nav className="flex flex-wrap gap-x-8 gap-y-3 border-b border-border pb-6">
      <Link
        href="/portfolio"
        className={cn(
          "text-sm uppercase tracking-[0.15em] transition-colors",
          !active ? "text-accent" : "text-foreground/60 hover:text-foreground"
        )}
      >
        {t("all")}
      </Link>
      {CATEGORY_SLUGS.map((slug) => (
        <Link
          key={slug}
          href={{ pathname: "/portfolio/[category]", params: { category: slug } }}
          className={cn(
            "text-sm uppercase tracking-[0.15em] transition-colors",
            active === slug ? "text-accent" : "text-foreground/60 hover:text-foreground"
          )}
        >
          {tCategories(slug)}
        </Link>
      ))}
    </nav>
  );
}
