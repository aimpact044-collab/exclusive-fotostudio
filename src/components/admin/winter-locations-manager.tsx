"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { requestUploadUrl } from "@/actions/r2";
import {
  addWinterLocationPhotos,
  deleteWinterLocationPhoto,
  toggleWinterLocationPhoto,
} from "@/actions/winter-locations";
import type { WinterLocationPhoto } from "@/types";

export function WinterLocationsManager({ photos }: { photos: WinterLocationPhoto[] }) {
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
if (!res.ok) {
  const text = await res.text();
  console.error("R2 upload failed:", {
    status: res.status,
    statusText: res.statusText,
    response: text,
    uploadUrl,
    contentType: file.type,
  });

  throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
}
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
        await addWinterLocationPhotos(pendingUploads);
        setPendingUploads([]);
        toast.success("Фотографии добавлены");
        router.refresh();
      } catch {
        toast.error("Не удалось сохранить фотографии");
      }
    });
  };

  const handleToggle = (photo: WinterLocationPhoto, isActive: boolean) => {
    startTransition(async () => {
      try {
        await toggleWinterLocationPhoto(photo.id, isActive);
        router.refresh();
      } catch {
        toast.error("Не удалось изменить статус фото");
      }
    });
  };

  const handleDelete = (photo: WinterLocationPhoto) => {
    if (!confirm("Удалить эту фотографию из локации?")) return;
    startTransition(async () => {
      try {
        await deleteWinterLocationPhoto(photo.id, photo.public_id);
        toast.success("Фото удалено");
        router.refresh();
      } catch {
        toast.error("Не удалось удалить фото");
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
        <p className="text-sm text-muted-foreground">Фотографий пока нет.</p>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {sorted.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden border border-border"
            >
              <Image
                src={photo.url}
                alt=""
                fill
                className={`object-cover ${photo.is_active ? "" : "opacity-40 grayscale"}`}
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/60 px-2 py-1.5">
                <Switch
                  checked={photo.is_active}
                  disabled={isPending}
                  onCheckedChange={(checked) => handleToggle(photo, checked)}
                />
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
          ))}
        </div>
      )}
    </div>
  );
}
