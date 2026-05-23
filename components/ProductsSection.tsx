'use client';

import { useRef } from 'react';
import type { Product } from '@/lib/products';
import { useCart } from './CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

// ─── Color Map for Swatches ─────────────────────────────
const COLOR_MAP: Record<string, string> = {
  red: '#E53935',
  black: '#111111',
  neon: '#76FF03',
  green: '#4CAF50',
  yellow: '#FDD835',
  white: '#F5F5F5',
  grey: '#9E9E9E',
  gray: '#9E9E9E',
  blue: '#1E88E5',
  navy: '#1A237E',
  pink: '#EC407A',
  orange: '#FF6B35',
  brown: '#6D4C41',
  beige: '#D7CCC8',
  cream: '#FFF8E1',
  purple: '#7B1FA2',
  maroon: '#7F0000',
};

function getColorHex(name: string): string {
  return COLOR_MAP[name.toLowerCase()] || '#9E9E9E';
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="flex-shrink-0 w-44 sm:w-52 md:w-64 lg:w-72 snap-start group">
      <Link href={`/product/${product.slug || product.id}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 mb-4">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          
          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 bg-brand-black text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest">
              {product.badge}
            </span>
          )}
          
          {/* Quick Add */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product);
            }}
            className="absolute bottom-3 right-3 w-10 h-10 bg-brand-black text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-graphite"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </Link>

      {/* Details */}
      <div className="px-0.5">
        {/* Color dots */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            {product.colors.map((color) => (
              <span
                key={color}
                className="w-3 h-3 rounded-full border border-gray-300"
                style={{ backgroundColor: getColorHex(color) }}
                title={color}
              />
            ))}
          </div>
        )}
        
        <Link href={`/product/${product.slug || product.id}`}>
          <h3 className="text-sm font-medium text-black leading-snug mb-1.5 line-clamp-1 group-hover:underline transition-all">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-black">₹{product.salePrice || product.price}</span>
          {product.salePrice && product.salePrice < product.price && (
            <span className="text-xs text-brand-steel line-through">₹{product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ScrollableRow({ title, subtitle, products }: { title: string; subtitle?: string; products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.7;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (products.length === 0) return null;


/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8 px-4 md:px-16 lg:px-24">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-black uppercase tracking-tight">{title}</h2>
          {subtitle && <p className="text-brand-steel text-xs sm:text-sm mt-2 tracking-wide">{subtitle}</p>}
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 border border-black/15 flex items-center justify-center hover:bg-brand-black hover:text-white hover:border-brand-black transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 border border-black/15 flex items-center justify-center hover:bg-brand-black hover:text-white hover:border-brand-black transition-all duration-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Scrollable Cards */}
      <div className="section-gutter">
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 hide-scrollbar"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {/* Right spacer */}
          <div className="flex-shrink-0 w-4 md:w-16 lg:w-24 min-h-[1px]" aria-hidden="true">&nbsp;</div>
        </div>
      </div>
    </div>
  );
}

interface BannerData {
  slot: string;
  isActive: boolean;
  imageUrl: string;
  title: string;
  buttonText: string;
  linkedProductId: string;
  showText?: boolean;
}

function MidPromoBanner({ banners = [] }: { banners?: BannerData[] }) {
  const mid = banners.find(b => b.slot === 'mid' && b.isActive);

  if (!mid) return null;

  const imgSrc = mid.imageUrl;
  const title = mid.title;
  const btnText = mid.buttonText || 'Shop Now';
  const href = mid.linkedProductId
    ? mid.linkedProductId.startsWith('cat-')
      ? `/category/${mid.linkedProductId.replace('cat-', '')}`
      : `/product/${mid.linkedProductId}`
    : '#shop';

  return (
    <div className="w-full px-4 md:px-16 lg:px-24">
      <div className="w-full relative overflow-hidden h-[220px] md:h-[300px] lg:h-[360px] group">
        <Link href={href} className="absolute inset-0 z-10 block" aria-label={title || "Banner link"} />
        <Image src={imgSrc} alt={title || 'Mid Banner'} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="100vw" />
        
        {mid.showText !== false && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14 lg:px-20 z-20 pointer-events-none">
              <span className="inline-block text-brand-accent text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-3 w-max pointer-events-auto">
                Exclusive
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-4 md:mb-5 max-w-sm uppercase tracking-tight pointer-events-auto">
                {title}
              </h2>
              <Link href={href} className="w-max inline-flex items-center gap-2 bg-white text-black font-bold px-6 md:px-8 py-3 hover:bg-brand-accent hover:text-white transition-all text-xs md:text-sm uppercase tracking-widest pointer-events-auto">
                {btnText}
                <ArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ProductsSection({ banners = [], products = [] }: { banners?: BannerData[], products?: Product[] }) {
  const bestsellers = products.filter(p => p.badge === 'Best Seller' || p.badge === 'Bestseller').slice(0, 8);
  const newArrivals = products.filter(p => p.badge === 'New Arrival' || p.badge === 'New');
  const trending = products.filter(p => p.badge === 'Trending');

  return (
    <section id="shop" className="py-16 md:py-24 bg-brand-light space-y-16 md:space-y-24">
      <ScrollableRow
        title="Best Sellers"
        subtitle="Most loved by athletes across India"
        products={bestsellers}
      />
      
      <MidPromoBanner banners={banners} />

      <ScrollableRow
        title="New Arrivals"
        subtitle="Latest drops — just landed"
        products={newArrivals}
      />

      {trending.length > 0 && (
        <ScrollableRow
          title="Trending Now"
          subtitle="What everyone's wearing"
          products={trending}
        />
      )}
    </section>
  );
}
