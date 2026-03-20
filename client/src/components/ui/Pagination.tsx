import React from "react";
import { ChevronRightIcon, ArrowLeftIcon } from "@/components/icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="flex items-center justify-center gap-1 md:gap-2 py-8 md:py-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1.5 md:p-2 border border-border disabled:opacity-30 hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
      </button>
      
      <div className="flex items-center gap-1">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`w-8 h-8 md:w-10 md:h-10 text-xs md:text-sm border border-border transition-colors ${
              currentPage === i + 1 ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1.5 md:p-2 border border-border disabled:opacity-30 hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        <ChevronRightIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
      </button>
    </div>
  );
};

export default Pagination;
