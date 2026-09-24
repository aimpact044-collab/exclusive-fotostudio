import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getEventTypeByIdAdmin, getPhotosByEventTypeAdmin } from "@/lib/admin-data";
import { GalleryManager } from "@/components/admin/gallery-manager";

export default async function EventTypeGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [eventType, photos] = await Promise.all([
    getEventTypeByIdAdmin(id),
    getPhotosByEventTypeAdmin(id),
  ]);

  if (!eventType) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin-portal/event-types"
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Категории
      </Link>
      <h1 className="font-sans text-2xl font-semibold">{eventType.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Фото и видео этой категории. Скрытые файлы (глаз перечёркнут) не показываются на сайте.
      </p>

      <div className="mt-8 border border-border bg-card p-6">
        <GalleryManager eventTypeId={eventType.id} photos={photos} />
      </div>
    </div>
  );
}
