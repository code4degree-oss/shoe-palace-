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
    });

    if (!customer) {
      return NextResponse.json({ customer: null });
    }

    return NextResponse.json({ customer });

  } catch (error: any) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
