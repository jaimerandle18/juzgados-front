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
    <main className="min-h-screen  flex flex-col items-center px-4 pt-10" >
     {loading && (
  <LoadingScreen
    message="Estamos validando tu matrícula con el Colegio Público de Abogados. Esto puede tardar unos segundos, por favor no cierres la página."
  />
)}


      {/* TÍTULO */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Crear cuenta</h1>
        <div className="mx-auto mt-3 h-[3px] w-24 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" />
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
        <input
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-400"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-400"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />
        <input
  className="bg-white border border-gray-300 rounded-xl px-4 py-3 w-full"
  placeholder="Tomo (hasta 3 dígitos)"
  value={tomo}
  onChange={(e) =>
    setTomo(e.target.value.replace(/\D/g, "").slice(0, 3))
  }
/>

<input
  className="bg-white border border-gray-300 rounded-xl px-4 py-3 w-full"
  placeholder="Folio (hasta 4 dígitos)"
  value={folio}
  onChange={(e) =>
    setFolio(e.target.value.replace(/\D/g, "").slice(0, 4))
  }
/>


<input
  type="email"
  className="bg-white border border-gray-300 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-400"
  placeholder="Correo electrónico"
  value={email}
  onChange={(e) => setEmail(e.target.value.toLowerCase())}
/>

        <input
          type="password"
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

        <p className="text-sm text-gray-700 text-center mt-2">
          ¿Ya tenés cuenta?
          <AnchorWithLoader href="/login" className="text-blue-600 font-semibold ml-1 hover:underline">
            Iniciar sesión
          </AnchorWithLoader>
        </p>
      </form>
    </main>
  );
}
