import React from "react";

const categories = [
  "Face Wash",
  "Serums",
  "Masks",
  "Moisturizers",
  "Treatments",
  "Eye Care",
  "Sun Care",
  "Toners",
  "Essences",
];

const skinTypes = ["Dry", "Oily", "Combination", "Sensitive", "All"];

const concerns = [
  "Hydration",
  "Brightening",
  "Aging",
  "Acne",
  "Sensitivity",
];

const FilterSidebar = () => {
  return (
    <div className="w-full flex flex-col gap-8">
      {/* Category */}
      <div>
        <h3 className="text-xs font-bold tracking-widest uppercase mb-4">Category</h3>
        <div className="flex flex-col gap-3">
          {categories.map((item) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 border-input rounded focus:ring-primary bg-background" />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Skin Type */}
      <div>
        <h3 className="text-xs font-bold tracking-widest uppercase mb-4">Skin Type</h3>
        <div className="flex flex-col gap-3">
          {skinTypes.map((item) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 border-gray-300 rounded focus:ring-black" />
              <span className="text-sm text-muted-foreground group-hover:text-black transition-colors">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Concerns */}
      <div>
        <h3 className="text-xs font-bold tracking-widest uppercase mb-4">Concerns</h3>
        <div className="flex flex-col gap-3">
          {concerns.map((item) => (
            <label key={item} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 border-gray-300 rounded focus:ring-black" />
              <span className="text-sm text-muted-foreground group-hover:text-black transition-colors">
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
