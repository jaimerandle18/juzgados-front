"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import djLogo from "../../public/dataJury1.png";

// Sonido estilo "Portal" (tono de SMS de iOS): corto, brillante, etéreo.
// Whoosh ascendente rápido + chime cristalino con shimmer + cola de reverb.
function playStartupSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.75, t);
    master.connect(ctx.destination);

    // Reverb simulado (delay con feedback corto, como sala pequeña etérea)
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.09;
    const fb = ctx.createGain();
    fb.gain.value = 0.32;
    delay.connect(fb);
    fb.connect(delay);
    const wet = ctx.createGain();
    wet.gain.value = 0.5;
    delay.connect(wet);
    wet.connect(master);

    // --- 1) WHOOSH ascendente (portal abriéndose) ---
    // sine que sube de 350Hz a 1800Hz en ~220ms
    const whoosh = ctx.createOscillator();
    const whooshG = ctx.createGain();
    whoosh.type = "sine";
    whoosh.frequency.setValueAtTime(350, t);
    whoosh.frequency.exponentialRampToValueAtTime(1800, t + 0.22);
    whooshG.gain.setValueAtTime(0, t);
    whooshG.gain.linearRampToValueAtTime(0.18, t + 0.06);
    whooshG.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    whoosh.connect(whooshG);
    whooshG.connect(master);
    whooshG.connect(delay);
    whoosh.start(t);
    whoosh.stop(t + 0.4);

    // Capa de aire/noise filtrado para el whoosh (le da textura)
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * 0.4;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf;
    const noiseFilt = ctx.createBiquadFilter();
    noiseFilt.type = "bandpass";
    noiseFilt.frequency.setValueAtTime(800, t);
    noiseFilt.frequency.exponentialRampToValueAtTime(3500, t + 0.22);
    noiseFilt.Q.value = 3;
    const noiseG = ctx.createGain();
    noiseG.gain.setValueAtTime(0, t);
    noiseG.gain.linearRampToValueAtTime(0.06, t + 0.05);
    noiseG.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    noise.connect(noiseFilt);
    noiseFilt.connect(noiseG);
    noiseG.connect(master);
    noiseG.connect(delay);
    noise.start(t);
    noise.stop(t + 0.3);

    // Helper para las notas de campana
    const bell = (freq: number, start: number, dur: number, vol: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, t + start);
      g.gain.linearRampToValueAtTime(vol, t + start + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, t + start + dur);
      o.connect(g);
      g.connect(master);
      g.connect(delay);
      o.start(t + start);
      o.stop(t + start + dur + 0.05);
    };

    // --- 2) CHIME cristalino (el "ping" del portal) ---
    // Acorde brillante: E6 + B6 + E7 (Mi mayor agudo, muy limpio)
    bell(1318.5, 0.20, 0.9, 0.18); // E6
    bell(1975.5, 0.22, 0.8, 0.14); // B6
    bell(2637.0, 0.24, 0.7, 0.10); // E7

    // Armónicos extra para brillo (campanillas)
    bell(3136.0, 0.26, 0.6, 0.06); // G7
    bell(3951.0, 0.28, 0.5, 0.045); // B7

    // --- 3) SHIMMER / cola mágica ---
    bell(5274.0, 0.35, 0.35, 0.03);
    bell(6272.0, 0.42, 0.28, 0.025);

    // --- 4) Sub suave que da cuerpo sin opacar el agudo ---
    const sub = ctx.createOscillator();
    const subG = ctx.createGain();
    sub.type = "sine";
    sub.frequency.value = 164.8; // E3
    subG.gain.setValueAtTime(0, t + 0.2);
    subG.gain.linearRampToValueAtTime(0.08, t + 0.25);
    subG.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
    sub.connect(subG);
    subG.connect(master);
    sub.start(t + 0.2);
    sub.stop(t + 1.0);
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
