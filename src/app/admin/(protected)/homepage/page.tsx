import { getSettingsAdmin, getWinterLocationPhotosAdmin } from "@/lib/admin-data";
import { updateHomepageSettings } from "@/actions/homepage";
import { CoverImageField } from "@/components/admin/cover-image-field";
import { WinterLocationsManager } from "@/components/admin/winter-locations-manager";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FALLBACK_SETTINGS, SERVICE_ITEM_KEYS, SERVICE_ITEM_LABELS } from "@/lib/constants";

export default async function AdminHomepagePage() {
  const settings = (await getSettingsAdmin()) ?? { id: 1, updated_at: "", ...FALLBACK_SETTINGS };
  const winterLocationPhotos = await getWinterLocationPhotosAdmin();

  const sectionToggles = [
    {
      name: "show_services",
      label: "Услуги",
      description: "Секция со списком услуг и фотосессий",
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
  ] as const;

  const servicePrices = settings.service_prices ?? {};

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-sans text-2xl font-semibold">Главная страница</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Обложка сайта, заголовки и видимость секций на главной странице.
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

          <div className="space-y-2">
            <Label htmlFor="hero_title">Заголовок</Label>
            <Textarea
              id="hero_title"
              name="hero_title"
              rows={2}
              placeholder="Оставьте пустым, чтобы использовать заголовок по умолчанию"
              defaultValue={settings.hero_title ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hero_subtitle">Подзаголовок</Label>
            <Textarea
              id="hero_subtitle"
              name="hero_subtitle"
              rows={2}
              placeholder="Оставьте пустым, чтобы использовать подзаголовок по умолчанию"
              defaultValue={settings.hero_subtitle ?? ""}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hero_cta_text">Текст кнопки</Label>
              <Input
                id="hero_cta_text"
                name="hero_cta_text"
                placeholder="Смотреть портфолио"
                defaultValue={settings.hero_cta_text ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero_cta_href">Ссылка кнопки</Label>
              <Input
                id="hero_cta_href"
                name="hero_cta_href"
                placeholder="/portfolio"
                defaultValue={settings.hero_cta_href ?? ""}
              />
            </div>
          </div>
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
            Цены на услуги
          </h2>
          <p className="text-xs text-muted-foreground">
            Укажите цену для отображения на сайте — можно точную сумму (например, «500 €») или диапазон
            (например, «500 € – 800 €»). Оставьте поле пустым, чтобы цена не отображалась.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {SERVICE_ITEM_KEYS.map((key) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`price_${key}`}>{SERVICE_ITEM_LABELS[key]}</Label>
                <Input
                  id={`price_${key}`}
                  name={`price_${key}`}
                  placeholder="500 € – 800 €"
                  defaultValue={servicePrices[key] ?? ""}
                />
              </div>
            ))}
          </div>
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
    </div>
  );
}
