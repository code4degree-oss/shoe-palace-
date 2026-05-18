import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET() {
  try {
    const zones = await prisma.deliveryZone.findMany();
    
    // Default fallback if table is empty
    let maharashtra = 50;
    let outside = 80;

    zones.forEach(z => {
      if (z.zone === 'maharashtra') maharashtra = z.charge;
      if (z.zone === 'outside_maharashtra') outside = z.charge;
    });

    return NextResponse.json({ maharashtra, outside });
  } catch (error) {
    console.error('Failed to fetch delivery zones:', error);
    return NextResponse.json({ error: 'Failed to fetch zones' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyAdminToken(req)) return unauthorizedResponse();
  try {
    const { maharashtra, outside } = await req.json();

    // Upsert Maharashtra zone
    await prisma.deliveryZone.upsert({
      where: { zone: 'maharashtra' },
      update: { charge: Number(maharashtra) },
      create: { zone: 'maharashtra', charge: Number(maharashtra) }
    });

    // Upsert Outside zone
    await prisma.deliveryZone.upsert({
      where: { zone: 'outside_maharashtra' },
      update: { charge: Number(outside) },
      create: { zone: 'outside_maharashtra', charge: Number(outside) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update delivery zones:', error);
    return NextResponse.json({ error: 'Failed to update zones' }, { status: 500 });
  }
}
