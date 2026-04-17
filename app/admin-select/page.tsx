"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminSelectPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    try {
      const isAdmin = localStorage.getItem("es_admin") === "1";
      if (!isAdmin) {
        router.replace("/");
        return;
      }
      setAllowed(true);
    } catch {
      router.replace("/");
    }
  }, [router]);

  if (!allowed) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">
          ¿Cómo querés ingresar?
        </h1>
        <div className="dj-grad-line mx-auto mt-3 h-[3px] w-28 rounded-full" />
        <p className="text-gray-600 mt-4 text-sm">
          Detectamos que sos administrador
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col space-y-4">
        <button
          onClick={() => router.replace("/admin/stats")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold shadow-lg hover:-translate-y-0.5 transition-all"
        >
          Entrar como admin
        </button>

        <button
          onClick={() => router.replace("/")}
          className="bg-gray-800 hover:bg-gray-900 text-white py-4 rounded-2xl font-semibold shadow-lg hover:-translate-y-0.5 transition-all"
        >
          Entrar como usuario
        </button>
      </div>
    </main>
  );
}
