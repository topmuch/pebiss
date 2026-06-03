'use client';

import { useState, useEffect, useRef } from 'react';
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
  Utensils,
  Wrench,
  Plane,
  Landmark,
  Sprout,
  ShoppingBag,
  Palette,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  UserPlus,
  Heart,
  Eye,
  Calendar,
  Megaphone,
  Stethoscope,
  GraduationCap,
  Home,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const categoryIcons: Record<string, React.ElementType> = {
  'mode-textile': Palette,
  'restaurants-alimentation': Utensils,
  'tourisme-hotellerie': Plane,
  'services-financiers': Landmark,
  'agriculture-agroalimentaire': Sprout,
  'commerce-distribution': ShoppingBag,
  'btp-construction': Wrench,
  'sante-bien-etre': Stethoscope,
  'education-formation': GraduationCap,
  'immobilier': Home,
};

const categoryImages: Record<string, string> = {
  'mode-textile': '/categories/mode-textile.png',
  'restaurants-alimentation': '/categories/restaurants-alimentation.png',
  'tourisme-hotellerie': '/categories/tourisme-hotellerie.png',
  'services-financiers': '/categories/services-financiers.png',
  'agriculture-agroalimentaire': '/categories/agriculture-agroalimentaire.png',
  'commerce-distribution': '/categories/commerce-distribution.png',
  'btp-construction': '/categories/btp-construction.png',
};

const allowedCategories = [
  'mode-textile',
  'restaurants-alimentation',
  'tourisme-hotellerie',
  'services-financiers',
  'agriculture-agroalimentaire',
  'commerce-distribution',
  'btp-construction',
  'sante-bien-etre',
  'education-formation',
  'immobilier',
];

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
  const [searchCategory, setSearchCategory] = useState('');
  const catScrollRef = useRef<HTMLDivElement>(null);

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
    if (searchCategory) params.set('category', searchCategory);
    router.push(`/annuaire?${params.toString()}`);
  }

  const [animStats, setAnimStats] = useState({ businesses: 0, categories: 0, cities: 0, reviews: 0 });
  const statsTarget = {
    businesses: Math.max(totalBusinesses, 150),
    categories: Math.max(totalCategories, 7),
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

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const amount = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#F6F6F6]">
      {/* ============ HERO SECTION — Full-Width Banner 1842x652 ============ */}
      <section className="relative w-full" style={{ aspectRatio: '1842 / 652' }}>
        {/* Background Image */}
        <Image
          src="/hero-banner.png"
          alt="Pebiss - Annuaire d'entreprises au Sénégal"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            {/* Badge */}
            <p className="text-sm md:text-base font-semibold text-white/90 mb-3">
              Plus de {animStats.businesses} annonces d&apos;entreprises
            </p>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
              Trouvez, Explorez,{' '}
              <span className="text-primary">Découvrez</span>
            </h1>

            {/* Description */}
            <p className="text-sm md:text-base text-white/80 mb-8 leading-relaxed max-w-2xl mx-auto">
              Découvrez des lieux incroyables près de chez vous en quelques clics. Parcourez les meilleures annonces et connectez-vous avec des entreprises locales de confiance chaque jour.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleHeroSearch} className="bg-white p-3 md:p-4 shadow-lg max-w-4xl mx-auto mb-6">
              <div className="flex flex-col sm:flex-row gap-2 items-stretch">
                <div className="flex-1">
                  <label className="block text-[11px] text-muted-foreground mb-1 font-medium">Ce que vous cherchez</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ex : Restaurant, Boutique, Hôtel..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-3 pr-9 py-2.5 text-sm bg-[#F6F6F6] border border-border/60 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                    <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] text-muted-foreground mb-1 font-medium">Catégorie</label>
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-[#F6F6F6] border border-border/60 text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 appearance-none pr-8"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="mode-textile">Mode & Textile</option>
                    <option value="restaurants-alimentation">Restaurants & Alimentation</option>
                    <option value="tourisme-hotellerie">Tourisme & Hôtellerie</option>
                    <option value="services-financiers">Services Financiers</option>
                    <option value="agriculture-agroalimentaire">Agriculture & Agroalimentaire</option>
                    <option value="commerce-distribution">Commerce & Distribution</option>
                    <option value="btp-construction">BTP & Construction</option>
                      <option value="sante-bien-etre">Santé & Bien-être</option>
                      <option value="education-formation">Éducation & Formation</option>
                      <option value="immobilier">Immobilier</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-[11px] text-muted-foreground mb-1 font-medium">Emplacement</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Sélectionner un emplacement"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="w-full pl-3 pr-9 py-2.5 text-sm bg-[#F6F6F6] border border-border/60 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                    <MapPin className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 text-sm font-medium w-full sm:w-auto"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </div>
            </form>

            {/* Popular Categories */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
              <span className="text-white/60 font-medium text-xs uppercase tracking-wide">Populaire :</span>
              <Link href="/annuaire?category=mode-textile" className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors">
                <Palette className="h-3.5 w-3.5" /> Mode & Textile
              </Link>
              <Link href="/annuaire?category=restaurants-alimentation" className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors">
                <Utensils className="h-3.5 w-3.5" /> Restaurants
              </Link>
              <Link href="/annuaire?category=tourisme-hotellerie" className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors">
                <Plane className="h-3.5 w-3.5" /> Tourisme
              </Link>
              <Link href="/annuaire?category=btp-construction" className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors">
                <Wrench className="h-3.5 w-3.5" /> BTP
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES SECTION — Auto-Slide Multicolor Gradient Squares ============ */}
      <section className="pb-12 md:pb-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              Parcourir par catégories
            </h2>
            <div className="hidden sm:flex gap-2">
              <button onClick={() => scrollContainer(catScrollRef, 'left')} className="p-2 bg-white border border-border hover:bg-muted transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => scrollContainer(catScrollRef, 'right')} className="p-2 bg-white border border-border hover:bg-muted transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Infinite sliding track */}
        {!categories ? (
          <div className="flex gap-4 overflow-hidden px-4">
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} className="shrink-0 w-[130px] md:w-[150px]">
                <Skeleton className="w-[130px] h-[130px] md:w-[150px] md:h-[150px] rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="group relative">
            <div className="flex gap-4 animate-slide-categories">
              {[...categories.filter((cat) => allowedCategories.includes(cat.slug)), ...categories.filter((cat) => allowedCategories.includes(cat.slug)), ...categories.filter((cat) => allowedCategories.includes(cat.slug))]
                .map((cat, idx) => {
                  const Icon = getCategoryIcon(cat.slug);
                  const gradients: Record<string, string> = {
                    'mode-textile': 'from-pink-500 to-rose-600',
                    'restaurants-alimentation': 'from-orange-400 to-red-500',
                    'tourisme-hotellerie': 'from-cyan-400 to-blue-500',
                    'services-financiers': 'from-emerald-400 to-green-600',
                    'agriculture-agroalimentaire': 'from-lime-400 to-green-500',
                    'commerce-distribution': 'from-violet-500 to-purple-700',
                    'btp-construction': 'from-amber-400 to-orange-600',
                    'sante-bien-etre': 'from-teal-400 to-emerald-600',
                    'education-formation': 'from-sky-400 to-indigo-500',
                    'immobilier': 'from-fuchsia-400 to-pink-600',
                  };
                  const gradient = gradients[cat.slug] || 'from-gray-400 to-gray-600';
                  return (
                    <Link key={`${cat.id}-${idx}`} href={`/annuaire?category=${cat.slug}`} className="shrink-0 group/card">
                      <div className={`w-[130px] md:w-[150px] h-[130px] md:h-[150px] rounded-2xl bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-2 transition-all duration-300 group-hover/card:scale-105 group-hover/card:shadow-xl`}>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                        </div>
                        <h3 className="text-white text-xs md:text-sm font-semibold text-center leading-tight px-2">
                          {cat.name}
                        </h3>
                        <span className="text-white/70 text-[10px]">
                          {cat._count.businesses} annonce{cat._count.businesses > 1 ? 's' : ''}
                        </span>
                      </div>
                    </Link>
                  );
                })}
            </div>
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#F6F6F6] to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F6F6F6] to-transparent pointer-events-none z-10" />
          </div>
        )}
      </section>

      {/* ============ CURRENT LISTINGS ============ */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                Annonces récentes
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Parcourez les annonces des villes populaires et proches. Trouvez ce dont vous avez besoin.
              </p>
            </div>
            <Link href="/annuaire" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-pebiss-blue transition-colors">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {!businessesData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }, (_, i) => (
                <BusinessCardSkeleton key={i} />
              ))}
            </div>
          ) : businesses.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-12 text-center">
                <Building2 className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Aucune annonce disponible
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Soyez le premier à inscrire votre entreprise sur Pebiss !
                </p>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-white text-sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Inscrire mon entreprise
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {businesses.slice(0, 8).map((business) => (
                <BusinessCard key={business.id} business={business} variant="grid" />
              ))}
            </div>
          )}

          <div className="mt-6 text-center sm:hidden">
            <Link href="/annuaire">
              <Button variant="outline" className="text-sm text-primary">
                Voir toutes les annonces <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ ADVERTISING BANNER ============ */}
      <section className="container mx-auto px-4 pb-12 md:pb-16">
        <Link href="/register" className="block">
          <div className="relative overflow-hidden group cursor-pointer">
            <Image
              src="/banner-ad.png"
              alt="Publicité - Inscrivez votre entreprise sur Pebiss"
              width={1344}
              height={768}
              className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center px-8 md:px-16">
              <div className="max-w-lg">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold uppercase tracking-wider mb-3">
                  Publicité
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
                  Boostez votre visibilité au Sénégal
                </h3>
                <p className="text-sm text-white/80 mb-5 leading-relaxed">
                  Inscrivez votre entreprise gratuitement et touchez des milliers de clients chaque jour.
                </p>
                <span className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-5 py-2.5 text-sm hover:bg-primary hover:text-white transition-colors duration-300">
                  Inscrire maintenant <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* ============ ABOUT / EXPERIENCE SECTION ============ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Image with badge */}
            <div className="relative">
              <div className="overflow-hidden">
                <Image
                  src="/hero.png"
                  alt="Entreprises sénégalaises"
                  width={640}
                  height={400}
                  className="w-full h-[300px] md:h-[400px] object-cover"
                />
              </div>
              <div className="absolute bottom-4 left-4 bg-primary text-white px-4 py-3">
                <span className="block text-2xl font-bold">25+</span>
                <span className="block text-xs text-white/70">Années d&apos;expérience</span>
              </div>
            </div>

            {/* Right: Content */}
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-tight">
                Pourquoi nous sommes axés sur la qualité, inspirés par vous.
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Explorez une plateforme de confiance qui vous connecte avec les meilleures villes et entreprises du Sénégal. Des annonces fiables, faciles à utiliser, pour tous vos besoins.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { title: 'Annonces complètes', desc: 'Informations détaillées sur chaque entreprise' },
                  { title: 'Infos fiables', desc: 'Données vérifiées et à jour' },
                  { title: 'Interface intuitive', desc: 'Navigation simple et efficace' },
                  { title: 'Villes diversifiées', desc: 'Couverture de tout le Sénégal' },
                  { title: 'Approuvé localement', desc: 'La confiance des entrepreneurs sénégalais' },
                  { title: 'Expérience fluide', desc: 'Résultats rapides et précis' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 shrink-0 bg-pebiss-blue/10 flex items-center justify-center">
                      <svg className="h-3 w-3 text-pebiss-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/register">
                <Button className="bg-primary hover:bg-primary/90 text-white text-sm px-6 py-2.5">
                  En savoir plus <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className="bg-primary py-10 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {animStats.businesses}+
              </div>
              <p className="text-sm text-white/60">Entreprises référencées</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {animStats.categories}+
              </div>
              <p className="text-sm text-white/60">Catégories</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {animStats.cities}+
              </div>
              <p className="text-sm text-white/60">Villes couvertes</p>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                {animStats.reviews}+
              </div>
              <p className="text-sm text-white/60">Avis clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero.png"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Inscrivez votre entreprise
          </h2>
          <p className="text-base text-white/70 mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines d&apos;entreprises sénégalaises sur Pebiss.
            Attirez de nouveaux clients et développez votre activité.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 h-12 text-sm">
                <UserPlus className="h-5 w-5 mr-2" />
                Créer mon compte gratuitement
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-white/60">
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
