'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
}

export function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/faqs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFaqs(data.filter(f => f.isActive));
        }
      })
      .catch(console.error);
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="w-full px-4 md:px-16 lg:px-24 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black mb-4">Frequently Asked Questions</h2>
          <p className="text-black/70 text-sm sm:text-base">Everything you need to know about our products and services.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id} 
                className={`bg-white border transition-all duration-300 rounded-xl overflow-hidden ${isOpen ? 'border-brand-accent shadow-md' : 'border-gray-200 shadow-sm'}`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-accent' : ''}`} size={20} />
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-gray-600 text-sm md:text-base whitespace-pre-wrap leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
