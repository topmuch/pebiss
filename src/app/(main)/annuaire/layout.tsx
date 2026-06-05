import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pebiss.sn'

export const metadata: Metadata = {
  title: 'Annuaire des Entreprises du Sénégal - Rechercher et Trouver',
  description: 'Parcourez l\'annuaire professionnel complet du Sénégal. Recherchez des entreprises par ville, région ou catégorie. Restaurants, hôtels, santé, BTP, informatique et plus.',
  keywords: [
    'annuaire entreprises Sénégal',
    'trouver entreprise Dakar',
    'repertoire professionnel Sénégal',
    'entreprises par ville Sénégal',
    'services Dakar',
    'commerces Sénégal',
  ],
  openGraph: {
    title: 'Annuaire des Entreprises du Sénégal - Pebiss',
    description: 'Parcourez l\'annuaire professionnel complet du Sénégal. Recherchez par ville, région ou catégorie.',
    url: `${SITE_URL}/annuaire`,
    images: [{ url: `${SITE_URL}/hero-banner.jpg`, width: 1344, height: 768 }],
  },
  alternates: {
    canonical: `${SITE_URL}/annuaire`,
  },
}

export default function AnnuaireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
