"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cookies } from "next/headers";

export default async function DeleteAccountButton () {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value ?? "";

  const handleDelete = async () => {
    const ok = window.confirm(
      "¿Seguro que querés eliminar tu cuenta? Esta acción es permanente."
    );
    if (!ok) return;

    setLoading(true);
    try {
      // Llamamos a un endpoint interno para poder leer cookies httpOnly desde server
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/usuarios/me`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token ?? ""}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(await res.text());

      // Si salió bien, limpiamos sesión y mandamos al login
      router.push("/login");
      router.refresh();
    } catch (e) {
      alert("No se pudo eliminar la cuenta. Intentá nuevamente.");
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="
        mt-4 inline-block w-full text-center
        px-6 py-3 font-semibold rounded-xl
        text-white bg-red-600
        hover:bg-red-700 hover:shadow-md transition-all
        disabled:opacity-60 disabled:cursor-not-allowed
      "
    >
      {loading ? "Eliminando..." : "Eliminar cuenta"}
    </button>
  );
}