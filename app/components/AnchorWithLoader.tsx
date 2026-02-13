"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { showLoader, forceHideLoader } from "./globalLoader";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  loadingMessage?: string;
};

export default function AnchorWithLoader({
  loadingMessage,
  onClick,
  href,
  target,
  rel,
  ...props
}: Props) {
  const router = useRouter();
  const isNative = useMemo(() => Capacitor.isNativePlatform(), []);

  return (
    <a
      {...props}
      href={href}
      target={target}
      rel={rel}
      onClick={(e) => {
        showLoader(loadingMessage);

        // Si el usuario quiere abrir en nueva pestaña/ventana, no interceptamos
        const isModifiedClick =
          e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1;

        if (!href || target === "_blank" || isModifiedClick) {
          onClick?.(e);
          return;
        }

        // ✅ clave: evitar navegación hard (es lo que te mete el flash negro)
        e.preventDefault();

        onClick?.(e);

        router.push(href);

        // 🔒 failsafe iOS
        if (isNative) setTimeout(() => forceHideLoader(), 2500);
      }}
    />
  );
}
