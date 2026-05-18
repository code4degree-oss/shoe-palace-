import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth';



export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const { id } = await params;
    const body = await req.json();
    
    const review = await prisma.review.update({
      where: { id },
      data: {
        approved: body.approved !== undefined ? body.approved : undefined,
        featured: body.featured !== undefined ? body.featured : undefined,
      }
    });
    
    return NextResponse.json(review);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}
