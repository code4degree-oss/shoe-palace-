'use client';

import { ReactNode } from 'react';
import { CartProvider } from './CartContext';
import { CartDrawer } from './CartDrawer';

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
