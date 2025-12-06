"use client";
import { getCookie } from "cookies-next";
import { motion } from "framer-motion";
import { Scale, Gavel, Globe2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useNavigate, useNavigation } from "react-router-dom";

export default function Home() {
  // Si está en "/" y no hay token → enviar a login
  const pathname = usePathname()
  const token = getCookie("auth_token")
  const router = useRouter()
if (pathname === "/" && !token) {
  router.push("/login");
}

  return (
    <main className="min-h-screen px-6 pt-20 text-white from-black to-gray-900">

      {/* Contenedor principal */}
      <div className="max-w-lg mx-auto flex flex-col gap-6 sm:gap-8">
        <MenuCard
          href="/fueros/categorias/nacionales"
          title="Fueros Nacionales"
          icon={<Scale className="w-8 h-8" />}
          gradient="from-white-500 to-blue-200"
        />

        <MenuCard
          href="/fueros/categorias/federales"
          title="Fueros Federales"
          icon={<Gavel className="w-8 h-8" />}
          gradient="from-white-500 to-blue-200"
        />

        <MenuCard
          href="/fueros/categorias/competencia-pais"
          title="Competencia en todo el país"
          icon={<Globe2 className="w-8 h-8" />}
          gradient="from-white-500 to-blue-200"
        />
      </div>
    </main>
  );
}

function MenuCard({ href, title, icon, gradient }: any) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ color: "black" }}
      className={`
        relative overflow-hidden group 
        rounded-2xl 
        p-15 sm:p-6         /* MÁS ESPACIO EN MOBILE */
        shadow-xl 
        bg-gradient-to-r ${gradient}
        font-bold 
        text-xl sm:text-lg /* TEXTO UN POCO MÁS GRANDE EN MOBILE */
        flex items-center gap-10 sm:gap-4
      `}
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />

      {/* Icono */}
      <div
        className="p-3 sm:p-3 rounded-xl backdrop-blur-sm"
        style={{ backgroundColor: "lab(77.5052% -6.4629 -36.42)" }}
      >
        {icon}
      </div>

      {/* Texto */}
      <span className="tracking-wide">{title}</span>
    </motion.a>
  );
}
