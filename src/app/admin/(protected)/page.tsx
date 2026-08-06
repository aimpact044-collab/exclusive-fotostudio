import Link from "next/link";
import { GalleryVerticalEnd, Inbox, Eye, EyeOff } from "lucide-react";

import { getAllProjectsAdmin, getSubmissions } from "@/lib/admin-data";
import { SITE_NAME } from "@/lib/constants";

export default async function AdminDashboardPage() {
  const [projects, submissions] = await Promise.all([
    getAllProjectsAdmin(),
    getSubmissions(),
  ]);

  const published = projects.filter((p) => p.is_published).length;
  const unread = submissions.filter((s) => !s.is_read).length;

  const cards = [
    {
      label: "Опубликованные проекты",
      value: `${published} / ${projects.length}`,
      icon: GalleryVerticalEnd,
      href: "/admin/projects",
    },
    {
      label: "Новые заявки",
      value: unread,
      icon: Inbox,
      href: "/admin/submissions",
    },
  ];

  return (
    <div>
      <h1 className="font-sans text-2xl font-semibold">Обзор</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Краткая сводка по сайту {SITE_NAME}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="flex items-center gap-4 border border-border bg-card p-6 transition-colors hover:border-accent"
          >
            <card.icon className="size-8 text-accent" />
            <div>
              <p className="text-2xl font-semibold">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-sans text-lg font-semibold">Последние проекты</h2>
          <Link href="/admin/projects" className="text-sm text-accent hover:underline">
            Все проекты
          </Link>
        </div>
        <div className="divide-y divide-border border border-border bg-card">
          {projects.slice(0, 5).map((project) => (
            <div key={project.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <div className="flex items-center gap-2">
                {project.is_published ? (
                  <Eye className="size-4 text-accent" />
                ) : (
                  <EyeOff className="size-4 text-muted-foreground" />
                )}
                <span>{project.title}</span>
              </div>
              <Link href={`/admin/projects/${project.id}`} className="text-accent hover:underline">
                Редактировать
              </Link>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="px-5 py-6 text-sm text-muted-foreground">
              Проектов пока нет. Создайте первый в разделе «Проекты».
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
