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
  metadataBase: new URL('https://Shoe Placeherbal.com'),
  title: 'Shoe Place | Authentic Herbal Hair Oils',
  description: 'Pure, natural, and authentic herbal hair oils for strong and beautiful hair. Restore your hair health with Shoe Place.',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Shoe Place | Authentic Herbal Hair Oils',
    description: 'Pure, natural, and authentic herbal hair oils for strong and beautiful hair.',
    url: 'https://Shoe Placeherbal.com',
    siteName: 'Shoe Place',
    images: [
      {
        url: '/images/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Shoe Place Herbal Hair Oils',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shoe Place | Authentic Herbal Hair Oils',
    description: 'Pure, natural, and authentic herbal hair oils for strong and beautiful hair.',
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
