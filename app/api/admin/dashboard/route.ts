import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) return unauthorizedResponse();
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [ordersToday, totalProducts, totalCustomers, recentOrders] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: today } }
      }),
      prisma.product.count(),
      prisma.customer.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
          items: true
        }
      })
    ]);

    const revenueToday = ordersToday.reduce((sum, order) => sum + order.total, 0);

    const formattedRecentOrders = recentOrders.map(o => ({
      id: o.id,
      customer: o.customer.name,
      items: o.items.reduce((sum, item) => sum + item.quantity, 0),
      total: o.total,
      status: o.status,
      date: new Date(o.createdAt).toLocaleDateString()
    }));

    return NextResponse.json({
      revenueToday,
      ordersTodayCount: ordersToday.length,
      totalProducts,
      totalCustomers,
      recentOrders: formattedRecentOrders
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard metrics' }, { status: 500 });
  }
}
