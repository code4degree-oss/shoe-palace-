'use client';

import { useCart } from '@/components/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/products';

export function ClientGrid({ products }: { products: Product[] }) {
  const { addToCart } = useCart();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      {products.map((product) => (
        <div key={product.id} className="group">
          <Link href={`/product/${product.slug || product.id}`} className="block">
            <div className="relative aspect-square overflow-hidden bg-gray-100 mb-3">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {product.badge && (
                <span className="absolute top-2 left-2 bg-brand-black text-white text-[9px] md:text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                  {product.badge}
                </span>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(product);
                }}
                className="absolute bottom-2 right-2 w-8 h-8 md:w-9 md:h-9 bg-brand-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-graphite"
              >
                <ShoppingBag size={14} />
              </button>
            </div>
          </Link>
          <div className="px-0.5">
            <Link href={`/product/${product.slug || product.id}`}>
              <h3 className="text-xs sm:text-sm font-medium text-brand-black leading-snug mb-1 line-clamp-2 group-hover:underline transition-all">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-brand-black">₹{product.salePrice || product.price}</span>
              {product.salePrice && product.salePrice < product.price && (
                <>
                  <span className="text-[10px] sm:text-xs text-brand-steel line-through">₹{product.price}</span>
                  <span className="text-[9px] sm:text-[10px] font-medium text-red-700">
                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
