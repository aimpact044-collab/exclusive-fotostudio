import { cn } from "@/lib/utils";
import type { ProjectCategory } from "@/types";

/**
 * Elegant gradient placeholder shown for demo/seed projects before the studio
 * uploads real photography. Keeps the site looking premium out of the box
 * without depending on external stock-photo services.
 */
const GRADIENTS: Record<ProjectCategory, string> = {
  weddings: "from-[#d9c7a3] via-[#e8dcc4] to-[#f3ece0]",
  cumatrii: "from-[#c9b79a] via-[#e2d3b8] to-[#f3ece0]",
  baptisms: "from-[#e0d6c3] via-[#eee4d2] to-[#f7f1e6]",
  "love-stories": "from-[#cbb49a] via-[#e5d2b8] to-[#f3ece0]",
  events: "from-[#bfae95] via-[#dccdb0] to-[#f3ece0]",
};

export function PlaceholderImage({
  category,
  label,
  className,
}: {
  category: ProjectCategory;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br",
        GRADIENTS[category],
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
      {label && (
        <span className="relative font-serif text-lg italic text-ink/50">
          {label}
        </span>
      )}
    </div>
  );
}
