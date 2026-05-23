import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, customerId, name, phone, rating, text, images } = body;

    if (!productId || !name || !phone || !rating || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        customerId: customerId || null,
        name,
        phone,
        rating: parseInt(rating),
        text,
        images: Array.isArray(images) ? images : (images ? [images] : []),
        approved: false, // Reviews require admin approval
        featured: false,
      }
    });

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */


    return NextResponse.json({ success: true, review });

  } catch (error: any) {
    console.error('Submit review error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
