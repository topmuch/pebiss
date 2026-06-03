import Link from 'next/link';
import Image from 'next/image';
import { Building2, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#242424] text-white mt-auto">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center">
              <Image
                src="/pebiss-logo.jpeg"
                alt="Pebiss"
                width={140}
                height={44}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Le premier annuaire professionnel du Sénégal. Référencez votre entreprise et soyez visible par des milliers de clients potentiels.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2.5 bg-white/10 hover:bg-white/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2.5 bg-white/10 hover:bg-white/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2.5 bg-white/10 hover:bg-white/20 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="font-semibold text-white text-lg">Liens rapides</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/annuaire" className="text-sm text-white/60 hover:text-white transition-colors">
                Annuaire des entreprises
              </Link>
              <Link href="/annonces" className="text-sm text-white/60 hover:text-white transition-colors">
                Annonces professionnelles
              </Link>
              <Link href="/register" className="text-sm text-white/60 hover:text-white transition-colors">
                Inscrire mon entreprise
              </Link>
              <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors">
                Se connecter
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-5">
            <h3 className="font-semibold text-white text-lg">Catégories</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/annuaire?category=mode-textile" className="text-sm text-white/60 hover:text-white transition-colors">
                Mode & Textile
              </Link>
              <Link href="/annuaire?category=restaurants-alimentation" className="text-sm text-white/60 hover:text-white transition-colors">
                Restaurants & Alimentation
              </Link>
              <Link href="/annuaire?category=tourisme-hotellerie" className="text-sm text-white/60 hover:text-white transition-colors">
                Tourisme & Hôtellerie
              </Link>
              <Link href="/annuaire?category=services-financiers" className="text-sm text-white/60 hover:text-white transition-colors">
                Services Financiers
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h3 className="font-semibold text-white text-lg">Contact</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-white/60">
                <MapPin className="h-4 w-4 shrink-0 text-white/40" />
                <span>Dakar, Sénégal</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="h-4 w-4 shrink-0 text-white/40" />
                <span>+221 33 800 00 00</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="h-4 w-4 shrink-0 text-white/40" />
                <span>contact@pebiss.sn</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
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
