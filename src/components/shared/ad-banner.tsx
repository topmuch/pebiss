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
  },
  light: {
    bg: 'bg-white',
    accent: 'bg-primary',
    text: 'text-[#242424]',
    subtext: 'text-[#777]',
    cta: 'bg-primary hover:bg-primary/90 text-white',
  },
  gradient: {
    bg: 'bg-gradient-to-r from-[#1a1a2e] to-[#16213e]',
    accent: 'bg-[#0F3460]',
    text: 'text-white',
    subtext: 'text-white/60',
    cta: 'bg-[#E94560] hover:bg-[#D63851] text-white',
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
        className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
        aria-label="Fermer la publicité"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="flex items-center">
        {/* Left: Accent + Text */}
        <div className="flex-1 flex items-center gap-4 p-4 md:p-5">
          {/* Accent Rectangle */}
          <div
            className={cn(
              'hidden sm:flex flex-col items-center justify-center w-24 md:w-28 h-16 md:h-20 rounded shrink-0',
              v.accent
            )}
          >
            <span className={cn('text-[10px] md:text-xs font-bold uppercase tracking-wider', variant === 'dark' ? 'text-white/70' : 'text-white/70')}>
              Annonce
            </span>
            <span className={cn('text-sm md:text-base font-bold leading-tight text-center', v.text)}>
              {title.split(' ').slice(0, 2).join(' ')}
            </span>
          </div>

          {/* Text Content */}
          <div className="min-w-0">
            <h3 className={cn('text-base md:text-lg font-bold leading-tight', v.text)}>
              {title}
            </h3>
            <p className={cn('text-xs md:text-sm mt-0.5 truncate', v.subtext)}>
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: CTA Button */}
        <div className="shrink-0 pr-4 md:pr-5">
          <a
            href={ctaLink}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 md:px-5 py-2 md:py-2.5 rounded text-xs md:text-sm font-semibold transition-colors',
              v.cta
            )}
          >
            {ctaText}
            <ArrowRight className="h-3.5 w-3.5" />
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
