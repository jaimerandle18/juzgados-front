"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "src/lib/api";
import LoadingScreen from "../components/LoadingScreen";
import AnchorWithLoader from "../components/AnchorWithLoader";
import { setGuestMode, clearGuestMode } from "../utils/AuthGuard";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Ingresá tus credenciales");
      return;
    }

    setLoading(true);

    // 🔧 iOS: forzá un frame para que pinte el overlay antes del await
    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    try {
      const res = await api.post("/auth/login", { email, contrasenia: password });
      const token = res?.data?.token;
      const esAdmin = Boolean(res?.data?.user?.es_admin);

      if (!token || typeof token !== "string") {
        setError("No llegó token del backend");
        return;
      }

      const isHttps = window.location.protocol === "https:";
      const maxAge = 60 * 60 * 24 * 7;

      document.cookie =
        `auth_token=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax` +
        (isHttps ? "; Secure" : "");

      try { localStorage.setItem("auth_token", token); } catch {}
      try { sessionStorage.setItem("auth_token", token); } catch {}
      try { localStorage.setItem("es_admin", esAdmin ? "1" : "0"); } catch {}
      try {
        const uid = res?.data?.user?.id;
        if (uid) localStorage.setItem("user_id", String(uid));
      } catch {}

      clearGuestMode();
      setLoading(false);
      router.replace("/");
      // NO hace falta router.refresh() acá (y a veces suma glitches en iOS)
    } catch (err) {
      console.error("login error:", err);
      setError("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingScreen message="Iniciando sesión..." />}

      <main className="min-h-screen flex flex-col items-center pt-14 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">Iniciar sesión</h1>
          <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />
        </div>

        <div className="w-full max-w-sm flex flex-col space-y-10 md:space-y-5">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <input
              type="email"
              placeholder="Correo electrónico"
              className="bg-white border border-gray-300 rounded-xl px-4 py-4 w-full focus:ring-2 focus:ring-blue-400 text-gray-900 mt-10 md:mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
            />

            <input
              type="password"
              placeholder="Contraseña"
              className="bg-white border border-gray-300 rounded-xl px-4 py-4 w-full focus:ring-2 focus:ring-blue-400 text-gray-900 mt-1 md:mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p className="text-red-500 text-sm font-semibold text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:-translate-y-0.5 transition-all mt-7 md:mt-1 disabled:opacity-60"
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

          <p className="text-sm text-gray-700 text-center">
            ¿No tenés cuenta?
            <AnchorWithLoader href="/register" className="text-blue-600 font-semibold ml-1 hover:underline">
              Registrate
            </AnchorWithLoader>
          </p>
        </div>
      </main>
    </>
  );
}
