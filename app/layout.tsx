import "./globals.css";
import ClientLayout from "./components/ClientLayout";

export const metadata = {
  title: "Abogados en Acción",
  description: "Opiniones y valoraciones de los juzgados argentinos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
