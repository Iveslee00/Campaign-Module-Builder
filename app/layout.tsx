import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NEXORA',
  description: 'AI-powered digital creation platform for building, launching, and managing campaign experiences',
  icons: {
    icon: '/brand/nexora-icon.svg',
    shortcut: '/brand/nexora-icon.svg',
    apple: '/brand/nexora-icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
