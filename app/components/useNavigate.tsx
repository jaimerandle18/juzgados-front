"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { useLoading } from "./LoadingContext";

export function useNavigate() {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const { showLoader } = useLoading();

  return (href: string) => {
    if (href === pathname) return;

    showLoader(); // 👈 loader sin mensaje por defecto

    startTransition(() => {
      router.push(href);
    });
  };
}
