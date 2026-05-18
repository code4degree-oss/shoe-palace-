'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface BannerData {
  id: string;
  slot: string;
  imageUrl: string;
  mobileImageUrl: string;
  isActive: boolean;
  linkedProductId: string;
}

export function BeforeAfterSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<{ id: string, imageUrl: string, isActive: boolean }[]>([]);

  useEffect(() => {
    fetch('/api/results')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setResults(data.filter(r => r.isActive));
        }
      })
      .catch(console.error);
  }, []);

  if (results.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.7;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 md:py-20 bg-brand-light">
      <div className="w-full px-4 md:px-16 lg:px-24">
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black mb-2">Real Results</h2>
            <p className="text-black/70 text-sm sm:text-base">Before and after transformations from our community.</p>
          </div>
          
          {/* Desktop Navigation Arrows (only show if more than 5 images) */}
          {results.length > 5 && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-10 h-10 border border-brand-dark/15 rounded-full flex items-center justify-center hover:bg-brand-dark hover:text-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-10 h-10 border border-brand-dark/15 rounded-full flex items-center justify-center hover:bg-brand-dark hover:text-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Carousel / Grid Container */}
        <div 
          ref={scrollRef}
          className={`flex overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar gap-4 md:gap-6 ${results.length <= 5 ? 'md:grid md:grid-cols-5 md:overflow-visible' : ''}`}
        >
          {results.map((result) => (
            <div 
              key={result.id} 
              className={`flex-shrink-0 w-[75vw] sm:w-[45vw] snap-start ${results.length <= 5 ? 'md:w-full' : 'md:w-[20vw]'}`}
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-200 group border border-gray-100 shadow-sm">
                <Image 
                  src={result.imageUrl} 
                  alt="Before and After Result" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  sizes="(max-width: 768px) 75vw, 20vw"
                />
              </div>
            </div>
          ))}
          {/* Spacer for mobile scroll ending padding */}
          <div className="flex-shrink-0 w-4 md:hidden min-h-[1px]" aria-hidden="true">&nbsp;</div>
        </div>
      </div>
    </section>
  );
}
