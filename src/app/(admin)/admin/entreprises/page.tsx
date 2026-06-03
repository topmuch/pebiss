'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Search, Eye, Ban, CheckCircle2, Trash2, Building2, Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminEntreprisesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionTarget, setActionTarget] = useState<{ id: string; action: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [form, setForm] = useState({
    businessName: '',
    categoryId: '',
    description: '',
    address: '',
    city: '',
    businessPhone: '',
    businessEmail: '',
    website: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-businesses', search, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      params.set('limit', '100');
      const res = await fetch(`/api/admin/businesses?${params}`);
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

  const actionMutation = useMutation({
    mutationFn: async ({ id, action, ...data }: { id: string; action: string; [key: string]: any }) => {
      if (action === 'delete') {
        const res = await fetch(`/api/admin/businesses`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error('Erreur');
        return res.json();
      }
      const res = await fetch(`/api/admin/businesses`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      if (!res.ok) throw new Error('Erreur');
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-businesses'] });
      const messages: Record<string, string> = {
        suspend: 'Entreprise suspendue',
        activate: 'Entreprise activée',
        delete: 'Entreprise supprimée',
      };
      toast.success(messages[variables.action] || 'Action effectuée');
      setActionTarget(null);
    },
    onError: () => {
      toast.error('Erreur lors de l\'action');
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch('/api/admin/businesses', {
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
      queryClient.invalidateQueries({ queryKey: ['admin-businesses'] });
      toast.success('Entreprise créée avec succès');
      closeDialog();
    },
    onError: (err) => toast.error(err.message || 'Erreur lors de la création'),
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setForm({
      businessName: '',
      categoryId: '',
      description: '',
      address: '',
      city: '',
      businessPhone: '',
      businessEmail: '',
      website: '',
      ownerName: '',
      ownerEmail: '',
      ownerPassword: '',
    });
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const businesses = data?.businesses || [];
  const categories = categoriesData || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Entreprises</h1>
          <p className="text-muted-foreground">Gérez toutes les entreprises de la plateforme</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-pebiss-orange hover:bg-pebiss-orange/90 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une entreprise
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une entreprise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actives</SelectItem>
                <SelectItem value="suspended">Suspendues</SelectItem>
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
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Ville</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Vues</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}><Skeleton className="h-12 w-full" /></TableCell>
                    </TableRow>
                  ))
                ) : businesses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucune entreprise trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  businesses.map((b: any) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {b.logo ? (
                            <img src={b.logo} alt="" className="h-8 w-8 rounded-lg object-cover" />
                          ) : (
                            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate max-w-[180px]">{b.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[180px]">{b.owner?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{b.category?.name || '-'}</TableCell>
                      <TableCell className="text-sm">{b.city || '-'}</TableCell>
                      <TableCell>
                        {b.isSuspended ? (
                          <Badge variant="destructive" className="text-[10px]">Suspendue</Badge>
                        ) : (
                          <Badge variant="default" className="bg-green-100 text-green-800 text-[10px]">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="text-sm">{b.views || 0}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/entreprise/${b.slug}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </Link>
                          {b.isSuspended ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600"
                              onClick={() => actionMutation.mutate({ id: b.id, action: 'activate', isSuspended: false, isActive: true })}
                            >
                              <CheckCircle2 className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-yellow-600"
                              onClick={() => actionMutation.mutate({ id: b.id, action: 'suspend', isSuspended: true })}
                            >
                              <Ban className="h-3 w-3" />
                            </Button>
                          )}
                          <AlertDialog open={actionTarget?.id === b.id && actionTarget?.action === 'delete'} onOpenChange={(open) => !open && setActionTarget(null)}>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => setActionTarget({ id: b.id, action: 'delete' })}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer {b.name} ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action supprimera définitivement l&apos;entreprise et toutes ses données associées.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => actionMutation.mutate({ id: b.id, action: 'delete' })}>
                                  Supprimer
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
            {businesses.length} entreprise{businesses.length !== 1 ? 's' : ''}
          </div>
        </CardContent>
      </Card>

      {/* Add Business Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter une entreprise</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Business Info */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Informations de l&apos;entreprise</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label>Nom de l&apos;entreprise *</Label>
                  <Input
                    value={form.businessName}
                    onChange={(e) => updateField('businessName', e.target.value)}
                    placeholder="Nom de l'entreprise"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Catégorie</Label>
                  <Select value={form.categoryId} onValueChange={(v) => updateField('categoryId', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
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
                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Description de l'entreprise"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Adresse</Label>
                  <Input
                    value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Adresse"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ville</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="Ville"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    value={form.businessPhone}
                    onChange={(e) => updateField('businessPhone', e.target.value)}
                    placeholder="+221 XX XXX XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.businessEmail}
                    onChange={(e) => updateField('businessEmail', e.target.value)}
                    placeholder="email@entreprise.com"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Site web</Label>
                  <Input
                    value={form.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="https://www.entreprise.com"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-sm font-semibold mb-3">Propriétaire</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nom du propriétaire *</Label>
                  <Input
                    value={form.ownerName}
                    onChange={(e) => updateField('ownerName', e.target.value)}
                    placeholder="Nom complet"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email du propriétaire *</Label>
                  <Input
                    type="email"
                    value={form.ownerEmail}
                    onChange={(e) => updateField('ownerEmail', e.target.value)}
                    placeholder="email@exemple.com"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Mot de passe *</Label>
                  <Input
                    type="password"
                    value={form.ownerPassword}
                    onChange={(e) => updateField('ownerPassword', e.target.value)}
                    placeholder="Minimum 6 caractères"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={closeDialog}>Annuler</Button>
              <Button
                onClick={() => createMutation.mutate(form)}
                disabled={
                  !form.businessName.trim() ||
                  !form.ownerName.trim() ||
                  !form.ownerEmail.trim() ||
                  !form.ownerPassword.trim() ||
                  form.ownerPassword.length < 6 ||
                  createMutation.isPending
                }
                className="bg-pebiss-orange hover:bg-pebiss-orange/90 text-white"
              >
                {createMutation.isPending ? 'Création...' : 'Créer l\'entreprise'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
