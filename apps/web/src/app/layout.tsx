import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/shell.css";

export const metadata: Metadata = {
  title: "Brimair",
  description: "Framer-like builder + Canva-like studio (RTL-first).",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
