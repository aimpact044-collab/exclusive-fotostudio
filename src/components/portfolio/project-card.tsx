import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";

import { Link } from "@/i18n/navigation";
import { localize } from "@/lib/data";
import { PlaceholderImage } from "@/components/shared/placeholder-image";
import type { Project } from "@/types";

export function ProjectCard({
  project,
  locale,
  priority = false,
}: {
  project: Project;
  locale: Locale;
  priority?: boolean;
}) {
  const tCategories = useTranslations("categories");
  const { title } = localize(project, locale);

  return (
    <Link
      href={{
        pathname: "/portfolio/[category]/[slug]",
        params: { category: project.category, slug: project.slug },
      }}
      className="group block"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-beige">
        {project.cover_url ? (
          <Image
            src={project.cover_url}
            alt={title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="transition-transform duration-700 ease-out group-hover:scale-105 h-full w-full">
            <PlaceholderImage category={project.category} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-1">{tCategories(project.category)}</p>
          <h3 className="font-serif text-xl text-foreground">{title}</h3>
        </div>
      </div>
    </Link>
  );
}
