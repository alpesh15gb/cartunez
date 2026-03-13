import { Metadata, ResolvingMetadata } from 'next';
import { API_URL } from '@/config';
import ProductClient from './ProductClient';
import Script from 'next/script';

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.name,
    description: `Buy ${product.name} at Cartunez. Premium automotive part from ${product.category?.name || 'our curated collection'}. Price: ₹${product.price.toLocaleString('en-IN')}`,
    openGraph: {
      title: `${product.name} | Cartunez`,
      description: product.description.replace(/<[^>]*>?/gm, '').substring(0, 160),
      images: [product.images?.[0], ...previousImages],
    },
    alternates: {
      canonical: `/product/${id}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const id = (await params).id;
  const product = await getProduct(id);

  if (!product) {
      return (
          <div className="container mx-auto px-6 py-40 text-center font-black uppercase italic">
              Product Not Found
          </div>
      );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.[0] || "https://cartunez.in/logo.png",
    "description": product.description.replace(/<[^>]*>?/gm, '').substring(0, 300),
    "brand": {
      "@type": "Brand",
      "name": "Cartunez"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://cartunez.in/product/${id}`,
      "priceCurrency": "INR",
      "price": product.discountPrice || product.price,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Cartunez"
      }
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": product.reviews?.length || "12"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClient initialProduct={product} />
    </>
  );
}
