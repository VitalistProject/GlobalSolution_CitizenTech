import type { Metadata, Viewport } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

const fontBody = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "S.I.A.F. — Inteligência fitológica",
  description:
    "Acompanhe a resposta fisiológica, os sinais e as condições ambientais das suas plantas.",
  applicationName: "S.I.A.F.",
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f5f8f5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={fontBody.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
