"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/src/lib/api";
import image from "../../../public/abogadosea.png";

export default function VerifyTokenPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [codigo, setToken] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // ✅ obtener el email almacenado al registrarse
  useEffect(() => {
    const savedEmail = localStorage.getItem("email_verificacion");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      // si no hay email guardado, lo manda al registro
      router.push("/register");
    }
  }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!codigo || !email) {
      setError("Faltan datos para verificar");
      return;
    }

    try {
      const res = await api.post("/auth/verify", {
        email,
        codigo,
      });

      if (res.status === 200) {
        alert("Cuenta verificada ✅");
        localStorage.removeItem("email_verificacion"); // limpiamos el localStorage
        router.push("/home");
      }
    } catch (err) {
      console.error(err);
      setError("Token inválido o expirado ❌");
    }
  };

  return (
    <main className="min-h-screen bg-fondo flex flex-col justify-start items-center pt-16 px-4">
      <Image
        src={image}
        alt="Abogados en Acción"
        width={150}
        height={150}
        priority
        className="mb-8"
      />

      <form
        onSubmit={handleVerify}
        className="bg-grisOscuro p-6 rounded-3xl shadow-card w-full max-w-sm flex flex-col gap-4 items-center"
      >
        <h1 className="text-2xl font-bold text-white mb-2">
          Verificá tu cuenta
        </h1>
        <p className="text-gray-400 text-sm text-center mb-2">
          Ingresá el código que te enviamos a <br />
          <span className="text-white font-semibold">{email}</span>
        </p>

        <input
          type="text"
          placeholder="Código de verificación"
          value={codigo}
          onChange={(e) => setToken(e.target.value)}
          className="bg-[#222] text-white rounded-xl px-4 py-3 w-full text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-rojo"
        />

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          className="bg-rojo hover:bg-red-800 text-white font-semibold py-3 rounded-2xl transition w-full"
        >
          Verificar
        </button>
      </form>
    </main>
  );
}
