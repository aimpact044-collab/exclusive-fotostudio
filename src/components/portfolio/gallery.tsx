"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Photo } from "@/types";

export function Gallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!photos.length) return null;

  const close = () => setActiveIndex(null);
  const showPrev = () =>
    setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  const showNext = () =>
    setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length));

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="group relative aspect-[3/4] w-full overflow-hidden bg-beige"
          >
            <Image
              src={photo.url}
              alt={photo.alt || title}
              fill
              loading="lazy"
              quality={90}
              sizes="(min-width: 1024px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Dialog open={activeIndex !== null} onOpenChange={(open) => !open && close()}>
        <DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          {activeIndex !== null && (
            <div className="relative flex aspect-[3/2] w-full items-center justify-center bg-ink sm:aspect-video">
              <Image
                src={photos[activeIndex].url}
                alt={photos[activeIndex].alt || title}
                fill
                quality={100}
                sizes="90vw"
                className="object-contain"
              />
              <button
                type="button"
                onClick={showPrev}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-cream/20 p-2 text-cream hover:bg-cream/40"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={showNext}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-cream/20 p-2 text-cream hover:bg-cream/40"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
