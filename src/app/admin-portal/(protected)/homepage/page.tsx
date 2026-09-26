import { getSettingsAdmin, getWinterLocationPhotosAdmin, getPricingPackagesAdmin } from "@/lib/admin-data";
import { updateHomepageSettings } from "@/actions/homepage";
import { CoverImageField } from "@/components/admin/cover-image-field";
import { WinterLocationsManager } from "@/components/admin/winter-locations-manager";
import { PricingManager } from "@/components/admin/pricing-manager";
import { LocalizedTextField } from "@/components/admin/localized-text-field";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FALLBACK_SETTINGS } from "@/lib/constants";

/** Displays a current value that is no longer editable from this form, for reference only. */
function ReadOnlyField({ label, value }: { label: string; value?: string | null }) {
  return (
    <p className="text-sm">
      <span className="font-medium">{label}:</span>{" "}
      <span className="text-muted-foreground">{value || "—"}</span>
    </p>
  );
}

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

          <LocalizedTextField label="Описание" name="instant_printing_description" value={settings.instant_printing_description} valueRo={settings.instant_printing_description_ro} valueEn={settings.instant_printing_description_en} rows={3} />
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

