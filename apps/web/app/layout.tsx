import type { Metadata } from 'next';
import { Providers } from './providers';
import '../src/styles/globals.css';

export const metadata: Metadata = {
  title: 'Aircraft',
  description: 'Framer-class builder + studio',
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="en" dir="ltr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
