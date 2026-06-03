'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BusinessCard } from '@/components/shared/business-card';
import { BusinessCardSkeleton } from '@/components/shared/business-card-skeleton';
import { RatingStars } from '@/components/shared/rating-stars';
import {
  Search,
  MapPin,
  Building2,
  Users,
  Star,
  Briefcase,
  Utensils,
  Laptop,
  Home,
  Truck,
  Heart,
  GraduationCap,
  ShoppingBag,
  Wrench,
  Palette,
  Camera,
  Plane,
  Scale,
  Lightbulb,
  ArrowRight,
  Megaphone,
  ChevronRight,
  UserPlus,
  Compass,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const categoryIcons: Record<string, React.ElementType> = {
  'restaurants-alimentation': Utensils,
  'technologie-informatique': Laptop,
  'immobilier': Home,
  'transport-logistique': Truck,
  'sante-bien-etre': Heart,
  'education-formation': GraduationCap,
  'commerce-shopping': ShoppingBag,
  'services-professionnels': Briefcase,
  'artisanat-industrie': Wrench,
  'art-culture': Palette,
  'photographie-video': Camera,
  'tourisme-voyage': Plane,
  'juridique-conseil': Scale,
  'startup-innovation': Lightbulb,
};

const defaultIcon = Building2;

function getCategoryIcon(slug: string | undefined): React.ElementType {
  if (!slug) return defaultIcon;
  return categoryIcons[slug] || defaultIcon;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  _count: { businesses: number };
}

interface Business {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  city?: string | null;
  views: number;
  avgRating?: number;
  _count?: { reviews: number; products: number; services: number };
  category?: { id: string; name: string; slug: string } | null;
}

interface Ad {
  id: string;
  title: string;
  description?: string | null;
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

const adTypeLabels: Record<string, string> = {
  SERVICE: 'Service',
  PROMOTION: 'Promotion',
  PRODUCT: 'Produit',
  EVENT: 'Événement',
};

const adTypeColors: Record<string, string> = {
  SERVICE: 'bg-primary/10 text-primary',
  PROMOTION: 'bg-pebiss-orange/10 text-pebiss-orange',
  PRODUCT: 'bg-green-100 text-green-700',
  EVENT: 'bg-purple-100 text-purple-700',
};

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories-home'],
    queryFn: () => fetch('/api/categories').then((r) => r.json()),
  });

  const { data: businessesData } = useQuery<{ businesses: Business[] }>({
    queryKey: ['businesses-featured'],
    queryFn: () => fetch('/api/businesses?limit=6&sortBy=createdAt&sortOrder=desc').then((r) => r.json()),
  });

  const { data: adsData } = useQuery<{ ads: Ad[] }>({
    queryKey: ['ads-latest'],
    queryFn: () => fetch('/api/ads?limit=6').then((r) => r.json()),
  });

  const businesses = businessesData?.businesses || [];
  const ads = adsData?.ads || [];

  const totalBusinesses = businesses.length > 0 ? Math.max(...categories?.map((c) => c._count.businesses) || [0]) * 5 + businesses.length : 0;
  const totalCategories = categories?.length || 0;
  const totalReviews = businesses.reduce((sum, b) => sum + (b._count?.reviews || 0), 0);

  function handleHeroSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (searchCity) params.set('city', searchCity);
    router.push(`/annuaire?${params.toString()}`);
  }

  const [animStats, setAnimStats] = useState({ businesses: 0, categories: 0, cities: 0, reviews: 0 });
  const statsTarget = {
    businesses: Math.max(totalBusinesses, 150),
    categories: Math.max(totalCategories, 14),
    cities: 12,
    reviews: Math.max(totalReviews + 120, 340),
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setAnimStats({
        businesses: Math.round(statsTarget.businesses * ease),
        categories: Math.round(statsTarget.categories * ease),
        cities: Math.round(statsTarget.cities * ease),
        reviews: Math.round(statsTarget.reviews * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative pebiss-gradient overflow-hidden">
        <div className="hero-pattern absolute inset-0" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pebiss-orange/10 rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Trouvez les meilleures{' '}
              <span className="text-pebiss-orange">entreprises</span> du{' '}
              <span className="text-pebiss-orange">Sénégal</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Référencez votre entreprise et connectez-vous avec des milliers de
              clients potentiels. Le premier annuaire professionnel du Sénégal.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleHeroSearch} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="Que recherchez-vous ?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                  <input
                    type="text"
                    placeholder="Ville..."
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-pebiss-orange hover:bg-pebiss-orange/90 text-white rounded-xl px-8"
                >
                  <Search className="h-5 w-5" />
                  <span className="hidden sm:inline">Rechercher</span>
                </Button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-pebiss-orange hover:bg-pebiss-orange/90 text-white rounded-xl px-8"
                >
                  <UserPlus className="h-5 w-5" />
                  S&apos;inscrire gratuitement
                </Button>
              </Link>
              <Link href="/annuaire">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 rounded-xl px-8"
                >
                  <Compass className="h-5 w-5" />
                  Explorer l&apos;annuaire
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-border/40 -mt-px relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Building2 className="h-6 w-6 text-primary mr-2" />
                <span className="text-2xl md:text-3xl font-bold text-primary">
                  {animStats.businesses}+
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Entreprises référencées</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-primary mr-2" />
                <span className="text-2xl md:text-3xl font-bold text-primary">
                  {animStats.categories}+
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Catégories</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-primary mr-2" />
                <span className="text-2xl md:text-3xl font-bold text-primary">
                  {animStats.cities}+
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Villes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-pebiss-orange mr-2" />
                <span className="text-2xl md:text-3xl font-bold text-primary">
                  {animStats.reviews}+
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Avis clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Catégories populaires
              </h2>
              <p className="text-muted-foreground mt-1">
                Parcourez nos catégories les plus recherchées
              </p>
            </div>
            <Link href="/annuaire" className="hidden sm:block">
              <Button variant="ghost" className="text-primary">
                Voir tout
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {!categories ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }, (_, i) => (
                <Card key={i} className="border-border/40">
                  <CardContent className="p-6 flex flex-col items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.slice(0, 10).map((cat) => {
                const Icon = getCategoryIcon(cat.slug);
                return (
                  <Link key={cat.id} href={`/annuaire?category=${cat.slug}`}>
                    <Card className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer border-border/40 h-full">
                      <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-7 w-7 text-primary" />
                        </div>
                        <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {cat.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {cat._count.businesses} entreprise{cat._count.businesses > 1 ? 's' : ''}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/annuaire">
              <Button variant="outline" className="text-primary">
                Voir toutes les catégories
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Entreprises récentes
              </h2>
              <p className="text-muted-foreground mt-1">
                Découvrez les dernières entreprises inscrites
              </p>
            </div>
            <Link href="/annuaire" className="hidden sm:block">
              <Button variant="ghost" className="text-primary">
                Voir tout
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {!businessesData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, i) => (
                <BusinessCardSkeleton key={i} />
              ))}
            </div>
          ) : businesses.length === 0 ? (
            <Card className="border-border/40">
              <CardContent className="p-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Aucune entreprise disponible
                </h3>
                <p className="text-muted-foreground mb-6">
                  Soyez le premier à inscrire votre entreprise sur Pebiss !
                </p>
                <Link href="/register">
                  <Button className="bg-pebiss-orange hover:bg-pebiss-orange/90 text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Inscrire mon entreprise
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} variant="grid" />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/annuaire">
              <Button variant="outline" className="text-primary">
                Voir toutes les entreprises
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Ads */}
      {ads.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Annonces récentes
                </h2>
                <p className="text-muted-foreground mt-1">
                  Découvrez les dernières offres et promotions
                </p>
              </div>
              <Link href="/annonces" className="hidden sm:block">
                <Button variant="ghost" className="text-primary">
                  Voir tout
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <Link key={ad.id} href={`/entreprise/${ad.business.slug}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 border-border/40 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge
                          className={`text-xs ${adTypeColors[ad.type] || 'bg-muted text-muted-foreground'}`}
                          variant="secondary"
                        >
                          <Megaphone className="h-3 w-3 mr-1" />
                          {adTypeLabels[ad.type] || ad.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(ad.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-1">
                        {ad.title}
                      </h3>
                      {ad.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {ad.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-3 border-t border-border/40">
                        {ad.business.logo ? (
                          <img
                            src={ad.business.logo}
                            alt={ad.business.name}
                            className="h-6 w-6 rounded object-cover"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-3.5 w-3.5 text-primary" />
                          </div>
                        )}
                        <span className="text-sm font-medium">{ad.business.name}</span>
                        {ad.business.city && (
                          <>
                            <span className="text-muted-foreground/40">·</span>
                            <span className="text-xs">{ad.business.city}</span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link href="/annonces">
                <Button variant="outline" className="text-primary">
                  Voir toutes les annonces
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 pebiss-gradient-orange relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Inscrivez votre entreprise
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines d&apos;entreprises sénégalaises sur Pebiss.
            Attirez de nouveaux clients et développez votre activité.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-pebiss-orange hover:bg-white/90 font-semibold rounded-xl px-8 h-12"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Créer mon compte gratuitement
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <CheckIcon /> Inscription gratuite
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon /> Visible immédiatement
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon /> Aucune carte requise
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
