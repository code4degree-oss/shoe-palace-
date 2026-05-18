'use client';

import { useCart } from '@/components/CartContext';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ShieldCheck, MapPin, User, Phone, ChevronLeft, Truck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, cartTotal, closeCart, cartCount, clearCart } = useCart();
  const router = useRouter();
  const initialLoadDone = useRef(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartCount === 0) {
      router.push('/');
    }
    closeCart(); // ensure drawer is closed
  }, [cartCount, router, closeCart]);

  const [formData, setFormData] = useState({
    mobile: '',
    name: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    pincode: '',
    city: '',
    state: '',
  });

  const [deliveryRates, setDeliveryRates] = useState({ maharashtra: 50, outside: 80 });
  const [isReturningCustomer, setIsReturningCustomer] = useState(false);

  useEffect(() => {
    // Fetch delivery rates
    fetch('/api/admin/delivery-zones')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setDeliveryRates({ maharashtra: data.maharashtra, outside: data.outside });
        }
      })
      .catch(console.error);

    // If user was previously "logged in", pre-fill their data
    const phone = localStorage.getItem('customer_phone');
    if (phone && !initialLoadDone.current) {
      initialLoadDone.current = true;
      setFormData(prev => ({ ...prev, mobile: phone }));
      fetch(`/api/customer/profile?phone=${phone}`)
        .then(res => res.json())
        .then(data => {
          if (data.customer) {
            setIsReturningCustomer(true);
            setFormData(prev => ({
              ...prev,
              name: data.customer.name || prev.name,
              addressLine1: data.customer.addressLine1 || prev.addressLine1,
              addressLine2: data.customer.addressLine2 || prev.addressLine2,
              addressLine3: data.customer.addressLine3 || prev.addressLine3,
              pincode: data.customer.pincode || prev.pincode,
              city: data.customer.city || prev.city,
              state: data.customer.state || prev.state,
            }));
          }
        })
        .catch(console.error);
    }
  }, []);

  // Auto-fill from phone number when user enters 10 digits
  const handlePhoneBlur = () => {
    if (formData.mobile.length === 10 && !isReturningCustomer) {
      fetch(`/api/customer/profile?phone=${formData.mobile}`)
        .then(res => res.json())
        .then(data => {
          if (data.customer) {
            setIsReturningCustomer(true);
            setFormData(prev => ({
              ...prev,
              name: data.customer.name || prev.name,
              addressLine1: data.customer.addressLine1 || prev.addressLine1,
              addressLine2: data.customer.addressLine2 || prev.addressLine2,
              addressLine3: data.customer.addressLine3 || prev.addressLine3,
              pincode: data.customer.pincode || prev.pincode,
              city: data.customer.city || prev.city,
              state: data.customer.state || prev.state,
            }));
          }
        })
        .catch(console.error);
    }
  };

  // Pincode auto-fill logic
  useEffect(() => {
    if (formData.pincode.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const po = data[0].PostOffice[0];
            setFormData(prev => ({
              ...prev,
              city: po.District,
              state: po.State
            }));
          }
        })
        .catch(console.error);
    }
  }, [formData.pincode]);

  let shippingCost = 0;
  if (formData.state) {
    if (formData.state.toLowerCase() === 'maharashtra') {
      shippingCost = deliveryRates.maharashtra;
    } else {
      shippingCost = deliveryRates.outside;
    }
  }

  const finalTotal = cartTotal + shippingCost;

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Reset returning customer flag if phone changes
    if (name === 'mobile') {
      setIsReturningCustomer(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    // Save phone to localStorage for future visits
    localStorage.setItem('customer_phone', formData.mobile);

    try {
      // 1. Create order on our backend
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData,
          items: items.map(item => ({ id: item.id, quantity: item.quantity, selectedSize: item.selectedSize, selectedColor: item.selectedColor })),
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      // 2. Load Razorpay script
      const resScript = await loadRazorpayScript();
      if (!resScript) {
        throw new Error('Razorpay SDK failed to load. Are you online?');
      }

      // 3. Open Razorpay Widget
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: 'Shoe Place',
        description: 'Herbal Hair Oils Purchase',
        order_id: data.order_id,
        handler: async function (response: any) {
          // 4. Verify Payment on backend — order is created ONLY after this succeeds
          try {
            const verifyRes = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderPayload: data.orderPayload,
              }),
            });
            const verifyData = await verifyRes.json();
            
            if (verifyRes.ok) {
              clearCart();
              router.push(`/order-success?orderId=${verifyData.order_id}`);
            } else {
              setError(verifyData.error || 'Payment verification failed');
            }
          } catch {
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.mobile,
        },
        theme: {
          color: '#1a1a1a',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on('payment.failed', function () {
        setError('Payment failed or was cancelled.');
      });
      paymentObject.open();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartCount === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-black hover:text-brand-accent transition-colors">
            <ChevronLeft size={20} />
            <span className="text-sm font-medium hidden sm:block">Continue Shopping</span>
          </Link>
          <h1 className="text-lg font-bold font-serif">Checkout</h1>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <ShieldCheck size={16} />
            <span className="hidden sm:block">Secure</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Returning customer welcome */}
        {isReturningCustomer && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <User size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Welcome back{formData.name ? `, ${formData.name}` : ''}!</p>
              <p className="text-xs text-green-600">We&apos;ve pre-filled your details from your last order.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Form */}
          <div className="flex-1">
            <form onSubmit={handlePayment} className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <h2 className="text-lg font-bold">Contact Information</h2>
                </div>
                
                {error && (
                  <div className="mb-5 p-4 bg-red-50 text-red-700 border border-red-100 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Full Name *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <User size={16} />
                      </span>
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent text-sm transition-all"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Mobile Number *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Phone size={16} />
                      </span>
                      <input
                        required
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        onBlur={handlePhoneBlur}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent text-sm transition-all"
                        placeholder="10-digit mobile number"
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit mobile number"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">We&apos;ll send order updates to this number</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <h2 className="text-lg font-bold">Shipping Address</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Address Line 1 *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <MapPin size={16} />
                      </span>
                      <input
                        required
                        type="text"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent text-sm transition-all"
                        placeholder="House/Flat No., Building Name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Address Line 2</label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent text-sm transition-all"
                        placeholder="Street, Area, Locality"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Landmark</label>
                      <input
                        type="text"
                        name="addressLine3"
                        value={formData.addressLine3}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent text-sm transition-all"
                        placeholder="Near..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Pincode *</label>
                    <input
                      required
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent text-sm transition-all"
                      placeholder="6-digit Pincode"
                      pattern="[0-9]{6}"
                      title="Please enter a valid 6-digit pincode"
                    />
                    <p className="text-[11px] text-brand-accent mt-1">City & State auto-fill from pincode</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">City *</label>
                      <input
                        required
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent text-sm transition-all"
                        placeholder="Auto-filled"
                        readOnly={!!formData.city}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">State *</label>
                      <input
                        required
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent text-sm transition-all"
                        placeholder="Auto-filled"
                        readOnly={!!formData.state}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <h2 className="text-lg font-bold">Payment</h2>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-5 border border-gray-100">
                  <ShieldCheck size={18} className="text-green-600 shrink-0" />
                  <p className="text-xs text-gray-600">Your payment is processed securely via Razorpay. We never store your card details.</p>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || !formData.state}
                  className="w-full py-4 px-6 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group text-base"
                >
                  <ShieldCheck size={18} />
                  {isProcessing ? 'Processing...' : `Pay ₹${finalTotal.toFixed(0)} Securely`}
                </button>
              </div>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <ShoppingBag size={18} className="text-brand-accent" />
                Order Summary
                <span className="text-xs font-normal text-gray-400 ml-auto">{items.length} item{items.length > 1 ? 's' : ''}</span>
              </h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.cartItemId} className="flex gap-3">
                    <div className="relative w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                      {(item.selectedSize || item.selectedColor) && (
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {item.selectedSize && `Size: ${item.selectedSize}`}
                          {item.selectedSize && item.selectedColor && ' | '}
                          {item.selectedColor && `Color: ${item.selectedColor}`}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-bold text-gray-900 shrink-0">
                      ₹{((item.salePrice || item.price) * item.quantity).toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">₹{cartTotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Truck size={14} />
                    Shipping {formData.state ? `(${formData.state})` : ''}
                  </span>
                  <span className="font-medium">
                    {formData.state ? `₹${shippingCost.toFixed(0)}` : '—'}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
