/**
 * "hace 3 días", "hace 2 meses", "hace 5 minutos", etc.
 * Usa Intl.RelativeTimeFormat nativo de JS — no requiere lib externa.
 */

const rtf = typeof Intl !== "undefined" && Intl.RelativeTimeFormat
  ? new Intl.RelativeTimeFormat("es-AR", { numeric: "auto" })
  : null;

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year",   60 * 60 * 24 * 365],
  ["month",  60 * 60 * 24 * 30],
  ["week",   60 * 60 * 24 * 7],
  ["day",    60 * 60 * 24],
  ["hour",   60 * 60],
  ["minute", 60],
  ["second", 1],
];

export function relativeTime(input: string | Date | number): string {
  try {
    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date.getTime())) return "";

    const diffSec = (date.getTime() - Date.now()) / 1000;

    if (!rtf) {
      // Fallback ultra simple
      const abs = Math.abs(diffSec);
      if (abs < 60) return "ahora";
      if (abs < 3600) return `hace ${Math.floor(abs / 60)} min`;
      if (abs < 86400) return `hace ${Math.floor(abs / 3600)} h`;
      return `hace ${Math.floor(abs / 86400)} d`;
    }

    for (const [unit, seconds] of UNITS) {
      if (Math.abs(diffSec) >= seconds || unit === "second") {
        return rtf.format(Math.round(diffSec / seconds), unit);
      }
    }
    return "";
  } catch {
    return "";
  }
}

/** "15 de marzo de 2026" – para tooltip completo. */
export function fullDate(input: string | Date | number): string {
  try {
    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
