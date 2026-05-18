import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    // Format to match the admin dashboard expectations
    const formatted = categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image,
      products: c._count.products
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const body = await req.json();
    const { name, slug, image } = body;
    
    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name, slug, image }
    });

    return NextResponse.json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
      products: 0
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
