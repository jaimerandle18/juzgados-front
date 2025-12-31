"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import image from "../../public/agaboga.png";

type LoadingScreenProps = {
  message?: string;
};

export default function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50 px-6 text-center">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
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

      {message && (
        <p className="text-gray-700 text-sm max-w-sm leading-relaxed">
          {message}
        </p>
      )}
    </div>
  );
}
