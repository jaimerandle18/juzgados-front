"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteMyAccount } from "src/lib/auth"; // ajustá el path real

export default function DeleteAccountButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const ok = window.confirm(
      "⚠️ Esta acción es irreversible.\n\nSe eliminará tu cuenta y tus votos.\n\n¿Querés continuar?"
    );
    if (!ok) return;

    try {
      setLoading(true);

      await deleteMyAccount();

      // Después de borrar, mandalo a logout para limpiar cookie/token
      router.push("/login");
      router.refresh();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "No se pudo eliminar la cuenta";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="
        mt-4 w-full
        px-6 py-3
        font-semibold rounded-xl
        text-white bg-red-600
        hover:bg-red-700 hover:shadow-md
        transition-all
        disabled:opacity-60 disabled:cursor-not-allowed
      "
    >
      {loading ? "Eliminando cuenta..." : "Eliminar mi cuenta"}
    </button>
  );
}