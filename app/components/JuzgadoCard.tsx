"use client";

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  id: number;
  nombre: string;
  ciudad?: string;
  promedio?: number;
  telefono: string;
  email: string;
};

export default function JuzgadoCard({ id, nombre, ciudad, promedio = 0, telefono, email }: Props) {
  const router = useRouter();

  return (
    <motion.article
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 ,duration: 0.3 }}
      onClick={() => router.push(`/juzgado/${id}`)}
      className="
        relative
        group
        cursor-pointer
        bg-[#1a1a1a]/80
        backdrop-blur-xl
        rounded-3xl
        shadow-[0_8px_30px_rgba(0,0,0,0.3)]
        overflow-hidden
        p-6
        flex
        flex-col
        gap-3
        border border-transparent
        hover:border-rojo
        hover:shadow-[0_0_25px_rgba(255,0,0,0.25)]
        transition-all
        duration-100
      "
    >
      {/* Barra lateral decorativa */}
      <span
        className="
          absolute
          left-0
          top-0
          bottom-0
          w-1.5
          bg-gradient-to-b from-rojo to-red-800
        "
      />

      {/* Contenido principal */}
      <div className="pl-3">
        <h2 className="text-xl font-semibold tracking-tight group-hover:text-rojo transition-colors">
          {nombre}
        </h2>
        <p style={{marginTop:"5px"}} className="text-sm text-gray-400">{ciudad || "Sin ciudad"}</p>
        <p style={{marginTop:"5px"}}className="text-sm text-gray-400">📞 {telefono || "Sin teléfono"}</p>
        <p style={{marginTop:"5px"}}className="text-sm text-gray-400 truncate">📧 {email || "Sin email"}</p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 pl-3 mt-2">
        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        <span className="font-semibold text-base">{promedio.toFixed(1)}</span>
      </div>

      {/* Botones */}
      <div className="flex gap-3 mt-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/juzgado/${id}`);
          }}
          className="w-1/2 bg-rojo hover:bg-red-800 text-white font-semibold py-2.5 rounded-2xl transition"
        >
          Evaluar
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/juzgado/${id}/promedios`);
          }}
          className="w-1/2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2.5 rounded-2xl transition"
        >
          Ver Evaluaciones
        </motion.button>
      </div>
    </motion.article>
  );
}
