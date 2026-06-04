'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Megaphone,
  ExternalLink,
  ImageOff,
  LayoutGrid,
  Square,
  RectangleHorizontal,
  Maximize,
  Smartphone,
} from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  link?: string | null;
  type: string;
  position: string;
  format: string;
  createdAt: string;
}

const FORMAT_CONFIG: Record<string, { key: string; icon: typeof Square; aspectClass: string }> = {
  square: { key: 'banner_format_square', icon: Square, aspectClass: 'aspect-square' },
  rectangle: { key: 'banner_format_rectangle', icon: RectangleHorizontal, aspectClass: 'aspect-[4/3]' },
  banner: { key: 'banner_format_banner', icon: Maximize, aspectClass: 'aspect-[4/1]' },
  tall: { key: 'banner_format_tall', icon: Smartphone, aspectClass: 'aspect-[2/3]' },
};

export default function AnnoncesPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');

  const { data: banners, isLoading } = useQuery<Banner[]>({
    queryKey: ['banners-all'],
    queryFn: () => fetch('/api/banners?position=all').then((r) => r.json()),
  });

  const filteredBanners = activeFilter === 'all'
    ? (banners || [])
    : (banners || []).filter((b) => b.format === activeFilter || (!b.format && activeFilter === 'rectangle'));

  const formatTabs = [
    { value: 'all', label: t('banners_filter_all') },
    { value: 'rectangle', label: t('banner_format_rectangle') },
    { value: 'square', label: t('banner_format_square') },
    { value: 'banner', label: t('banner_format_banner') },
    { value: 'tall', label: t('banner_format_tall') },
  ];

  return (
    <div className="min-h-[60vh]">
      {/* Page Header */}
      <div className="pebiss-gradient py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <LayoutGrid className="h-8 w-8 text-white/80" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {t('banners_page_title')}
            </h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            {t('banners_page_subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {formatTabs.map((tab) => (
            <Button
              key={tab.value}
              variant={activeFilter === tab.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(tab.value)}
              className={
                activeFilter === tab.value
                  ? 'bg-pebiss-orange hover:bg-pebiss-orange/90 text-white'
                  : ''
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-6">
          {t('banners_count', { count: filteredBanners.length })}
        </p>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <Card key={i} className="border-border/40">
                <CardContent className="p-0">
                  <Skeleton className="w-full aspect-[4/3] rounded-t-lg" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-4 w-24 rounded-full" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-9 w-28 rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredBanners.length === 0 && (
          <Card className="border-border/40">
            <CardContent className="py-20 px-6 text-center">
              <Megaphone className="h-16 w-16 text-muted-foreground/20 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t('banners_no_results')}
              </h3>
              <p className="text-muted-foreground">
                {t('banners_no_results_desc')}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Banners Grid */}
        {!isLoading && filteredBanners.length > 0 && (
          <div className="space-y-8">
            {/* Banner format = full-width */}
            {filteredBanners
              .filter((b) => b.format === 'banner' || (!b.format && activeFilter === 'banner'))
              .map((banner) => (
                <BannerCard key={banner.id} banner={banner} isWide />
              ))}

            {/* Other formats in grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBanners
                .filter((b) => b.format !== 'banner' && b.format)
                .map((banner) => (
                  <BannerCard key={banner.id} banner={banner} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BannerCard({ banner, isWide = false }: { banner: Banner; isWide?: boolean }) {
  const { t } = useTranslation();
  const formatConfig = FORMAT_CONFIG[banner.format || 'rectangle'];
  const FormatIcon = formatConfig?.icon || RectangleHorizontal;

  const content = (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/40 overflow-hidden h-full">
      <CardContent className="p-0">
        {/* Image */}
        {banner.image ? (
          <div className={`relative ${isWide ? 'w-full' : 'w-full'} ${isWide ? 'max-h-[200px]' : formatConfig?.aspectClass || 'aspect-[4/3]'} overflow-hidden`}>
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs font-medium gap-1">
                <FormatIcon className="h-3 w-3" />
                {t(formatConfig?.key || 'banner_format_rectangle')}
              </Badge>
            </div>
          </div>
        ) : (
          <div className={`bg-muted flex items-center justify-center ${formatConfig?.aspectClass || 'aspect-[4/3]'}`}>
            <ImageOff className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}

        {/* Content */}
        <div className={isWide ? 'p-4 md:p-6' : 'p-4'}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {banner.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {banner.description}
                </p>
              )}
              {banner.link && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-pebiss-orange hover:bg-pebiss-orange/90 text-white border-pebiss-orange text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(banner.link!, '_blank');
                  }}
                >
                  {t('banners_view_details')}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (banner.link && !banner.link.startsWith('#')) {
    return (
      <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}
