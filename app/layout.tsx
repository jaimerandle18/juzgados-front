// app/layout.tsx
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import type { ReactNode } from "react";

export const metadata = {
  title: "Data Jury",
  description: "Sistema de valoración de juzgados",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 min-h-screen">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
