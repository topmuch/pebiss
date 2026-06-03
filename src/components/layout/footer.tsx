'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Building2, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/lib/i18n';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

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
              {t('footer_desc')}
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
            <h3 className="font-semibold text-white text-lg">{t('quick_links')}</h3>
            <nav className="flex flex-col gap-3">
              <Link href="/annuaire" className="text-sm text-white/60 hover:text-white transition-colors">
                {t('business_directory')}
              </Link>
              <Link href="/annonces" className="text-sm text-white/60 hover:text-white transition-colors">
                {t('professional_ads')}
              </Link>
              <Link href="/apropos" className="text-sm text-white/60 hover:text-white transition-colors">
                {t('footer_about')}
              </Link>
              <Link href="/contact" className="text-sm text-white/60 hover:text-white transition-colors">
                {t('contact')}
              </Link>
              <Link href="/reseaux-sociaux" className="text-sm text-white/60 hover:text-white transition-colors">
                {t('footer_social')}
              </Link>
              <Link href="/publicite" className="text-sm text-white/60 hover:text-white transition-colors">
                {t('footer_ads')}
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-5">
            <h3 className="font-semibold text-white text-lg">
              {t('stats_categories')}
            </h3>
            <nav className="flex flex-col gap-3">
              <Link href="/annuaire?category=mode-textile" className="text-sm text-white/60 hover:text-white transition-colors">
                {t('mode')}
              </Link>
              <Link href="/annuaire?category=restaurants-alimentation" className="text-sm text-white/60 hover:text-white transition-colors">
                {t('restaurants')}
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
            <h3 className="font-semibold text-white text-lg">{t('contact')}</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="h-4 w-4 shrink-0 text-white/40 mt-0.5" />
                <span>{t('contact_page_address')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="h-4 w-4 shrink-0 text-white/40" />
                <span>{t('contact_page_phone1')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="h-4 w-4 shrink-0 text-white/40" />
                <span>{t('contact_page_email')}</span>
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
            <Link href="#" className="hover:text-white transition-colors">{t('legal')}</Link>
            <Link href="#" className="hover:text-white transition-colors">{t('privacy')}</Link>
            <Link href="#" className="hover:text-white transition-colors">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
