"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { requestUploadUrl } from "@/actions/r2";

interface CoverImageFieldProps {
  initialUrl?: string | null;
  initialPublicId?: string | null;
  urlFieldName?: string;
  publicIdFieldName?: string;
  label?: string;
  removeLabel?: string;
  aspectClassName?: string;
}

export function CoverImageField({
  initialUrl,
  initialPublicId,
  urlFieldName = "cover_url",
  publicIdFieldName = "cover_public_id",
  label = "Загрузить обложку",
  removeLabel,
  aspectClassName = "aspect-video",
}: CoverImageFieldProps) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [publicId, setPublicId] = useState(initialPublicId ?? "");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    startTransition(async () => {
      try {
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
        setUrl(publicUrl);
        setPublicId(key);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Не удалось загрузить изображение");
      } finally {
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  };


  return (
    <div>
      <input type="hidden" name={urlFieldName} value={url} />
      <input type="hidden" name={publicIdFieldName} value={publicId} />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {url ? (
        <div className={`relative ${aspectClassName} w-full max-w-sm overflow-hidden border border-border`}>
          <Image src={url} alt="Обложка" fill className="object-cover" />
          <button
            type="button"
            onClick={() => {
              setUrl("");
              setPublicId("");
            }}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
            aria-label={removeLabel ?? "Удалить изображение"}
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          {label}
        </Button>
      )}
    </div>
  );
}
