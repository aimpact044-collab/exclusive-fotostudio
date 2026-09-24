"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import Image from "next/image";

/** Extracts a YouTube video ID from common URL formats. */
export function getYoutubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/watch\?v=([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

/**
 * "Lite" YouTube embed: renders only a thumbnail image until the user clicks
 * play, then swaps in the real iframe. Avoids loading YouTube's ~1MB of JS
 * up front, which keeps the project page's Core Web Vitals fast.
 */
export function YoutubeEmbed({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const id = getYoutubeId(url);

  if (!id) return null;

  if (playing) {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative aspect-video w-full overflow-hidden bg-black"
      aria-label={`Play ${title}`}
    >
      <Image
        src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
        alt={title}
        fill
        sizes="(min-width: 1024px) 900px, 100vw"
        className="object-cover opacity-90 transition-opacity group-hover:opacity-70"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-cream/90 transition-transform group-hover:scale-110">
          <Play className="ml-1 size-6 fill-ink text-ink" />
        </span>
      </span>
    </button>
  );
}
