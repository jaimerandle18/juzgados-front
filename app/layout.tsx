// app/layout.tsx
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import type { ReactNode } from "react";
import AuthGuard from "./utils/AuthGuard";
import { ToastProvider } from "@/components/Toast";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { App } from "@capacitor/app";

export const metadata = { title: "Data Jury", description: "Sistema de valoración de juzgados" };

// Bloqueamos el zoom del WebView: en iOS, al enfocar un input con
// font-size < 16px Safari hace autozoom y no vuelve solo; esto dejaba
// la pantalla "mas grande" despues de escribir. Como es una app mobile
// con layout fijo, directamente desactivamos el pinch-zoom.
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
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
  <ToastProvider>
    <ClientLayout>
      <AuthGuard>{children}</AuthGuard>
    </ClientLayout>
  </ToastProvider>
</body>


    </html>
  );
  
}
