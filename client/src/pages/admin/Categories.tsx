import React, { useEffect, useState } from "react";
import { 
  ListTree, 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  ChevronRight,
  Search,
  CheckCircle2,
  Upload
} from "lucide-react";
import api from "../../redux/api";
import type { ICategory } from "../../redux/types";
import Pagination from "../../components/ui/Pagination";
import AdminModal from "../../components/admin/AdminModal";
import { toast } from "sonner";

const AdminCategories: React.FC = () => {
  // Data State
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<ICategory>>({
    name: "",
    slug: "",
    description: "",
    image: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/categories?page=${currentPage}&limit=${limit}&name=${searchTerm}`);
      // Handle both paginated and non-paginated responses
      if (response.data.data) {
        setCategories(response.data.data);
        setTotalPages(response.data.totalPages);
      } else {
        setCategories(response.data);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  const handleOpenModal = (category?: ICategory) => {
    if (category) {
      setEditingCategory(category);
      setFormData(category);
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        image: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category? All products in this category may be affected.")) {
      try {
        await api.delete(`/admin/categories/${id}`);
        toast.success("Category deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory._id}`, formData);
        toast.success("Category updated successfully");
      } else {
        await api.post("/admin/categories", formData);
        toast.success("Category created successfully");
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      toast.error(editingCategory ? "Failed to update category" : "Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse font-medium">Loading structures...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Category <span className="text-primary italic">Management</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
            Manage product categories and their descriptions.
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          Add Category
        </button>
      </div>

      <div className="relative group max-w-2xl">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Search categories..." 
          className="w-full pl-14 pr-6 py-4 bg-card border border-border rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {categories.map((category) => (
          <div key={category._id} className="group luxury-card relative hover:border-primary/50">
            <div className="flex justify-between items-start mb-8">
              <div className="w-20 h-20 rounded-[2rem] bg-accent overflow-hidden group-hover:scale-110 transition-all duration-500 shadow-2xl shadow-black/5">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-primary/5">
                    <ImageIcon size={32} />
                  </div>
                )}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button 
                  onClick={() => handleOpenModal(category)}
                  className="p-3 border border-border bg-card rounded-2xl hover:bg-primary hover:text-primary-foreground hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(category._id)}
                  className="p-3 border border-border bg-card rounded-2xl hover:bg-destructive hover:text-destructive-foreground hover:shadow-xl hover:shadow-destructive/20 transition-all duration-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">{category.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {category.description || "No description available for this category."}
              </p>
              <div className="flex items-center gap-2 pt-4 text-[10px] font-bold text-primary uppercase tracking-widest group-hover:translate-x-2 transition-transform cursor-pointer">
                Edit Category <ChevronRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />

      {/* Category Form Modal */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingCategory ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Category Name
              </label>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Celestial Serums"
                className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Description
              </label>
              <textarea 
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="The essence of this category..."
                className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                 Category Image (URL) <Upload size={14} className="text-primary" />
              </label>
              <input 
                type="text" 
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://assets.luxury/icons/serums.png"
                className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-border/30">
            <button 
              type="button"
              onClick={handleCloseModal}
              className="px-8 py-4 bg-muted/50 text-foreground rounded-2xl font-bold hover:bg-muted transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-2xl shadow-primary/30 hover:scale-102 active:scale-98 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                   Saving...
                </>
              ) : (
                <>
                  {editingCategory ? "Update Category" : "Create Category"}
                  <CheckCircle2 size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminCategories;
