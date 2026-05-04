"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "src/lib/api";
import LoadingScreen from "../components/LoadingScreen";
import AnchorWithLoader from "../components/AnchorWithLoader";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Ingresá tu email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ingresá un email válido");
      return;
    }

    setLoading(true);

    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    try {
      await api.post("/auth/request-password-reset", { email });
      localStorage.setItem("email_reset", email);
      setSent(true);
    } catch {
      setError("Error al enviar el código. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <main className="flex flex-col items-center pt-6 sm:pt-14 px-4 pb-24">
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Revisá tu email</h1>
          <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />
        </div>

        <div className="w-full max-w-sm flex flex-col space-y-5">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <div className="text-3xl mb-3">📧</div>
            <p className="text-gray-700 mb-1">
              Enviamos un código de recuperación a:
            </p>
            <p className="text-blue-700 font-semibold">{email}</p>
          </div>

          <p className="text-sm text-gray-500 text-center">
            El código expira en 15 minutos. Revisá también la carpeta de spam.
          </p>

          <button
            onClick={() => router.push("/reset-password")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:-translate-y-0.5 transition-all"
          >
            Ya tengo el código
          </button>

          <button
            onClick={() => setSent(false)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium text-center transition-colors"
          >
            Reenviar código
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      {loading && <LoadingScreen message="Enviando código..." />}

      <main className="flex flex-col items-center pt-6 sm:pt-14 px-4 pb-24">
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Recuperar contraseña</h1>
          <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />
        </div>

        <div className="w-full max-w-sm flex flex-col space-y-5">
          <p className="text-gray-600 text-center text-sm">
            Ingresá el email con el que te registraste y te enviaremos un código para restablecer tu contraseña.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <label htmlFor="reset-email" className="sr-only">Correo electrónico</label>
            <input
              id="reset-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Correo electrónico"
              className="bg-white border border-gray-300 rounded-xl px-4 py-4 w-full focus:ring-2 focus:ring-blue-400 text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
            />

            {error && (
              <p className="text-red-500 text-sm font-semibold text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Enviar código"}
            </button>
          </form>

          <p className="text-sm text-gray-700 text-center mt-4">
            <AnchorWithLoader
              href="/login"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Volver al inicio de sesión
            </AnchorWithLoader>
          </p>
        </div>
      </main>
    </>
  );
}
