import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cartunez | Premium Automotive Masterpieces',
    short_name: 'Cartunez',
    description: "India's premium destination for high-end automotive parts, styling accessories, and performance upgrades.",
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#cc0000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
