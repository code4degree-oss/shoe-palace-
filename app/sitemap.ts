import { prisma } from '@/lib/prisma';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://Shoe Placeherbal.com';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/our-story`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms-and-conditions`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/shipping-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/return-and-refund-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/cancellation-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Dynamic product pages
  try {
    const products = await prisma.product.findMany({ select: { id: true, slug: true, updatedAt: true } });
    const productPages: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/product/${p.slug || p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Dynamic category pages
    const categories = await prisma.category.findMany({ select: { id: true } });
    const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/category/${c.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    return [...staticPages, ...categoryPages, ...productPages];
  } catch {
    return staticPages;
  }
}
