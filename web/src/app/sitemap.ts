import { MetadataRoute } from 'next';
import { API_URL } from '@/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cartunez.in';

  // Static routes
  const staticRoutes = [
    '',
    '/shop',
    '/categories',
    '/login',
    '/signup',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic products
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    // Fail fast during build if API is unreachable (5s timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_URL}/products`, {
        signal: controller.signal,
        next: { revalidate: 3600 }
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
        const products = await response.json();
        if (Array.isArray(products)) {
            productRoutes = products.map((product: any) => ({
                url: `${baseUrl}/product/${product.id}`,
                lastModified: new Date(product.updatedAt || new Date()),
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }));
        }
    }
  } catch (e) {
    console.error('Sitemap product fetch skipped (API unreachable or timeout):', e);
  }

  // Dynamic categories
  const categories = ['interior', 'exterior', 'electronics', 'batteries'];
  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/shop?category=${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
