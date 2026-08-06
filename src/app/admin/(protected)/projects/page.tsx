import Link from "next/link";
import { Plus } from "lucide-react";

import { getAllProjectsAdmin } from "@/lib/admin-data";
import { ProjectsTable } from "@/components/admin/projects-table";
import { Button } from "@/components/ui/button";

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-sans text-2xl font-semibold">Проекты</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Управление портфолио: создание, редактирование, публикация
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="size-4" />
            Новый проект
          </Link>
        </Button>
      </div>

      <ProjectsTable projects={projects} />
    </div>
  );
}
