import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/banners - Public endpoint to fetch active banners by position
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position') || 'home';

    const now = new Date();

    const banners = await db.ad.findMany({
      where: {
        position,
        isActive: true,
        OR: [
          { AND: [{ startDate: { lte: now } }, { endDate: { gte: now } }] },
          { AND: [{ startDate: { lte: now } }, { endDate: null }] },
          { AND: [{ startDate: null }, { endDate: { gte: now } }] },
          { AND: [{ startDate: null }, { endDate: null }] },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        link: true,
        type: true,
        position: true,
        createdAt: true,
      },
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des bannières' },
      { status: 500 }
    );
  }
}
