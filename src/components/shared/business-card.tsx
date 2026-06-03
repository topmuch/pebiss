'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, MapPin, Eye, ArrowRight, Plus } from 'lucide-react';
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
    <Link href={`/entreprise/${business.slug}`} className="group block">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-border bg-white" style={{ width: '251px' }}>
        {/* Cover Image — fixed 251×517px portrait */}
        <div className="relative overflow-hidden" style={{ width: '251px', height: '517px' }}>
          {business.coverImage ? (
            <Image
              src={business.coverImage}
              alt={business.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="502px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
              <Building2 className="h-20 w-20 text-primary/30" />
            </div>
          )}
          {/* Category badge */}
          {business.category && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/90 text-foreground backdrop-blur-sm border-0 text-[11px] font-medium shadow-sm">
                {business.category.name}
              </Badge>
            </div>
          )}
          {/* Views badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white text-[11px] px-2 py-1 rounded-full">
            <Eye className="h-3 w-3" />
            {business.views}
          </div>
        </div>

        {/* Text area — compact white section below image (~15% of card) */}
        <div className="px-3 py-2.5 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-foreground text-sm leading-snug group-hover:text-primary transition-colors line-clamp-1">
              {business.name}
            </h3>
            {business.description && (
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1 mt-0.5">
                {business.description}
              </p>
            )}
          </div>
          {/* Green circular + button */}
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors shadow-sm shrink-0">
            <Plus className="h-3.5 w-3.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
}
