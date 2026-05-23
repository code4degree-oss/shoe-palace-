import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const { id } = await params;
    
    // First check if category has products
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing products' }, 
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}

/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */


export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, image } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, image },
    });

    return NextResponse.json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
      products: 0, // Simplified for the response, since the frontend just updates the row
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}
