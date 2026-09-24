import type { Photo } from "@/types";
import { YoutubeEmbed } from "@/components/shared/youtube-embed";

export function VideoGrid({ videos }: { videos: Photo[] }) {
  if (!videos.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {videos.map((video) => (
        <YoutubeEmbed key={video.id} url={video.url} title="Видео" />
      ))}
    </div>
  );
}
