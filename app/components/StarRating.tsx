"use client";

/**
 * Rating de 5 estrellas con relleno fraccionario (ej: 4.3 → 4 llenas + 30% de la 5ª).
 * Una sola SVG por estrella con un rect que hace de máscara del relleno.
 *
 * Props:
 *  - value:    promedio 0-5 (acepta decimales)
 *  - cantidad: opcional, muestra "(N)" al lado
 *  - size:     "sm" (lista) | "md" (default) | "lg" (detalle)
 *  - tintedByValue: si está en true, el número se pinta verde/amarillo/rojo
 *                   según el promedio (para rankings / listas).
 */

type Size = "sm" | "md" | "lg";

const sizeMap: Record<Size, { star: number; gap: string; text: string; num: string }> = {
  sm: { star: 16, gap: "gap-0.5", text: "text-xs",  num: "text-xs"  },
  md: { star: 20, gap: "gap-0.5", text: "text-sm",  num: "text-sm"  },
  lg: { star: 24, gap: "gap-1",   text: "text-base", num: "text-base" },
};

function colorFor(value: number) {
  if (value >= 4) return "text-green-600";
  if (value >= 3) return "text-yellow-600";
  return "text-red-600";
}

function Star({ fill, size }: { fill: number; size: number }) {
  // Dos SVGs apiladas: una gris de fondo y una dorada recortada con clip-path.
  const pct = Math.max(0, Math.min(1, fill)) * 100;
  return (
    <span
      className="relative inline-block"
      style={{ width: size, height: size, lineHeight: 0 }}
      aria-hidden="true"
    >
      {/* Estrella de fondo (vacía / gris) */}
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className="absolute inset-0 text-gray-300"
        fill="currentColor"
      >
        <path d="M12 2.5l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 18.25l-6.18 3.25L7 14.63 2 9.76l6.91-1L12 2.5z" />
      </svg>
      {/* Estrella rellena (dorada) recortada al porcentaje */}
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className="absolute inset-0 text-yellow-400"
        fill="currentColor"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      >
        <path d="M12 2.5l3.09 6.26 6.91 1-5 4.87 1.18 6.87L12 18.25l-6.18 3.25L7 14.63 2 9.76l6.91-1L12 2.5z" />
      </svg>
    </span>
  );
}

export default function StarRating({
  value = 0,
  cantidad,
  size = "md",
  tintedByValue = false,
  showNumber = true,
  showCantidad = true,
}: {
  value?: number;
  cantidad?: number;
  size?: Size;
  tintedByValue?: boolean;
  showNumber?: boolean;
  showCantidad?: boolean;
}) {
  const safe = Math.max(0, Math.min(5, Number(value) || 0));
  const cfg = sizeMap[size];

  return (
    <div className={`inline-flex items-center ${cfg.gap}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={cfg.star} fill={safe - i} />
      ))}

      {showNumber && (
        <span
          className={`
            font-semibold ml-1
            ${cfg.num}
            ${tintedByValue ? colorFor(safe) : "text-gray-800"}
          `}
        >
          {safe.toFixed(1)}
        </span>
      )}

      {showCantidad && typeof cantidad === "number" && (
        <span className={`text-gray-500 ml-1 ${cfg.text}`}>
          ({cantidad.toLocaleString("es-AR")})
        </span>
      )}
    </div>
  );
}
