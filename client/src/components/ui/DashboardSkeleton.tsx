import React from "react";
import { Skeleton } from "./skeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 pb-10 w-full animate-in fade-in duration-700 h-screen overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-12 w-64 rounded-xl" />
          <Skeleton className="h-5 w-80 rounded-lg" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card/50 border border-border/50 p-6 rounded-3xl">
            <div className="flex justify-between items-start mb-6">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              {i < 3 && <Skeleton className="h-6 w-16 rounded-full" />}
            </div>
            <Skeleton className="h-4 w-24 rounded-md mb-2" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Charts & Tables) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Chart Skeleton */}
          <div className="bg-card/30 border border-border/50 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-8">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-6 w-56 rounded-md" />
            </div>
             <Skeleton className="w-full h-[200px] rounded-xl" />
          </div>

           {/* Recent Orders Skeleton */}
           <div className="bg-card/30 border border-border/50 rounded-3xl overflow-hidden">
             <div className="p-6 border-b border-border/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-6 w-40 rounded-md" />
                </div>
                <Skeleton className="h-4 w-32 rounded-md" />
             </div>
             <div className="p-6 space-y-6">
               {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                     <div className="space-y-2">
                       <Skeleton className="h-4 w-32 rounded-md" />
                       <Skeleton className="h-3 w-48 rounded-md" />
                     </div>
                     <Skeleton className="h-4 w-16 rounded-md" />
                     <Skeleton className="h-5 w-20 rounded-md" />
                     <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
               ))}
             </div>
           </div>
        </div>

        {/* Right Column (Quick Actions & System Overview) */}
        <div className="space-y-6">
           <div className="bg-card/30 border border-border/50 rounded-3xl p-6">
             <div className="flex items-center gap-2 mb-6">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-6 w-32 rounded-md" />
             </div>
             <div className="space-y-4">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-16 w-full rounded-2xl" />
             </div>
           </div>

           <div className="bg-card/30 border border-border/50 rounded-3xl p-6">
              <Skeleton className="h-4 w-40 rounded-md mb-6" />
              <div className="space-y-4">
                 <Skeleton className="h-20 w-full rounded-2xl" />
                 <Skeleton className="h-20 w-full rounded-2xl" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
