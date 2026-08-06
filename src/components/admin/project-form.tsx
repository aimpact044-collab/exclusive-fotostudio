import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CoverImageField } from "@/components/admin/cover-image-field";
import { CATEGORY_SLUGS } from "@/lib/constants";
import type { Project } from "@/types";

const CATEGORY_LABELS: Record<string, string> = {
  weddings: "Свадьбы",
  cumatrii: "Кумэтрии",
  baptisms: "Крестины",
  "love-stories": "Love Story",
  events: "Мероприятия",
};

export function ProjectForm({
  action,
  project,
}: {
  action: (formData: FormData) => void | Promise<void>;
  project?: Project;
}) {
  return (
    <form action={action} className="space-y-8">
      <section className="space-y-4 border border-border bg-card p-6">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Основное
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Категория</Label>
            <Select name="category" defaultValue={project?.category ?? CATEGORY_SLUGS[0]}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_SLUGS.map((slug) => (
                  <SelectItem key={slug} value={slug}>
                    {CATEGORY_LABELS[slug]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_date">Дата события</Label>
            <Input id="event_date" name="event_date" type="date" defaultValue={project?.event_date ?? ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              URL (slug){" "}
              <span className="text-xs normal-case text-muted-foreground">
                — оставьте пустым, чтобы сгенерировать из названия
              </span>
            </Label>
            <Input id="slug" name="slug" defaultValue={project?.slug ?? ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube_url">Ссылка на YouTube видео</Label>
            <Input
              id="youtube_url"
              name="youtube_url"
              placeholder="https://youtube.com/watch?v=..."
              defaultValue={project?.youtube_url ?? ""}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-8 pt-2">
          <label className="flex items-center gap-3 text-sm">
            <Switch name="is_published" defaultChecked={project?.is_published ?? false} />
            Опубликован на сайте
          </label>
          <label className="flex items-center gap-3 text-sm">
            <Switch name="is_featured" defaultChecked={project?.is_featured ?? false} />
            Показывать на главной странице
          </label>
        </div>
      </section>

      <section className="space-y-4 border border-border bg-card p-6">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Обложка проекта
        </h2>
        <CoverImageField initialUrl={project?.cover_url} initialPublicId={project?.cover_public_id} />
      </section>

      <section className="space-y-4 border border-border bg-card p-6">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Название · Русский (основной язык)
        </h2>
        <div className="space-y-2">
          <Label htmlFor="title">Название</Label>
          <Input id="title" name="title" required defaultValue={project?.title ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>
          <Textarea id="description" name="description" rows={4} defaultValue={project?.description ?? ""} />
        </div>
      </section>

      <section className="space-y-4 border border-border bg-card p-6">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Română (opțional)
        </h2>
        <div className="space-y-2">
          <Label htmlFor="title_ro">Titlu</Label>
          <Input id="title_ro" name="title_ro" defaultValue={project?.title_ro ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description_ro">Descriere</Label>
          <Textarea id="description_ro" name="description_ro" rows={3} defaultValue={project?.description_ro ?? ""} />
        </div>
      </section>

      <section className="space-y-4 border border-border bg-card p-6">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          English (optional)
        </h2>
        <div className="space-y-2">
          <Label htmlFor="title_en">Title</Label>
          <Input id="title_en" name="title_en" defaultValue={project?.title_en ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description_en">Description</Label>
          <Textarea id="description_en" name="description_en" rows={3} defaultValue={project?.description_en ?? ""} />
        </div>
      </section>

      <Button type="submit" size="lg">
        Сохранить
      </Button>
    </form>
  );
}
