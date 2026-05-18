import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) return unauthorizedResponse();
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '90'); // Default 90 days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get all order items for non-cancelled orders within the date range
    const items = await prisma.orderItem.findMany({
      where: {
        order: {
          status: {
            not: 'CANCELLED'
          },
          createdAt: { gte: startDate }
        }
      },
      select: {
        productId: true,
        quantity: true,
        priceAtPurchase: true,
        product: {
          select: {
            id: true,
            name: true,
            image: true,
            sku: true,
          }
        }
      }
    });

    // Aggregate by product
    const salesMap = new Map<string, { product: any, totalQuantity: number, totalRevenue: number }>();

    items.forEach((item) => {
      const existing = salesMap.get(item.productId);
      if (existing) {
        existing.totalQuantity += item.quantity;
        existing.totalRevenue += item.quantity * item.priceAtPurchase;
      } else {
        salesMap.set(item.productId, {
          product: item.product,
          totalQuantity: item.quantity,
          totalRevenue: item.quantity * item.priceAtPurchase
        });
      }
    });

    // Convert map to array and sort by totalQuantity descending
    const sortedProducts = Array.from(salesMap.values()).sort((a, b) => b.totalQuantity - a.totalQuantity);

    const formatted = sortedProducts.map((p) => ({
      id: p.product.id,
      name: p.product.name,
      image: p.product.image,
      sku: p.product.sku || 'N/A',
      totalQuantitySold: p.totalQuantity,
      totalRevenue: p.totalRevenue
    }));

    return NextResponse.json(formatted);

  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
