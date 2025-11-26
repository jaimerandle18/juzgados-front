"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "src/lib/api";
import image from "../../public/agaboga.png";
import LoadingScreen from "../components/LoadingScreen";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [contrasenia, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading]= useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // primero prevenís el reload
    setError("");
    setLoading(true); // recién acá mostrás el loader
  
    if (!nombre || !apellido || !email || !contrasenia) {
      setError("Completá todos los campos");
      setLoading(false);
      return;
    }
  
    try {
      const res = await api.post("/auth/register", {
        nombre,
        apellido,
        email,
        contrasenia,
      });
  
      if (res.status === 200 || res.status === 201) {
        console.log(`📧 Token enviado a ${email}`);
        localStorage.setItem("email_verificacion", email);
        await router.push("/verify-token");
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setError("Error al registrarse. Intente nuevamente.");
    }
  };
  

  return (
    <main className="min-h-screen bg-fondo flex flex-col justify-start items-center pt-8 px-4"style={{marginTop:"60px"}}>
        {loading && <LoadingScreen/>}
      {/* 🧑‍⚖️ Logo */}
      <Image
        src={image}
        alt="Abogados en Acción"
        width={150}
        height={150}
        priority
        style={{marginBottom:"-20px"}}
      />

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-grisOscuro p-4 rounded-3xl shadow-card w-full max-w-sm flex flex-col gap-4 items-center"
      >
        <h1 className="text-2xl font-bold text-black mb-2">Crear cuenta</h1>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          style={{border:"2px solid grey"}}
          onChange={(e) => setNombre(e.target.value)}
          className="bg-white text-black rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rojo"
        />

        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          style={{border:"2px solid grey"}}
          onChange={(e) => setApellido(e.target.value)}
          className="bg-white text-black rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rojo"
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          style={{border:"2px solid grey"}}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-whitetext-black rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rojo"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={contrasenia}
          style={{border:"2px solid grey"}}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-whitetext-black rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-rojo"
        />

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button
        style={{backgroundColor:"#1f5691"}}
          type="submit"
          className="bg-#1f5691 hover:text-white font-semibold py-3 rounded-2xl transition w-full"
        >
          Registrarse
        </button>

        <p className="text-sm text-gray-600 mt-3">
          ¿Ya tenés cuenta?{" "}
          <a href="/login" className="text-rojo font-semibold hover:underline">
            Iniciá sesión
          </a>
        </p>
      </form>
    </main>
  );
}
