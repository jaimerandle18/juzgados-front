// app/layout.tsx
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import type { ReactNode } from "react";
import AuthGuard from "./utils/AuthGuard";

export const metadata = {
  title: "Data Jury",
  description: "Sistema de valoración de juzgados",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 min-h-screen">
        <ClientLayout>
        <AuthGuard>
          {children}
          </AuthGuard>
        </ClientLayout>
      </body>
    </html>
  );
}
