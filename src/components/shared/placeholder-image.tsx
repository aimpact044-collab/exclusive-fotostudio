import { cn } from "@/lib/utils";

/**
 * Elegant gradient placeholder shown for projects before the studio uploads
 * real photography. Keeps the site looking premium out of the box without
 * depending on external stock-photo services.
 */
const GRADIENT = "from-[#d9c7a3] via-[#e8dcc4] to-[#f3ece0]";

export function PlaceholderImage({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br",
        GRADIENT,
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

