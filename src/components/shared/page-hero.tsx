import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <section className={cn("bg-cream pb-16 pt-36 lg:pt-44", className)}>
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h1 className="whitespace-pre-line font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="prose-measure mx-auto mt-5 text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
