import { notFound } from "next/navigation";

import { getProjectByIdAdmin } from "@/lib/admin-data";
import { ProjectForm } from "@/components/admin/project-form";
import { GalleryManager } from "@/components/admin/gallery-manager";
import { updateProject } from "@/actions/projects";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectByIdAdmin(id);

  if (!project) {
    notFound();
  }

  const updateWithId = updateProject.bind(null, project.id);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-sans text-2xl font-semibold">{project.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Редактирование проекта</p>

      <div className="mt-8">
        <ProjectForm action={updateWithId} project={project} />
      </div>

      <div className="mt-10 border border-border bg-card p-6">
        <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Фотогалерея
        </h2>
        <GalleryManager projectId={project.id} photos={project.photos ?? []} />
      </div>
    </div>
  );
}
