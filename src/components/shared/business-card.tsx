'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Eye } from 'lucide-react';
import { RatingStars } from './rating-stars';

interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  city?: string | null;
  views: number;
  _count?: {
    reviews: number;
    products: number;
    services: number;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
    icon?: string | null;
  } | null;
  avgRating?: number;
}

interface BusinessCardProps {
  business: Business;
  variant?: 'grid' | 'list';
}

export function BusinessCard({ business, variant = 'grid' }: BusinessCardProps) {
  if (variant === 'list') {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border-border/60">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {business.logo ? (
                <img
                  src={business.logo}
                  alt={business.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href={`/entreprise/${business.slug}`}
                  className="font-semibold text-foreground group-hover:text-primary transition-colors truncate"
                >
                  {business.name}
                </Link>
                {business.category && (
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {business.category.name}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-1">
                {business.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {business.city}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {business.views} vues
                </span>
              </div>
              {business.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {business.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                <RatingStars
                  rating={business.avgRating || 0}
                  reviewCount={business._count?.reviews}
                  size="sm"
                />
                <Link href={`/entreprise/${business.slug}`}>
                  <Button variant="outline" size="sm">
                    Voir la fiche
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/60 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center gap-3">
          {business.logo ? (
            <img
              src={business.logo}
              alt={business.name}
              className="h-20 w-20 rounded-xl object-cover"
            />
          ) : (
            <div className="h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-10 w-10 text-primary" />
            </div>
          )}
          <div>
            <Link
              href={`/entreprise/${business.slug}`}
              className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors"
            >
              {business.name}
            </Link>
            {business.category && (
              <Badge variant="secondary" className="mt-1 text-xs">
                {business.category.name}
              </Badge>
            )}
          </div>
          {business.city && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {business.city}
            </span>
          )}
          <RatingStars
            rating={business.avgRating || 0}
            reviewCount={business._count?.reviews}
            size="sm"
          />
          <Link href={`/entreprise/${business.slug}`} className="w-full">
            <Button variant="outline" className="w-full" size="sm">
              Voir la fiche
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
