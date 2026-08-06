import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/shared/page-hero";
import { CategoryNav } from "@/components/portfolio/category-nav";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";
import { getProjects } from "@/lib/data";
import { CATEGORY_SLUGS } from "@/lib/constants";
import { routing, type Locale } from "@/i18n/routing";
import type { ProjectCategory } from "@/types";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CATEGORY_SLUGS.map((category) => ({ locale, category }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; category: string }>;
}) {
  const { locale, category } = await params;
  if (!CATEGORY_SLUGS.includes(category as ProjectCategory)) return {};

  const t = await getTranslations({ locale, namespace: "categories" });
  const tPortfolio = await getTranslations({ locale, namespace: "portfolio" });
  const label = t(category as ProjectCategory);
  return { title: `${label} — ${tPortfolio("title")}` };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: Locale; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  if (!CATEGORY_SLUGS.includes(category as ProjectCategory)) {
    notFound();
  }
  const typedCategory = category as ProjectCategory;

  const t = await getTranslations({ locale, namespace: "portfolio" });
  const tCategories = await getTranslations({ locale, namespace: "categories" });
  const projects = await getProjects(typedCategory);

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={tCategories(typedCategory)}
        subtitle={t("subtitle")}
      />
      <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-10 lg:pb-32">
        <CategoryNav active={typedCategory} />
        <PortfolioGrid projects={projects} locale={locale} />
      </div>
    </>
  );
}
