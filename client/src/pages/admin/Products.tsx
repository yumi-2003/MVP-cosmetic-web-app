import React, { useEffect, useState } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Tag, 
  Filter,
  MoreVertical,
  X,
  Upload,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import api from "../../redux/api";
import type { IProduct, ICategory } from "../../redux/types";
import Pagination from "../../components/ui/Pagination";
import AdminModal from "../../components/admin/AdminModal";
import { toast } from "sonner";

const AdminProducts: React.FC = () => {
  // Data State
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<IProduct>>({
    name: "",
    price: 0,
    comparePrice: 0,
    category: "",
    description: "",
    countInStock: 0,
    images: [""],
    tags: [],
    skinTypes: [],
    concerns: [],
    ingredients: [],
    isNew: false,
    isBestSeller: false
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get(`/products?page=${currentPage}&limit=${limit}&name=${searchTerm}&category=${selectedCategory === 'all' ? '' : selectedCategory}`),
        api.get("/categories")
      ]);
      setProducts(prodRes.data.data);
      setTotalPages(prodRes.data.totalPages);
      setCategories(catRes.data.data || catRes.data); // Support both paginated and non-paginated
    } catch (error) {
      console.error("Failed to fetch products or categories", error);
      toast.error("Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, selectedCategory]);

  const handleOpenModal = (product?: IProduct) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        ...product,
        category: typeof product.category === 'string' ? product.category : product.category._id
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        price: 0,
        comparePrice: 0,
        category: categories[0]?._id || "",
        description: "",
        countInStock: 50,
        images: [""],
        tags: [],
        skinTypes: [],
        concerns: [],
        ingredients: [],
        isNew: true,
        isBestSeller: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        await api.delete(`/admin/products/${id}`);
        toast.success("Product deleted successfully");
        fetchData();
      } catch (error) {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, formData);
        toast.success("Product updated successfully");
      } else {
        await api.post("/admin/products", formData);
        toast.success("Product created successfully");
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error(editingProduct ? "Failed to update product" : "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleArrayChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value.split(",").map(item => item.trim()).filter(Boolean)
    }));
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse font-medium">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Product <span className="text-primary italic">Inventory</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
            Manage your product catalog and stock levels.
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          Add Product
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-14 pr-6 py-4 bg-card border border-border rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
            <select 
              className="pl-12 pr-10 py-4 bg-card border border-border rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm appearance-none font-medium text-muted-foreground hover:border-primary cursor-pointer min-w-[220px]"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="luxury-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/10 text-muted-foreground text-xs uppercase tracking-widest font-bold">
                <th className="px-8 py-6">Product Name</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Price</th>
                <th className="px-8 py-6 text-center">In Stock</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-primary/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-accent overflow-hidden group-hover:scale-105 transition-transform duration-500 shadow-inner">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Package size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{product.name}</span>
                        <span className="text-xs text-muted-foreground/60 font-mono tracking-tighter">SKU: {product._id.slice(-8).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground bg-secondary px-4 py-2 rounded-full w-fit">
                      <Tag size={12} className="text-primary" />
                      {typeof product.category === 'string' ? product.category : product.category.name}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-xl text-foreground">${product.price.toFixed(2)}</span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-xs text-muted-foreground line-through">${product.comparePrice.toFixed(2)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-lg font-bold ${
                        product.countInStock <= 5 ? 'text-destructive underline decoration-wavy' : 'text-foreground'
                      }`}>
                        {product.countInStock}
                      </span>
                      <span className={`text-[10px] uppercase font-bold tracking-widest ${
                        product.countInStock > 0 ? 'text-primary' : 'text-destructive'
                      }`}>
                        {product.countInStock > 0 ? "In Stock" : "Depleted"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-3 border border-border bg-card rounded-2xl hover:bg-primary hover:text-primary-foreground hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="p-3 border border-border bg-card rounded-2xl hover:bg-destructive hover:text-destructive-foreground hover:shadow-xl hover:shadow-destructive/20 transition-all duration-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="border-t border-border/10 bg-muted/5">
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        </div>
      </div>

      {/* Product Form Modal */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingProduct ? "Edit Product" : "Add Product"}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   Product Name <CheckCircle2 size={14} className="text-primary" />
                </label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Midnight Silk Sericin Cream"
                  className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    Price ($)
                  </label>
                  <input 
                    type="number" 
                    name="price"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Compare at ($)
                  </label>
                  <input 
                    type="number" 
                    name="comparePrice"
                    step="0.01"
                    value={formData.comparePrice}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  Category <Tag size={14} className="text-primary" />
                </label>
                <select 
                  name="category"
                  required
                  value={formData.category as string}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium appearance-none"
                >
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  Quantity in Stock
                </label>
                <input 
                  type="number" 
                  name="countInStock"
                  required
                  value={formData.countInStock}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono"
                />
              </div>

              <div className="flex gap-6 pt-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      name="isNew"
                      checked={formData.isNew}
                      onChange={handleCheckboxChange}
                      className="peer sr-only"
                    />
                    <div className="w-12 h-6 bg-muted rounded-full peer-checked:bg-primary transition-colors duration-300"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-6"></div>
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">New Release</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      name="isBestSeller"
                      checked={formData.isBestSeller}
                      onChange={handleCheckboxChange}
                      className="peer sr-only"
                    />
                    <div className="w-12 h-6 bg-muted rounded-full peer-checked:bg-primary transition-colors duration-300"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-6"></div>
                  </div>
                  <span className="text-sm font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">Best Seller</span>
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Description
                </label>
                <textarea 
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Tell the story of this product..."
                  className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none min-h-[160px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  Visual Assets (Image URL) <Upload size={14} className="text-primary" />
                </label>
                <input 
                  type="text" 
                  value={formData.images?.[0] || ""}
                  onChange={(e) => handleArrayChange("images", e.target.value)}
                  placeholder="https://exclusive.images/product-01.jpg"
                  className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono text-sm"
                />
                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest pt-1 px-2">High-resolution URLs only</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Skin Compatibility (Comma separated)
                </label>
                <input 
                  type="text" 
                  value={formData.skinTypes?.join(", ")}
                  onChange={(e) => handleArrayChange("skinTypes", e.target.value)}
                  placeholder="Dry, Sensitive, Mature"
                  className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Concerns Addressed
                </label>
                <input 
                  type="text" 
                  value={formData.concerns?.join(", ")}
                  onChange={(e) => handleArrayChange("concerns", e.target.value)}
                  placeholder="Aging, Hyperpigmentation, Dullness"
                  className="w-full px-6 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
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
                  {editingProduct ? "Save Changes" : "Add Product"}
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

export default AdminProducts;
