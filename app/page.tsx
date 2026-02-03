"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Scale, Gavel, Globe2 } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { App } from "@capacitor/app";
import { showLoader } from "./components/globalLoader";

export default function Home() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Light });

    const sub = App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) window.history.back();
      else App.exitApp();
    });

    return () => void sub.remove();
  }, []);

  return (
    <main className="min-h-screen px-6 pt-20">
      <div className="max-w-lg mx-auto flex flex-col gap-6 sm:gap-8">
        <MenuCard
          href="/fueros/categorias/nacionales"
          title="Fueros Nacionales"
          icon={<Scale className="w-8 h-8 text-blue-700" />}
        />

        <MenuCard
          href="/fueros/categorias/federales"
          title="Fueros Federales"
          icon={<Gavel className="w-8 h-8 text-blue-700" />}
        />

        <MenuCard
          href="/fueros/categorias/competencia-pais"
          title="Competencia en todo el país"
          icon={<Globe2 className="w-8 h-8 text-blue-700" />}
        />
      </div>
    </main>
  );
}

function MenuCard({
  href,
  title,
  icon,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      onClick={() => showLoader()}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        dj-card
        relative overflow-hidden
        p-6

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
      {/* glow hover suave */}
      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity pointer-events-none" />

      <div className="dj-card-icon p-4">
        {icon}
      </div>

      <span className="tracking-wide font-bold text-lg sm:text-xl">
        {title}
      </span>
    </motion.a>
  );
}
