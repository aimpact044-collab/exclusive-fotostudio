/**
 * Elegant editorial hero backdrop shown until the studio uploads a real
 * hero photo from /admin/homepage. Built entirely from CSS gradients, blurred
 * bokeh accents, camera-aperture rings and a film-grain SVG filter — no
 * external stock imagery involved, matching the same "no external
 * dependency" philosophy as <PlaceholderImage />.
 */
export function HeroPlaceholder() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#241f1a_0%,#3a3128_32%,#6b5236_68%,#a9835a_100%)]" />

      {/* golden-hour glow */}
      <div className="absolute left-1/2 top-[58%] size-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,214,168,0.55)_0%,rgba(244,214,168,0.15)_38%,transparent_68%)] blur-2xl" />

      {/* camera-aperture rings, a nod to photography */}
      <div className="absolute left-1/2 top-1/2 size-[38vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream/10" />
      <div className="absolute left-1/2 top-1/2 size-[46vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream/[0.07]" />
      <div className="absolute left-1/2 top-1/2 size-[54vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cream/[0.05]" />

      {/* bokeh light accents */}
      <div className="absolute left-[18%] top-[28%] size-16 rounded-full bg-accent/25 blur-xl" />
      <div className="absolute right-[22%] top-[38%] size-24 rounded-full bg-cream/15 blur-2xl" />
      <div className="absolute left-[32%] bottom-[22%] size-10 rounded-full bg-accent/30 blur-lg" />
      <div className="absolute right-[15%] bottom-[30%] size-20 rounded-full bg-cream/10 blur-2xl" />

      {/* subtle film grain for a photographic texture */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.06] mix-blend-overlay" aria-hidden>
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>
    </div>
  );
}
