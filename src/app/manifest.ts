import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Arham Hussain — B. Pharm & Pharmacovigilance',
    short_name: 'Arham',
    description:
      'Portfolio of Arham Hussain — B. Pharm student at KLE College of Pharmacy, Hubballi, aspiring pharmacovigilance professional.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F0EBE3',
    theme_color: '#F0EBE3',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
