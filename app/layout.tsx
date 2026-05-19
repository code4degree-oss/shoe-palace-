import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://shoeplace.com'),
  title: 'Shoe Place | Premium Footwear Store',
  description: 'Discover premium running shoes, casual sneakers, and stylish footwear at Shoe Place. Quality shoes for every occasion.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Shoe Place | Premium Footwear Store',
    description: 'Discover premium running shoes, casual sneakers, and stylish footwear at Shoe Place.',
    url: 'https://shoeplace.com',
    siteName: 'Shoe Place',
    images: [
      {
        url: '/images/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Shoe Place Premium Footwear',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shoe Place | Premium Footwear Store',
    description: 'Discover premium running shoes, casual sneakers, and stylish footwear at Shoe Place.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-brand-light text-brand-dark" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
