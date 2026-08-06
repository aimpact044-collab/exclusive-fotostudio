"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { requestUploadUrl } from "@/actions/r2";
import { addPhotos, deletePhoto, reorderPhotos } from "@/actions/projects";
import type { Photo } from "@/types";

export function GalleryManager({ projectId, photos }: { projectId: string; photos: Photo[] }) {
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
      toast.error(error instanceof Error ? error.message : "Не удалось загрузить фото");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleSaveUploads = () => {
    if (!pendingUploads.length) return;
    startTransition(async () => {
      try {
        await addPhotos(projectId, pendingUploads);
        setPendingUploads([]);
        toast.success("Фотографии добавлены");
        router.refresh();
      } catch {
        toast.error("Не удалось сохранить фотографии");
      }
    });
  };

  const handleDelete = (photo: Photo) => {
    if (!confirm("Удалить это фото из галереи?")) return;
    startTransition(async () => {
      try {
        await deletePhoto(projectId, photo.id, photo.public_id);
        toast.success("Фото удалено");
        router.refresh();
      } catch {
        toast.error("Не удалось удалить фото");
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
          projectId,
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
            Сохранить {pendingUploads.length} новых фото
          </Button>
        )}
      </div>

      {pendingUploads.length > 0 && (
        <div className="mb-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {pendingUploads.map((photo) => (
            <div key={photo.public_id} className="relative aspect-square overflow-hidden border border-dashed border-accent">
              <Image src={photo.url} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">В галерее пока нет фотографий.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {sorted.map((photo, index) => (
            <div key={photo.id} className="group relative aspect-square overflow-hidden border border-border">
              <Image src={photo.url} alt={photo.alt ?? ""} fill className="object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/0 opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
                <div className="flex gap-1">
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
