"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { registerLoader } from "./globalLoader";
import { Capacitor } from "@capacitor/core";

export default function GlobalLoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

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
