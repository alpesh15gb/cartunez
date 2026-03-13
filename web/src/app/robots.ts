import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login', '/signup', '/checkout', '/orders'],
    },
    sitemap: 'https://cartunez.in/sitemap.xml',
  };
}
