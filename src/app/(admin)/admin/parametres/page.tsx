'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings, Globe, Search, Share2, ImageIcon, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminParametresPage() {
  const queryClient = useQueryClient();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const seoImageInputRef = useRef<HTMLInputElement>(null);

  const { data: config, isLoading } = useQuery({
    queryKey: ['site-config'],
    queryFn: async () => {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Erreur');
      return res.json();
    },
  });

  const [form, setForm] = useState({
    siteName: '',
    logo: '',
    favicon: '',
    address: '',
    phone: '',
    email: '',
    seoTitle: '',
    seoDescription: '',
    seoImage: '',
    defaultLang: 'pt',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    whatsapp: '',
  });

  const [initialized, setInitialized] = useState(false);

  // Initialize form when data loads
  if (config && !initialized) {
    setForm({
      siteName: config.siteName || '',
      logo: config.logo || '',
      favicon: config.favicon || '',
      address: config.address || '',
      phone: config.phone || '',
      email: config.email || '',
      seoTitle: config.seoTitle || '',
      seoDescription: config.seoDescription || '',
      seoImage: config.seoImage || '',
      defaultLang: config.defaultLang || 'pt',
      facebook: config.facebook || '',
      instagram: config.instagram || '',
      twitter: config.twitter || '',
      linkedin: config.linkedin || '',
      whatsapp: config.whatsapp || '',
    });
    setInitialized(true);
  }

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('files', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Erreur lors du téléchargement');
      return res.json();
    },
  });

  const handleUpload = async (field: 'logo' | 'seoImage', file: File) => {
    try {
      const result = await uploadMutation.mutateAsync(file);
      updateField(field, result.url);
      toast.success('Image téléchargée avec succès');
    } catch {
      toast.error('Erreur lors du téléchargement');
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Erreur');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-config'] });
      toast.success('Configuration enregistrée avec succès');
    },
    onError: (err) => toast.error(err.message || 'Erreur lors de l\'enregistrement'),
  });

  const handleSave = () => {
    saveMutation.mutate(form);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72 mt-2" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">Configurez les paramètres généraux du site</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Globe className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Search className="h-4 w-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="h-4 w-4" />
            Réseaux sociaux
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations du site</CardTitle>
              <CardDescription>Nom, logo et coordonnées de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nom du site</Label>
                  <Input
                    value={form.siteName}
                    onChange={(e) => updateField('siteName', e.target.value)}
                    placeholder="Nom du site"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Langue par défaut</Label>
                  <Select value={form.defaultLang} onValueChange={(v) => updateField('defaultLang', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt">Portugais (PT)</SelectItem>
                      <SelectItem value="fr">Français (FR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Logo */}
              <div className="space-y-3">
                <Label>Logo du site</Label>
                {form.logo && (
                  <div className="relative inline-block">
                    <img
                      src={form.logo}
                      alt="Logo du site"
                      className="h-16 w-auto rounded-lg border object-contain bg-white p-1"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadMutation.isPending}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadMutation.isPending ? 'Téléchargement...' : 'Télécharger le logo'}
                  </Button>
                  {form.logo && (
                    <Button variant="ghost" onClick={() => updateField('logo', '')}>
                      Supprimer
                    </Button>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload('logo', file);
                    }}
                  />
                </div>
              </div>

              <Separator />

              {/* Contact Info */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Coordonnées</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Input
                      value={form.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="Adresse de l'entreprise"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+221 XX XXX XXXX"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="contact@pebiss.com"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Optimisation SEO</CardTitle>
              <CardDescription>Configurez le référencement naturel de votre site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Titre SEO</Label>
                <Input
                  value={form.seoTitle}
                  onChange={(e) => updateField('seoTitle', e.target.value)}
                  placeholder="Titre affiché dans les moteurs de recherche"
                />
                <p className="text-xs text-muted-foreground">
                  Ce titre apparaît dans les résultats de recherche. Recommandé : 50-60 caractères.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Description SEO</Label>
                <Textarea
                  value={form.seoDescription}
                  onChange={(e) => updateField('seoDescription', e.target.value)}
                  placeholder="Description affichée dans les moteurs de recherche"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Cette description apparaît sous le titre dans les résultats. Recommandé : 150-160 caractères.
                </p>
              </div>

              <Separator />

              {/* SEO Image */}
              <div className="space-y-3">
                <Label>Image SEO (Open Graph)</Label>
                {form.seoImage && (
                  <div className="relative inline-block">
                    <img
                      src={form.seoImage}
                      alt="Image SEO"
                      className="h-24 w-40 rounded-lg border object-cover"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => seoImageInputRef.current?.click()}
                    disabled={uploadMutation.isPending}
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    {uploadMutation.isPending ? 'Téléchargement...' : 'Télécharger l\'image'}
                  </Button>
                  {form.seoImage && (
                    <Button variant="ghost" onClick={() => updateField('seoImage', '')}>
                      Supprimer
                    </Button>
                  )}
                  <input
                    ref={seoImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload('seoImage', file);
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Image affichée lors du partage sur les réseaux sociaux. Recommandé : 1200x630px.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Réseaux sociaux</CardTitle>
              <CardDescription>Liens vers les profils de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Facebook</Label>
                <Input
                  value={form.facebook}
                  onChange={(e) => updateField('facebook', e.target.value)}
                  placeholder="https://facebook.com/pebiss"
                />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input
                  value={form.instagram}
                  onChange={(e) => updateField('instagram', e.target.value)}
                  placeholder="https://instagram.com/pebiss"
                />
              </div>
              <div className="space-y-2">
                <Label>Twitter / X</Label>
                <Input
                  value={form.twitter}
                  onChange={(e) => updateField('twitter', e.target.value)}
                  placeholder="https://twitter.com/pebiss"
                />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input
                  value={form.linkedin}
                  onChange={(e) => updateField('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/pebiss"
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp</Label>
                <Input
                  value={form.whatsapp}
                  onChange={(e) => updateField('whatsapp', e.target.value)}
                  placeholder="+221 XX XXX XXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end sticky bottom-6">
        <Button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="bg-pebiss-orange hover:bg-pebiss-orange/90 text-white"
          size="lg"
        >
          <Settings className="mr-2 h-4 w-4" />
          {saveMutation.isPending ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </div>
    </div>
  );
}
