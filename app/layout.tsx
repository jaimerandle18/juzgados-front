// app/layout.tsx
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import type { ReactNode } from "react";
import AuthGuard from "./utils/AuthGuard";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { App } from "@capacitor/app";
import { LoadingProvider } from "./components/LoadingContext";

export const metadata = {
  title: "Data Jury",
  description: "Sistema de valoración de juzgados",
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
      <body className="bg-gray-100 min-h-screen">
        <LoadingProvider>
        <ClientLayout>
        <AuthGuard>
          {children}
          </AuthGuard>
        </ClientLayout>
        </LoadingProvider>
      </body>
    </html>
  );
}
