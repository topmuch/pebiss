'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BusinessCard } from '@/components/shared/business-card';
import { BusinessCardSkeleton } from '@/components/shared/business-card-skeleton';
import {
  Search,
  MapPin,
  Building2,
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
  ChevronRight,
  UserPlus,
  Compass,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

const categoryGradients = [
  'bg-gradient-to-br from-emerald-500 to-emerald-700',
  'bg-gradient-to-br from-orange-500 to-orange-700',
  'bg-gradient-to-br from-violet-500 to-violet-700',
  'bg-gradient-to-br from-cyan-500 to-cyan-700',
  'bg-gradient-to-br from-rose-500 to-rose-700',
  'bg-gradient-to-br from-amber-500 to-amber-700',
  'bg-gradient-to-br from-indigo-500 to-indigo-700',
  'bg-gradient-to-br from-teal-500 to-teal-700',
  'bg-gradient-to-br from-pink-500 to-pink-700',
  'bg-gradient-to-br from-sky-500 to-sky-700',
  'bg-gradient-to-br from-fuchsia-500 to-fuchsia-700',
  'bg-gradient-to-br from-lime-600 to-lime-800',
  'bg-gradient-to-br from-red-500 to-red-700',
  'bg-gradient-to-br from-blue-500 to-blue-700',
];

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
  coverImage?: string | null;
  city?: string | null;
  views: number;
  avgRating?: number;
  _count?: { reviews: number; products: number; services: number };
  category?: { id: string; name: string; slug: string } | null;
}

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

  const businesses = businessesData?.businesses || [];

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
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pebiss-blue-light/10 rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Hero Content */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white mb-6 leading-tight">
                Trouvez les meilleures{' '}
                <span className="text-pebiss-blue-light">entreprises</span> du{' '}
                <span className="text-pebiss-blue-light">Sénégal</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl">
                Référencez votre entreprise et connectez-vous avec des milliers de
                clients potentiels. Le premier annuaire professionnel du Sénégal.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleHeroSearch} className="max-w-xl">
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
                    className="bg-pebiss-blue-light hover:bg-pebiss-blue-light/90 text-white rounded-xl px-8"
                  >
                    <Search className="h-5 w-5" />
                    <span className="hidden sm:inline">Rechercher</span>
                  </Button>
                </div>
              </form>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start gap-4 mt-8">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-pebiss-blue-light hover:bg-pebiss-blue-light/90 text-white rounded-xl px-8"
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

            {/* Hero Image */}
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-2xl" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <Image
                    src="/hero.png"
                    alt="Réseau d'entreprises sénégalaises - Annuaire Pebiss"
                    width={560}
                    height={320}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
                {/* Floating stat card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-pebiss-blue-light/20 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-pebiss-blue-light" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{animStats.businesses}+</p>
                    <p className="text-xs text-muted-foreground">Entreprises</p>
                  </div>
                </div>
                {/* Floating rating card */}
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-primary fill-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{animStats.reviews}+</p>
                    <p className="text-xs text-muted-foreground">Avis clients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Right Below Hero */}
      <section className="relative -mt-12 md:-mt-16 z-20 pb-12 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Catégories populaires
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Parcourez nos catégories les plus recherchées
              </p>
            </div>
            <Link href="/annuaire" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="text-primary">
                Voir tout
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {!categories ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 md:gap-4">
              {Array.from({ length: 14 }, (_, i) => (
                <div key={i} className="aspect-square rounded-2xl">
                  <Skeleton className="h-full w-full rounded-2xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 md:gap-4">
              {categories.slice(0, 14).map((cat, index) => {
                const Icon = getCategoryIcon(cat.slug);
                const gradient = categoryGradients[index % categoryGradients.length];
                return (
                  <Link key={cat.id} href={`/annuaire?category=${cat.slug}`}>
                    <div
                      className={`group ${gradient} rounded-2xl aspect-square flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-lg`}
                    >
                      <div className="h-12 w-12 rounded-xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-colors">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm text-white leading-tight text-center px-2">
                        {cat.name}
                      </h3>
                      <span className="text-xs text-white/70">
                        {cat._count.businesses} entreprise{cat._count.businesses > 1 ? 's' : ''}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-6 text-center sm:hidden">
            <Link href="/annuaire">
              <Button variant="outline" size="sm" className="text-primary">
                Voir toutes les catégories
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-y border-border/30">
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
                <Star className="h-6 w-6 text-pebiss-blue-light mr-2" />
                <span className="text-2xl md:text-3xl font-bold text-primary">
                  {animStats.reviews}+
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Avis clients</p>
            </div>
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
                  <Button className="bg-pebiss-blue-light hover:bg-pebiss-blue-light/90 text-white">
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

      {/* CTA Section */}
      <section className="py-16 md:py-24 pebiss-gradient relative overflow-hidden">
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
                className="bg-white text-primary hover:bg-white/90 font-semibold rounded-xl px-8 h-12"
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
