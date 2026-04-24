"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "src/lib/api";
import LoadingScreen from "../components/LoadingScreen";
import logo from "../../public/dataJury1.png";
import AnchorWithLoader from "@/components/AnchorWithLoader";
import { navigateWithLoader } from "@/components/NavigateWithLoader";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tomo, setTomo] = useState("");
const [folio, setFolio] = useState("");


  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

   if (!nombre || !apellido || !email || !contrasenia || !tomo || !folio) {
  setError("Completá todos los campos");
  setLoading(false);
  return;
   }

   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
     setError("Ingresá un email válido");
     setLoading(false);
     return;
   }

    try {
      const res = await api.post("/auth/register", {
        nombre,
        apellido,
        email,
        contrasenia,
        tomo,
        folio,
      });      

      localStorage.setItem("email_verificacion", email);
      navigateWithLoader(router,"/verify-token");
    } catch (err) {
      console.error(err);
      setError("Error al registrarse");
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center px-4 pt-10">
     {loading && (
  <LoadingScreen
    message="Estamos validando tu matrícula con el Colegio Público de Abogados. Esto puede tardar unos segundos, por favor no cierres la página."
    showSponsor
  />
)}


      {/* TÍTULO */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Crear cuenta</h1>
        <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />
      </div>
      <div className="mb-6 w-full max-w-sm rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
  <strong>Importante:</strong>  
  Para validar tu matrícula, ingresá <strong>exactamente</strong> el mismo
  <strong> nombre, apellido, tomo y folio</strong> con el que estás registrado
  en el <strong>Colegio Público de Abogados</strong>.
  <br />
  <span className="block mt-1 text-blue-700">
    Si los datos no coinciden, no podremos validar tu cuenta.
  </span>
</div>


      <form className="w-full max-w-sm flex flex-col gap-5" onSubmit={handleSubmit}>
        <label htmlFor="reg-nombre" className="sr-only">Nombre</label>
        <input
          id="reg-nombre"
          autoComplete="given-name"
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-400"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <label htmlFor="reg-apellido" className="sr-only">Apellido</label>
        <input
          id="reg-apellido"
          autoComplete="family-name"
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-400"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />

        <label htmlFor="reg-tomo" className="sr-only">Tomo</label>
        <input
          id="reg-tomo"
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 w-full"
          placeholder="Tomo (hasta 3 dígitos)"
          value={tomo}
          onChange={(e) => setTomo(e.target.value.replace(/\D/g, "").slice(0, 3))}
        />

        <label htmlFor="reg-folio" className="sr-only">Folio</label>
        <input
          id="reg-folio"
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 w-full"
          placeholder="Folio (hasta 4 dígitos)"
          value={folio}
          onChange={(e) => setFolio(e.target.value.replace(/\D/g, "").slice(0, 4))}
        />

        <label htmlFor="reg-email" className="sr-only">Correo electrónico</label>
        <input
          id="reg-email"
          type="email"
          autoComplete="email"
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-400"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
        />

        <label htmlFor="reg-password" className="sr-only">Contraseña</label>
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-400"
          placeholder="Contraseña"
          value={contrasenia}
          onChange={(e) => setContrasenia(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold shadow-md transition"
        >
          Registrarse
        </button>

        <p className="text-sm text-gray-700 text-center mt-2 mb-16">
          ¿Ya tenés cuenta?
          <AnchorWithLoader href="/login" className="ml-1 inline-block px-2 py-0.5 rounded-md bg-blue-600 text-white font-semibold text-xs shadow-md hover:bg-blue-700 transition-all">
            Iniciar sesión
          </AnchorWithLoader>
        </p>
      </form>
    </main>
  );
}
