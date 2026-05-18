'use client';

import { ReactNode } from 'react';
import { CartProvider } from './CartContext';
import { CartDrawer } from './CartDrawer';
export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
