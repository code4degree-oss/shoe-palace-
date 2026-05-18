'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { ShoppingBag, Star, Truck, ShieldCheck, Scale, ChevronDown, Share2, Facebook, MessageCircle, Link2 } from 'lucide-react';
import type { Product, Review } from '@/lib/products';

export function ClientProductDetails({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [mainImage, setMainImage] = useState(product.image || '');
  const [openSection, setOpenSection] = useState<'howToUse' | 'ingredients' | null>(null);
  
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors?.[0]);

  // Review States
  const [isEligibleToReview, setIsEligibleToReview] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '', name: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  
  // Share state
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.share-menu-container')) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out ${product.name} at ${shareUrl}`)}`, '_blank');
    setShowShareMenu(false);
  };
  
  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    setShowShareMenu(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setShowShareMenu(false);
    alert('Link copied to clipboard!');
  };
  const [customerPhone, setCustomerPhone] = useState<string | null>(null);

  useEffect(() => {
    const phone = localStorage.getItem('customer_phone');
    if (phone) {
      setCustomerPhone(phone);
      fetch(`/api/reviews/check-eligibility?phone=${phone}&productId=${product.id}`)
        .then(res => res.json())
        .then(data => {
          setIsEligibleToReview(data.eligible);
          setCustomerId(data.customerId);
        })
        .catch(console.error);
      
      fetch(`/api/customer/profile?phone=${phone}`)
        .then(res => res.json())
        .then(data => {
           if (data.customer?.name) setReviewForm(prev => ({...prev, name: data.customer.name}));
        }).catch(console.error);
    }
  }, [product.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone || !reviewForm.text || !reviewForm.name) return;
    
    setReviewLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerId,
          name: reviewForm.name,
          phone: customerPhone,
          rating: reviewForm.rating,
          text: reviewForm.text
        }),
      });
      if (res.ok) {
        setReviewSuccess(true);
        setShowReviewForm(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewLoading(false);
    }
  };

  const images = [
    product.image,
    ...(product.images || [])
  ].filter(Boolean);

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Left Column: Images */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-sm border border-brand-dark/5">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(img)}
                className={`relative w-20 sm:w-24 aspect-square rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${mainImage === img ? 'border-brand-blue' : 'border-transparent hover:border-brand-blue/50'}`}
              >
                <Image
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col">
          <div className="mb-6 border-b border-brand-dark/10 pb-6">
            <div className="text-brand-accent uppercase tracking-widest text-xs font-semibold mb-3">
              Premium Quality
            </div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-brand-dark leading-tight">
                {product.name}
              </h1>
              
              <div className="relative inline-block shrink-0 share-menu-container">
                <button 
                  onClick={() => setShowShareMenu(!showShareMenu)} 
                  className="p-2 sm:p-3 bg-gray-100 rounded-full text-brand-dark hover:bg-gray-200 transition-colors mt-1 sm:mt-2"
                  title="Share"
                >
                  <Share2 size={20} />
                </button>
                
                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 p-2 z-50">
                    <button onClick={handleShareWhatsApp} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                      <MessageCircle size={16} className="text-green-500" /> WhatsApp
                    </button>
                    <button onClick={handleShareFacebook} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                      <Facebook size={16} className="text-blue-600" /> Facebook
                    </button>
                    <button onClick={handleCopyLink} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                      <Link2 size={16} className="text-gray-500" /> Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-brand-dark">₹{product.salePrice || product.price}</span>
              {product.salePrice && (
                <span className="text-lg text-brand-dark/40 line-through">₹{product.price}</span>
              )}
            </div>

            <p className="text-brand-dark/80 text-lg leading-relaxed mb-6 whitespace-pre-wrap">
              {product.description}
            </p>

            <div className="flex items-center gap-2 text-gray-600 mb-6 font-medium">
              <Scale size={20} className="text-brand-accent" />
              <span>Net Content: {product.displayWeight || product.weightGrams}{product.weightUnit || 'g'}</span>
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-brand-dark mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md font-medium transition-colors ${selectedSize === size ? 'border-brand-dark bg-brand-dark text-white' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-brand-dark mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-md font-medium transition-colors ${selectedColor === color ? 'border-brand-dark bg-brand-dark text-white' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if ((product.sizes?.length ?? 0) > 0 && !selectedSize) {
                  alert('Please select a size');
                  return;
                }
                if ((product.colors?.length ?? 0) > 0 && !selectedColor) {
                  alert('Please select a color');
                  return;
                }
                addToCart(product, selectedSize, selectedColor);
              }}
              className="w-full sm:w-auto bg-brand-accent text-brand-dark px-10 py-4 rounded-sm font-bold flex items-center justify-center gap-3 hover:bg-brand-accent-hover transition-colors shadow-lg shadow-brand-accent/30 text-lg tracking-wide"
            >
              <ShoppingBag size={22} />
              Add to Cart
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 justify-between py-6">
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 p-2 rounded-full text-black shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-brand-dark text-sm mb-1">Fast Delivery</h4>
                <p className="text-xs text-brand-dark/60">Safe & secure shipping</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 p-2 rounded-full text-black shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-brand-dark text-sm mb-1">Purity Guaranteed</h4>
                <p className="text-xs text-brand-dark/60">Certified organic herbs</p>
              </div>
            </div>
          </div>

          {/* Accordions */}
          <div className="flex flex-col gap-3 pb-6">
            {product.howToUse && (
              <div className="border border-brand-dark/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenSection(openSection === 'howToUse' ? null : 'howToUse')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-serif font-bold text-lg text-brand-dark">How to Use</span>
                  <ChevronDown className={`transition-transform duration-300 text-brand-dark/60 ${openSection === 'howToUse' ? 'rotate-180' : ''}`} size={20} />
                </button>
                <div className={`transition-all duration-300 ease-in-out ${openSection === 'howToUse' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <div className="p-4 pt-0 text-brand-dark/80 whitespace-pre-wrap text-base leading-relaxed bg-gray-50/50">
                    {product.howToUse}
                  </div>
                </div>
              </div>
            )}
            
            {product.ingredients && (
              <div className="border border-brand-dark/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenSection(openSection === 'ingredients' ? null : 'ingredients')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-serif font-bold text-lg text-brand-dark">Ingredients</span>
                  <ChevronDown className={`transition-transform duration-300 text-brand-dark/60 ${openSection === 'ingredients' ? 'rotate-180' : ''}`} size={20} />
                </button>
                <div className={`transition-all duration-300 ease-in-out ${openSection === 'ingredients' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <div className="p-4 pt-0 text-brand-dark/80 whitespace-pre-wrap text-base leading-relaxed bg-gray-50/50">
                    {product.ingredients}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 pt-16 border-t border-brand-dark/10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark">Customer Reviews</h2>
          
          {isEligibleToReview && !showReviewForm && !reviewSuccess && (
            <button 
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-2 border-2 border-brand-accent text-brand-dark font-bold rounded-sm hover:bg-brand-accent hover:text-black transition-colors"
            >
              Write a Review
            </button>
          )}
        </div>

        {reviewSuccess && (
          <div className="bg-green-50 text-green-800 p-4 rounded-md border border-green-200 mb-8 font-medium text-center">
            Thank you for your review! It will be visible after moderation.
          </div>
        )}

        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-12 space-y-4 max-w-2xl">
            <h3 className="font-bold text-lg mb-2">Write your review</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <Star size={24} className={star <= reviewForm.rating ? "text-brand-accent fill-brand-accent" : "text-gray-300"} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input required type="text" value={reviewForm.name} onChange={e => setReviewForm(prev => ({ ...prev, name: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
              <textarea required value={reviewForm.text} onChange={e => setReviewForm(prev => ({ ...prev, text: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 resize-none" placeholder="What did you like or dislike?"></textarea>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setShowReviewForm(false)} className="px-4 py-2 text-gray-600">Cancel</button>
              <button type="submit" disabled={reviewLoading} className="px-6 py-2 bg-brand-accent text-black font-bold rounded-sm hover:bg-brand-accent-hover disabled:opacity-50">
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-6">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-brand-accent/20 rounded-full flex items-center justify-center font-bold text-brand-dark">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{review.name}</h4>
                      <div className="flex text-brand-accent">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? "fill-current text-brand-accent" : "text-gray-300"} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 mb-4">{review.text}</p>
                {review.image && (
                  <div className="relative w-24 h-24 rounded-md overflow-hidden bg-gray-100">
                    <Image src={review.image} alt="Review" fill className="object-cover" sizes="100px" />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No reviews yet for this product. Check back soon!</p>
          )}
        </div>
      </div>
    </div>
  );
}
