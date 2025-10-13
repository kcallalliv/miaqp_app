export const metadata = {
  title: "MIAQP — De Miami a Perú",
  description: "Compras directas de outlet, entregas en Arequipa/Lima.",
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
