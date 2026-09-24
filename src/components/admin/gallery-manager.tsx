"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestUploadUrl } from "@/actions/r2";
import { addPhotos, deletePhoto, reorderPhotos, togglePhotoPublish } from "@/actions/photos";
import { YoutubeEmbed, getYoutubeId } from "@/components/shared/youtube-embed";
import type { Photo } from "@/types";

function MediaSection({
  eventTypeId,
  photos,
}: {
  eventTypeId: string;
  photos: Photo[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<{ url: string; public_id: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const sorted = photos.slice().sort((a, b) => a.position - b.position);

  const uploadFile = async (file: File) => {
    const { uploadUrl, key, publicUrl } = await requestUploadUrl(file.type);

    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!res.ok) throw new Error("Upload failed");

    return { url: publicUrl, public_id: key };
  };

  const handleFiles = async (files: FileList) => {
    setIsUploading(true);
    try {
      const uploaded = await Promise.all(Array.from(files).map(uploadFile));
      setPendingUploads((prev) => [...prev, ...uploaded]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось загрузить файл");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleSaveUploads = () => {
    if (!pendingUploads.length) return;
    startTransition(async () => {
      try {
        await addPhotos(
          eventTypeId,
          pendingUploads.map((p) => ({ ...p, media_type: "photo" as const }))
        );
        setPendingUploads([]);
        toast.success("Сохранено");
        router.refresh();
      } catch {
        toast.error("Не удалось сохранить");
      }
    });
  };

  const handleDelete = (photo: Photo) => {
    if (!confirm("Удалить этот файл из галереи?")) return;
    startTransition(async () => {
      try {
        await deletePhoto(eventTypeId, photo.id, photo.public_id);
        toast.success("Удалено");
        router.refresh();
      } catch {
        toast.error("Не удалось удалить");
      }
    });
  };

  const handleTogglePublish = (photo: Photo) => {
    startTransition(async () => {
      try {
        await togglePhotoPublish(eventTypeId, photo.id, !photo.is_published);
        router.refresh();
      } catch {
        toast.error("Не удалось изменить видимость");
      }
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = sorted.slice();
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];

    startTransition(async () => {
      try {
        await reorderPhotos(
          eventTypeId,
          next.map((p) => p.id)
        );
        router.refresh();
      } catch {
        toast.error("Не удалось изменить порядок");
      }
    });
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          Загрузить фото
        </Button>

        {pendingUploads.length > 0 && (
          <Button type="button" onClick={handleSaveUploads} disabled={isPending}>
            Сохранить {pendingUploads.length} новых файлов
          </Button>
        )}
      </div>

      {pendingUploads.length > 0 && (
        <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {pendingUploads.map((photo) => (
            <div
              key={photo.public_id}
              className="relative aspect-square overflow-hidden border border-dashed border-accent"
            >
              <Image src={photo.url} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">Пока ничего не загружено.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {sorted.map((photo, index) => (
            <div
              key={photo.id}
              className={`group relative aspect-square overflow-hidden border border-border ${photo.is_published ? "" : "opacity-40"}`}
            >
              <Image src={photo.url} alt={photo.alt ?? ""} fill className="object-cover" />
              <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center gap-1 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="pointer-events-auto flex gap-1">
                  <button
                    type="button"
                    disabled={index === 0 || isPending}
                    onClick={() => move(index, -1)}
                    className="rounded bg-white/90 p-1 disabled:opacity-40"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === sorted.length - 1 || isPending}
                    onClick={() => move(index, 1)}
                    className="rounded bg-white/90 p-1 disabled:opacity-40"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleTogglePublish(photo)}
                    title={photo.is_published ? "Скрыть на сайте" : "Показать на сайте"}
                    className="rounded bg-white/90 p-1"
                  >
                    {photo.is_published ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(photo)}
                    className="rounded bg-white/90 p-1 text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VideoSection({ eventTypeId, photos }: { eventTypeId: string; photos: Photo[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [url, setUrl] = useState("");

  const sorted = photos.slice().sort((a, b) => a.position - b.position);

  const handleAdd = () => {
    const id = getYoutubeId(url.trim());
    if (!id) {
      toast.error("Не удалось распознать ссылку YouTube");
      return;
    }
    startTransition(async () => {
      try {
        await addPhotos(eventTypeId, [
          {
            url: `https://www.youtube.com/watch?v=${id}`,
            public_id: `youtube-${id}`,
            media_type: "video",
          },
        ]);
        setUrl("");
        toast.success("Видео добавлено");
        router.refresh();
      } catch {
        toast.error("Не удалось добавить видео");
      }
    });
  };

  const handleDelete = (photo: Photo) => {
    if (!confirm("Удалить это видео из галереи?")) return;
    startTransition(async () => {
      try {
        await deletePhoto(eventTypeId, photo.id, photo.public_id);
        toast.success("Удалено");
        router.refresh();
      } catch {
        toast.error("Не удалось удалить");
      }
    });
  };

  const handleTogglePublish = (photo: Photo) => {
    startTransition(async () => {
      try {
        await togglePhotoPublish(eventTypeId, photo.id, !photo.is_published);
        router.refresh();
      } catch {
        toast.error("Не удалось изменить видимость");
      }
    });
  };

  const move = (index: number, direction: -1 | 1) => {
    const next = sorted.slice();
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];

    startTransition(async () => {
      try {
        await reorderPhotos(
          eventTypeId,
          next.map((p) => p.id)
        );
        router.refresh();
      } catch {
        toast.error("Не удалось изменить порядок");
      }
    });
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="max-w-md"
        />
        <Button type="button" onClick={handleAdd} disabled={isPending || !url.trim()}>
          Добавить
        </Button>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">Пока ничего не добавлено.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {sorted.map((video, index) => (
            <div
              key={video.id}
              className={`group relative aspect-video overflow-hidden border border-border ${video.is_published ? "" : "opacity-40"}`}
            >
              <YoutubeEmbed url={video.url} title="Видео" />
              <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center gap-1 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="pointer-events-auto flex gap-1">
                  <button
                    type="button"
                    disabled={index === 0 || isPending}
                    onClick={() => move(index, -1)}
                    className="rounded bg-white/90 p-1 disabled:opacity-40"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === sorted.length - 1 || isPending}
                    onClick={() => move(index, 1)}
                    className="rounded bg-white/90 p-1 disabled:opacity-40"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleTogglePublish(video)}
                    title={video.is_published ? "Скрыть на сайте" : "Показать на сайте"}
                    className="rounded bg-white/90 p-1"
                  >
                    {video.is_published ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleDelete(video)}
                    className="rounded bg-white/90 p-1 text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function GalleryManager({ eventTypeId, photos }: { eventTypeId: string; photos: Photo[] }) {
  const photoItems = photos.filter((p) => p.media_type !== "video");
  const videoItems = photos.filter((p) => p.media_type === "video");

  return (
    <div className="space-y-10">
      <div>
        <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Фото
        </h3>
        <MediaSection eventTypeId={eventTypeId} photos={photoItems} />
      </div>

      <div>
        <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Видео (ссылка на YouTube)
        </h3>
        <VideoSection eventTypeId={eventTypeId} photos={videoItems} />
      </div>
    </div>
  );
}

