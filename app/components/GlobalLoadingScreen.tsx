"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import { registerLoader } from "./globalLoader";

export default function GlobalLoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  useEffect(() => {
    return registerLoader(
      (msg?: string) => {
        setMessage(msg);
        setVisible(true);
      },
      () => {
        setVisible(false);
        // no borres el message inmediatamente (evita 1 frame raro)
        setTimeout(() => setMessage(undefined), 150);
      }
    );
  }, []);

  return (
    <div
      aria-hidden={!visible}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        // 🔑 fondo sólido desde el frame 0
        background: "#f3f4f6",
        // 🔑 no “desaparece” del DOM -> evita flash negro
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 120ms ease",
        transform: "translate3d(0,0,0)",
        WebkitTransform: "translate3d(0,0,0)",
        willChange: "opacity",
      }}
    >
      <LoadingScreen message={message} />
    </div>
  );
}
