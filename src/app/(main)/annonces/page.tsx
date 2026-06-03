'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslation, categoryTranslations } from '@/lib/i18n';
import {
  Megaphone,
  Building2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Tag,
  Calendar,
  Search,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Ad {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  type: string;
  createdAt: string;
  business: {
    id: string;
    name: string;
    slug: string;
    logo?: string | null;
    city?: string | null;
  };
  category?: { id: string; name: string; slug: string } | null;
}

const adTypeKeys: Record<string, string> = {
  SERVICE: 'ads_type_service',
  PROMOTION: 'ads_type_promotion',
  PRODUCT: 'ads_type_product',
  EVENT: 'ads_type_event',
};

const adTypeColors: Record<string, string> = {
  SERVICE: 'bg-primary/10 text-primary border-primary/20',
  PROMOTION: 'bg-pebiss-orange/10 text-pebiss-orange border-pebiss-orange/20',
  PRODUCT: 'bg-green-100 text-green-700 border-green-200',
  EVENT: 'bg-purple-100 text-purple-700 border-purple-200',
};

export default function AnnoncesPage() {
  const { t, locale } = useTranslation();
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => fetch('/api/categories').then((r) => r.json()),
  });

  const { data, isLoading } = useQuery<{
    ads: Ad[];
    pagination: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean };
  }>({
    queryKey: ['ads', type, category, page],
    queryFn: () => {
      const params = new URLSearchParams();
      if (type) params.set('type', type);
      if (category) params.set('category', category);
      params.set('page', page.toString());
      params.set('limit', '12');
      return fetch(`/api/ads?${params.toString()}`).then((r) => r.json());
    },
  });

  const ads = data?.ads || [];
  const pagination = data?.pagination;

  const pageNumbers: number[] = [];
  if (pagination) {
    const start = Math.max(1, page - 2);
    const end = Math.min(pagination.totalPages, page + 2);
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }
  }

  return (
    <div className="min-h-[60vh]">
      {/* Page Header */}
      <div className="pebiss-gradient py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t('ads_page_list_title')}
          </h1>
          <p className="text-white/80 text-lg">
            {t('ads_page_list_subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8 border-border/40 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="text-sm font-medium mb-1.5 block">{t('ads_page_list_type')}</label>
                <Select value={type} onValueChange={(v) => { setType(v === 'all' ? '' : v); setPage(1); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('ads_page_list_all_types')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('ads_page_list_all_types')}</SelectItem>
                    <SelectItem value="SERVICE">{t('ads_type_service')}</SelectItem>
                    <SelectItem value="PROMOTION">{t('ads_type_promotion')}</SelectItem>
                    <SelectItem value="PRODUCT">{t('ads_type_product')}</SelectItem>
                    <SelectItem value="EVENT">{t('ads_type_event')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 w-full">
                <label className="text-sm font-medium mb-1.5 block">{t('ads_page_list_category')}</label>
                <Select value={category} onValueChange={(v) => { setCategory(v === 'all' ? '' : v); setPage(1); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('annuaire_all_categories')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('annuaire_all_categories')}</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.slug && categoryTranslations[cat.slug] ? categoryTranslations[cat.slug][locale] : cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {t('ads_page_list_count', { count: pagination?.total || 0 })}
          </p>
          {(type || category) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setType('');
                setCategory('');
              }}
              className="text-destructive"
            >
              {t('ads_page_list_reset_filters')}
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <Card key={i} className="border-border/40">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex items-center gap-2 pt-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && ads.length === 0 && (
          <Card className="border-border/40">
            <CardContent className="py-16 px-6 text-center">
              <Megaphone className="h-16 w-16 text-muted-foreground/20 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {t('ads_page_list_no_results')}
              </h3>
              <p className="text-muted-foreground">
                {t('ads_page_list_no_results_desc')}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Ads Grid */}
        {!isLoading && ads.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <Link key={ad.id} href={`/entreprise/${ad.business.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 border-border/40 h-full">
                    {/* Image */}
                    {ad.image && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={ad.image}
                          alt={ad.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <Badge
                          className={`text-xs ${adTypeColors[ad.type] || 'bg-muted text-muted-foreground'}`}
                          variant="outline"
                        >
                          {t(adTypeKeys[ad.type] || ad.type) || ad.type}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(ad.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'pt-PT', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                        {ad.title}
                      </h3>
                      {ad.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {ad.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                        {ad.business.logo ? (
                          <img
                            src={ad.business.logo}
                            alt={ad.business.name}
                            className="h-8 w-8 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {ad.business.name}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {ad.business.city && (
                              <>
                                <MapPin className="h-3 w-3" />
                                {ad.business.city}
                              </>
                            )}
                            {ad.category && ad.business.city && <span>·</span>}
                            {ad.category && (
                              <span className="truncate">{ad.category && ad.category.slug && categoryTranslations[ad.category.slug] ? categoryTranslations[ad.category.slug][locale] : ad.category?.name}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('annuaire_previous')}
                </Button>

                <div className="flex items-center gap-1">
                  {pageNumbers[0] > 1 && (
                    <>
                      <button
                        onClick={() => setPage(1)}
                        className="w-8 h-8 rounded flex items-center justify-center text-sm hover:bg-muted"
                      >
                        1
                      </button>
                      {pageNumbers[0] > 2 && <span className="px-1 text-muted-foreground">...</span>}
                    </>
                  )}
                  {pageNumbers.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  {pageNumbers[pageNumbers.length - 1] < pagination.totalPages && (
                    <>
                      {pageNumbers[pageNumbers.length - 1] < pagination.totalPages - 1 && (
                        <span className="px-1 text-muted-foreground">...</span>
                      )}
                      <button
                        onClick={() => setPage(pagination.totalPages)}
                        className="w-8 h-8 rounded flex items-center justify-center text-sm hover:bg-muted"
                      >
                        {pagination.totalPages}
                      </button>
                    </>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t('annuaire_next')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
