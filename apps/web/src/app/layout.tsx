import type { Metadata } from 'next';
import './globals.css';

// لو عندك ThemeProvider / I18nProvider في @aircraft packages استخدمهم هنا.
// هسيبها "آمنة" من غير ما أفترض أسماء Providers عندك.

export const metadata: Metadata = {
  title: 'Aircraft',
  description: 'Framer-class builder + studio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
