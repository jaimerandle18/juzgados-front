"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { showLoader, forceHideLoader } from "./components/globalLoader"; // 👈 forceHide si lo tenés
import { Capacitor } from "@capacitor/core";

function MenuCard({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) {
  const router = useRouter();
  const isNative = useMemo(() => Capacitor.isNativePlatform(), []);

  const go = () => {
    // 🔑 En app: usamos navegación SPA, así el loader puede cerrarse bien
    showLoader();
    router.push(href);

    // 🔒 Failsafe: si por cualquier motivo queda colgado, lo cerramos
    // (en iOS a veces hay navegaciones rápidas/back-forward cache)
    if (isNative) setTimeout(() => forceHideLoader?.(), 2500);
  };

  return (
    <motion.button
      type="button"
      onClick={go}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        dj-card
        relative overflow-hidden
        p-6 w-full
        flex flex-col items-center text-center gap-4
        sm:flex-row sm:text-left sm:items-center sm:gap-6
        text-gray-900
      "
      style={{
        transform: "translate3d(0,0,0)",
        WebkitTransform: "translate3d(0,0,0)",
        willChange: "transform",
      }}
    >
      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity pointer-events-none" />
      <div className="dj-card-icon p-4">{icon}</div>
      <span className="tracking-wide font-bold text-lg sm:text-xl">{title}</span>
    </motion.button>
  );
}
