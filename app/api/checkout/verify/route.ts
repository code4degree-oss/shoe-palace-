import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendOrderConfirmation } from '@/lib/whatsapp';

const MAX_RETRIES = 5;

export async function POST(req: Request) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderPayload
    } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) throw new Error('Razorpay secret not configured');

    // 1. Verify signature FIRST — reject if invalid
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // 2. Signature is valid — payment is confirmed. Now create the order in DB.
    if (!orderPayload) {
      return NextResponse.json({ error: 'Missing order payload' }, { status: 400 });
    }

    // 3. Re-validate the total server-side to prevent amount tampering
    const productIds = orderPayload.orderItemsData.map((item: any) => item.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    let verifiedTotal = 0;
    for (const item of orderPayload.orderItemsData) {
      const product = dbProducts.find((p: any) => p.id === item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }
      const expectedPrice = product.salePrice || product.price;
      if (Math.abs(expectedPrice - item.priceAtPurchase) > 0.01) {
        return NextResponse.json({ error: 'Price mismatch detected. Please retry checkout.' }, { status: 400 });
      }
      verifiedTotal += expectedPrice * item.quantity;
    }
    verifiedTotal += orderPayload.deliveryCharge;

    if (Math.abs(verifiedTotal - orderPayload.total) > 1) {
      return NextResponse.json({ error: 'Total amount mismatch. Please retry checkout.' }, { status: 400 });
    }

    // 4. Create order inside a transaction with retry for race conditions
    //    Retries handle concurrent requests generating duplicate order/invoice numbers
    let order: any;
    let orderNumber = '';

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        order = await prisma.$transaction(async (tx) => {
          // 4a. Validate stock inside transaction (prevents overselling)
          for (const item of orderPayload.orderItemsData) {
            const product = await tx.product.findUnique({ where: { id: item.productId } });
            if (!product || product.stock < item.quantity) {
              throw new Error(
                `Insufficient stock for "${product?.name || item.productId}". ` +
                `Available: ${product?.stock || 0}, Requested: ${item.quantity}`
              );
            }
          }

          // 4b. Generate orderNumber
          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, '0');
          const dd = String(today.getDate()).padStart(2, '0');
          const dateStr = `${yyyy}${mm}${dd}`;

          const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

          const orderCountToday = await tx.order.count({
            where: {
              createdAt: {
                gte: startOfDay
              }
            }
          });

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */


          const runningNumber = 1001 + orderCountToday;
          orderNumber = `KV${dateStr}${runningNumber}`;

          // 4c. Generate sequential invoice number
          const lastOrder = await tx.order.findFirst({
            where: { invoiceNumber: { not: null } },
            orderBy: { invoiceNumber: 'desc' },
            select: { invoiceNumber: true }
          });
          const nextInvoiceNumber = (lastOrder?.invoiceNumber || 0) + 1;

          // 4d. Create the order
          const createdOrder = await tx.order.create({
            data: {
              orderNumber,
              invoiceNumber: nextInvoiceNumber,
              customerId: orderPayload.customerId,
              status: 'NEW',
              total: orderPayload.total,
              deliveryCharge: orderPayload.deliveryCharge,
              totalWeightGrams: orderPayload.totalWeightGrams,
              paymentMethod: 'ONLINE',
              shippingName: orderPayload.shippingName,
              shippingPhone: orderPayload.shippingPhone,
              shippingAddress1: orderPayload.shippingAddress1,
              shippingAddress2: orderPayload.shippingAddress2,
              shippingCity: orderPayload.shippingCity,
              shippingState: orderPayload.shippingState,
              shippingPincode: orderPayload.shippingPincode,
              razorpayPaymentId: razorpay_payment_id,
              razorpayOrderId: razorpay_order_id,
              razorpaySignature: razorpay_signature,
              items: {
                create: orderPayload.orderItemsData.map((item: any) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  priceAtPurchase: item.priceAtPurchase,
                  weightGrams: item.weightGrams,
                }))
              }
            }
          });

          // 4e. Decrement stock for each product
          for (const item of orderPayload.orderItemsData) {
            await tx.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } }
            });
          }

          return createdOrder;
        });

        break; // Transaction succeeded, exit retry loop

      } catch (error: any) {
        // P2002 = Unique constraint violation (duplicate order/invoice number)
        // Retry with incremented numbers on next attempt
        if (error.code === 'P2002' && attempt < MAX_RETRIES - 1) {
          console.warn(`[Checkout] Unique constraint collision on attempt ${attempt + 1}, retrying...`);
          continue;
        }
        throw error; // Re-throw non-retryable errors
      }
    }

    if (!order) {
      return NextResponse.json({ error: 'Failed to create order after multiple attempts' }, { status: 500 });
    }

    // 5. Send WhatsApp order confirmation (non-blocking, never fails the order)
    sendOrderConfirmation(
      orderPayload.shippingPhone,
      orderPayload.shippingName,
      orderNumber,
      orderPayload.total
    ).catch(err => console.error('[WhatsApp] Failed to send order confirmation:', err));

    return NextResponse.json({ success: true, order_id: order.orderNumber || order.id });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 });
  }
}
