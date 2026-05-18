'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/lib/products';

export function CategoriesSection({ categories = [] }: { categories?: Category[] }) {
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="px-4 md:px-16 lg:px-24">
        <h2 className="text-center font-serif text-2xl md:text-3xl font-bold text-black mb-2">
          Shop By Category
        </h2>
        <p className="text-center text-black text-sm mb-8">
          Find exactly what your hair &amp; skin needs
        </p>

        <div className="flex justify-center gap-6 sm:gap-10 md:gap-14 flex-wrap">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="flex flex-col items-center gap-3 group"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-3 border-brand-accent/30 group-hover:border-brand-accent transition-colors shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                <Image
                  src={cat.image || '/placeholder.png'}
                  alt={cat.name}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
                <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-brand-dark/0 transition-colors" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-black group-hover:text-brand-accent transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
