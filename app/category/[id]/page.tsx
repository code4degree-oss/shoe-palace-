import { getCategoryById, getProductsByCategory } from '@/lib/products';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ClientGrid } from './ClientGrid';

export const revalidate = 10;

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  const categoryId = unwrappedParams.id;
  const category = await getCategoryById(categoryId);
  const products = await getProductsByCategory(categoryId);

  return (
    <div className="min-h-screen bg-brand-light flex flex-col antialiased">
      <Header />

      <main className="flex-1 pt-20">
        {/* Category Header */}
        <div className="bg-white border-b border-brand-dark/5 px-4 md:px-16 lg:px-24 py-6 md:py-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-brand-dark/50 hover:text-brand-accent transition-colors mb-4">
            <ArrowLeft size={16} className="mr-1.5" />
            Back to Home
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-brand-dark">
            {category?.name || 'Category'}
          </h1>
          <p className="text-brand-dark/50 text-sm mt-1">{products.length} products</p>
        </div>

        {/* Products Grid */}
        <div className="px-4 md:px-16 lg:px-24 py-8">
          <ClientGrid products={products} />

          {products.length === 0 && (
            <div className="text-center py-20 text-brand-dark/40">
              <p className="text-lg">No products in this category yet</p>
              <Link href="/" className="text-brand-accent font-medium hover:underline mt-2 inline-block">
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
