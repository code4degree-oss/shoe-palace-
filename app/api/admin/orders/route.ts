import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) return unauthorizedResponse();
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');
    const status = searchParams.get('status') || undefined;

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          customer: true,
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    const formattedOrders = orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber || o.id,
      customer: o.customer.name,
      phone: o.customer.phone,
      itemsCount: o.items.reduce((acc, item) => acc + item.quantity, 0),
      itemsList: o.items.map(item => {
        let shortName = item.product.name;
        shortName = shortName.replace(/^Shoe Place Herbal\s+/i, '');
        shortName = shortName.replace(/^Shoe Place\s+/i, '');
        return `${item.quantity}x ${shortName}`;
      }),
      total: o.total,
      weight: o.totalWeightGrams,
      status: o.status,
      date: new Date(o.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
      }),
      createdAtIso: o.createdAt.toISOString(),
      canCancel: o.status === 'NEW',
      // Shipping details for Excel Export
      shippingName: o.shippingName,
      shippingPhone: o.shippingPhone,
      shippingAddress1: o.shippingAddress1,
      shippingAddress2: o.shippingAddress2,
      shippingCity: o.shippingCity,
      shippingState: o.shippingState,
      shippingPincode: o.shippingPincode,
      cancellationReason: o.cancellationReason
    }));

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      }
    });
  } catch (error) {
    console.error('Fetch admin orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
