"use client";
import { motion } from "framer-motion";
import { Scale, Gavel, Globe2 } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { App } from "@capacitor/app";
import { showLoader } from "./components/globalLoader";

export default function Home() {

  if (Capacitor.isNativePlatform()) {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Light });
  }


if (Capacitor.isNativePlatform()) {
  App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });
}
  return (
    <main className="min-h-screen px-6 pt-20 text-white from-black to-gray-900">

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
      onClick={() => showLoader()}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ color: "black" }}
      className={`
        relative overflow-hidden group 
        rounded-2xl shadow-xl 
        bg-gradient-to-r ${gradient}
        p-6

        /* MOBILE: icono arriba, texto centrado */
        flex flex-col items-center text-center gap-4

        /* DESKTOP: icono + texto en fila */
        sm:flex-row sm:text-left sm:items-center sm:gap-6
      `}
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />

      {/* Icono */}
      <div
        className="p-4 rounded-xl backdrop-blur-sm"
        style={{ backgroundColor: "lab(77.5052% -6.4629 -36.42)" }}
      >
        {icon}
      </div>

      {/* Texto */}
      <span className="tracking-wide font-bold text-lg sm:text-xl break-words">
        {title}
      </span>
    </motion.a>
  );
}
