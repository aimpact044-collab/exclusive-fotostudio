import { getTranslations, setRequestLocale } from "next-intl/server";
import { Phone, Mail, MapPin } from "lucide-react";

import { PageHero } from "@/components/shared/page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { getSettings, getEventTypes } from "@/lib/data";
import { localizedSetting } from "@/lib/settings-i18n";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return { title: t("title").replace("\n", " "), description: t("subtitle") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "contactPage" });
  const [settings, eventTypes] = await Promise.all([getSettings(), getEventTypes()]);

  return (
    <>
      <PageHero
        eyebrow={
          localizedSetting(settings.contact_page_eyebrow, settings.contact_page_eyebrow_ro, settings.contact_page_eyebrow_en, locale) ||
          t("eyebrow")
        }
        title={
          localizedSetting(settings.contact_page_title, settings.contact_page_title_ro, settings.contact_page_title_en, locale) ||
          t("title")
        }
        subtitle={
          localizedSetting(settings.contact_page_subtitle, settings.contact_page_subtitle_ro, settings.contact_page_subtitle_en, locale) ||
          t("subtitle")
        }
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 py-16 lg:grid-cols-5 lg:px-10 lg:py-24">
        <div className="lg:col-span-2">
          <h2 className="font-serif text-2xl">{t("infoTitle")}</h2>
          <ul className="mt-8 space-y-6 text-sm">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 text-accent" />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t("phone")}
                </p>
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="text-foreground">
                  {settings.phone}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 text-accent" />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t("email")}
                </p>
                <a href={`mailto:${settings.email}`} className="text-foreground">
                  {settings.email}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 text-accent" />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t("address")}
                </p>
                <p className="text-foreground">{settings.address}</p>
              </div>
            </li>
          </ul>

          {(settings.instagram_url || settings.facebook_url) && (
            <div className="mt-10">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {t("social")}
              </p>
              <div className="mt-3 flex gap-5 text-sm">
                {settings.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-accent"
                  >
                    Instagram
                  </a>
                )}
                {settings.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-accent"
                  >
                    Facebook
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <ContactForm eventTypes={eventTypes} />
        </div>
      </div>
    </>
  );
}
