import { useTranslations } from "next-intl";

import { AnimatedSection } from "@/components/shared/animated-section";
import { ProjectCard } from "@/components/portfolio/project-card";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { getFeaturedProjects } from "@/lib/data";
import type { Locale } from "@/i18n/routing";

export async function FeaturedProjects({ locale }: { locale: Locale }) {
  const projects = await getFeaturedProjects(4);

  if (!projects.length) return null;

  return (
    <FeaturedProjectsView projects={projects} locale={locale} />
  );
}

function FeaturedProjectsView({
  projects,
  locale,
}: {
  projects: Awaited<ReturnType<typeof getFeaturedProjects>>;
  locale: Locale;
}) {
  const t = useTranslations("featured");

  return (
    <section className="bg-cream py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <AnimatedSection className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-4">{t("eyebrow")}</p>
            <h2 className="font-serif text-4xl sm:text-5xl">{t("title")}</h2>
            <p className="mt-3 max-w-md text-muted-foreground">{t("subtitle")}</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/portfolio">{t("viewAll")}</Link>
          </Button>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project, i) => (
            <AnimatedSection key={project.id} delay={i * 0.08}>
              <ProjectCard project={project} locale={locale} priority={i < 2} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
