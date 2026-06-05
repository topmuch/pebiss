import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pebiss.sn'

export const metadata: Metadata = {
  title: 'Réseaux Sociaux - Suivez Pebiss',
  description: 'Suivez Pebiss sur les réseaux sociaux. Restez informé des dernières entreprises inscrites, des actualités et des promotions au Sénégal.',
  keywords: [
    'Pebiss réseaux sociaux',
    'Facebook Pebiss',
    'Instagram Pebiss',
    'actualités Sénégal',
  ],
  openGraph: {
    title: 'Réseaux Sociaux - Pebiss',
    description: 'Suivez Pebiss sur les réseaux sociaux.',
    url: `${SITE_URL}/reseaux-sociaux`,
    images: [{ url: `${SITE_URL}/hero-banner.jpg`, width: 1344, height: 768 }],
  },
  alternates: {
    canonical: `${SITE_URL}/reseaux-sociaux`,
  },
}

export default function ReseauxSociauxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
