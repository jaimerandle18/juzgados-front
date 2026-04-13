"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import djLogo from "../../public/dataJury1.png";

// Reproduce el tono "Portal" de iOS directo desde public/portal.mp3.
// Se ejecuta siempre dentro de un gesto/render del usuario (login o
// "ingresar como invitado"), así que el autoplay queda permitido.
function playStartupSound() {
  try {
    const audio = new Audio("/portal.mp3");
    audio.volume = 0.9;
    // `.play()` devuelve una promesa — si el navegador lo bloquea
    // (desktop sin interacción previa) lo ignoramos silencioso.
    void audio.play().catch(() => {});
  } catch {}
}

const SPONSOR_URL = "https://www.asocgobiernoabierto.org/wp-content/uploads/2026/03/Logotipo-AGA.png";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const doneRef = useRef(false);

  useEffect(() => {
    playStartupSound();
    const timer = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-white"
      style={{ zIndex: 999999 }}
    >
      {/* Logo DataJury */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src={djLogo}
          alt="Data Jury"
          width={200}
          height={90}
          priority
          className="dj-logo"
          style={{ objectFit: "contain" }}
        />
      </motion.div>

      {/* Barra de carga */}
      <div className="mt-8 w-52 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5.2, ease: "easeInOut" }}
        />
      </div>

      {/* Sponsor */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-16 flex flex-col items-center gap-4"
      >
        <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">
          Sponsored by
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SPONSOR_URL}
          alt="Gobierno Abierto"
          width={170}
          height={55}
          style={{ objectFit: "contain" }}
        />
      </motion.div>
    </motion.div>
  );
}
