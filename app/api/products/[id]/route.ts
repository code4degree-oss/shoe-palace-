import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const { id } = await params;
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

    const baseSlug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    const product = await prisma.product.update({
      where: { id },
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
        badge: badge || null,
        sku: sku || null,
        slug,
        howToUse: howToUse || null,
        ingredients: ingredients || null,
        images: Array.isArray(images) ? images : [],
        sizes: Array.isArray(sizes) ? sizes : (typeof sizes === 'string' ? sizes.split(',').map((s: string) => s.trim()).filter(Boolean) : []),
        colors: Array.isArray(colors) ? colors : (typeof colors === 'string' ? colors.split(',').map((c: string) => c.trim()).filter(Boolean) : []),
        colorImages: colorImages ? (typeof colorImages === 'string' ? colorImages : JSON.stringify(colorImages)) : "{}",
        variantPrices: variantPrices ? (typeof variantPrices === 'string' ? variantPrices : JSON.stringify(variantPrices)) : "[]",
      },
      include: { category: true }
    });

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */


    return NextResponse.json({
      ...product,
      categoryName: product.category.name,
      categorySlug: product.category.slug
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const { id } = await params;

    // Delete related records first to avoid foreign key constraints
    await prisma.comboProduct.deleteMany({ where: { productId: id } });
    await prisma.review.deleteMany({ where: { productId: id } });
    await prisma.orderItem.deleteMany({ where: { productId: id } });

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
