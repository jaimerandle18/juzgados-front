"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import djLogo from "../../public/dataJury1.png";

function playStartupSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.7, t);
    master.connect(ctx.destination);

    // Reverb simulado con delay
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.12;
    const fbGain = ctx.createGain();
    fbGain.gain.value = 0.25;
    delay.connect(fbGain);
    fbGain.connect(delay);
    delay.connect(master);

    // Helper para crear oscilador con envelope
    const voice = (
      type: OscillatorType, freq: number, start: number, end: number,
      vol: number, attack: number, freqEnd?: number, useFb?: boolean
    ) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t + start);
      if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, t + end - 0.1);
      g.gain.setValueAtTime(0, t + start);
      g.gain.linearRampToValueAtTime(vol, t + start + attack);
      g.gain.setValueAtTime(vol, t + end - (end - start) * 0.4);
      g.gain.exponentialRampToValueAtTime(0.001, t + end);
      o.connect(g);
      g.connect(master);
      if (useFb) g.connect(delay);
      o.start(t + start);
      o.stop(t + end + 0.5);
    };

    // --- CAPA 1: Sub bass profundo (que se siente, no se escucha tanto) ---
    voice("sine", 55, 0, 3.0, 0.12, 0.8, 75);

    // --- CAPA 2: Pad cálido - acorde mayor abierto (Do-Sol-Mi) ---
    // Fundamental Do3
    voice("sine", 130.8, 0.1, 3.2, 0.07, 0.6, 138);
    // Quinta Sol3
    voice("sine", 196, 0.2, 3.3, 0.06, 0.7, 207);
    // Tercera Mi4 (arriba, etéreo)
    voice("sine", 329.6, 0.3, 3.4, 0.04, 0.8, 349);
    // Octava Do4
    voice("sine", 261.6, 0.15, 3.1, 0.05, 0.7, 277);

    // --- CAPA 3: Shimmer cristalino (como campanitas PS5) ---
    voice("sine", 1318, 0.5, 2.8, 0.03, 0.1, 1400, true);
    voice("sine", 1568, 0.7, 2.6, 0.025, 0.1, 1660, true);
    voice("sine", 2093, 0.9, 2.4, 0.02, 0.08, 2200, true);
    voice("triangle", 987, 0.6, 2.9, 0.02, 0.15, 1050, true);

    // --- CAPA 4: Sweep ascendente etéreo ---
    const sw = ctx.createOscillator();
    const swG = ctx.createGain();
    sw.type = "sine";
    sw.frequency.setValueAtTime(200, t + 0.1);
    sw.frequency.exponentialRampToValueAtTime(800, t + 1.5);
    sw.frequency.exponentialRampToValueAtTime(600, t + 3.0);
    swG.gain.setValueAtTime(0, t);
    swG.gain.linearRampToValueAtTime(0.04, t + 0.5);
    swG.gain.setValueAtTime(0.04, t + 1.5);
    swG.gain.exponentialRampToValueAtTime(0.001, t + 3.2);
    sw.connect(swG);
    swG.connect(master);
    swG.connect(delay);
    sw.start(t + 0.1);
    sw.stop(t + 3.5);

    // --- CAPA 5: Nota final de resolución (ding suave) ---
    voice("sine", 523.2, 2.0, 3.8, 0.035, 0.15);
    voice("sine", 659.2, 2.1, 3.7, 0.025, 0.15, undefined, true);
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
