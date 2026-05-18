import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) return unauthorizedResponse();
  try {
    const customers = await prisma.customer.findMany({
      include: {
        orders: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedCustomers = customers.map(c => {
      const totalOrders = c.orders.length;
      const totalSpent = c.orders.reduce((sum, order) => sum + order.total, 0);
      const lastOrder = c.orders.length > 0 ? new Date(c.orders[0].createdAt).toLocaleDateString() : 'Never';

      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        city: c.city || 'Unknown',
        state: c.state || 'Unknown',
        totalOrders,
        totalSpent,
        lastOrder
      };
    });

    return NextResponse.json(formattedCustomers);
  } catch (error) {
    console.error('Customers API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
