"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "src/lib/api";
import LoadingScreen from "../components/LoadingScreen";
import logo from "../../public/dataJury1.png";

export default function VerifyTokenPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("email_verificacion");
    if (!saved) router.push("/register");
    else setEmail(saved);
  }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/verify", { email, codigo });

      alert("Cuenta verificada ✅");
      localStorage.removeItem("email_verificacion");
      router.push("/");
    } catch {
      setError("Código inválido o expirado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-4 pt-10">
      {loading && <LoadingScreen />}

      {/* TÍTULO */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Verificá tu cuenta</h1>
        <div className="mx-auto mt-3 h-[3px] w-24 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
      </div>

      <form onSubmit={handleVerify} className="w-full max-w-sm flex flex-col gap-5">
        <p className="text-gray-700 text-center mb-1">
          Ingresá el código enviado a:
        </p>
        <p className="text-blue-700 font-semibold text-center mb-4">{email}</p>

        <input
          type="text"
          placeholder="Código de verificación"
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 w-full text-center tracking-widest focus:ring-2 focus:ring-blue-400"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold shadow-md transition"
        >
          Verificar
        </button>
      </form>
    </main>
  );
}
