import type {Metadata} from 'next';
import { Inter, Oswald } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://shoeplace.com'),
  title: 'Shoe Place | Premium Footwear',
  description: 'Performance meets style. Discover premium running shoes, casual sneakers, and athletic footwear at Shoe Place.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Shoe Place | Premium Footwear',
    description: 'Performance meets style. Premium running shoes and athletic footwear.',
    url: 'https://shoeplace.com',
    siteName: 'Shoe Place',
    images: [
      {
        url: '/images/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Shoe Place — Premium Footwear',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shoe Place | Premium Footwear',
    description: 'Performance meets style. Premium running shoes and athletic footwear.',
  },
};


/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-brand-light text-brand-dark overflow-x-hidden" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
