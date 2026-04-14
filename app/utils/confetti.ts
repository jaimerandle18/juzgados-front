/**
 * Confetti festivo para celebrar acciones exitosas (ej: enviar un voto).
 * Usa canvas-confetti. Lanza dos ráfagas desde las esquinas inferiores
 * para que el efecto sea amplio y simétrico en mobile y desktop.
 */
import confetti from "canvas-confetti";

export function celebrate() {
  if (typeof window === "undefined") return;

  const defaults = {
    spread: 75,
    startVelocity: 55,
    ticks: 140,
    gravity: 0.9,
    scalar: 1,
    zIndex: 9_999_999,
    // Paleta en línea con la app (azules + dorados/amarillos)
    colors: ["#2563eb", "#3b82f6", "#60a5fa", "#facc15", "#fbbf24", "#ffffff"],
  };

  // Ráfaga principal desde el centro-abajo
  confetti({
    ...defaults,
    particleCount: 90,
    angle: 90,
    origin: { x: 0.5, y: 1 },
  });

  // Desde esquina inferior-izquierda hacia arriba-derecha
  confetti({
    ...defaults,
    particleCount: 55,
    angle: 60,
    origin: { x: 0, y: 1 },
  });

  // Desde esquina inferior-derecha hacia arriba-izquierda
  confetti({
    ...defaults,
    particleCount: 55,
    angle: 120,
    origin: { x: 1, y: 1 },
  });
}
