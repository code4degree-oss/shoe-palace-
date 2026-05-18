import { prisma } from './prisma';

export interface Product {
  id: string;
  slug?: string | null;
  name: string;
  price: number;
  salePrice: number;
  image: string;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  description: string;
  weightGrams: number;
  displayWeight?: number;
  weightUnit?: string;
  shippingWeightGrams?: number;
  categoryId: string;
  categorySlug?: string;
  categoryName?: string;
  stock: number;
  badge?: string | null;
  howToUse?: string | null;
  ingredients?: string | null;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  image?: string | null;
  createdAt: Date;
}

export interface Product {
  id: string;
  slug?: string | null;
  name: string;
  price: number;
  salePrice: number;
  image: string;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  description: string;
  weightGrams: number;
  displayWeight?: number;
  weightUnit?: string;
  shippingWeightGrams?: number;
  categoryId: string;
  categorySlug?: string;
  categoryName?: string;
  stock: number;
  badge?: string | null;
  howToUse?: string | null;
  ingredients?: string | null;
  reviews?: Review[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { position: 'asc' },
  });

  return products.map(p => ({
    ...p,
    categoryName: p.category.name,
    categorySlug: p.category.slug,
  }));
}

export async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function getProductById(idOrSlug: string): Promise<Product | null> {
  const p = await prisma.product.findFirst({
    where: { 
      OR: [
        { id: idOrSlug },
        { slug: idOrSlug }
      ]
    },
    include: { 
      category: true,
      reviews: {
        where: { approved: true },
        orderBy: { createdAt: 'desc' }
      }
    },
  });
  if (!p) return null;
  return {
    ...p,
    categoryName: p.category.name,
    categorySlug: p.category.slug,
    reviews: p.reviews,
  };
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return prisma.category.findUnique({
    where: { slug },
  });
}

export async function getCategoryById(id: string): Promise<Category | null> {
  return prisma.category.findUnique({
    where: { id },
  });
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { categoryId },
    include: { category: true },
    orderBy: { position: 'asc' },
  });
  return products.map(p => ({
    ...p,
    categoryName: p.category.name,
    categorySlug: p.category.slug,
  }));
}
