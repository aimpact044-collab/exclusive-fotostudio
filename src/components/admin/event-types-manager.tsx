"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Plus, Images } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createEventType,
  updateEventType,
  deleteEventType,
} from "@/actions/event-types";
import type { EventType } from "@/types";

function EventTypeForm({
  eventType,
  onDone,
}: {
  eventType?: EventType;
  onDone: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const action = (formData: FormData) => {
    startTransition(async () => {
      try {
        if (eventType) {
          await updateEventType(eventType.id, formData);
          toast.success("Тип события обновлён");
        } else {
          await createEventType(formData);
          toast.success("Тип события добавлен");
        }
        router.refresh();
        onDone();
      } catch {
        toast.error("Не удалось сохранить тип события");
      }
    });
  };

  return (
    <form action={action} className="space-y-5 border border-border bg-card p-5">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Название</p>
        <div className="space-y-2">
          <Label htmlFor="name">Русский</Label>
          <Input id="name" name="name" required defaultValue={eventType?.name ?? ""} placeholder="Например, Свадьбы" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name_ro">Română</Label>
          <Input id="name_ro" name="name_ro" defaultValue={eventType?.name_ro ?? ""} placeholder="De ex. Nunți" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name_en">English</Label>
          <Input id="name_en" name="name_en" defaultValue={eventType?.name_en ?? ""} placeholder="E.g. Weddings" />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Описание</p>
        <div className="space-y-2">
          <Label htmlFor="description">Русский</Label>
          <Textarea
            id="description"
            name="description"
            rows={2}
            defaultValue={eventType?.description ?? ""}
            placeholder="Краткое описание этого типа события"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description_ro">Română</Label>
          <Textarea
            id="description_ro"
            name="description_ro"
            rows={2}
            defaultValue={eventType?.description_ro ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description_en">English</Label>
          <Textarea
            id="description_en"
            name="description_en"
            rows={2}
            defaultValue={eventType?.description_en ?? ""}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">
          Цена{" "}
          <span className="text-xs normal-case text-muted-foreground">(необязательно)</span>
        </Label>
        <Input id="price" name="price" defaultValue={eventType?.price ?? ""} placeholder="от 500 €" />
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          Сохранить
        </Button>
        <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
          Отмена
        </Button>
      </div>
    </form>
  );
}

export function EventTypesManager({ eventTypes }: { eventTypes: EventType[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const handleDelete = (eventType: EventType) => {
    if (!confirm(`Удалить тип события «${eventType.name}»?`)) return;
    startTransition(async () => {
      try {
        await deleteEventType(eventType.id);
        toast.success("Тип события удалён");
        router.refresh();
      } catch {
        toast.error("Не удалось удалить тип события");
      }
    });
  };

  return (
    <div className="space-y-4">
      {!creating && (
        <Button type="button" onClick={() => setCreating(true)}>
          <Plus className="size-4" />
          Добавить тип события
        </Button>
      )}

      {creating && <EventTypeForm onDone={() => setCreating(false)} />}

      {eventTypes.length === 0 ? (
        <p className="border border-border bg-card px-5 py-10 text-center text-sm text-muted-foreground">
          Типов событий пока нет.
        </p>
      ) : (
        <div className="divide-y divide-border border border-border bg-card">
          {eventTypes.map((eventType) =>
            editingId === eventType.id ? (
              <div key={eventType.id} className="p-1">
                <EventTypeForm eventType={eventType} onDone={() => setEditingId(null)} />
              </div>
            ) : (
              <div key={eventType.id} className="flex items-start justify-between gap-4 px-5 py-4">
                <div>
                  <p className="text-sm font-medium">{eventType.name}</p>
                  {eventType.description && (
                    <p className="mt-1 max-w-xl text-sm text-muted-foreground">{eventType.description}</p>
                  )}
                  {eventType.price && (
                    <p className="mt-1 text-sm font-medium text-accent">{eventType.price}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="icon" variant="ghost" asChild>
                    <Link href={`/admin-portal/event-types/${eventType.id}`} title="Галерея">
                      <Images className="size-4" />
                    </Link>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => setEditingId(eventType.id)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={isPending}
                    onClick={() => handleDelete(eventType)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
