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
    <Card className="border-border/60 overflow-hidden flex flex-col">
      {/* Image skeleton */}
      <Skeleton className="aspect-[16/10] w-full" />
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-border/40">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-4 w-4 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </Card>
  );
}
