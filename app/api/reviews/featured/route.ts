import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const featuredReviews = await prisma.review.findMany({
      where: {
        featured: true,
        approved: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 3, // Only show top 3 on homepage
    });
    return NextResponse.json(featuredReviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch featured reviews' }, { status: 500 });
  }
}
