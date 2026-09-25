import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-[#EFE3E6]/60 rounded-[4px]',
        className
      )}
      {...props}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-3 flex flex-col space-y-3">
      <Skeleton className="w-full aspect-square rounded-[4px]" />
      <div className="space-y-2 pt-1">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-1 pt-1">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};

export const ProductListItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-3 flex items-center gap-4">
      <Skeleton className="w-16 h-16 shrink-0 rounded-[4px]" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-3 w-2/5" />
      </div>
      <div className="text-right space-y-1 shrink-0">
        <Skeleton className="h-5 w-24 ml-auto" />
        <Skeleton className="h-3 w-16 ml-auto" />
      </div>
    </div>
  );
};

export const MetricCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-[#EFE3E6] rounded-[4px] p-4 space-y-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-7 w-36" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
};
