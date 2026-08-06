"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, GalleryVerticalEnd, Settings, Inbox, LogOut, ExternalLink, Home } from "lucide-react";

import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";
import { SITE_NAME } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/admin", label: "Обзор", icon: LayoutDashboard },
  { href: "/admin/homepage", label: "Главная страница", icon: Home },
  { href: "/admin/projects", label: "Проекты", icon: GalleryVerticalEnd },
  { href: "/admin/submissions", label: "Заявки", icon: Inbox },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card px-5 py-8">
      <Link href="/admin" className="font-sans text-lg font-semibold">
        {SITE_NAME}
      </Link>
      <p className="mb-8 mt-1 text-xs text-muted-foreground">Панель управления</p>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-accent/15 text-accent-foreground font-medium"
                  : "text-foreground/70 hover:bg-muted"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="mb-2 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-muted"
      >
        <ExternalLink className="size-4" />
        Открыть сайт
      </a>

      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-muted"
        >
          <LogOut className="size-4" />
          Выйти
        </button>
      </form>
    </aside>
  );
}
