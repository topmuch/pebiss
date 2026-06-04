'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Trash2, Megaphone, Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';

const AD_TYPES: Record<string, string> = {
  SERVICE: 'bg-blue-100 text-blue-800',
  PROMOTION: 'bg-orange-100 text-orange-800',
  PRODUCT: 'bg-green-100 text-green-800',
  EVENT: 'bg-purple-100 text-purple-800',
};

export default function AdminAnnoncesPage() {
  const { t, locale } = useTranslation();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'SERVICE',
    categoryId: '',
    image: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-ads', search, typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (typeFilter !== 'all') params.set('type', typeFilter);
      params.set('limit', '100');
      const res = await fetch(`/api/ads?${params}`);
      if (!res.ok) throw new Error('Erreur');
      return res.json();
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Erreur');
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/ads/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ads'] });
      toast.success(t('admin_ads_deleted_msg'));
      setDeleteId(null);
    },
    onError: () => toast.error(t('admin_ads_error_delete')),
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('files', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error(t('admin_settings_upload_error'));
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch('/api/ads', {
        method: 'POST',
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
      queryClient.invalidateQueries({ queryKey: ['admin-ads'] });
      toast.success(t('admin_ads_created_msg'));
      closeDialog();
    },
    onError: (err) => toast.error(err.message || t('admin_ads_error_create')),
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setForm({
      title: '',
      description: '',
      type: 'SERVICE',
      categoryId: '',
      image: '',
    });
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpload = async (file: File) => {
    try {
      const result = await uploadMutation.mutateAsync(file);
      updateField('image', result.url);
      toast.success(t('admin_settings_image_uploaded'));
    } catch {
      toast.error(t('admin_settings_upload_error'));
    }
  };

  const ads = data?.ads || [];
  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.categories || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('admin_ads_title')}</h1>
          <p className="text-muted-foreground">{t('admin_ads_subtitle')}</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-pebiss-orange hover:bg-pebiss-orange/90 text-white">
          <Plus className="mr-2 h-4 w-4" />
          {t('dash_ads_create')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('admin_ads_search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t('dash_ads_field_type')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin_ads_all_types')}</SelectItem>
                <SelectItem value="SERVICE">Service</SelectItem>
                <SelectItem value="PROMOTION">Promotion</SelectItem>
                <SelectItem value="PRODUCT">Produit</SelectItem>
                <SelectItem value="EVENT">Événement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('dash_ads_field_title')}</TableHead>
                  <TableHead>{t('dash_ads_field_type')}</TableHead>
                  <TableHead>{t('dash_ads_field_category')}</TableHead>
                  <TableHead>{t('admin_dash_col_date')}</TableHead>
                  <TableHead className="text-right">{t('admin_ent_col_actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}><Skeleton className="h-12 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : ads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {t('admin_ads_no_results')}
                    </TableCell>
                  </TableRow>
                ) : (
                  ads.map((ad: any) => (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {ad.image ? (
                            <img src={ad.image} alt="" className="h-8 w-8 rounded-lg object-cover" />
                          ) : (
                            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                              <Megaphone className="h-3 w-3 text-muted-foreground" />
                            </div>
                          )}
                          <span className="font-medium text-sm truncate max-w-[150px]">{ad.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] ${AD_TYPES[ad.type] || 'bg-gray-100 text-gray-800'}`}>
                          {ad.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{ad.category?.name || '-'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(ad.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'pt-PT')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end">
                          <AlertDialog open={deleteId === ad.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => setDeleteId(ad.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('admin_ads_delete_confirm')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('dash_ads_delete_desc')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('common_cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteMutation.mutate(ad.id)}>
                                  {t('common_delete')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="p-4 border-t text-sm text-muted-foreground">
            {ads.length} {t('admin_ads_title').toLowerCase()}{ads.length !== 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>

      {/* Add Ad Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('dash_ads_create')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('dash_ads_field_title')} *</Label>
              <Input
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder={t('dash_ads_title_placeholder')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('dash_ads_field_desc')}</Label>
              <Textarea
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder={t('dash_ads_desc_placeholder')}
                rows={3}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t('dash_ads_field_type')}</Label>
                <Select value={form.type} onValueChange={(v) => updateField('type', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('dash_ads_select')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SERVICE">Service</SelectItem>
                    <SelectItem value="PROMOTION">Promotion</SelectItem>
                    <SelectItem value="PRODUCT">Produit</SelectItem>
                    <SelectItem value="EVENT">Événement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t('dash_ads_field_category')}</Label>
                <Select value={form.categoryId} onValueChange={(v) => updateField('categoryId', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('dash_ads_select')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <Label>{t('dash_ads_field_image')}</Label>
              {form.image && (
                <div className="relative inline-block">
                  <img
                    src={form.image}
                    alt="Aperçu"
                    className="h-24 w-40 rounded-lg border object-cover"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploadMutation.isPending}
                  type="button"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {uploadMutation.isPending ? t('dash_photos_uploading') : t('admin_ads_download_image')}
                </Button>
                {form.image && (
                  <Button variant="ghost" onClick={() => updateField('image', '')} type="button">
                    {t('common_delete')}
                  </Button>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={closeDialog}>{t('common_cancel')}</Button>
              <Button
                onClick={() => createMutation.mutate(form)}
                disabled={
                  !form.title.trim() ||
                  createMutation.isPending
                }
                className="bg-pebiss-orange hover:bg-pebiss-orange/90 text-white"
              >
                {createMutation.isPending ? t('admin_ads_creating') : t('dash_ads_create')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
