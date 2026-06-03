'use client';

import { ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AdBannerProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  variant?: 'dark' | 'light' | 'gradient';
  className?: string;
}

const variants = {
  dark: {
    bg: 'bg-[#2D2D2D]',
    accent: 'bg-[#2563EB]',
    text: 'text-white',
    subtext: 'text-white/60',
    cta: 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white',
    close: 'text-white/30 hover:text-white/70',
    badge: 'bg-white/10',
  },
  light: {
    bg: 'bg-white border border-[#E0E0E0]',
    accent: 'bg-primary',
    text: 'text-[#242424]',
    subtext: 'text-[#777]',
    cta: 'bg-primary hover:bg-primary/90 text-white',
    close: 'text-[#999] hover:text-[#555]',
    badge: 'bg-[#F6F6F6]',
  },
  gradient: {
    bg: 'bg-gradient-to-b from-[#1a1a2e] to-[#16213e]',
    accent: 'bg-[#0F3460]',
    text: 'text-white',
    subtext: 'text-white/60',
    cta: 'bg-[#E94560] hover:bg-[#D63851] text-white',
    close: 'text-white/30 hover:text-white/70',
    badge: 'bg-white/10',
  },
};

export function AdBanner({
  title,
  subtitle,
  ctaText = 'Découvrir',
  ctaLink = '#',
  variant = 'dark',
  className,
}: AdBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const v = variants[variant];

  if (dismissed) return null;

  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden group flex flex-col',
        v.bg,
        className
      )}
      style={{ width: '251px', height: '517px' }}
    >
      {/* Close button */}
      <button
        onClick={() => setDismissed(true)}
        className={cn(
          'absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center transition-colors',
          v.close
        )}
        aria-label="Fermer la publicité"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      {/* Top: Accent badge */}
      <div className={cn('mx-4 mt-4 px-3 py-1 rounded-full w-fit', v.badge)}>
        <span className={cn('text-[10px] font-bold uppercase tracking-wider', v.text)}>
          Annonce
        </span>
      </div>

      {/* Middle: Title + Subtitle */}
      <div className="flex-1 flex flex-col justify-center px-5 py-4">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-5', v.accent)}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/90" fillRule="evenodd" clipRule="evenodd">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>

        <h3 className={cn('text-lg font-bold leading-snug', v.text)}>
          {title}
        </h3>
        <p className={cn('text-xs leading-relaxed mt-2.5', v.subtext)}>
          {subtitle}
        </p>
      </div>

      {/* Bottom: CTA Button */}
      <div className="px-5 pb-5">
        <a
          href={ctaLink}
          className={cn(
            'flex items-center justify-center gap-2 w-full py-2.5 rounded text-sm font-semibold transition-colors',
            v.cta
          )}
        >
          {ctaText}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

/* Pre-configured banner sets for the entreprise page */
export function AdBanner1() {
  return (
    <AdBanner
      title="Boostez votre visibilité"
      subtitle="Diffusez vos produits et services auprès de milliers de clients au Sénégal"
      ctaText="Promouvoir"
      ctaLink="/register"
      variant="dark"
    />
  );
}

export function AdBanner2() {
  return (
    <AdBanner
      title="Inscrivez votre entreprise"
      subtitle="Rejoignez le plus grand annuaire d'entreprises au Sénégal gratuitement"
      ctaText="S'inscrire"
      ctaLink="/register"
      variant="gradient"
    />
  );
}

export function AdBanner3() {
  return (
    <AdBanner
      title="Services Premium"
      subtitle="Obtenez plus de visibilité et de clients avec notre offre premium"
      ctaText="En savoir plus"
      ctaLink="/register"
      variant="dark"
    />
  );
}

export function AdBanner4() {
  return (
    <AdBanner
      title="Développez votre réseau"
      subtitle="Connectez-vous avec des professionnels et partenaires partout au Sénégal"
      ctaText="Rejoindre"
      ctaLink="/register"
      variant="light"
    />
  );
}

export function AdBanner5() {
  return (
    <AdBanner
      title="Annonces mises en avant"
      subtitle="Augmentez vos chances d'être vu avec une annonce en tête de liste"
      ctaText="Voir offres"
      ctaLink="/register"
      variant="gradient"
    />
  );
}
