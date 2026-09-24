"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Tags, Settings, Inbox, LogOut, ExternalLink, Home } from "lucide-react";

import { cn } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";
import { SITE_NAME } from "@/lib/constants";

const NAV_ITEMS = [
  { href: "/admin-portal/homepage", label: "Главная страница", icon: Home },
  { href: "/admin-portal/event-types", label: "Категории", icon: Tags },
  { href: "/admin-portal/submissions", label: "Заявки", icon: Inbox },
  { href: "/admin-portal/settings", label: "Настройки", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card px-5 py-8">
      <Link href="/admin-portal/event-types" className="flex items-center">
        <Image
          src="/exclusive.jpg"
          alt={SITE_NAME}
          width={160}
          height={40}
          className="h-9 w-auto rounded-sm object-contain"
        />
      </Link>
      <p className="mb-8 mt-1 text-xs text-muted-foreground">Панель управления</p>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
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
