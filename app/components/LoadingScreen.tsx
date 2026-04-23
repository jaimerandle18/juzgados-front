"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import image from "../../public/agaboga.png";

type LoadingScreenProps = {
  message?: string;
  showSponsor?: boolean;
  /**
   * Logo adicional para mostrar debajo del mensaje (p.ej. el de Google Maps
   * en el flujo de armar recorrido, indicando a donde vas a ir a parar).
   */
  brandLogoUrl?: string;
  brandLogoAlt?: string;
};

const SPONSOR_URL = "/gobiernoabierto.png";

export default function LoadingScreen({
  message,
  showSponsor,
  brandLogoUrl,
  brandLogoAlt,
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 px-6 text-center">
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        style={{ transformStyle: "preserve-3d" } as React.CSSProperties}
        className="relative w-32 h-32 mb-6"
      >
        <Image
          src={image}
          alt="Abogados en Acción"
          fill
          priority
          className="object-contain"
        />
      </motion.div>

      {message  && (
        <p className="text-gray-700 text-sm max-w-sm leading-relaxed">
          {message}
        </p>
      )}
      {!message && (
           <p className="text-gray-700 text-sm max-w-sm leading-relaxed">
           Cargando...
         </p>
      )}

      {brandLogoUrl && (
        <motion.img
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          src={brandLogoUrl}
          alt={brandLogoAlt || ""}
          className="mt-6 w-16 h-16 rounded-xl object-cover shadow-md"
        />
      )}

      {showSponsor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-16 flex flex-col items-center gap-4"
        >
          <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">
            Sponsored by
          </p>
          <div className="flex items-center gap-5">
            {/* Gobierno Abierto */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SPONSOR_URL}
              alt="Gobierno Abierto"
              width={170}
              height={55}
              style={{ objectFit: "contain" }}
            />

            {/* Separador */}
            <div className="h-12 w-px bg-gray-300" />

            {/* FORES */}
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/fores_logo.jpeg"
                alt="FORES"
                width={40}
                height={40}
                className="rounded-full"
                style={{ objectFit: "contain" }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700 leading-tight">fores</span>
                <span className="text-[10px] text-gray-500 leading-tight max-w-[130px]">
                  foro de estudios sobre la administración de justicia
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}