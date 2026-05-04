"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "src/lib/api";
import LoadingScreen from "../components/LoadingScreen";
import AnchorWithLoader from "../components/AnchorWithLoader";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("email_reset");
    if (!saved) router.replace("/forgot-password");
    else setEmail(saved);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!codigo) {
      setError("Ingresá el código que recibiste por email");
      return;
    }

    if (!password) {
      setError("Ingresá tu nueva contraseña");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    await new Promise<void>((r) => requestAnimationFrame(() => r()));

    try {
      await api.post("/auth/reset-password", {
        email,
        codigo,
        nuevaContrasenia: password,
      });

      localStorage.removeItem("email_reset");
      setSuccess(true);
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Error al restablecer la contraseña";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="flex flex-col items-center pt-6 sm:pt-14 px-4 pb-24">
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Contraseña actualizada</h1>
          <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />
        </div>

        <div className="w-full max-w-sm flex flex-col space-y-5">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <div className="text-3xl mb-3">✅</div>
            <p className="text-gray-700 font-medium">
              Tu contraseña fue restablecida con éxito.
            </p>
          </div>

          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:-translate-y-0.5 transition-all"
          >
            Iniciar sesión
          </button>
        </div>
      </main>
    );
  }

  return (
    <>
      {loading && <LoadingScreen message="Restableciendo contraseña..." />}

      <main className="flex flex-col items-center pt-6 sm:pt-14 px-4 pb-24">
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Nueva contraseña</h1>
          <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />
        </div>

        <div className="w-full max-w-sm flex flex-col space-y-5">
          {email && (
            <p className="text-gray-600 text-center text-sm">
              Ingresá el código enviado a <span className="text-blue-700 font-semibold">{email}</span>
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <label htmlFor="reset-code" className="sr-only">Código de recuperación</label>
            <input
              id="reset-code"
              type="text"
              placeholder="Código de recuperación"
              className="bg-white border border-gray-300 rounded-xl px-4 py-4 w-full text-center tracking-widest focus:ring-2 focus:ring-blue-400 text-gray-900"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />

            <label htmlFor="new-password" className="sr-only">Nueva contraseña</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              placeholder="Nueva contraseña"
              className="bg-white border border-gray-300 rounded-xl px-4 py-4 w-full focus:ring-2 focus:ring-blue-400 text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label htmlFor="confirm-password" className="sr-only">Confirmar contraseña</label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              placeholder="Confirmar contraseña"
              className="bg-white border border-gray-300 rounded-xl px-4 py-4 w-full focus:ring-2 focus:ring-blue-400 text-gray-900"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && (
              <p className="text-red-500 text-sm font-semibold text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60"
            >
              {loading ? "Restableciendo..." : "Restablecer contraseña"}
            </button>
          </form>

          <p className="text-sm text-gray-700 text-center mt-4">
            <AnchorWithLoader
              href="/forgot-password"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Reenviar código
            </AnchorWithLoader>
          </p>
        </div>
      </main>
    </>
  );
}
