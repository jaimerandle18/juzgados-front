"use client";

const SPONSOR_URL = "/gobiernoabierto.png";
const GAP = "px-4"; // mismo espacio entre cada logo

/**
 * Marquee infinito con los sponsors. Usa CSS animation puro (sin JS)
 * para un scroll horizontal super fluido.
 */
export default function SponsorMarquee() {
  return (
    <div className="w-full overflow-hidden py-0.5 relative"
      style={{ maskImage: "linear-gradient(to right, transparent 0%, black 35%, black 65%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 35%, black 65%, transparent 100%)" }}
    >
      <div className="flex animate-marquee w-max">
        <Track />
        <Track />
      </div>
    </div>
  );
}

function Track() {
  return (
    <div className="flex items-center shrink-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SPONSOR_URL}
            alt="Gobierno Abierto"
            height={30}
            className={GAP}
            style={{ height: 30, width: "auto", objectFit: "contain" }}
          />
          <div className={`flex items-center gap-1.5 ${GAP}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/fores_logo.jpeg"
              alt="FORES"
              width={28}
              height={28}
              className="rounded-full"
              style={{ objectFit: "contain" }}
            />
            <span className="text-xs font-semibold text-black leading-tight">fores</span>
          </div>
        </div>
      ))}
    </div>
  );
}
