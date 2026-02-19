import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '\u0C2E\u0C28 \u0C35\u0C3E\u0C30\u0C4D\u0C24\u0C32\u0C41 - Admin Panel',
  description: 'Mana Varthalu Admin Panel - Telugu News Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="te">
      <body>{children}</body>
    </html>
  );
}
