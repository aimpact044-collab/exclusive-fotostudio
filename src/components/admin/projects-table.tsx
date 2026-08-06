"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { togglePublish, deleteProject } from "@/actions/projects";
import type { Project } from "@/types";

export function ProjectsTable({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = (project: Project) => {
    startTransition(async () => {
      try {
        await togglePublish(project.id, !project.is_published);
        router.refresh();
      } catch {
        toast.error("Не удалось изменить статус публикации");
      }
    });
  };

  const handleDelete = (project: Project) => {
    if (!confirm(`Удалить проект «${project.title}»? Это действие необратимо.`)) return;
    startTransition(async () => {
      try {
        await deleteProject(project.id);
        toast.success("Проект удалён");
        router.refresh();
      } catch {
        toast.error("Не удалось удалить проект");
      }
    });
  };

  if (!projects.length) {
    return (
      <p className="border border-border bg-card px-5 py-10 text-center text-sm text-muted-foreground">
        Проектов пока нет.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th className="px-5 py-3 font-medium">Название</th>
            <th className="px-5 py-3 font-medium">Категория</th>
            <th className="px-5 py-3 font-medium">Дата</th>
            <th className="px-5 py-3 font-medium">Опубликован</th>
            <th className="px-5 py-3 font-medium text-right">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="px-5 py-3">{project.title}</td>
              <td className="px-5 py-3 text-muted-foreground">{project.category}</td>
              <td className="px-5 py-3 text-muted-foreground">
                {project.event_date ?? "—"}
              </td>
              <td className="px-5 py-3">
                <Switch
                  checked={project.is_published}
                  disabled={isPending}
                  onCheckedChange={() => handleToggle(project)}
                />
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-2">
                  <Button asChild size="icon" variant="ghost">
                    <Link href={`/admin/projects/${project.id}`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={isPending}
                    onClick={() => handleDelete(project)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
