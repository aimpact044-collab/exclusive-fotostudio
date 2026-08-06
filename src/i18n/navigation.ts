import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Lightweight wrappers around Next.js navigation APIs that are aware of the
 * locale routing configuration. Use these instead of `next/link` and
 * `next/navigation` anywhere inside the localized `[locale]` segment.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
