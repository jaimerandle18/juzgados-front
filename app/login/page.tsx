"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { setCookie } from "cookies-next";
import { api } from "@/src/lib/api";
import image from "../../../public/abogadosea.png";
import LoadingScreen from "../components/LoadingScreen";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading,setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true)
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Ingresá tus credenciales");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });
      setCookie("auth_token", res.data.token);
      router.push("/home");
    } catch (err: any) {
      console.error(err);
      setError("Credenciales incorrectas o error del servidor");
    }
    finally{
        setIsLoading(false)
    }
  };

  return (
    <main className="min-h-screen bg-fondo flex flex-col justify-start items-center pt-8 px-4">
        {loading && <LoadingScreen/>}
      {/* 🧑‍⚖️ Logo */}
      <Image
        src={image}
        alt="Abogados en Acción"
        width={150}
        height={150}
        priority
        className="mb-8"
      />

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-grisOscuro p-6 rounded-3xl shadow-card w-full max-w-sm flex flex-col gap-4 items-center"
      >
        <h1 className="text-2xl font-bold text-white mb-2">
          Iniciar sesión
        </h1>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#222] text-white rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rojo"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#222] text-white rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rojo"
        />

        {error && (
          <p className="text-red-500 text-sm font-medium">{error}</p>
        )}

        <button
          type="submit"
          className="bg-rojo hover:bg-red-800 text-white font-semibold py-3 rounded-2xl transition w-full"
        >
          Ingresar
        </button>

        {/* 🔗 Link a registro */}
        <p className="text-sm text-gray-400 mt-3">
          ¿No tenés cuenta?{" "}
          <Link
            href="/register"
            className="text-rojo font-semibold hover:underline"
          >
            Registrate
          </Link>
        </p>
      </form>
    </main>
  );
}
