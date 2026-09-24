import { getSettingsAdmin, getWinterLocationPhotosAdmin, getPricingPackagesAdmin } from "@/lib/admin-data";
import { updateHomepageSettings } from "@/actions/homepage";
import { CoverImageField } from "@/components/admin/cover-image-field";
import { WinterLocationsManager } from "@/components/admin/winter-locations-manager";
import { PricingManager } from "@/components/admin/pricing-manager";
import { LocalizedTextField } from "@/components/admin/localized-text-field";
import { LocalizedListField } from "@/components/admin/localized-list-field";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FALLBACK_SETTINGS } from "@/lib/constants";

export default async function AdminHomepagePage() {
  const settings = (await getSettingsAdmin()) ?? { id: 1, updated_at: "", ...FALLBACK_SETTINGS };
  const winterLocationPhotos = await getWinterLocationPhotosAdmin();
  const pricingPackages = await getPricingPackagesAdmin();

  const sectionToggles = [
    {
      name: "show_services",
      label: "Типы событий",
      description: "Секция со списком типов событий, их описанием и ценой",
      checked: settings.show_services,
    },
    {
      name: "show_instant_printing",
      label: "Мгновенная печать фотографий",
      description: "Премиальная секция об услуге печати фото на мероприятии",
      checked: settings.show_instant_printing,
    },
    {
      name: "show_winter_locations",
      label: "Зимние локации",
      description: "Секция о сезонных зимних локациях для фотосессий",
      checked: settings.show_winter_locations,
    },
    {
      name: "show_featured_projects",
      label: "Избранные проекты",
      description: "Подборка проектов из портфолио",
      checked: settings.show_featured_projects,
    },
    {
      name: "show_pricing",
      label: "Тарифы",
      description: "Секция с пакетами услуг и ценами",
      checked: settings.show_pricing,
    },
  ] as const;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-sans text-2xl font-semibold">Главная страница</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Все тексты ниже необязательны — если оставить поле пустым, используется текст по умолчанию. Каждое поле можно заполнить на русском, румынском и английском языках.
      </p>

      <form action={updateHomepageSettings} className="mt-8 space-y-6">
        <section className="space-y-4 border border-border bg-card p-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Главное изображение (Hero)
          </h2>

          <div className="space-y-2">
            <Label>Фоновое изображение</Label>
            <CoverImageField
              initialUrl={settings.hero_image_url}
              initialPublicId={settings.hero_image_public_id}
              urlFieldName="hero_image_url"
              publicIdFieldName="hero_image_public_id"
              label="Загрузить изображение"
              removeLabel="Удалить изображение"
              aspectClassName="aspect-[16/9]"
            />
            <p className="text-xs text-muted-foreground">
              Если изображение не загружено, отображается фон по умолчанию.
            </p>
          </div>

          <LocalizedTextField
            label="Заголовок"
            name="hero_title"
            value={settings.hero_title}
            valueRo={settings.hero_title_ro}
            valueEn={settings.hero_title_en}
            placeholder="Оставьте пустым, чтобы использовать заголовок по умолчанию"
          />
          <LocalizedTextField
            label="Подзаголовок"
            name="hero_subtitle"
            value={settings.hero_subtitle}
            valueRo={settings.hero_subtitle_ro}
            valueEn={settings.hero_subtitle_en}
            placeholder="Оставьте пустым, чтобы использовать подзаголовок по умолчанию"
          />
        </section>

        <section className="space-y-4 border border-border bg-card p-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Секция «Избранные проекты»
          </h2>
          <LocalizedTextField label="Рубрика" name="featured_eyebrow" value={settings.featured_eyebrow} valueRo={settings.featured_eyebrow_ro} valueEn={settings.featured_eyebrow_en} rows={1} />
          <LocalizedTextField label="Заголовок" name="featured_title" value={settings.featured_title} valueRo={settings.featured_title_ro} valueEn={settings.featured_title_en} />
          <LocalizedTextField label="Подзаголовок" name="featured_subtitle" value={settings.featured_subtitle} valueRo={settings.featured_subtitle_ro} valueEn={settings.featured_subtitle_en} />
          <LocalizedTextField label="Ссылка «Всё портфолио»" name="featured_view_all" value={settings.featured_view_all} valueRo={settings.featured_view_all_ro} valueEn={settings.featured_view_all_en} rows={1} />
        </section>

        <section className="space-y-4 border border-border bg-card p-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Секция «Мгновенная печать фотографий»
          </h2>

          <div className="space-y-2">
            <Label>Изображение</Label>
            <CoverImageField
              initialUrl={settings.instant_printing_image_url}
              initialPublicId={settings.instant_printing_image_public_id}
              urlFieldName="instant_printing_image_url"
              publicIdFieldName="instant_printing_image_public_id"
              label="Загрузить изображение"
              removeLabel="Удалить изображение"
              aspectClassName="aspect-[4/5]"
            />
            <p className="text-xs text-muted-foreground">
              Если изображение не загружено, отображается графика по умолчанию (иконка принтера).
            </p>
          </div>

          <LocalizedTextField label="Бейдж" name="instant_printing_badge" value={settings.instant_printing_badge} valueRo={settings.instant_printing_badge_ro} valueEn={settings.instant_printing_badge_en} rows={1} />
          <LocalizedTextField label="Рубрика" name="instant_printing_eyebrow" value={settings.instant_printing_eyebrow} valueRo={settings.instant_printing_eyebrow_ro} valueEn={settings.instant_printing_eyebrow_en} rows={1} />
          <LocalizedTextField label="Заголовок" name="instant_printing_title" value={settings.instant_printing_title} valueRo={settings.instant_printing_title_ro} valueEn={settings.instant_printing_title_en} />
          <LocalizedTextField label="Описание" name="instant_printing_description" value={settings.instant_printing_description} valueRo={settings.instant_printing_description_ro} valueEn={settings.instant_printing_description_en} rows={3} />
          <LocalizedListField label="Пункты списка" name="instant_printing_points" value={settings.instant_printing_points} valueRo={settings.instant_printing_points_ro} valueEn={settings.instant_printing_points_en} rows={3} />
          <LocalizedTextField label="Текст кнопки" name="instant_printing_cta" value={settings.instant_printing_cta} valueRo={settings.instant_printing_cta_ro} valueEn={settings.instant_printing_cta_en} rows={1} />
        </section>

        <section className="space-y-4 border border-border bg-card p-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Секция «Зимние локации»
          </h2>
          <LocalizedTextField label="Рубрика" name="winter_eyebrow" value={settings.winter_eyebrow} valueRo={settings.winter_eyebrow_ro} valueEn={settings.winter_eyebrow_en} rows={1} />
          <LocalizedTextField label="Заголовок" name="winter_title" value={settings.winter_title} valueRo={settings.winter_title_ro} valueEn={settings.winter_title_en} />
          <LocalizedTextField label="Описание" name="winter_description" value={settings.winter_description} valueRo={settings.winter_description_ro} valueEn={settings.winter_description_en} rows={3} />
          <LocalizedTextField label="Текст кнопки" name="winter_cta" value={settings.winter_cta} valueRo={settings.winter_cta_ro} valueEn={settings.winter_cta_en} rows={1} />
          <p className="text-xs text-muted-foreground">
            Фотографии зимних локаций загружаются ниже, в разделе «Зимние локации — фото зон».
          </p>
        </section>

        <section className="space-y-4 border border-border bg-card p-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Секция «О команде»
          </h2>
          <LocalizedTextField label="Рубрика" name="about_eyebrow" value={settings.about_eyebrow} valueRo={settings.about_eyebrow_ro} valueEn={settings.about_eyebrow_en} rows={1} />
          <LocalizedTextField label="Заголовок" name="about_title" value={settings.about_title} valueRo={settings.about_title_ro} valueEn={settings.about_title_en} />
          <LocalizedTextField label="Описание" name="about_description" value={settings.about_description} valueRo={settings.about_description_ro} valueEn={settings.about_description_en} rows={4} />
          <LocalizedListField
            label="Значения статистики (например, «10+ лет»)"
            name="about_stat_values"
            value={settings.about_stat_values}
            valueRo={settings.about_stat_values_ro}
            valueEn={settings.about_stat_values_en}
            rows={3}
            placeholder={"10+ лет\n300+\n5"}
          />
          <LocalizedListField
            label="Подписи статистики (в том же порядке, что значения выше)"
            name="about_stat_labels"
            value={settings.about_stat_labels}
            valueRo={settings.about_stat_labels_ro}
            valueEn={settings.about_stat_labels_en}
            rows={3}
            placeholder={"опыта в свадебной съёмке\nснятых историй\nчеловек в команде"}
          />
          <LocalizedTextField label="Текст кнопки" name="about_cta" value={settings.about_cta} valueRo={settings.about_cta_ro} valueEn={settings.about_cta_en} rows={1} />
        </section>

        <section className="space-y-4 border border-border bg-card p-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Секция «Расскажите нам о своём торжестве» (перед подвалом)
          </h2>
          <LocalizedTextField label="Рубрика" name="contact_cta_eyebrow" value={settings.contact_cta_eyebrow} valueRo={settings.contact_cta_eyebrow_ro} valueEn={settings.contact_cta_eyebrow_en} rows={1} />
          <LocalizedTextField label="Заголовок" name="contact_cta_title" value={settings.contact_cta_title} valueRo={settings.contact_cta_title_ro} valueEn={settings.contact_cta_title_en} />
          <LocalizedTextField label="Подзаголовок" name="contact_cta_subtitle" value={settings.contact_cta_subtitle} valueRo={settings.contact_cta_subtitle_ro} valueEn={settings.contact_cta_subtitle_en} rows={3} />
          <LocalizedTextField label="Текст кнопки" name="contact_cta_button" value={settings.contact_cta_button} valueRo={settings.contact_cta_button_ro} valueEn={settings.contact_cta_button_en} rows={1} />
        </section>

        <section className="space-y-5 border border-border bg-card p-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Видимость секций
          </h2>

          {sectionToggles.map((toggle) => (
            <label key={toggle.name} className="flex items-center justify-between gap-4">
              <span>
                <span className="block text-sm font-medium">{toggle.label}</span>
                <span className="block text-xs text-muted-foreground">{toggle.description}</span>
              </span>
              <Switch name={toggle.name} defaultChecked={toggle.checked} />
            </label>
          ))}
        </section>

        <section className="space-y-4 border border-border bg-card p-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Зимние локации — фото зон
          </h2>
          <p className="text-xs text-muted-foreground">
            Загрузите фотографии зимних локаций и включайте/выключайте каждую отдельно — они появятся в секции «Зимний сезон» на главной странице (если сама секция включена выше).
          </p>
          <WinterLocationsManager photos={winterLocationPhotos} />
        </section>

        <Button type="submit" size="lg">
          Сохранить изменения
        </Button>
      </form>

      <section className="mt-6 space-y-4 border border-border bg-card p-6">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Тарифы — пакеты услуг
        </h2>
        <p className="text-xs text-muted-foreground">
          Пакеты (например, Classic и Premium) появятся в секции «Тарифы» на главной странице (если сама секция включена выше). Изменения здесь сохраняются сразу, без кнопки «Сохранить» выше.
        </p>
        <PricingManager packages={pricingPackages} />
      </section>
    </div>
  );
}

