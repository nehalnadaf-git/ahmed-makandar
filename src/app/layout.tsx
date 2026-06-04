import type { Metadata, Viewport } from 'next';
import { Inter, Caveat, Kalam } from 'next/font/google';
import './globals.css';
import PWARegistrar from '@/components/ui/PWARegistrar';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-script',
  display: 'swap',
});

const kalam = Kalam({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-hand',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Arham Hussain — B. Pharm & Aspiring Pharmacovigilance Professional',
  description:
    'Portfolio of Arham Hussain — B. Pharm student at KLE College of Pharmacy, Hubballi. Aspiring pharmacovigilance professional with expertise in UV Spectroscopy, HPLC, and pharmaceutical quality assurance.',
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', rel: 'shortcut icon' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Arham',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F0EBE3',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${caveat.variable} ${kalam.variable}`} suppressHydrationWarning>
      <body>
        {children}
        <PWARegistrar />
      </body>
    </html>
  );
}
