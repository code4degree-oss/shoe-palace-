'use client';

import { useCart } from '@/components/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Star } from 'lucide-react';
import type { Product } from '@/lib/products';

export function ClientGrid({ products }: { products: Product[] }) {
  const { addToCart } = useCart();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      {products.map((product) => (
        <div key={product.id} className="group">
          <Link href={`/product/${product.slug || product.id}`} className="block">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-3">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {product.badge && (
                <span className="absolute top-2.5 left-2.5 bg-brand-accent text-brand-dark text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                  {product.badge}
                </span>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(product);
                }}
                className="absolute bottom-3 right-3 w-9 h-9 bg-brand-accent text-brand-dark rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-brand-accent-hover"
              >
                <ShoppingBag size={16} />
              </button>
            </div>
          </Link>
          <div className="px-0.5">
            <div className="flex items-center gap-0.5 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} fill="currentColor" className="text-brand-accent" />
              ))}
            </div>
            <Link href={`/product/${product.slug || product.id}`}>
              <h3 className="text-xs sm:text-sm font-semibold text-brand-dark leading-snug mb-1.5 line-clamp-2 hover:text-brand-accent transition-colors">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-brand-dark">₹{product.salePrice || product.price}</span>
              {product.salePrice && (
                <span className="text-xs text-brand-dark/35 line-through">₹{product.price}</span>
              )}
              {product.salePrice && (
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                  {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                </span>
              )}
            </div>
            <button
              onClick={() => addToCart(product)}
              className="w-full mt-3 bg-brand-accent text-brand-dark text-xs font-bold py-2.5 rounded-sm hover:bg-brand-accent-hover transition-colors tracking-wide"
            >
              ADD TO CART
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
