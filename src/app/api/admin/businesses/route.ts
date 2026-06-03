import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// GET /api/admin/businesses - All businesses with management data (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Réservé aux administrateurs.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || ''; // active, suspended, inactive
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (status === 'active') {
      where.isActive = true;
      where.isSuspended = false;
    } else if (status === 'suspended') {
      where.isSuspended = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { city: { contains: search } },
        { region: { contains: search } },
        { owner: { name: { contains: search } } },
      ];
    }

    const [businesses, total] = await Promise.all([
      db.business.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          owner: {
            select: { id: true, name: true, email: true, phone: true },
          },
          _count: {
            select: {
              reviews: true,
              products: true,
              services: true,
              ads: true,
              photos: true,
            },
          },
        },
      }),
      db.business.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      businesses,
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
    console.error('Error fetching admin businesses:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des entreprises' },
      { status: 500 }
    );
  }
}

// POST /api/admin/businesses - Create a new business with owner (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé. Réservé aux administrateurs.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      businessName,
      categoryId,
      description,
      address,
      city,
      businessPhone,
      businessEmail,
      website,
      ownerName,
      ownerEmail,
      ownerPassword,
    } = body;

    if (!businessName || !ownerName || !ownerEmail || !ownerPassword) {
      return NextResponse.json(
        { error: 'Le nom de l\'entreprise, le nom du propriétaire, l\'email et le mot de passe sont requis' },
        { status: 400 }
      );
    }

    if (ownerPassword.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Check email uniqueness
    const existingUser = await db.user.findUnique({ where: { email: ownerEmail } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ownerPassword, 10);

    // Generate slug from business name
    const slug = businessName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Check slug uniqueness
    const existingSlug = await db.business.findUnique({ where: { slug } });
    const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

    // Create user first
    const user = await db.user.create({
      data: {
        name: ownerName,
        email: ownerEmail,
        password: hashedPassword,
        role: 'ENTERPRISE',
      },
    });

    // Create business linked to user
    const business = await db.business.create({
      data: {
        name: businessName,
        slug: finalSlug,
        categoryId: categoryId || null,
        description,
        address,
        city,
        phone: businessPhone,
        email: businessEmail,
        website,
        ownerId: user.id,
        isActive: true,
        isSuspended: false,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        owner: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    return NextResponse.json({ user, business }, { status: 201 });
  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'entreprise' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/businesses - Suspend/activate a business (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, isSuspended, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'L\'identifiant de l\'entreprise est requis' },
        { status: 400 }
      );
    }

    const existing = await db.business.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Entreprise non trouvée' },
        { status: 404 }
      );
    }

    const business = await db.business.update({
      where: { id },
      data: {
        ...(isSuspended !== undefined && { isSuspended }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        category: true,
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json(business);
  } catch (error) {
    console.error('Error updating business status:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'entreprise' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/businesses - Delete a business (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      );
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'L\'identifiant de l\'entreprise est requis' },
        { status: 400 }
      );
    }

    const existing = await db.business.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Entreprise non trouvée' },
        { status: 404 }
      );
    }

    // Delete business and all related data (cascading)
    await db.business.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: 'Entreprise supprimée avec succès',
    });
  } catch (error) {
    console.error('Error deleting business:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'entreprise' },
      { status: 500 }
    );
  }
}
