import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCategories } from "@/redux/slices/categorySlice";
import { X } from "lucide-react";

const skinTypes = [
  { label: "All", value: "all" },
  { label: "Dry", value: "dry" },
  { label: "Oily", value: "oily" },
  { label: "Combination", value: "combination" },
  { label: "Sensitive", value: "sensitive" },
  { label: "Normal", value: "normal" },
];

const concerns = [
  { label: "Hydration", value: "dehydration" },
  { label: "Brightening", value: "dullness" },
  { label: "Aging", value: "aging" },
  { label: "Acne", value: "acne" },
  { label: "Sensitivity", value: "sensitivity" },
  { label: "Sun Protection", value: "sun protection" },
  { label: "Redness", value: "redness" },
];

const FilterSidebar = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, status: catStatus } = useAppSelector((state) => state.categories);

  useEffect(() => {
    if (catStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, catStatus]);

  const currentCategory = searchParams.get("category");
  const currentSkinTypes = searchParams.get("skinTypes")?.split(",") || [];
  const currentConcerns = searchParams.get("concerns")?.split(",") || [];
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentInStock = searchParams.get("inStock") || "";

  const handleCategoryChange = (slug: string) => {
    if (currentCategory === slug) {
      searchParams.delete("category");
    } else {
      searchParams.set("category", slug);
    }
    setSearchParams(searchParams);
  };

  const handleArrayFilterChange = (type: "skinTypes" | "concerns", value: string, currentValues: string[]) => {
    let newValues = [...currentValues];
    if (newValues.includes(value)) {
      newValues = newValues.filter(v => v !== value);
    } else {
      newValues.push(value);
    }

    if (newValues.length > 0) {
      searchParams.set(type, newValues.join(","));
    } else {
      searchParams.delete(type);
    }
    setSearchParams(searchParams);
  };

  const handleClearAll = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("category");
    newParams.delete("skinTypes");
    newParams.delete("concerns");
    newParams.delete("minPrice");
    newParams.delete("maxPrice");
    newParams.delete("inStock");
    setSearchParams(newParams);
  };

  const handlePriceChange = (type: "minPrice" | "maxPrice", value: string) => {
    if (value) {
      searchParams.set(type, value);
    } else {
      searchParams.delete(type);
    }
    setSearchParams(searchParams);
  };

  const handleStockChange = (value: string) => {
    if (currentInStock === value) {
      searchParams.delete("inStock");
    } else {
      searchParams.set("inStock", value);
    }
    setSearchParams(searchParams);
  };

  const hasFilters = currentCategory || currentSkinTypes.length > 0 || currentConcerns.length > 0 || currentMinPrice || currentMaxPrice || currentInStock;

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Clear All */}
      {hasFilters && (
        <button 
          onClick={handleClearAll}
          className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary hover:text-primary/80 transition-colors mb-2"
        >
          <X className="w-3 h-3" />
          Clear All Filters
        </button>
      )}

      {/* Category */}
      <div>
        <h3 className="text-xs font-bold tracking-widest uppercase mb-4">Category</h3>
        <div className="flex flex-col gap-3">
          {catStatus === "loading" && <span className="text-xs text-muted-foreground italic">Loading...</span>}
          {categories.map((cat) => {
            const isChecked = currentCategory === cat.slug;
            return (
              <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={() => handleCategoryChange(cat.slug)}
                  className="w-4 h-4 border-input rounded focus:ring-primary bg-background" 
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {cat.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-bold tracking-widest uppercase mb-4">Price Range</h3>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Min"
            value={currentMinPrice}
            onChange={(e) => handlePriceChange("minPrice", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary bg-background"
          />
          <span className="text-muted-foreground">-</span>
          <input 
            type="number" 
            placeholder="Max"
            value={currentMaxPrice}
            onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
            className="w-full px-3 py-2 text-sm border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary bg-background"
          />
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="text-xs font-bold tracking-widest uppercase mb-4">Availability</h3>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={currentInStock === "true"}
              onChange={() => handleStockChange("true")}
              className="w-4 h-4 border-input rounded focus:ring-primary bg-background" 
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              In Stock
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={currentInStock === "false"}
              onChange={() => handleStockChange("false")}
              className="w-4 h-4 border-input rounded focus:ring-primary bg-background" 
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              Out of Stock
            </span>
          </label>
        </div>
      </div>

      {/* Skin Type */}
      <div>
        <h3 className="text-xs font-bold tracking-widest uppercase mb-4">Skin Type</h3>
        <div className="flex flex-col gap-3">
          {skinTypes.map((item) => {
            const isChecked = currentSkinTypes.includes(item.value);
            return (
              <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={() => handleArrayFilterChange("skinTypes", item.value, currentSkinTypes)}
                  className="w-4 h-4 border-input rounded focus:ring-primary bg-background" 
                />
                <span className="text-sm text-muted-foreground group-hover:text-black transition-colors">
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Concerns */}
      <div>
        <h3 className="text-xs font-bold tracking-widest uppercase mb-4">Concerns</h3>
        <div className="flex flex-col gap-3">
          {concerns.map((item) => {
            const isChecked = currentConcerns.includes(item.value);
            return (
              <label key={item.value} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={() => handleArrayFilterChange("concerns", item.value, currentConcerns)}
                  className="w-4 h-4 border-input rounded focus:ring-primary bg-background" 
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
