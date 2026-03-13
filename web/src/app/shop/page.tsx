import { Metadata } from 'next';
import { API_URL } from '@/config';
import ShopClient from './ShopClient';

interface Props {
  searchParams: Promise<{ categoryId?: string; search?: string; category?: string }>;
}

async function getCategory(id: string) {
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const categories = await res.json();
    return categories.find((c: any) => c.id === id);
  } catch (e) {
    return null;
  }
}

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  const { categoryId, category, search } = await searchParams;
  
  if (search) {
    return {
      title: `Search results for "${search}"`,
      description: `Explore premium car parts matching your search for ${search} at Cartunez.`,
    };
  }

  if (categoryId) {
    const cat = await getCategory(categoryId);
    if (cat) {
      return {
        title: `${cat.name} Collection`,
        description: `Shop our premium ${cat.name} range. High-end automotive upgrades specifically curated for quality and style at Cartunez.`,
        alternates: {
          canonical: `/shop?categoryId=${categoryId}`,
        },
      };
    }
  }

  if (category && category !== 'All') {
      return {
          title: `${category} Accessories`,
          description: `Discover top-tier ${category} accessories for your vehicle at Cartunez. Elevate your driving experience.`,
      };
  }

  return {
    title: "All Collections | Premium Automotive Shop",
    description: "Explore our complete range of high-performance car parts, interior styling, and electronics. Cartunez delivers quality across India.",
    alternates: {
      canonical: '/shop',
    },
  };
}

export default async function Page({ searchParams }: Props) {
  const { categoryId, category } = await searchParams;
  const currentCategory = categoryId ? await getCategory(categoryId) : null;
  const categoryName = currentCategory?.name || category || 'All';

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://cartunez.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": "https://cartunez.in/shop"
      }
    ]
  };

  if (categoryName !== 'All') {
    breadcrumbJsonLd.itemListElement.push({
      "@type": "ListItem",
      "position": 3,
      "name": categoryName,
      "item": `https://cartunez.in/shop?category=${categoryName.toLowerCase()}`
    });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ShopClient />
    </>
  );
}
