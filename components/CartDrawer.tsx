'use client';

import { useCart } from './CartContext';
import { ShoppingBag, X, Minus, Plus, ArrowRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

export function CartDrawer() {
  const { isCartOpen, closeCart, items, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  const handleCheckout = () => {
    setIsCheckingOut(true);
    closeCart();
    router.push('/checkout');
    setIsCheckingOut(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <ShoppingBag size={22} className="text-black" />
                <h2 className="text-xl font-bold text-black">Cart</h2>
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 flex items-center justify-center text-black/60 hover:text-black transition-colors rounded-full hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-black/50 space-y-4">
                  <ShoppingBag size={56} className="opacity-15 text-black" />
                  <p className="text-lg font-medium text-black/60">Your cart is empty</p>
                  <button
                    onClick={closeCart}
                    className="mt-4 px-8 py-3 bg-brand-accent text-black font-bold rounded-sm hover:bg-brand-accent-hover transition-colors tracking-wide"
                  >
                    START SHOPPING
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="relative flex gap-4 items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                      {/* Remove Item Button */}
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X size={14} />
                      </button>

                      <div className="w-20 h-20 bg-brand-light rounded-lg overflow-hidden flex-shrink-0">
                        <div className="relative w-full h-full">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className="font-bold text-black text-sm truncate">{item.name}</h3>
                        {(item.selectedSize || item.selectedColor) && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                            {item.selectedSize && item.selectedColor && ' | '}
                            {item.selectedColor && `Color: ${item.selectedColor}`}
                          </p>
                        )}
                        <p className="text-black font-bold mt-1">₹{(item.salePrice || item.price).toFixed(2)}</p>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-sm bg-gray-100 border border-gray-200 text-black hover:bg-gray-200 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-sm bg-gray-100 border border-gray-200 text-black hover:bg-gray-200 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkout Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-black/70 font-medium">Subtotal</span>
                  <span className="font-bold text-black text-xl">₹{cartTotal.toFixed(2)}</span>
                </div>
                
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full py-4 px-6 bg-brand-accent text-black rounded-sm font-bold hover:bg-brand-accent-hover transition-colors flex justify-between items-center disabled:opacity-70 disabled:cursor-not-allowed group tracking-wide"
                  >
                    <span>{isCheckingOut ? 'Redirecting...' : 'Proceed to Checkout'}</span>
                    {!isCheckingOut && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                  </button>

                  <button
                    onClick={clearCart}
                    className="w-full mt-3 py-3 px-6 bg-white border border-gray-200 text-red-500 rounded-sm font-medium hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Trash2 size={16} />
                    Clear Cart
                  </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
