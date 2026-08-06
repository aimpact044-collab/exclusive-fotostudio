import { useTranslations } from "next-intl";
import { Phone, Mail, MapPin } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { CATEGORY_SLUGS, SITE_NAME } from "@/lib/constants";
import { FALLBACK_SETTINGS } from "@/lib/constants";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tCategories = useTranslations("categories");

  const settings = FALLBACK_SETTINGS;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="font-serif text-2xl tracking-wide">
              {SITE_NAME}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
          </div>

          <div>
            <h3 className="eyebrow mb-4">{t("navigation")}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-foreground/80 hover:text-accent">
                  {tNav("home")}
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-foreground/80 hover:text-accent">
                  {tNav("portfolio")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/80 hover:text-accent">
                  {tNav("contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-4">{t("categories")}</h3>
            <ul className="space-y-3 text-sm">
              {CATEGORY_SLUGS.map((slug) => (
                <li key={slug}>
                  <Link
                    href={{ pathname: "/portfolio/[category]", params: { category: slug } }}
                    className="text-foreground/80 hover:text-accent"
                  >
                    {tCategories(slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-4">{t("contacts")}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-foreground/80">
                <Phone className="size-4 text-accent" />
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>
              </li>
              <li className="flex items-center gap-2 text-foreground/80">
                <Mail className="size-4 text-accent" />
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
              <li className="flex items-center gap-2 text-foreground/80">
                <MapPin className="size-4 text-accent" />
                {settings.address}
              </li>
            </ul>
            <div className="mt-5 flex gap-5 text-xs uppercase tracking-widest">
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-accent"
                >
                  Instagram
                </a>
              )}
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 hover:text-accent"
                >
                  Facebook
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {SITE_NAME}. {t("rights")}
          </p>
          <a href="/admin" className="opacity-40 hover:opacity-70">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
