'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { ExternalLink } from 'lucide-react';

// Format definitions
export const BANNER_FORMATS: Record<string, { label: string; w: number; h: number; usage: string; isWide: boolean }> = {
  '728x90': { label: '728 × 90', w: 728, h: 90, usage: 'Header desktop', isWide: true },
  '320x100': { label: '320 × 100', w: 320, h: 100, usage: 'Header mobile', isWide: true },
  '300x250': { label: '300 × 250', w: 300, h: 250, usage: 'Liste / Sidebar / Détail', isWide: false },
  '336x280': { label: '336 × 280', w: 336, h: 280, usage: 'Détail annonce', isWide: false },
  '970x250': { label: '970 × 250', w: 970, h: 250, usage: 'Bannière large', isWide: true },
  '300x600': { label: '300 × 600', w: 300, h: 600, usage: 'Sidebar', isWide: false },
};

interface BannerData {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  link?: string | null;
  type: string;
  position: string;
  format: string;
}

// BannerCard - renders a single banner respecting its format dimensions
function BannerCard({ banner, className = '' }: { banner: BannerData; className?: string }) {
  const fmt = BANNER_FORMATS[banner.format] || { label: banner.format, w: 300, h: 250, usage: '', isWide: false };

  const content = (
    <div
      className={`relative overflow-hidden rounded-lg group cursor-pointer hover:shadow-lg transition-all duration-300 ${className}`}
      style={{ aspectRatio: `${fmt.w} / ${fmt.h}` }}
    >
      {banner.image ? (
        <>
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-semibold text-sm leading-tight drop-shadow-md">{banner.title}</h3>
            {banner.description && (
              <p className="text-white/70 text-xs mt-1 line-clamp-1">{banner.description}</p>
            )}
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
          <div className="text-center">
            <span className="text-[10px] text-white/40 uppercase font-medium">{fmt.label}</span>
            <h3 className="text-white font-semibold text-sm mt-1">{banner.title}</h3>
          </div>
        </div>
      )}
    </div>
  );

  if (banner.link) {
    return (
      <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }
  return content;
}

// Hook to fetch banners by position and format
export function useBanners(position: string, format?: string) {
  return useQuery<BannerData[]>({
    queryKey: ['banners', position, format],
    queryFn: () => {
      const params = new URLSearchParams({ position });
      if (format) params.set('format', format);
      return fetch(`/api/banners?${params}`).then(r => r.json()).then(d => Array.isArray(d) ? d : []);
    },
  });
}

// HomepageHeaderBanner - Leaderboard banner (728x90 desktop, 320x100 mobile)
export function HomepageHeaderBanner() {
  const { data: banners } = useBanners('home', '728x90');
  const { data: mobileBanners } = useBanners('home', '320x100');

  const desktopBanner = banners?.[0];
  const mobileBanner = mobileBanners?.[0];

  if (!desktopBanner && !mobileBanner) return null;

  return (
    <div className="container mx-auto px-4">
      {/* Desktop banner */}
      {desktopBanner && (
        <div className="hidden md:block">
          <BannerCard
            banner={desktopBanner}
            className="w-full"
          />
        </div>
      )}
      {/* Mobile banner */}
      {mobileBanner && (
        <div className="md:hidden">
          <BannerCard banner={mobileBanner} />
        </div>
      )}
    </div>
  );
}

// HomepageBetweenListings - 300x250 banner between business cards
export function HomepageBetweenListings({ slot = 'after-hero' }: { slot?: string }) {
  const { data: banners } = useBanners('home', '300x250');

  if (!banners || banners.length === 0) return null;

  // Show a different banner based on slot
  const bannerIndex = slot === 'after-hero' ? 0 : 1;
  const banner = banners[bannerIndex];
  if (!banner) return null;

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex justify-center">
        <div className="w-full max-w-[300px]">
          <BannerCard banner={banner} />
        </div>
      </div>
    </div>
  );
}

// HomepageGridBanners - Grid of mixed banner formats (300x250, 336x280) on homepage
export function HomepageGridBanners() {
  const { data: banners } = useBanners('home');
  const { t } = useTranslation();

  if (!banners || banners.length === 0) return null;

  // Filter out header formats (728x90, 320x100, 970x250) — they have their own placement
  const gridBanners = banners.filter(b => {
    const fmt = b.format;
    return fmt !== '728x90' && fmt !== '320x100' && fmt !== '970x250';
  });

  if (gridBanners.length === 0) return null;

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              {t('banners_section_title')}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t('banners_section_desc')}
            </p>
          </div>
          <Link href="/annonces" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Voir tout
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {gridBanners.slice(0, 8).map((banner) => (
            <BannerCard key={banner.id} banner={banner} />
          ))}
        </div>
      </div>
    </section>
  );
}

// EnterpriseDetailBanner - 336x280 or 300x250 on enterprise detail page
export function EnterpriseDetailBanner() {
  const { data: banners336 } = useBanners('enterprise', '336x280');
  const { data: banners300 } = useBanners('enterprise', '300x250');

  const banner = banners336?.[0] || banners300?.[0];
  if (!banner) return null;

  return (
    <div className="my-4">
      <BannerCard banner={banner} />
    </div>
  );
}

// EnterpriseSidebarBanner - 300x600 sidebar banner on enterprise page
export function EnterpriseSidebarBanner() {
  const { data: banners } = useBanners('sidebar', '300x600');

  if (!banners || banners.length === 0) return null;

  return (
    <div className="space-y-4">
      {banners.slice(0, 2).map((banner) => (
        <BannerCard key={banner.id} banner={banner} />
      ))}
    </div>
  );
}

export { BannerCard };
