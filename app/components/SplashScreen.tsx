"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

function playSwoosh() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 0.45;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + duration * 0.4);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + duration * 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {}
}

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const doneRef = useRef(false);

  useEffect(() => {
    playSwoosh();
    const timer = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-white"
      style={{ zIndex: 999999 }}
    >
      {/* Logo DataJury */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Image
          src="/dataJury1.png"
          alt="Data Jury"
          width={180}
          height={80}
          priority
          style={{ objectFit: "contain" }}
        />
      </motion.div>

      {/* Barra de carga */}
      <div className="mt-8 w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.6, ease: "easeInOut" }}
        />
      </div>

      {/* Sponsor */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-16 flex flex-col items-center gap-3"
      >
        <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">
          Sponsored by
        </p>
        <Image
          src="/gobiernoabierto.png"
          alt="Gobierno Abierto"
          width={160}
          height={50}
          style={{ objectFit: "contain" }}
        />
      </motion.div>
    </motion.div>
  );
}
