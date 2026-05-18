import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');
    const productId = searchParams.get('productId');

    if (!phone || !productId) {
      return NextResponse.json({ error: 'Phone number and product ID are required' }, { status: 400 });
    }

    // Check if customer exists
    const customer = await prisma.customer.findUnique({
      where: { phone },
    });

    if (!customer) {
      return NextResponse.json({ eligible: false });
    }

    // Check if customer has an order containing this product
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          customerId: customer.id,
          status: {
            not: 'CANCELLED' // Can be 'NEW', 'SHIPPED', 'DELIVERED', 'PACKED'
          }
        }
      }
    });

    return NextResponse.json({ eligible: !!orderItem, customerId: customer.id });

  } catch (error: any) {
    console.error('Check eligibility error:', error);
    return NextResponse.json({ error: 'Failed to check eligibility' }, { status: 500 });
  }
}
