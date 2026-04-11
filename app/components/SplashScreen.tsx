"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

function playStartupSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;

    // Capa 1: tono grave de fondo (pad)
    const pad = ctx.createOscillator();
    const padGain = ctx.createGain();
    pad.type = "sine";
    pad.frequency.setValueAtTime(180, now);
    pad.frequency.linearRampToValueAtTime(220, now + 1.2);
    padGain.gain.setValueAtTime(0, now);
    padGain.gain.linearRampToValueAtTime(0.08, now + 0.3);
    padGain.gain.setValueAtTime(0.08, now + 0.8);
    padGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    pad.connect(padGain);
    padGain.connect(ctx.destination);
    pad.start(now);
    pad.stop(now + 1.5);

    // Capa 2: sweep ascendente (el "fiiuum" principal)
    const sweep = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweep.type = "sine";
    sweep.frequency.setValueAtTime(250, now + 0.05);
    sweep.frequency.exponentialRampToValueAtTime(900, now + 0.5);
    sweep.frequency.exponentialRampToValueAtTime(1100, now + 0.9);
    sweep.frequency.exponentialRampToValueAtTime(700, now + 1.3);
    sweepGain.gain.setValueAtTime(0, now);
    sweepGain.gain.linearRampToValueAtTime(0.13, now + 0.15);
    sweepGain.gain.setValueAtTime(0.13, now + 0.6);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
    sweep.connect(sweepGain);
    sweepGain.connect(ctx.destination);
    sweep.start(now + 0.05);
    sweep.stop(now + 1.4);

    // Capa 3: brillo agudo (shimmer)
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = "triangle";
    shimmer.frequency.setValueAtTime(600, now + 0.2);
    shimmer.frequency.exponentialRampToValueAtTime(1400, now + 0.7);
    shimmer.frequency.exponentialRampToValueAtTime(1000, now + 1.2);
    shimmerGain.gain.setValueAtTime(0, now + 0.2);
    shimmerGain.gain.linearRampToValueAtTime(0.06, now + 0.4);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmer.start(now + 0.2);
    shimmer.stop(now + 1.3);

    // Capa 4: "ding" final de confirmación
    const ding = ctx.createOscillator();
    const dingGain = ctx.createGain();
    ding.type = "sine";
    ding.frequency.setValueAtTime(880, now + 0.8);
    dingGain.gain.setValueAtTime(0, now + 0.8);
    dingGain.gain.linearRampToValueAtTime(0.1, now + 0.85);
    dingGain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
    ding.connect(dingGain);
    dingGain.connect(ctx.destination);
    ding.start(now + 0.8);
    ding.stop(now + 1.6);
  } catch {}
}

const SPONSOR_LOGO = "https://asocgobiernoabierto.org/wp-content/uploads/2026/03/Logotipo-AGA.png";

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/dataJury1.png"
          alt="Data Jury"
          width={200}
          height={90}
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
          src={SPONSOR_LOGO}
          alt="Gobierno Abierto"
          width={170}
          height={55}
          style={{ objectFit: "contain" }}
        />
      </motion.div>
    </motion.div>
  );
}
