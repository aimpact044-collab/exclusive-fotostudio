import { getSettingsAdmin } from "@/lib/admin-data";
import { updateSettings } from "@/actions/settings";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FALLBACK_SETTINGS } from "@/lib/constants";

export default async function AdminSettingsPage() {
  const settings = (await getSettingsAdmin()) ?? { id: 1, updated_at: "", ...FALLBACK_SETTINGS };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-sans text-2xl font-semibold">Настройки сайта</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Контактная информация, которая отображается в шапке, подвале и на странице контактов.
      </p>

      <form action={updateSettings} className="mt-8 space-y-6 border border-border bg-card p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input id="phone" name="phone" defaultValue={settings.phone} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={settings.email} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Адрес / локация</Label>
          <Input id="address" name="address" defaultValue={settings.address} required />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="instagram_url">Instagram (ссылка)</Label>
            <Input id="instagram_url" name="instagram_url" defaultValue={settings.instagram_url ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook_url">Facebook (ссылка)</Label>
            <Input id="facebook_url" name="facebook_url" defaultValue={settings.facebook_url ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tiktok_url">TikTok (ссылка)</Label>
            <Input id="tiktok_url" name="tiktok_url" defaultValue={settings.tiktok_url ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp_url">WhatsApp (ссылка)</Label>
            <Input id="whatsapp_url" name="whatsapp_url" defaultValue={settings.whatsapp_url ?? ""} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero_video_url">Видео на главной (YouTube, опционально)</Label>
          <Input id="hero_video_url" name="hero_video_url" defaultValue={settings.hero_video_url ?? ""} />
        </div>

        <Button type="submit" size="lg">
          Сохранить изменения
        </Button>
      </form>
    </div>
  );
}
