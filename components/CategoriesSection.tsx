'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/lib/products';
import { ArrowRight } from 'lucide-react';

export function CategoriesSection({ categories = [] }: { categories?: Category[] }) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="px-4 md:px-16 lg:px-24">
        <div className="mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-black uppercase tracking-tight mb-3">
            Shop By Category
          </h2>
          <p className="text-brand-steel text-sm tracking-wide">
            Find your perfect pair
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="group relative aspect-[4/5] overflow-hidden bg-gray-100"
            >
              <Image
                src={cat.image || '/placeholder.png'}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <h3 className="text-white font-serif text-xl md:text-2xl font-bold uppercase tracking-wider mb-2">
                  {cat.name}
                </h3>
                <div className="flex items-center gap-2 text-white/80 text-xs uppercase tracking-widest font-medium group-hover:text-brand-accent transition-colors">
                  Shop Now
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
