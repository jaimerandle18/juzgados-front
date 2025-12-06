"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setCookie } from "cookies-next";
import { api } from "src/lib/api";
import LoadingScreen from "../components/LoadingScreen";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("Ingresá tus credenciales");
      setIsLoading(false);
      return;
    }

    try {
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center pt-14 px-4">
      {loading && <LoadingScreen />}

      {/* TÍTULO */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Iniciar sesión</h1>
        <div className="mx-auto mt-3 h-[3px] w-24 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
      </div>

      {/* FORM CON CARD */}
      <div
        className="
          w-full max-w-sm 
          flex flex-col
          space-y-10          /* MÁS ESPACIO ENTRE INPUTS EN MOBILE */
          md:space-y-5       /* Más compacto en desktop */
        "
      >
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">

          <input
            type="email"
            placeholder="Correo electrónico"
            className="
              bg-white border border-gray-300 rounded-xl 
              px-4 py-4 w-full 
              focus:ring-2 focus:ring-blue-400
              text-gray-900
              mt-10
              md:mt-1
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="
              bg-white border border-gray-300 rounded-xl 
              px-4 py-4 w-full
              focus:ring-2 focus:ring-blue-400
              text-gray-900
              mt-1
              md:mt-1
            "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-sm font-semibold text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="
              bg-blue-600 hover:bg-blue-700 
              text-white py-4 rounded-2xl 
              font-semibold shadow-lg 
              hover:-translate-y-0.5 transition-all
               mt-7
              md:mt-1
            "
          >
            Ingresar
          </button>
        </form>

        <p className="text-sm text-gray-700 text-center">
          ¿No tenés cuenta?
          <Link
            href="/register"
            className="text-blue-600 font-semibold ml-1 hover:underline"
          >
            Registrate
          </Link>
        </p>
      </div>
    </main>
  );
}
