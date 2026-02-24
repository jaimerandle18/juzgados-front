"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteAccountButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const ok = window.confirm(
      "¿Seguro que querés eliminar tu cuenta? Esta acción es permanente."
    );
    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Error");
      }

      // Te llevo a logout (o a /login). Ideal: /logout borra cookie.
      router.push("/logout");
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar la cuenta. Intentá nuevamente.");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
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