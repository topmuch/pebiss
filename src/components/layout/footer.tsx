import Link from 'next/link';
import Image from 'next/image';
import { Building2, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/pebiss-logo.png"
                alt="Pebiss"
                width={36}
                height={36}
                className="rounded-lg brightness-0 invert"
              />
              <span className="text-xl font-bold">Pebiss</span>
            </Link>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Le premier annuaire professionnel du Sénégal. Référencez votre entreprise et soyez visible par des milliers de clients potentiels.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Liens rapides</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/annuaire" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                Annuaire des entreprises
              </Link>
              <Link href="/annonces" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                Annonces professionnelles
              </Link>
              <Link href="/register" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                Inscrire mon entreprise
              </Link>
              <Link href="/login" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                Se connecter
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Catégories populaires</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/annuaire?cat=restaurants-alimentation" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                Restaurants & Alimentation
              </Link>
              <Link href="/annuaire?cat=technologie-informatique" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                Technologie & Informatique
              </Link>
              <Link href="/annuaire?cat=immobilier" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                Immobilier
              </Link>
              <Link href="/annuaire?cat=transport-logistique" className="text-sm text-primary-foreground/80 hover:text-white transition-colors">
                Transport & Logistique
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Contact</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Dakar, Sénégal</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+221 33 800 00 00</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4 shrink-0" />
                <span>contact@pebiss.sn</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-primary-foreground/20" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/70">
          <p>© {currentYear} Pebiss. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link>
            <Link href="#" className="hover:text-white transition-colors">CGU</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
