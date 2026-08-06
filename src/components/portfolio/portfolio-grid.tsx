import { useTranslations } from "next-intl";

import { ProjectCard } from "@/components/portfolio/project-card";
import type { Locale } from "@/i18n/routing";
import type { Project } from "@/types";

export function PortfolioGrid({ projects, locale }: { projects: Project[]; locale: Locale }) {
  const t = useTranslations("portfolio");

  if (!projects.length) {
    return (
      <p className="py-24 text-center text-muted-foreground">{t("empty")}</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-16 pt-14 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} locale={locale} priority={i < 3} />
      ))}
    </div>
  );
}
