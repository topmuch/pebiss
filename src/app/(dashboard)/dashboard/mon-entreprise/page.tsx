'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBusinessSlug } from '@/hooks/use-business-slug';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  Phone,
  Mail,
  Globe,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Clock,
  Save,
  Upload,
  ImageIcon,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function MonEntreprisePage() {
  const { slug, business, isLoading: businessLoading } = useBusinessSlug();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState({
    name: '', description: '', categoryId: '', keywords: '',
    phone: '', email: '', website: '', address: '', city: '', country: 'Sénégal',
    facebook: '', instagram: '', twitter: '', linkedin: '', whatsapp: '',
  });
  const [hours, setHours] = useState<Record<number, { openTime: string; closeTime: string; isClosed: boolean }>>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Erreur');
      return res.json();
    },
  });

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || '',
        description: business.description || '',
        categoryId: business.categoryId || '',
        keywords: business.keywords || '',
        phone: business.phone || '',
        email: business.email || '',
        website: business.website || '',
        address: business.address || '',
        city: business.city || '',
        country: business.country || 'Sénégal',
        facebook: business.facebook || '',
        instagram: business.instagram || '',
        twitter: business.twitter || '',
        linkedin: business.linkedin || '',
        whatsapp: business.whatsapp || '',
      });
      setLogoPreview(business.logo || null);
      setCoverPreview(business.coverImage || null);
      if (business.hours) {
        const h: Record<number, { openTime: string; closeTime: string; isClosed: boolean }> = {};
        for (let i = 0; i < 7; i++) {
          const dayHour = business.hours.find((bh: any) => bh.dayOfWeek === i);
          h[i] = {
            openTime: dayHour?.openTime || '09:00',
            closeTime: dayHour?.closeTime || '18:00',
            isClosed: dayHour?.isClosed || i === 0,
          };
        }
        setHours(h);
      }
    }
  }, [business]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/businesses/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erreur');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-business'] });
      toast.success('Entreprise mise à jour avec succès');
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour");
    },
  });

  const hoursMutation = useMutation({
    mutationFn: async (hoursData: any) => {
      const res = await fetch('/api/business-hours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId: business!.id, hours: hoursData }),
      });
      if (!res.ok) throw new Error('Erreur');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-business'] });
      toast.success('Horaires mis à jour avec succès');
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour des horaires");
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) throw new Error('Erreur');
      return res.json();
    },
  });

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadMutation.mutateAsync(file);
      const url = result.urls?.[0] || result.url;
      setLogoPreview(url);
      updateMutation.mutate({ logo: url });
      toast.success('Logo mis à jour');
    } catch {
      toast.error('Erreur lors du téléchargement');
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadMutation.mutateAsync(file);
      const url = result.urls?.[0] || result.url;
      setCoverPreview(url);
      updateMutation.mutate({ coverImage: url });
      toast.success('Image de couverture mise à jour');
    } catch {
      toast.error('Erreur lors du téléchargement');
    }
  };

  const handleSaveInfo = () => {
    updateMutation.mutate(formData);
  };

  const handleSaveContact = () => {
    updateMutation.mutate({
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      address: formData.address,
      city: formData.city,
      country: formData.country,
    });
  };

  const handleSaveSocial = () => {
    updateMutation.mutate({
      facebook: formData.facebook,
      instagram: formData.instagram,
      twitter: formData.twitter,
      linkedin: formData.linkedin,
      whatsapp: formData.whatsapp,
    });
  };

  const handleSaveHours = () => {
    const hoursData = Object.entries(hours).map(([day, h]) => ({
      dayOfWeek: Number(day),
      openTime: h.isClosed ? null : h.openTime,
      closeTime: h.isClosed ? null : h.closeTime,
      isClosed: h.isClosed,
    }));
    hoursMutation.mutate(hoursData);
  };

  if (businessLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Aucune entreprise trouvée.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mon entreprise</h1>
        <p className="text-muted-foreground">Gérez les informations de votre entreprise</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="hours">Horaires</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="info" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations de base
              </CardTitle>
              <CardDescription>Nom, description et catégorie de votre entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l&apos;entreprise</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nom de votre entreprise"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.categories?.map((cat: any) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez votre entreprise..."
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">Mots-clés</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="mot1, mot2, mot3"
                />
                <p className="text-xs text-muted-foreground">Séparez les mots-clés par des virgules</p>
              </div>
              <Button onClick={handleSaveInfo} disabled={updateMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Informations de contact
              </CardTitle>
              <CardDescription>Comment les clients peuvent vous contacter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+221 33 XXX XX XX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@entreprise.sn"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Site web</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.entreprise.sn"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Adresse complète"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Dakar"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Sénégal"
                  />
                </div>
              </div>
              <Button onClick={handleSaveContact} disabled={updateMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Réseaux sociaux
              </CardTitle>
              <CardDescription>Liens vers vos profils de réseaux sociaux</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-sky-500" />
                    Twitter / X
                  </Label>
                  <Input
                    id="twitter"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-blue-700" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    WhatsApp
                  </Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="+221 77 XXX XX XX"
                  />
                </div>
              </div>
              <Button onClick={handleSaveSocial} disabled={updateMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Logo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors min-h-[160px]"
                onClick={() => logoInputRef.current?.click()}
              >
                {logoPreview ? (
                  <div className="relative">
                    <img src={logoPreview} alt="Logo" className="h-24 w-24 rounded-xl object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setLogoPreview(null); }}
                      className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Cliquez pour télécharger votre logo</p>
                  </div>
                )}
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Image de couverture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors min-h-[200px]"
                onClick={() => coverInputRef.current?.click()}
              >
                {coverPreview ? (
                  <div className="relative w-full">
                    <img src={coverPreview} alt="Cover" className="w-full h-40 rounded-xl object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); setCoverPreview(null); }}
                      className="absolute top-2 right-2 bg-destructive text-white rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Cliquez pour télécharger une image de couverture</p>
                    <p className="text-xs text-muted-foreground">Recommandé : 1200 x 400px</p>
                  </div>
                )}
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hours Tab */}
        <TabsContent value="hours" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horaires d&apos;ouverture
              </CardTitle>
              <CardDescription>Définissez vos heures d&apos;ouverture pour chaque jour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {DAYS.map((day, index) => {
                  const dayHours = hours[index] || { openTime: '09:00', closeTime: '18:00', isClosed: index === 0 };
                  return (
                    <div key={day} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                      <div className="w-28 font-medium text-sm">{day}</div>
                      <div className="flex items-center gap-2 flex-1">
                        <Switch
                          checked={!dayHours.isClosed}
                          onCheckedChange={(checked) =>
                            setHours({ ...hours, [index]: { ...dayHours, isClosed: !checked } })
                          }
                        />
                        <span className="text-xs text-muted-foreground w-16">
                          {dayHours.isClosed ? 'Fermé' : 'Ouvert'}
                        </span>
                      </div>
                      {!dayHours.isClosed && (
                        <div className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={dayHours.openTime}
                            onChange={(e) =>
                              setHours({ ...hours, [index]: { ...dayHours, openTime: e.target.value } })
                            }
                            className="w-32"
                          />
                          <span className="text-muted-foreground">à</span>
                          <Input
                            type="time"
                            value={dayHours.closeTime}
                            onChange={(e) =>
                              setHours({ ...hours, [index]: { ...dayHours, closeTime: e.target.value } })
                            }
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <Button onClick={handleSaveHours} disabled={hoursMutation.isPending} className="mt-6">
                <Save className="mr-2 h-4 w-4" />
                {hoursMutation.isPending ? 'Enregistrement...' : 'Enregistrer les horaires'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
