import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth';
import { sendShippingNotification } from '@/lib/whatsapp';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const { id } = await params;
    const body = await req.json();
    
    if (!body.status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    if (body.status === 'PACKED') {
      const existingOrder = await prisma.order.findUnique({ where: { id } });
      if (!existingOrder) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      
      const orderAgeMs = Date.now() - new Date(existingOrder.createdAt).getTime();
      const fourHoursMs = 4 * 60 * 60 * 1000;
      if (orderAgeMs < fourHoursMs) {
        return NextResponse.json({ error: 'Order cannot be packed within the 4-hour cancellation window.' }, { status: 400 });
      }
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: body.status as OrderStatus,
      },
      include: {
        customer: true,
      }
    });

    // Send WhatsApp notification based on status change (non-blocking)
    if (body.status === 'SHIPPED') {
      sendShippingNotification(
        order.customer.phone,
        order.customer.name,
        order.orderNumber || order.id
      ).catch(err => console.error('[WhatsApp] Failed to send shipping notification:', err));
    }
    
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
