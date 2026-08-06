import { ProjectForm } from "@/components/admin/project-form";
import { createProject } from "@/actions/projects";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-sans text-2xl font-semibold">Новый проект</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        После сохранения вы сможете добавить фотографии в галерею.
      </p>

      <div className="mt-8">
        <ProjectForm action={createProject} />
      </div>
    </div>
  );
}
