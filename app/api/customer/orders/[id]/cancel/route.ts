import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const phone = body.phone;
    const reason = body.reason || null;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { customer: true }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify order belongs to the requesting customer
    if (order.customer.phone !== phone) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (order.status !== 'NEW') {
      return NextResponse.json({ error: 'Only NEW orders can be cancelled' }, { status: 400 });
    }

    const orderDate = new Date(order.createdAt);
    // Check time limit (12 hours)
    const twelveHoursMs = 12 * 60 * 60 * 1000;
    if (Date.now() - orderDate.getTime() > twelveHoursMs) {
      return NextResponse.json({ error: 'Orders can only be cancelled within 12 hours.' }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancellationReason: reason
      }
    });

    return NextResponse.json({ success: true, order: updatedOrder });

  } catch (error: any) {
    console.error('Cancel order error:', error);
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}
