import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ShoppingProvider } from '@/context/ShoppingProvider';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KapruQ — Your Sri Lankan Shopping Concierge',
  description: 'AI-powered shopping assistant for Kapruka. Discover, compare, and order with ease.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="h-full">
        <ShoppingProvider>{children}</ShoppingProvider>
      </body>
    </html>
  );
}
