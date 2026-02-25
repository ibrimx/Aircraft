import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brimair",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ar" dir="rtl" className="theme-dark">
      <body>
        <div className="app-frame">
          <header className="app-header">
            <p className="app-brand">Brimair</p>
          </header>
          <main className="app-main" id="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
