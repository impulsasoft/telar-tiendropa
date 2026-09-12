import type { Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "TELAR — Moda Fashion Femenina",
  description: "Tienda de moda femenina con estilo único. Vestidos, blusas, accesorios y más. Envíos a todo el país.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" style={{ scrollBehavior: "smooth" }}>
      <body className={`${geist.className} ${cormorant.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
