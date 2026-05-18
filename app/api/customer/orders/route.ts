import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { phone },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    if (!customer) {
      return NextResponse.json({ orders: [], message: 'No customer found with this number' });
    }

    return NextResponse.json({ orders: customer.orders });

  } catch (error: any) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
