import { Capacitor } from "@capacitor/core";
import { NativeBiometric } from "capacitor-native-biometric";

const SERVER = "datajury-app";

/** Devuelve true si el dispositivo soporta biometrics (Face ID / Touch ID) */
export async function isBiometricAvailable(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const result = await NativeBiometric.isAvailable();
    return result.isAvailable;
  } catch {
    return false;
  }
}

/** Guarda credenciales en el Keychain protegido por biometrics */
export async function saveCredentials(email: string, password: string) {
  try {
    await NativeBiometric.setCredentials({
      username: email,
      password,
      server: SERVER,
    });
  } catch {}
}

/** Verifica biometrics y devuelve las credenciales guardadas */
export async function getCredentialsWithBiometric(): Promise<{
  username: string;
  password: string;
} | null> {
  try {
    await NativeBiometric.verifyIdentity({
      reason: "Iniciá sesión con Face ID",
      title: "Data Jury",
    });
    const creds = await NativeBiometric.getCredentials({ server: SERVER });
    return creds;
  } catch {
    return null;
  }
}

/** Devuelve true si hay credenciales guardadas */
export async function hasStoredCredentials(): Promise<boolean> {
  try {
    const creds = await NativeBiometric.getCredentials({ server: SERVER });
    return !!(creds?.username && creds?.password);
  } catch {
    return false;
  }
}

/** Borra credenciales guardadas */
export async function deleteCredentials() {
  try {
    await NativeBiometric.deleteCredentials({ server: SERVER });
  } catch {}
}
