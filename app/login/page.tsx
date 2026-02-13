"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "src/lib/api";
import LoadingScreen from "../components/LoadingScreen";

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

      router.replace("/"); // mejor que push para login
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

          <p className="text-sm text-gray-700 text-center">
            ¿No tenés cuenta?
            <Link href="/register" className="text-blue-600 font-semibold ml-1 hover:underline">
              Registrate
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
