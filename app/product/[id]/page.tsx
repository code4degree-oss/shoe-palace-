import { getProductById } from '@/lib/products';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ClientProductDetails } from './ClientProductDetails';

export const revalidate = 10;

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  const productId = unwrappedParams.id;
  const product = await getProductById(productId);

  if (!product) {

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */

    return (
      <div className="min-h-screen bg-brand-light flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center pt-24 text-brand-dark">
          <h1 className="text-3xl font-serif font-bold mb-4">Product Not Found</h1>
          <Link href="/" className="text-black hover:underline">Return to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light flex flex-col antialiased">
      <Header />
      
      <main className="flex-1 py-6 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-6 md:mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-brand-dark/60 hover:text-black transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to Collection
            </Link>
          </div>

          <ClientProductDetails product={product} />

        </div>
      </main>

      <Footer />
    </div>
  );
}
