import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0066CC',
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pebiss.sn';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pebiss - Annuaire Professionnel du Sénégal",
    template: "%s | Pebiss",
  },
  description: "Le premier annuaire professionnel du Sénégal. Référencez votre entreprise et soyez visible par des milliers de clients potentiels. Inscription gratuite.",
  keywords: [
    "annuaire Sénégal",
    "entreprises Sénégal",
    "référencement professionnel",
    "business directory Sénégal",
    "Dakar",
    "Pebiss",
    "professionnel Sénégal",
    "trouver une entreprise Sénégal",
    "services Sénégal",
    "commerces Sénégal",
  ],
  authors: [{ name: "Pebiss", url: SITE_URL }],
  creator: "Pebiss",
  publisher: "Pebiss",
  openGraph: {
    title: "Pebiss - Annuaire Professionnel du Sénégal",
    description: "Le premier annuaire professionnel du Sénégal. Trouvez et référencez des entreprises.",
    type: "website",
    locale: "fr_SN",
    siteName: "Pebiss",
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/hero-banner.jpg`, width: 1344, height: 768, alt: "Pebiss - Annuaire Professionnel du Sénégal" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pebiss - Annuaire Professionnel du Sénégal",
    description: "Le premier annuaire professionnel du Sénégal.",
    images: [`${SITE_URL}/hero-banner.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <AuthProvider>
            <QueryProvider>
              {children}
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
        <SonnerToaster />
        <Toaster />
      </body>
    </html>
  );
}
