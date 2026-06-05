import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pebiss.sn'

export const metadata: Metadata = {
  title: 'Publicité - Advertise Your Business on Pebiss',
  description: 'Boostez votre visibilité avec Pebiss. Solutions publicitaires pour entreprises au Sénégal : bannières, annonces sponsorisées et référencement professionnel.',
  keywords: [
    'publicité Sénégal',
    'annonces sponsorisées',
    'bannières publicitaires',
    'marketing digital Sénégal',
    'visibilité entreprise',
  ],
  openGraph: {
    title: 'Publicité - Pebiss',
    description: 'Boostez votre visibilité avec Pebiss. Solutions publicitaires pour entreprises au Sénégal.',
    url: `${SITE_URL}/publicite`,
    images: [{ url: `${SITE_URL}/hero-banner.jpg`, width: 1344, height: 768 }],
  },
  alternates: {
    canonical: `${SITE_URL}/publicite`,
  },
}

export default function PubliciteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
