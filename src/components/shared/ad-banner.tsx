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
  },
  light: {
    bg: 'bg-white border border-[#E0E0E0]',
    accent: 'bg-primary',
    text: 'text-[#242424]',
    subtext: 'text-[#777]',
    cta: 'bg-primary hover:bg-primary/90 text-white',
    close: 'text-[#999] hover:text-[#555]',
  },
  gradient: {
    bg: 'bg-gradient-to-r from-[#1a1a2e] to-[#16213e]',
    accent: 'bg-[#0F3460]',
    text: 'text-white',
    subtext: 'text-white/60',
    cta: 'bg-[#E94560] hover:bg-[#D63851] text-white',
    close: 'text-white/30 hover:text-white/70',
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
        'relative rounded overflow-hidden group',
        v.bg,
        className
      )}
    >
      <button
        onClick={() => setDismissed(true)}
        className={cn(
          'absolute top-1.5 right-1.5 z-10 w-5 h-5 flex items-center justify-center transition-colors',
          v.close
        )}
        aria-label="Fermer la publicité"
      >
        <X className="h-3 w-3" />
      </button>

      <div className="flex items-center">
        {/* Left: Accent + Text */}
        <div className="flex-1 flex items-center gap-2.5 p-2.5 md:p-3">
          {/* Accent Rectangle */}
          <div
            className={cn(
              'hidden sm:flex flex-col items-center justify-center w-16 md:w-20 h-10 md:h-12 rounded shrink-0',
              v.accent
            )}
          >
            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-white/70">
              Annonce
            </span>
            <span className={cn('text-[10px] md:text-xs font-bold leading-tight text-center px-1', v.text)}>
              {title.split(' ').slice(0, 2).join(' ')}
            </span>
          </div>

          {/* Text Content */}
          <div className="min-w-0">
            <h3 className={cn('text-xs md:text-sm font-bold leading-tight', v.text)}>
              {title}
            </h3>
            <p className={cn('text-[10px] md:text-xs mt-0.5 truncate', v.subtext)}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: CTA Button */}
        <div className="shrink-0 pr-2.5 md:pr-3">
          <a
            href={ctaLink}
            className={cn(
              'inline-flex items-center gap-1 px-2.5 md:px-3 py-1.5 md:py-1.5 rounded text-[10px] md:text-xs font-semibold transition-colors',
              v.cta
            )}
          >
            {ctaText}
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
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
