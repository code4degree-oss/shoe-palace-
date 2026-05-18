import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken, unauthorizedResponse } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) return unauthorizedResponse();
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '90'); // Default 90 days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate }
      },
      select: {
        total: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group by Date (YYYY-MM-DD)
    const dailyData: Record<string, { revenue: number; orders: number }> = {};

    orders.forEach(order => {
      const dateStr = new Date(order.createdAt).toISOString().split('T')[0];
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = { revenue: 0, orders: 0 };
      }
      dailyData[dateStr].revenue += order.total;
      dailyData[dateStr].orders += 1;
    });

    const formattedData = Object.keys(dailyData).map(date => ({
      date,
      revenue: dailyData[date].revenue,
      orders: dailyData[date].orders
    }));

    // Sort descending by date
    formattedData.sort((a, b) => b.date.localeCompare(a.date));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Revenue API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch revenue' }, { status: 500 });
  }
}
