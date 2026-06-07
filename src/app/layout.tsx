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
  title: 'Ahmed Rehan Makandar — Lead Engineer, Solar O&M | Renewable Energy Professional',
  description:
    'Portfolio of Ahmed Rehan Makandar — Lead Engineer Solar O&M at TATA Power Renewable Energy. 2.7+ years of experience in solar plant operations, SCADA monitoring, HV switchgear, SAP S4/HANA, and supply chain management across 100 MW & 400 MW utility-scale solar installations.',
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
    title: 'Ahmed',
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
