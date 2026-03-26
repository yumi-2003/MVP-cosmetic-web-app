import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Image Skeleton */}
      <Skeleton className="aspect-square w-full rounded-xl" />
      
      {/* Details Skeleton */}
      <div className="flex flex-col gap-1.5 px-1">
        {/* Category */}
        <Skeleton className="h-3 w-20" />
        
        {/* Name */}
        <Skeleton className="h-5 w-3/4 mt-1" />
        
        {/* Stock Status */}
        <Skeleton className="h-3 w-24 mt-0.5" />
        
        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <Skeleton className="h-3 w-16" />
        </div>
        
        {/* Price */}
        <Skeleton className="h-5 w-16 mt-1" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
