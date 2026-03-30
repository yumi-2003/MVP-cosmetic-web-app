import React, { useEffect, useState } from "react";
import { 
  Package, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Tag, 
  Layers, 
  Filter,
  MoreVertical,
  Layers3
} from "lucide-react";
import api from "../../redux/api";
import type { IProduct, ICategory } from "../../redux/types";

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories")
        ]);
        setProducts(prodRes.data.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Failed to fetch products or categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
      (typeof p.category === 'string' ? p.category === selectedCategory : p.category._id === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/admin/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        alert("Failed to delete product");
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
            Inventory <span className="text-primary text-xl align-top">Management</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your product catalog and stock levels.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            className="px-4 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm min-w-[150px]"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <button className="p-3 border border-border bg-card rounded-2xl hover:bg-accent transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-accent/10 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-accent overflow-hidden group-hover:scale-110 transition-transform">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Package size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{product.name}</span>
                        <span className="text-xs text-muted-foreground">Ref: {product._id.slice(-6)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/30 px-3 py-1 rounded-full w-fit">
                      <Tag size={12} className="text-primary" />
                      {typeof product.category === 'string' ? product.category : product.category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-foreground">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-mono font-bold px-2 py-1 rounded-lg ${
                      product.countInStock <= 5 ? 'bg-rose-500/10 text-rose-500' : 'text-foreground'
                    }`}>
                      {product.countInStock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        product.countInStock > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 border border-border bg-background rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="p-2 border border-border bg-background rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
