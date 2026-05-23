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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
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
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold text-black uppercase tracking-[0.2em]">Your Bag</h2>
                <span className="text-xs text-brand-steel">({items.reduce((sum, i) => sum + i.quantity, 0)})</span>
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 flex items-center justify-center text-black/60 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-black/50 space-y-4">
                  <ShoppingBag size={48} className="opacity-10 text-black" />
                  <p className="text-sm font-medium text-black/40 uppercase tracking-wider">Your bag is empty</p>
                  <button
                    onClick={closeCart}
                    className="mt-4 px-8 py-3 bg-brand-black text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-graphite transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="relative flex gap-4 items-start pb-4 border-b border-gray-100 last:border-0">
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X size={14} />
                      </button>

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */


                      <div className="w-20 h-20 bg-gray-50 overflow-hidden flex-shrink-0">
                        <div className="relative w-full h-full">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <h3 className="font-bold text-black text-sm truncate">{item.name}</h3>
                        {(item.selectedSize || item.selectedColor) && (
                          <p className="text-[11px] text-brand-steel mt-0.5 uppercase tracking-wider">
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                            {item.selectedSize && item.selectedColor && ' · '}
                            {item.selectedColor && `${item.selectedColor}`}
                          </p>
                        )}
                        <p className="text-black font-bold text-sm mt-1">₹{(item.salePrice || item.price)}</p>
                        
                        <div className="flex items-center gap-0 mt-2 border border-gray-200 w-max">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-black hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold border-x border-gray-200">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-black hover:bg-gray-50 transition-colors"
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
              <div className="p-6 bg-white border-t border-gray-100">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-xs text-brand-steel uppercase tracking-wider font-medium">Subtotal</span>
                  <span className="font-bold text-black text-xl">₹{cartTotal.toFixed(0)}</span>
                </div>
                <p className="text-[11px] text-brand-steel mb-4">Shipping calculated at checkout</p>
                
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 px-6 bg-brand-black text-white font-bold hover:bg-brand-graphite transition-all flex justify-between items-center disabled:opacity-70 disabled:cursor-not-allowed group text-xs uppercase tracking-[0.2em]"
                >
                  <span>{isCheckingOut ? 'Redirecting...' : 'Checkout'}</span>
                  {!isCheckingOut && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                </button>

                <button
                  onClick={clearCart}
                  className="w-full mt-3 py-2.5 text-xs text-brand-steel hover:text-red-500 transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider"
                >
                  <Trash2 size={14} />
                  Clear Bag
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
