import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for:
  // - /api (route handlers)
  // - /admin-portal (protected admin area, not localized)
  // - /_next (Next.js internals)
  // - files with an extension (e.g. favicon.ico, images)
  matcher: ["/((?!api|admin-portal|_next|.*\\..*).*)"],
};
