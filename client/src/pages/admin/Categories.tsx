import React, { useEffect, useState } from "react";
import { 
  ListTree, 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  ChevronRight,
  Search
} from "lucide-react";
import api from "../../redux/api";
import type { ICategory } from "../../redux/types";

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/admin/categories/${id}`);
        setCategories(categories.filter(c => c._id !== id));
      } catch (error) {
        alert("Failed to delete category");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Categories <span className="text-primary text-xl align-top">Structure</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Organize your products with logical categories.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
          <Plus size={20} />
          New Category
        </button>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Filter categories..." 
          className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category._id} className="group bg-card/30 backdrop-blur-md border border-border/50 p-6 rounded-3xl hover:border-primary/50 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-2xl bg-accent overflow-hidden group-hover:scale-110 transition-transform">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon size={28} />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button className="p-2 border border-border bg-background rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(category._id)}
                  className="p-2 border border-border bg-background rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight">{category.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {category.description || "No description provided for this category."}
              </p>
              <div className="flex items-center gap-2 pt-4 text-xs font-semibold text-primary uppercase tracking-wider">
                View Details <ChevronRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
