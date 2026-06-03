import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/ads - List ads with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || '';
    const category = searchParams.get('category') || '';
    const businessId = searchParams.get('businessId') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = { slug: category };
    }

    if (businessId) {
      where.businessId = businessId;
    }

    const [ads, total] = await Promise.all([
      db.ad.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          business: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              city: true,
            },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      db.ad.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      ads,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des publicités' },
      { status: 500 }
    );
  }
}

// POST /api/ads - Create a new ad
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    const body = await request.json();
    const { title, description, image, type, categoryId, businessId } = body;

    if (!title || !businessId) {
      return NextResponse.json(
        { error: 'Le titre et l\'entreprise sont requis' },
        { status: 400 }
      );
    }

    // Verify user owns the business (or is admin)
    const userRole = (session.user as any).role;
    if (userRole !== 'ADMIN') {
      const business = await db.business.findUnique({
        where: { id: businessId },
      });
      if (!business || business.ownerId !== userId) {
        return NextResponse.json(
          { error: 'Non autorisé à créer une publicité pour cette entreprise' },
          { status: 403 }
        );
      }
    }

    // Validate type
    const validTypes = ['SERVICE', 'PROMOTION', 'PRODUCT', 'EVENT'];
    if (type && !validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Type de publicité invalide' },
        { status: 400 }
      );
    }

    const ad = await db.ad.create({
      data: {
        title,
        description,
        image,
        type: type || 'SERVICE',
        categoryId,
        businessId,
      },
      include: {
        business: {
          select: { id: true, name: true, slug: true, logo: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json(ad, { status: 201 });
  } catch (error) {
    console.error('Error creating ad:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la publicité' },
      { status: 500 }
    );
  }
}
