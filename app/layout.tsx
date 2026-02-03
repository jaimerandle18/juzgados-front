// app/layout.tsx
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import type { ReactNode } from "react";
import AuthGuard from "./utils/AuthGuard";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { App } from "@capacitor/app";

export const metadata = { title: "Data Jury", description: "Sistema de valoración de juzgados" };

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};


export default function RootLayout({ children }: { children: ReactNode }) {
  if (Capacitor.isNativePlatform()) {
    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Light });
  }


if (Capacitor.isNativePlatform()) {
  App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });
}
  return (
    <html lang="es">
   <body className="min-h-screen">
  <div className="dj-bg" aria-hidden />
  <ClientLayout>
    <AuthGuard>{children}</AuthGuard>
  </ClientLayout>
</body>


    </html>
  );
  
}
