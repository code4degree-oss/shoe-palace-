'use client';

import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

export function ReviewsSection() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/reviews/featured')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      })
      .catch(console.error);
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-serif font-bold text-black mb-4">Loved by Thousands</h2>
          <p className="text-black text-lg">Real results from our community of natural hair care enthusiasts.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-8 rounded-3xl shadow-sm border border-brand-blue/5 relative flex flex-col h-full"
            >
              <Quote className="absolute top-6 right-6 text-black/10 w-12 h-12" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, index) => (
                  <Star 
                    key={index}
                    size={18} 
                    fill={index < review.rating ? 'currentColor' : 'none'} 
                    className={index < review.rating ? 'text-brand-accent' : 'text-gray-300'}
                  />
                ))}
              </div>
              
              <p className="text-black/80 mb-6 flex-1 leading-relaxed relative z-10">
                &quot;{review.text}&quot;
              </p>
              
              {review.image && (
                <div className="mb-6 rounded-md overflow-hidden bg-gray-100 h-32 w-full relative">
                  <Image src={review.image} alt="Review attachment" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              )}
              
              <div className="mt-auto">
                <p className="font-medium text-black">{review.name}</p>
                <p className="text-sm text-black">{review.role || 'Verified Buyer'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
