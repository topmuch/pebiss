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

export const metadata: Metadata = {
  title: {
    default: "Pebiss - Annuaire Professionnel du Sénégal",
    template: "%s | Pebiss",
  },
  description: "Le premier annuaire professionnel du Sénégal. Référencez votre entreprise et soyez visible par des milliers de clients potentiels. Inscription gratuite.",
  keywords: [
    "annuaire Sénégal",
    "entreprises Sénégal",
    "référencement",
    "business directory",
    "Dakar",
    "Pebiss",
    "professionnel Sénégal",
  ],
  authors: [{ name: "Pebiss" }],
  openGraph: {
    title: "Pebiss - Annuaire Professionnel du Sénégal",
    description: "Le premier annuaire professionnel du Sénégal. Trouvez et référencez des entreprises.",
    type: "website",
    locale: "fr_SN",
    siteName: "Pebiss",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pebiss - Annuaire Professionnel du Sénégal",
    description: "Le premier annuaire professionnel du Sénégal.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
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
