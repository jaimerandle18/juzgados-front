/**
 * Feedback háptico — solo se dispara en Capacitor nativo (iOS/Android).
 * En web los métodos no hacen nada (return silencioso).
 *
 * Estilos disponibles:
 *   - light  (tap de card, selección)
 *   - medium (confirmación)
 *   - heavy  (acción fuerte: borrar, error crítico)
 */
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

const isNative = () => {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

export async function hapticLight() {
  if (!isNative()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {}
}

export async function hapticMedium() {
  if (!isNative()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {}
}

export async function hapticHeavy() {
  if (!isNative()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  } catch {}
}

export async function hapticSuccess() {
  if (!isNative()) return;
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch {}
}

export async function hapticWarning() {
  if (!isNative()) return;
  try {
    await Haptics.notification({ type: NotificationType.Warning });
  } catch {}
}

export async function hapticError() {
  if (!isNative()) return;
  try {
    await Haptics.notification({ type: NotificationType.Error });
  } catch {}
}

/** Selección — el "tick" al mover un picker. Usar en estrellas, por ej. */
export async function hapticSelection() {
  if (!isNative()) return;
  try {
    await Haptics.selectionStart();
    await Haptics.selectionChanged();
    await Haptics.selectionEnd();
  } catch {}
}
