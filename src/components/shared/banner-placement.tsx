'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/lib/i18n';

// Format definitions — only 3 formats
export const BANNER_FORMATS: Record<string, { label: string; w: number; h: number; usage: string; isWide: boolean }> = {
  '728x90': { label: '728 × 90', w: 728, h: 90, usage: 'Leaderboard', isWide: true },
  '336x280': { label: '336 × 280', w: 336, h: 280, usage: 'Rectangle moyen', isWide: false },
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

// Hook to fetch banners by position and optional format
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

// HomepageMidBanner - 336x280 banner in the middle of homepage
export function HomepageMidBanner() {
  const { data: banners } = useBanners('home', '336x280');

  if (!banners || banners.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center">
        <div className="w-full max-w-[336px]">
          <BannerCard banner={banners[0]} />
        </div>
      </div>
    </div>
  );
}

// HomepageFooterBanner - 728x90 leaderboard before footer on homepage
export function HomepageFooterBanner() {
  const { data: banners } = useBanners('home', '728x90');

  if (!banners || banners.length === 0) return null;

  return (
    <div className="container mx-auto px-4 pb-8">
      <BannerCard banner={banners[0]} className="w-full" />
    </div>
  );
}

// EnterpriseSidebarBanner - 300x600 sidebar banner on enterprise detail page
export function EnterpriseSidebarBanner() {
  const { data: banners } = useBanners('enterprise', '300x600');

  if (!banners || banners.length === 0) return null;

  return (
    <div className="space-y-4">
      {banners.slice(0, 2).map((banner) => (
        <BannerCard key={banner.id} banner={banner} />
      ))}
    </div>
  );
}

// EnterpriseFooterBanner - 728x90 banner before footer on enterprise detail page
export function EnterpriseFooterBanner() {
  const { data: banners } = useBanners('enterprise', '728x90');

  if (!banners || banners.length === 0) return null;

  return (
    <div className="lg:col-span-3 py-4">
      <BannerCard banner={banners[0]} className="w-full" />
    </div>
  );
}

export { BannerCard };
