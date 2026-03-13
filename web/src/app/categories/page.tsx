import { Metadata } from 'next';
import { API_URL } from '@/config';
import CategoriesClient from './CategoriesClient';

export const metadata: Metadata = {
  title: "Premium Automotive Collections",
  description: "Explore our curated collections of high-end car speakers, subwoofers, amplifiers, and lighting. Cartunez brings the best of automotive upgrades to you.",
  openGraph: {
    title: "Cartunez Collections | Automotive Masterpieces",
    description: "Browse our premium categories for the ultimate vehicle upgrade.",
  },
  alternates: {
    canonical: '/categories',
  },
};

async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

export default async function Page() {
  const categories = await getCategories();

  return <CategoriesClient categories={categories} />;
}
