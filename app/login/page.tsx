"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "src/lib/api";
import LoadingScreen from "../components/LoadingScreen";
import AnchorWithLoader from "../components/AnchorWithLoader";
import { showLoader } from "../components/globalLoader";
import { setGuestMode, clearGuestMode } from "../utils/AuthGuard";
import {
  isBiometricAvailable,
  saveCredentials,
  getCredentialsWithBiometric,
  hasStoredCredentials,
} from "../utils/biometric";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [biometricReady, setBiometricReady] = useState(false);
  const router = useRouter();

  // Chequeamos si hay credenciales guardadas + biometrics disponible
  useEffect(() => {
    (async () => {
      const available = await isBiometricAvailable();
      if (!available) return;
      const stored = await hasStoredCredentials();
      setBiometricReady(stored);
    })();
  }, []);

  const doLogin = async (loginEmail: string, loginPassword: string, saveBio = false) => {
    setLoading(true);
    setError("");

    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    try {
      const res = await api.post("/auth/login", { email: loginEmail, contrasenia: loginPassword });
      const token = res?.data?.token;
      const esAdmin = Boolean(res?.data?.user?.es_admin);

      if (!token || typeof token !== "string") {
        setError("No llegó token del backend");
        setLoading(false);
        return;
      }

      const isHttps = window.location.protocol === "https:";
      const maxAge = 60 * 60 * 24 * 7;

      document.cookie =
        `auth_token=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax` +
        (isHttps ? "; Secure" : "");

      try { localStorage.setItem("es_admin", esAdmin ? "1" : "0"); } catch {}
      try {
        const uid = res?.data?.user?.id;
        if (uid) localStorage.setItem("user_id", String(uid));
      } catch {}

      // Guardar credenciales para Face ID en el primer login manual
      if (saveBio) {
        await saveCredentials(loginEmail, loginPassword);
      }

      clearGuestMode();
      setLoading(false);
      window.location.href = "/";
    } catch (err) {
      console.error("login error:", err);
      setError("Credenciales incorrectas");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Ingresá tus credenciales");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresá un email válido");
      return;
    }

    // En el primer login manual, guardamos para Face ID si hay biometrics
    const bioAvailable = await isBiometricAvailable();
    await doLogin(email, password, bioAvailable);
  };

  const handleBiometricLogin = async () => {
    const creds = await getCredentialsWithBiometric();
    if (!creds) {
      setError("No se pudo verificar Face ID");
      return;
    }
    await doLogin(creds.username, creds.password, false);
  };

  return (
    <>
      {loading && <LoadingScreen message="Iniciando sesión..." />}

      <main className="flex flex-col items-center pt-6 sm:pt-14 px-4">
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">Iniciar sesión</h1>
          <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />
        </div>

        <div className="w-full max-w-sm flex flex-col space-y-5">
          {/* Botón Face ID */}
          {biometricReady && (
            <button
              type="button"
              onClick={handleBiometricLogin}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-semibold text-lg bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
                <path d="M9 2a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V4h1a1 1 0 1 0 0-2H9zm6 0a1 1 0 1 0 0 2h1v1a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1h-2zM4 9a1 1 0 0 0-2 0v2a1 1 0 1 0 2 0V9zm18 0a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V9zM9 22a1 1 0 0 0-1-1H7a1 1 0 0 0 0 2h2zm7-1a1 1 0 1 0 0 2h2a1 1 0 0 0 1-1v-2a1 1 0 1 0-2 0v1h-1zM3 15a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 1 0 0-2H4v-1a1 1 0 0 0-1-1zm9-5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
              </svg>
              Ingresar con Face ID
            </button>
          )}

          {biometricReady && (
            <div className="relative flex items-center my-2">
              <div className="flex-1 border-t border-gray-300" />
              <span className="px-3 text-sm text-gray-400">o ingresá manualmente</span>
              <div className="flex-1 border-t border-gray-300" />
            </div>
          )}

          <form action="#" method="post" onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <label htmlFor="login-email" className="sr-only">Correo electrónico</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Correo electrónico"
              className="bg-white border border-gray-300 rounded-xl px-4 py-4 w-full focus:ring-2 focus:ring-blue-400 text-gray-900 mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
            />

            <label htmlFor="login-password" className="sr-only">Contraseña</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Contraseña"
              className="bg-white border border-gray-300 rounded-xl px-4 py-4 w-full focus:ring-2 focus:ring-blue-400 text-gray-900 mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="text-red-500 text-sm font-semibold text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:-translate-y-0.5 transition-all mt-1 disabled:opacity-60"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <div className="relative flex items-center my-2">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3 text-sm text-gray-400">o</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          <button
            type="button"
            onClick={() => {
              setGuestMode();
              showLoader();
              router.replace("/");
            }}
            className="
              w-full py-4 rounded-2xl font-semibold text-lg
              bg-gray-800 text-white
              hover:bg-gray-900
              shadow-lg hover:-translate-y-0.5
              transition-all
            "
          >
            Ingresar como invitado
          </button>

          <p className="text-sm text-gray-700 text-center mt-10">
            ¿No tenés cuenta?
            <AnchorWithLoader
              href="/register"
              className="ml-1 inline-block px-2 py-0.5 rounded-md bg-blue-600 text-white font-semibold text-xs shadow-md hover:bg-blue-700 transition-all"
            >
              Registrate
            </AnchorWithLoader>
          </p>
        </div>
      </main>
    </>
  );
}
