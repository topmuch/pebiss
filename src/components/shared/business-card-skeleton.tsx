'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function BusinessCardSkeleton({ variant = 'grid' }: { variant?: 'grid' | 'list' }) {
  if (variant === 'list') {
    return (
      <Card className="border-border/60 overflow-hidden">
        <div className="flex">
          <Skeleton className="w-40 sm:w-52 flex-shrink-0" />
          <div className="flex-1 p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="w-full aspect-[2/3]" />
      {/* Content skeleton — compact */}
      <div className="px-3 py-2.5 flex items-center justify-between gap-2">
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
        {/* Circular button skeleton */}
        <Skeleton className="h-7 w-7 rounded-full shrink-0" />
      </div>
    </Card>
  );
}
