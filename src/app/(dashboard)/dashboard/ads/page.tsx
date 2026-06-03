'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBusinessSlug } from '@/hooks/use-business-slug';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Megaphone, Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

const AD_TYPES = [
  { value: 'SERVICE', label: 'Service', color: 'bg-blue-100 text-blue-800' },
  { value: 'PROMOTION', label: 'Promotion', color: 'bg-orange-100 text-orange-800' },
  { value: 'PRODUCT', label: 'Produit', color: 'bg-green-100 text-green-800' },
  { value: 'EVENT', label: 'Événement', color: 'bg-purple-100 text-purple-800' },
];

export default function AdsPage() {
  const { slug, business, isLoading } = useBusinessSlug();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', type: 'SERVICE', categoryId: '', image: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Erreur');
      return res.json();
    },
  });

  const { data: adsData, isLoading: adsLoading } = useQuery({
    queryKey: ['business-ads', business?.id],
    queryFn: async () => {
      const res = await fetch(`/api/ads?businessId=${business!.id}&limit=50`);
      if (!res.ok) throw new Error('Erreur');
      return res.json();
    },
    enabled: !!business?.id,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Erreur');
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erreur');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-ads', business?.id] });
      toast.success('Annonce créée avec succès');
      closeDialog();
    },
    onError: () => toast.error('Erreur lors de la création'),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const res = await fetch(`/api/ads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erreur');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-ads', business?.id] });
      toast.success('Annonce mise à jour');
      closeDialog();
    },
    onError: () => toast.error('Erreur lors de la mise à jour'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/ads/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-ads', business?.id] });
      toast.success('Annonce supprimée');
      setDeleteId(null);
    },
    onError: () => toast.error('Erreur lors de la suppression'),
  });

  const openDialog = (ad?: any) => {
    setEditingAd(ad || null);
    setForm({
      title: ad?.title || '',
      description: ad?.description || '',
      type: ad?.type || 'SERVICE',
      categoryId: ad?.categoryId || '',
      image: ad?.image || '',
    });
    setImagePreview(ad?.image || null);
    setImageFile(null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingAd(null);
    setForm({ title: '', description: '', type: 'SERVICE', categoryId: '', image: '' });
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSubmit = async () => {
    let imageUrl = form.image;
    if (imageFile) {
      try {
        const result = await uploadMutation.mutateAsync(imageFile);
        imageUrl = result.urls?.[0] || result.url;
      } catch {
        toast.error('Erreur lors du téléchargement');
        return;
      }
    }

    const data = {
      ...form,
      image: imageUrl,
      businessId: business!.id,
    };

    if (editingAd?.id) {
      updateMutation.mutate({ id: editingAd.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const ads = adsData?.ads || [];
  const getTypeColor = (type: string) => AD_TYPES.find(t => t.value === type)?.color || 'bg-gray-100 text-gray-800';

  if (isLoading || adsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Annonces</h1>
          <p className="text-muted-foreground">Gérez vos annonces publicitaires</p>
        </div>
        <Button onClick={() => openDialog()} className="bg-pebiss-orange hover:bg-pebiss-orange/90 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Créer une annonce
        </Button>
      </div>

      {ads.length === 0 ? (
        <div className="text-center py-16">
          <Megaphone className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Aucune annonce</h3>
          <p className="text-muted-foreground mt-1">Créez votre première annonce pour promouvoir votre entreprise</p>
          <Button onClick={() => openDialog()} className="mt-4 bg-pebiss-orange hover:bg-pebiss-orange/90 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Créer une annonce
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {ads.map((ad: any) => (
            <Card key={ad.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-48 h-32 sm:h-auto bg-muted relative shrink-0">
                    {ad.image ? (
                      <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Megaphone className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium">{ad.title}</h3>
                          <Badge className={`text-[10px] ${getTypeColor(ad.type)}`}>{ad.type}</Badge>
                        </div>
                        {ad.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ad.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(ad.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDialog(ad)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <AlertDialog open={deleteId === ad.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(ad.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer cette annonce ?</AlertDialogTitle>
                              <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteMutation.mutate(ad.id)}>Supprimer</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAd?.id ? 'Modifier l\'annonce' : 'Créer une annonce'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Titre</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Titre de l'annonce"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description de l'annonce..."
                rows={3}
              />
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(val) => setForm({ ...form, type: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AD_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select value={form.categoryId} onValueChange={(val) => setForm({ ...form, categoryId: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.categories?.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Image</Label>
              <div
                className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50"
                onClick={() => document.getElementById('ad-image-input')?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-24 max-w-full rounded-lg object-cover" />
                ) : (
                  <div className="text-center">
                    <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">Cliquer pour ajouter une image</p>
                  </div>
                )}
              </div>
              <input
                id="ad-image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={closeDialog}>Annuler</Button>
              <Button
                onClick={handleSubmit}
                disabled={!form.title.trim() || createMutation.isPending || updateMutation.isPending}
                className="bg-pebiss-orange hover:bg-pebiss-orange/90 text-white"
              >
                {(createMutation.isPending || updateMutation.isPending) ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
