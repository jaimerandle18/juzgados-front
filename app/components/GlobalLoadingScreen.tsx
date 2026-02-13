"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { registerLoader } from "./globalLoader";
import { Capacitor } from "@capacitor/core";
import { forceHideLoader } from "./globalLoader";
import { usePathname } from "next/navigation";




export default function GlobalLoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  const pathname = usePathname();

  useEffect(() => {
    forceHideLoader(); // cada vez que cambia la ruta, cerrá loader
  }, [pathname]);

  useEffect(() => {
    const isIOSApp = Capacitor.isNativePlatform() && Capacitor.getPlatform() === "ios";

    registerLoader(
      (msg?: string) => {
        setMessage(msg);

        // 🔑 iOS: mostralo en el próximo frame para evitar “gap” de paint
        if (isIOSApp) requestAnimationFrame(() => setVisible(true));
        else setVisible(true);
      },
      () => {
        setVisible(false);
        // no lo borres instantáneo (evita re-layout raro)
        setTimeout(() => setMessage(undefined), 150);
      }
    );
   const close = () => forceHideLoader();

  // back/forward
  window.addEventListener("popstate", close);

  // 🔥 iOS BFCache: al volver atrás, se dispara pageshow y NO corren effects normales
  window.addEventListener("pageshow", close);

  // opcional: si vuelve de background
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") close();
  });

  return () => {
    window.removeEventListener("popstate", close);
    window.removeEventListener("pageshow", close);
    document.removeEventListener("visibilitychange", () => {});
  };
  }, []);

  // 🔑 En vez de return null, dejamos el nodo y lo ocultamos con display
  return (
    <div
      className="dj-global-loader"
      style={{
        display: visible ? "block" : "none",
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        backgroundColor: "#f3f4f6", // 🔥 sólido SIEMPRE
        transform: "translate3d(0,0,0)",
        WebkitTransform: "translate3d(0,0,0)",
      }}
    >
      <LoadingScreen message={message} />
    </div>
  );
}
