"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import image from "../../public/agaboga.png"

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        style={{ transformStyle: "preserve-3d" } as React.CSSProperties}
        className="relative w-32 h-32"
      >
        <Image
          src={image}
          alt="Abogados en Acción"
          fill
          className="object-contain"
        />
      </motion.div>
    </div>
  );
}
