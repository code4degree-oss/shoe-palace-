import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: { position: 'asc' }
    });
    
    const formatted = products.map(p => ({
      ...p,
      categoryName: p.category.name,
      categorySlug: p.category.slug
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const body = await req.json();
    const { 
      name, 
      description, 
      price, 
      salePrice, 
      stock, 
      weightGrams, 
      displayWeight,
      weightUnit,
      shippingWeightGrams,
      categoryId, 
      image,
      badge,
      sku,
      howToUse,
      ingredients,
      images,
      sizes,
      colors,
      colorImages,
      variantPrices
    } = body;

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */


    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price.toString()),
        salePrice: parseFloat(salePrice.toString()),
        stock: parseInt(stock.toString()),
        weightGrams: parseInt((shippingWeightGrams || weightGrams || 0).toString()),
        displayWeight: parseInt((displayWeight || 0).toString()),
        weightUnit: weightUnit || 'g',
        shippingWeightGrams: parseInt((shippingWeightGrams || 0).toString()),
        categoryId,
        image,
        badge,
        sku,
        slug,
        howToUse: howToUse || null,
        ingredients: ingredients || null,
        images: Array.isArray(images) ? images : [],
        sizes: Array.isArray(sizes) ? sizes : (typeof sizes === 'string' ? sizes.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
        colors: Array.isArray(colors) ? colors : (typeof colors === 'string' ? colors.split(',').map((c: string) => c.trim()).filter(Boolean) : []),
        colorImages: colorImages ? (typeof colorImages === 'string' ? colorImages : JSON.stringify(colorImages)) : "{}",
        variantPrices: variantPrices ? (typeof variantPrices === 'string' ? variantPrices : JSON.stringify(variantPrices)) : "[]",
        position: await prisma.product.count() // append to end
      },
      include: { category: true }
    });

    return NextResponse.json({
      ...product,
      categoryName: product.category.name,
      categorySlug: product.category.slug
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
