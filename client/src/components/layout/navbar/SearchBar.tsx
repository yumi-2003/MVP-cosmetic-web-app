import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

const SearchBar = () => {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Search className="w-5 h-5 cursor-point" onClick={() => setOpen(true)} />
    );
  }
  return (
    <div className="absolute left-0 top-16 w-full border-b bg-white p-4 flex items-center gap-4">
      <Search className="w-5 h-5" />
      <Input
        className="border-none shadow-none focus-visible:ring-0"
        placeholder="Search products..."
      />
      <X className="w-5 h-5 cursor-point" onClick={() => setOpen(false)} />
    </div>
  );
};

export default SearchBar;
