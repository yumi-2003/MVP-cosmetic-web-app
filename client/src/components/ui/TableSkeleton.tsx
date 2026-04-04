import React from "react";
import { Skeleton } from "./skeleton";

export const TableSkeleton = () => {
  return (
    <div className="space-y-10 pb-16 w-full">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-5 w-96 rounded-lg" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-12 w-32 rounded-xl" />
        </div>
      </div>

      {/* Search / Filter Bar Skeleton */}
      <div className="flex justify-between items-center gap-4">
        <Skeleton className="h-16 w-full max-w-2xl rounded-3xl" />
        <Skeleton className="h-12 w-24 rounded-2xl hidden md:block" />
      </div>

      {/* Table Skeleton */}
      <div className="luxury-card overflow-hidden border border-border/50 bg-card/30 backdrop-blur-md rounded-3xl">
        <div className="overflow-x-auto min-h-[400px] p-6">
          <div className="space-y-6">
            {/* Table Header Row Skeleton */}
            <div className="flex items-center justify-between border-b border-border/20 pb-4">
               {Array.from({ length: 5 }).map((_, i) => (
                 <Skeleton key={i} className="h-4 w-24 rounded-md" />
               ))}
            </div>
            
            {/* Table Body Rows Skeletons */}
            {Array.from({ length: 6 }).map((_, r) => (
              <div key={r} className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4 w-1/4">
                  <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
                <div className="flex gap-2">
                   <Skeleton className="h-8 w-8 rounded-lg" />
                   <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pagination Skeleton */}
        <div className="border-t border-border/10 bg-muted/5 p-6 flex justify-between items-center">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
