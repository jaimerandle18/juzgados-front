"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Scale, Gavel, Globe2 } from "lucide-react";
import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { App } from "@capacitor/app";
import { showLoader } from "./components/globalLoader";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { forceHideLoader } from "./components/globalLoader";
import SearchBar from "./components/SearchBar";

export default function Home() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let handle: PluginListenerHandle | null = null;

    const setup = async () => {
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setStyle({ style: Style.Light });

      handle = await App.addListener("backButton", ({ canGoBack }) => {
        if (canGoBack) window.history.back();
        else App.exitApp();
      });
    };

    setup();

    return () => {
      handle?.remove();
      handle = null;
    };
  }, []);

  return (
    <main className="flex min-h-[calc(100dvh-8rem)] flex-col justify-center pb-6">
      <div className="max-w-lg mx-auto w-full flex flex-col gap-5 sm:gap-6">
        <SearchBar />

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
  const router = useRouter();
  const isNative = useMemo(() => Capacitor.isNativePlatform(), []);
  // Sólo aplicamos hover/tap de Framer Motion en dispositivos con
  // puntero preciso (desktop). En touch queda estático.
  const hasHover = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    []
  );

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
      tabIndex={0}
      onClick={go}
      whileHover={hasHover ? { scale: 1.03 } : undefined}
      whileTap={hasHover ? { scale: 0.98 } : undefined}
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