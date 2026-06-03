'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { RatingStars } from '@/components/shared/rating-stars';
import { useToast } from '@/hooks/use-toast';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MessageCircle,
  Clock,
  Star,
  Package,
  Wrench,
  ImageIcon,
  Eye,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

interface BusinessData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  coverImage?: string | null;
  address?: string | null;
  city?: string | null;
  region?: string | null;
  country: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  whatsapp?: string | null;
  keywords?: string | null;
  isActive: boolean;
  views: number;
  avgRating: number;
  createdAt: string;
  category?: { id: string; name: string; slug: string } | null;
  owner?: { id: string; name: string; avatar?: string | null } | null;
  photos: { id: string; url: string; createdAt: string }[];
  products: { id: string; name: string; description?: string | null; price?: string | null; imageUrl?: string | null }[];
  services: { id: string; name: string; description?: string | null; price?: string | null }[];
  hours: { id: string; dayOfWeek: number; openTime?: string | null; closeTime?: string | null; isClosed: boolean }[];
  reviews: {
    id: string;
    rating: number;
    comment?: string | null;
    response?: string | null;
    createdAt: string;
    user: { id: string; name: string; avatar?: string | null };
  }[];
  _count: { reviews: number; products: number; services: number };
}

interface SimilarBusiness {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  city?: string | null;
  views: number;
  avgRating?: number;
  _count?: { reviews: number };
  category?: { id: string; name: string; slug: string } | null;
}

const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const DAY_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export default function BusinessDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: session } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: business, isLoading } = useQuery<BusinessData>({
    queryKey: ['business', slug],
    queryFn: () => fetch(`/api/businesses/${slug}`).then((r) => {
      if (!r.ok) throw new Error('Entreprise non trouvée');
      return r.json();
    }),
    enabled: !!slug,
  });

  const { data: similarBusinesses } = useQuery<{ businesses: SimilarBusiness[] }>({
    queryKey: ['similar-businesses', business?.category?.slug],
    queryFn: () =>
      fetch(`/api/businesses?category=${business?.category?.slug}&limit=4`).then((r) => r.json()),
    enabled: !!business?.category?.slug,
  });

  const reviewMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/businesses/${slug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la soumission');
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Avis publié', description: 'Merci pour votre avis !' });
      setReviewComment('');
      setReviewRating(5);
      queryClient.invalidateQueries({ queryKey: ['business', slug] });
    },
    onError: (error: Error) => {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh]">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="w-80 space-y-4">
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Entreprise non trouvée</h2>
          <p className="text-muted-foreground mb-6">
            L&apos;entreprise que vous recherchez n&apos;existe pas ou a été supprimée.
          </p>
          <Link href="/annuaire">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l&apos;annuaire
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasAlreadyReviewed = session && business.reviews.some((r) => r.user.id === session.user.id);

  return (
    <div className="min-h-[60vh]">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 lg:h-72 bg-gradient-to-br from-primary to-primary/80 overflow-hidden">
        {business.coverImage && (
          <img
            src={business.coverImage}
            alt={business.name}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Accueil</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/annuaire">Annuaire</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {business.category && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={`/annuaire?category=${business.category.slug}`}>
                        {business.category.name}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">{business.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Business Header Card */}
            <Card className="border-border/40 shadow-sm mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    {business.logo ? (
                      <img
                        src={business.logo}
                        alt={business.name}
                        className="h-24 w-24 rounded-xl object-cover border-2 border-background shadow-md"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-xl bg-primary/10 flex items-center justify-center border-2 border-background shadow-md">
                        <Building2 className="h-12 w-12 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start flex-wrap gap-2 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                        {business.name}
                      </h1>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Vérifié
                      </Badge>
                    </div>

                    <div className="flex items-center flex-wrap gap-3 mb-3">
                      {business.category && (
                        <Link href={`/annuaire?category=${business.category.slug}`}>
                          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
                            {business.category.name}
                          </Badge>
                        </Link>
                      )}
                      <RatingStars
                        rating={business.avgRating}
                        reviewCount={business._count.reviews}
                        size="md"
                      />
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-3.5 w-3.5" />
                        {business.views} vues
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {business.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {business.address ? `${business.address}, ${business.city}` : business.city}
                          {business.region ? `, ${business.region}` : ''}
                        </span>
                      )}
                      {business.phone && (
                        <a href={`tel:${business.phone}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                          <Phone className="h-4 w-4" />
                          {business.phone}
                        </a>
                      )}
                      {business.email && (
                        <a href={`mailto:${business.email}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                          <Mail className="h-4 w-4" />
                          {business.email}
                        </a>
                      )}
                    </div>

                    {/* Social Links */}
                    {(business.facebook || business.instagram || business.twitter || business.linkedin || business.whatsapp) && (
                      <div className="flex items-center gap-2 mt-3">
                        {business.facebook && (
                          <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-muted transition-colors">
                            <Facebook className="h-4 w-4 text-blue-600" />
                          </a>
                        )}
                        {business.instagram && (
                          <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-muted transition-colors">
                            <Instagram className="h-4 w-4 text-pink-600" />
                          </a>
                        )}
                        {business.twitter && (
                          <a href={business.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-muted transition-colors">
                            <Twitter className="h-4 w-4 text-sky-500" />
                          </a>
                        )}
                        {business.linkedin && (
                          <a href={business.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-muted transition-colors">
                            <Linkedin className="h-4 w-4 text-blue-700" />
                          </a>
                        )}
                        {business.whatsapp && (
                          <a href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-muted transition-colors">
                            <MessageCircle className="h-4 w-4 text-green-600" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start flex-wrap mb-6 h-auto gap-1 bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="about" className="rounded-lg">
                  À propos
                </TabsTrigger>
                <TabsTrigger value="photos" className="rounded-lg">
                  <ImageIcon className="h-4 w-4 mr-1" />
                  Photos ({business.photos.length})
                </TabsTrigger>
                <TabsTrigger value="products" className="rounded-lg">
                  <Package className="h-4 w-4 mr-1" />
                  Produits & Services
                </TabsTrigger>
                <TabsTrigger value="hours" className="rounded-lg">
                  <Clock className="h-4 w-4 mr-1" />
                  Horaires
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-lg">
                  <Star className="h-4 w-4 mr-1" />
                  Avis ({business._count.reviews})
                </TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about">
                <Card className="border-border/40">
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Description</h3>
                      {business.description ? (
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {business.description}
                        </p>
                      ) : (
                        <p className="text-muted-foreground italic">
                          Aucune description disponible pour le moment.
                        </p>
                      )}
                    </div>

                    {/* Contact Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <h3 className="text-lg font-semibold md:col-span-2">Informations de contact</h3>
                      {business.phone && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <Phone className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Téléphone</p>
                            <a href={`tel:${business.phone}`} className="font-medium hover:text-primary">{business.phone}</a>
                          </div>
                        </div>
                      )}
                      {business.email && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <Mail className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <a href={`mailto:${business.email}`} className="font-medium hover:text-primary">{business.email}</a>
                          </div>
                        </div>
                      )}
                      {business.website && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <Globe className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Site web</p>
                            <a href={business.website} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary flex items-center gap-1">
                              {business.website.replace(/^https?:\/\//, '')}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      )}
                      {business.whatsapp && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <MessageCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">WhatsApp</p>
                            <a href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary">
                              {business.whatsapp}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Address & Map Placeholder */}
                    {(business.address || business.city) && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Adresse</h3>
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/30">
                          <MapPin className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">
                              {business.address && `${business.address}, `}
                              {business.city}
                              {business.region && `, ${business.region}`}
                              {business.country && ` - ${business.country}`}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 h-48 rounded-xl bg-muted/50 border border-border/30 flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Carte non disponible</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Photos Tab */}
              <TabsContent value="photos">
                <Card className="border-border/40">
                  <CardContent className="p-6">
                    {business.photos.length === 0 ? (
                      <div className="py-16 text-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Aucune photo</h3>
                        <p className="text-muted-foreground">
                          Cette entreprise n&apos;a pas encore ajouté de photos.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {business.photos.map((photo) => (
                          <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-muted/30">
                            <img
                              src={photo.url}
                              alt={`${business.name} - photo`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Products & Services Tab */}
              <TabsContent value="products">
                <div className="space-y-6">
                  {business.products.length > 0 && (
                    <Card className="border-border/40">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary" />
                          Produits ({business.products.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {business.products.map((product) => (
                            <div key={product.id} className="flex gap-3 p-3 rounded-lg bg-muted/30">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="h-16 w-16 rounded-lg object-cover flex-shrink-0" />
                              ) : (
                                <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <Package className="h-6 w-6 text-primary" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <h4 className="font-medium text-foreground">{product.name}</h4>
                                {product.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                                )}
                                {product.price && (
                                  <Badge variant="secondary" className="mt-1 text-pebiss-orange">
                                    {product.price}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {business.services.length > 0 && (
                    <Card className="border-border/40">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Wrench className="h-5 w-5 text-primary" />
                          Services ({business.services.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {business.services.map((service) => (
                            <div key={service.id} className="p-3 rounded-lg bg-muted/30">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className="font-medium text-foreground">{service.name}</h4>
                                  {service.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{service.description}</p>
                                  )}
                                </div>
                                {service.price && (
                                  <Badge variant="secondary" className="text-pebiss-orange flex-shrink-0">
                                    {service.price}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {business.products.length === 0 && business.services.length === 0 && (
                    <Card className="border-border/40">
                      <CardContent className="py-16 text-center">
                        <Package className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Aucun produit ou service</h3>
                        <p className="text-muted-foreground">
                          Cette entreprise n&apos;a pas encore ajouté de produits ou services.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Hours Tab */}
              <TabsContent value="hours">
                <Card className="border-border/40">
                  <CardContent className="p-6">
                    {business.hours.length === 0 ? (
                      <div className="py-16 text-center">
                        <Clock className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Horaires non disponibles</h3>
                        <p className="text-muted-foreground">
                          Cette entreprise n&apos;a pas encore renseigné ses horaires d&apos;ouverture.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-0">
                        <h3 className="text-lg font-semibold mb-4">Horaires d&apos;ouverture</h3>
                        <div className="rounded-xl border border-border/40 overflow-hidden">
                          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                            const hour = business.hours.find((h) => h.dayOfWeek === day);
                            const isClosed = !hour || hour.isClosed;
                            return (
                              <div
                                key={day}
                                className={`flex items-center justify-between px-4 py-3 ${
                                  day === 0 ? 'bg-primary/5' : ''
                                } ${day < 6 ? 'border-b border-border/30' : ''}`}
                              >
                                <span className={`font-medium ${day === 0 ? 'text-pebiss-orange' : 'text-foreground'}`}>
                                  {DAY_NAMES[day]}
                                </span>
                                <span className={isClosed ? 'text-muted-foreground italic' : 'text-foreground'}>
                                  {isClosed ? 'Fermé' : `${hour!.openTime} - ${hour!.closeTime}`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <div className="space-y-6">
                  {/* Review Summary */}
                  <Card className="border-border/40">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-primary">{business.avgRating.toFixed(1)}</p>
                          <RatingStars rating={business.avgRating} showValue={false} size="md" />
                          <p className="text-sm text-muted-foreground mt-1">
                            {business._count.reviews} avis
                          </p>
                        </div>
                        <div className="flex-1 space-y-2">
                          {[5, 4, 3, 2, 1].map((stars) => {
                            const count = business.reviews.filter((r) => r.rating === stars).length;
                            const percentage = business.reviews.length > 0 ? (count / business.reviews.length) * 100 : 0;
                            return (
                              <div key={stars} className="flex items-center gap-2">
                                <span className="text-sm w-8 text-muted-foreground">{stars}</span>
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-yellow-400 rounded-full transition-all"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Leave Review */}
                  {session && !hasAlreadyReviewed && (
                    <Card className="border-pebiss-orange/30">
                      <CardHeader>
                        <CardTitle className="text-lg">Laisser un avis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Votre note</p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setReviewRating(star)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={`h-7 w-7 transition-colors ${
                                    star <= reviewRating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-muted-foreground/30 hover:text-yellow-400/50'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Votre commentaire</p>
                          <Textarea
                            placeholder="Partagez votre expérience..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={4}
                          />
                        </div>
                        <Button
                          onClick={() => {
                            setIsSubmitting(true);
                            reviewMutation.mutate();
                          }}
                          disabled={isSubmitting}
                          className="bg-pebiss-orange hover:bg-pebiss-orange/90 text-white"
                        >
                          {isSubmitting ? 'Envoi en cours...' : 'Publier l\'avis'}
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {session && hasAlreadyReviewed && (
                    <Card className="border-border/40">
                      <CardContent className="p-4 text-center text-muted-foreground">
                        Vous avez déjà laissé un avis pour cette entreprise.
                      </CardContent>
                    </Card>
                  )}

                  {!session && (
                    <Card className="border-border/40">
                      <CardContent className="p-4 text-center">
                        <p className="text-muted-foreground mb-3">
                          Connectez-vous pour laisser un avis
                        </p>
                        <Link href="/login">
                          <Button size="sm">Se connecter</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}

                  {/* Reviews List */}
                  {business.reviews.length === 0 ? (
                    <Card className="border-border/40">
                      <CardContent className="py-12 text-center">
                        <Star className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                        <p className="text-muted-foreground">Aucun avis pour le moment.</p>
                        <p className="text-sm text-muted-foreground/60">
                          Soyez le premier à donner votre avis !
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {business.reviews.map((review) => (
                        <Card key={review.id} className="border-border/40">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="font-medium text-primary text-sm">
                                    {review.user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{review.user.name}</p>
                                  <div className="flex items-center gap-2">
                                    <RatingStars rating={review.rating} showValue={false} size="sm" />
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(review.createdAt).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {review.comment && (
                              <p className="text-muted-foreground leading-relaxed ml-13 mt-2">
                                {review.comment}
                              </p>
                            )}
                            {review.response && (
                              <div className="ml-4 mt-3 pl-4 border-l-2 border-primary/30 bg-primary/5 rounded-r-lg p-3">
                                <p className="text-xs font-medium text-primary mb-1">
                                  Réponse de l&apos;entreprise
                                </p>
                                <p className="text-sm text-muted-foreground">{review.response}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            {/* Quick Contact */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Contact rapide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {business.phone && (
                  <a href={`tel:${business.phone}`} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2 text-primary" />
                      Appeler {business.phone}
                    </Button>
                  </a>
                )}
                {business.email && (
                  <a href={`mailto:${business.email}`} className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2 text-primary" />
                      Envoyer un email
                    </Button>
                  </a>
                )}
                {business.whatsapp && (
                  <a href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white justify-start">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                )}
                {business.website && (
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Globe className="h-4 w-4 mr-2 text-primary" />
                      Visiter le site web
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="border-border/40">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Inscrit depuis le</span>
                  <span className="font-medium">
                    {new Date(business.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Nombre de vues</span>
                  <span className="font-medium">{business.views}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Nombre d&apos;avis</span>
                  <span className="font-medium">{business._count.reviews}</span>
                </div>
              </CardContent>
            </Card>

            {/* Similar Businesses */}
            {similarBusinesses && similarBusinesses.businesses.filter((b) => b.slug !== slug).length > 0 && (
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="text-lg">Entreprises similaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {similarBusinesses.businesses
                    .filter((b) => b.slug !== slug)
                    .slice(0, 4)
                    .map((b) => (
                      <Link key={b.id} href={`/entreprise/${b.slug}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        {b.logo ? (
                          <img src={b.logo} alt={b.name} className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{b.name}</p>
                          {b.city && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {b.city}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
