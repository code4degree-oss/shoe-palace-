import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CategoriesSection } from "@/components/CategoriesSection";
import { ProductsSection } from "@/components/ProductsSection";
import { BannerSection } from "@/components/BannerSection";
import { Footer } from "@/components/Footer";
import { getProducts, getCategories } from '@/lib/products';
import fs from 'fs';
import path from 'path';

// Revalidate every 10 seconds so admin banner changes reflect quickly
export const revalidate = 10;


interface BannerData {
  id: string;
  slot: string;
  imageUrl: string;
  mobileImageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  linkedProductId: string;
  showText?: boolean;
  isActive: boolean;
}

function getBanners(): BannerData[] {
  try {
    const file = path.join(process.cwd(), 'data', 'banners.json');
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

export default async function Home() {
  const banners = getBanners();
  const products = await getProducts();
  const categories = await getCategories();


/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */

  return (
    <main className="min-h-screen flex flex-col">
      <div className="bg-brand-light">
        <Header />
        <Hero banners={banners} />
        <CategoriesSection categories={categories} />
        <ProductsSection banners={banners} products={products} />
      </div>

      <div className="bg-white">
      </div>

      <Footer />
    </main>
  );
}
