'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/components/CartContext';
import { ShoppingBag, Star, Truck, RotateCcw, Shield, ChevronDown, Share2, Facebook, MessageCircle, Link2, Check, Ruler } from 'lucide-react';
import type { Product, Review } from '@/lib/products';
import { SizeChart } from '@/components/SizeChart';

// ─── Color Name → Hex Map ─────────────────────────────
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

export function ClientProductDetails({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const [mainImage, setMainImage] = useState(allImages[0] || '');
  
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product.colors?.[0]);

  // Review States
  const [isEligibleToReview, setIsEligibleToReview] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '', name: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewFiles, setReviewFiles] = useState<File[]>([]);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  
  // Dynamic Pricing
  const variantPrices = Array.isArray(product.variantPrices) ? product.variantPrices : (typeof product.variantPrices === 'string' ? JSON.parse(product.variantPrices) : []);
  const colorImages = product.colorImages ? (typeof product.colorImages === 'string' ? JSON.parse(product.colorImages) : product.colorImages) : {};
  
  const currentVariant = variantPrices.find((v: any) => v.color === selectedColor && v.size === selectedSize);
  const displayPrice = currentVariant ? currentVariant.price : product.price;
  const displaySalePrice = currentVariant ? currentVariant.salePrice : product.salePrice;
  
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

  // When color changes, cycle to the corresponding image
  useEffect(() => {
    if (selectedColor) {
      if (colorImages[selectedColor] && Array.isArray(colorImages[selectedColor]) && colorImages[selectedColor].length > 0) {
        setMainImage(colorImages[selectedColor][0]);
      } else if (product.colors && product.colors.length > 0) {
        const colorIndex = product.colors.indexOf(selectedColor);
        if (colorIndex >= 0 && colorIndex < allImages.length) {
          setMainImage(allImages[colorIndex]);
        }
      }
    }
  }, [selectedColor, colorImages]);

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
      // Upload review images uncompressed
      const uploadedImageUrls: string[] = [];
      for (const file of reviewFiles) {
        const fd = new FormData();
        fd.append('file', file);
        const uploadRes = await fetch('/api/reviews/upload', { method: 'POST', body: fd });
        const uploadData = await uploadRes.json();
        if (uploadData.url) {
          uploadedImageUrls.push(uploadData.url);
        }
      }

      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerId,
          name: reviewForm.name,
          phone: customerPhone,
          rating: reviewForm.rating,
          text: reviewForm.text,
          images: uploadedImageUrls,
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

  const discount = displaySalePrice && displaySalePrice < displayPrice 
    ? Math.round(((displayPrice - displaySalePrice) / displayPrice) * 100) 
    : 0;
  
  // Use color specific images if available, else all images
  const currentGalleryImages = (selectedColor && colorImages[selectedColor] && Array.isArray(colorImages[selectedColor]) && colorImages[selectedColor].length > 0) 
    ? colorImages[selectedColor] 
    : allImages;

  return (
    <div className="space-y-10 md:space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
        
        {/* ─── Left Column: Gallery ─── */}
        <div className="flex flex-col-reverse md:flex-row gap-3">
          {/* Thumbnails */}
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto hide-scrollbar md:w-20 shrink-0">
            {currentGalleryImages.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setMainImage(img)}
                className={`relative w-14 md:w-full aspect-square overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                  mainImage === img 
                    ? 'border-brand-black' 
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} view ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
          
          {/* Main Image */}
          <div className="relative flex-1 aspect-square bg-gray-50 overflow-hidden">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-brand-black text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-widest z-10">
                {product.badge}
              </span>
            )}
          </div>
        </div>

        {/* ─── Right Column: Details ─── */}
        <div className="flex flex-col pt-2 lg:pt-4">
          
          {/* Breadcrumb-style category */}
          <div className="text-brand-steel uppercase tracking-[0.15em] text-[10px] md:text-[11px] font-medium mb-3">
            {product.categoryName || 'Footwear'}
          </div>

          {/* Title + Share */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-brand-black leading-tight uppercase tracking-tight">
              {product.name}
            </h1>
            
            <div className="relative inline-block shrink-0 share-menu-container">
              <button 
                onClick={() => setShowShareMenu(!showShareMenu)} 
                className="p-2.5 border border-gray-200 text-brand-black hover:border-brand-black transition-colors mt-1"
                title="Share"
              >
                <Share2 size={18} />
              </button>
              
              {showShareMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl border border-gray-100 p-2 z-50">
                  <button onClick={handleShareWhatsApp} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <MessageCircle size={16} className="text-green-500" /> WhatsApp
                  </button>
                  <button onClick={handleShareFacebook} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Facebook size={16} className="text-blue-600" /> Facebook
                  </button>
                  <button onClick={handleCopyLink} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Link2 size={16} className="text-gray-500" /> Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-xl md:text-2xl font-bold text-brand-black">₹{displaySalePrice || displayPrice}</span>
            {displaySalePrice && displaySalePrice < displayPrice && (
              <>
                <span className="text-lg text-brand-steel line-through">₹{displayPrice}</span>
                <span className="text-sm font-medium text-red-700">{discount}% OFF</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-brand-steel text-sm md:text-[15px] leading-relaxed mb-6">
            {product.description}
          </p>

          {/* ─── Color Swatches ─── */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-brand-black uppercase tracking-[0.15em] mb-3">
                Color — <span className="font-normal text-brand-steel capitalize">{selectedColor}</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => {
                  const hex = getColorHex(color);
                  const isSelected = selectedColor === color;
                  const isLight = ['white', 'cream', 'beige', 'yellow', 'neon'].includes(color.toLowerCase());
                  
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-10 h-10 rounded-full transition-all duration-200 ${
                        isSelected 
                          ? 'ring-2 ring-brand-black ring-offset-2' 
                          : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'
                      } ${isLight ? 'border border-gray-300' : ''}`}
                      style={{ backgroundColor: hex }}
                      title={color}
                    >
                      {isSelected && (
                        <Check 
                          size={16} 
                          className={`absolute inset-0 m-auto ${isLight ? 'text-black' : 'text-white'}`} 
                          strokeWidth={3}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── Size Selector ─── */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-brand-black uppercase tracking-[0.15em]">
                  Size — <span className="font-normal text-brand-steel">UK {selectedSize}</span>
                </h3>
                <button 
                  onClick={() => setIsSizeChartOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-brand-black uppercase tracking-[0.1em] hover:text-brand-steel transition-colors"
                >
                  <Ruler size={14} /> Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 border font-medium text-sm transition-all duration-200 ${
                      selectedSize === size 
                        ? 'border-brand-black bg-brand-black text-white' 
                        : 'border-gray-200 text-brand-black hover:border-brand-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── Add to Cart ─── */}
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
              addToCart(
                { ...product, price: displayPrice, salePrice: displaySalePrice }, 
                selectedSize, 
                selectedColor
              );
            }}
            className="w-full bg-brand-black text-white py-4 px-8 font-bold flex items-center justify-center gap-3 hover:bg-brand-graphite transition-all duration-300 text-sm uppercase tracking-[0.2em] mb-4"
          >
            <ShoppingBag size={18} />
            Add to Bag
          </button>

          {/* ─── Trust Badges ─── */}
          <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-100">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-gray-50 flex items-center justify-center">
                <Truck size={18} className="text-brand-black" />
              </div>
              <div>
                <h4 className="font-bold text-brand-black text-[11px] uppercase tracking-wider">Free Delivery</h4>
                <p className="text-[10px] text-brand-steel mt-0.5">On orders ₹4,999+</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-gray-50 flex items-center justify-center">
                <RotateCcw size={18} className="text-brand-black" />
              </div>
              <div>
                <h4 className="font-bold text-brand-black text-[11px] uppercase tracking-wider">Free Returns</h4>
                <p className="text-[10px] text-brand-steel mt-0.5">Within 30 days</p>
              </div>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-gray-50 flex items-center justify-center">
                <Shield size={18} className="text-brand-black" />
              </div>
              <div>
                <h4 className="font-bold text-brand-black text-[11px] uppercase tracking-wider">Authentic</h4>
                <p className="text-[10px] text-brand-steel mt-0.5">100% genuine</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Reviews Section ─── */}
      <div className="mt-16 pt-16 border-t border-gray-100">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-black uppercase tracking-tight">Reviews</h2>
          
          {isEligibleToReview && !showReviewForm && !reviewSuccess && (
            <button 
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-2.5 border-2 border-brand-black text-brand-black font-bold text-xs uppercase tracking-widest hover:bg-brand-black hover:text-white transition-all"
            >
              Write a Review
            </button>
          )}
        </div>

        {reviewSuccess && (
          <div className="bg-green-50 text-green-800 p-4 border border-green-200 mb-8 font-medium text-center text-sm">
            Thank you for your review! It will be visible after moderation.
          </div>
        )}

        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 border border-gray-100 mb-12 space-y-4 max-w-2xl">
            <h3 className="font-bold text-lg mb-2 uppercase tracking-wide text-sm">Write your review</h3>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <Star size={24} className={star <= reviewForm.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Your Name</label>
              <input required type="text" value={reviewForm.name} onChange={e => setReviewForm(prev => ({ ...prev, name: e.target.value }))} className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-black focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Review</label>
              <textarea required value={reviewForm.text} onChange={e => setReviewForm(prev => ({ ...prev, text: e.target.value }))} className="w-full border border-gray-200 px-3 py-2.5 h-24 resize-none text-sm focus:border-brand-black focus:outline-none transition-colors" placeholder="What did you like or dislike?"></textarea>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Images (Optional, up to 100MB)</label>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={(e) => {
                  if (e.target.files) setReviewFiles(Array.from(e.target.files));
                }} 
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-colors"
              />
              {reviewFiles.length > 0 && (
                <p className="text-xs text-brand-steel mt-2">{reviewFiles.length} file(s) selected.</p>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setShowReviewForm(false)} className="px-4 py-2 text-gray-600 text-sm">Cancel</button>
              <button type="submit" disabled={reviewLoading} className="px-6 py-2.5 bg-brand-black text-white font-bold text-xs uppercase tracking-widest hover:bg-brand-graphite disabled:opacity-50 transition-colors">
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-black text-white flex items-center justify-center font-bold text-sm">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-black text-sm">{review.name}</h4>
                      <div className="flex text-amber-500 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? "fill-current text-amber-500" : "text-gray-300"} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-brand-steel">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-brand-steel text-sm leading-relaxed">{review.text}</p>
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto hide-scrollbar pb-2">
                    {review.images.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-gray-100">
                        <Image src={img} alt="Review" fill className="object-cover" sizes="80px" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-brand-steel text-sm col-span-2">No reviews yet. Be the first to share your experience.</p>
          )}
        </div>
      </div>
      <SizeChart isOpen={isSizeChartOpen} onClose={() => setIsSizeChartOpen(false)} />
    </div>
  );
}
