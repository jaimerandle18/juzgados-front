// components/navigateWithLoader.ts
"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { showLoader } from "./globalLoader";

export function navigateWithLoader(
  router: AppRouterInstance,
  href: string,
  message?: string
) {
  showLoader(message);
  router.push(href);
}
