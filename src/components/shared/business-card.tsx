'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Eye, ArrowRight } from 'lucide-react';
import { RatingStars } from './rating-stars';

interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  coverImage?: string | null;
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
      <Card className="group hover:shadow-lg transition-all duration-300 border-border/60 overflow-hidden">
        <Link href={`/entreprise/${business.slug}`} className="block">
          <div className="flex">
            {/* Cover Image */}
            <div className="relative w-40 sm:w-52 flex-shrink-0">
              {business.coverImage ? (
                <Image
                  src={business.coverImage}
                  alt={business.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 160px, 208px"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-primary/40" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {business.name}
                  </h3>
                  {business.category && (
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      {business.category.name}
                    </Badge>
                  )}
                </div>
                {business.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {business.description}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {business.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {business.city}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {business.views}
                  </span>
                </div>
                <RatingStars
                  rating={business.avgRating || 0}
                  reviewCount={business._count?.reviews}
                  size="sm"
                />
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-border/60 overflow-hidden flex flex-col">
      {/* Cover Image */}
      <Link href={`/entreprise/${business.slug}`} className="relative aspect-[16/10] overflow-hidden">
        {business.coverImage ? (
          <Image
            src={business.coverImage}
            alt={business.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Building2 className="h-16 w-16 text-primary/30" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category badge on image */}
        {business.category && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/90 text-foreground backdrop-blur-sm border-0 text-xs font-medium shadow-sm">
              {business.category.name}
            </Badge>
          </div>
        )}

        {/* Views badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
          <Eye className="h-3 w-3" />
          {business.views}
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md line-clamp-1">
            {business.name}
          </h3>
          {business.city && (
            <div className="flex items-center gap-1 text-white/80 text-sm mt-1">
              <MapPin className="h-3.5 w-3.5" />
              {business.city}
            </div>
          )}
        </div>
      </Link>

      {/* Card body */}
      <CardContent className="p-4 flex-1 flex flex-col">
        {business.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {business.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/40">
          <RatingStars
            rating={business.avgRating || 0}
            reviewCount={business._count?.reviews}
            size="sm"
          />
          <Link href={`/entreprise/${business.slug}`}>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary gap-1 px-2">
              <span className="hidden sm:inline">Voir la fiche</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
