import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, customerId, name, phone, rating, text, image } = body;

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
        image: image || null,
        approved: false, // Reviews require admin approval
        featured: false,
      }
    });

    return NextResponse.json({ success: true, review });

  } catch (error: any) {
    console.error('Submit review error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
