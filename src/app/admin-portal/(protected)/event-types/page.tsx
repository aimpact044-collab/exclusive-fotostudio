import { getEventTypesAdmin } from "@/lib/admin-data";
import { EventTypesManager } from "@/components/admin/event-types-manager";

export default async function AdminEventTypesPage() {
  const eventTypes = await getEventTypesAdmin();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-sans text-2xl font-semibold">Услуги</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Список услуг (например, свадебная фотосъёмка, крещение, дрон-съёмка) — показывается в
          блоке «Услуги» на главной странице. Услуга появляется в «Портфолио» автоматически, как
          только вы добавите к ней хотя бы одно фото или видео (кнопка с иконкой галереи).
        </p>
      </div>

      <EventTypesManager eventTypes={eventTypes} />
    </div>
  );
}
