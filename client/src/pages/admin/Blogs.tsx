import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Image as ImageIcon, 
  Clock, 
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  FileText
} from "lucide-react";
import api from "../../redux/api";
import type { IBlog } from "../../redux/types";
import Pagination from "../../components/ui/Pagination";
import AdminModal from "../../components/admin/AdminModal";
import { toast } from "sonner";

const AdminBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<IBlog | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6); // 2x3 grid or similar
  
  // Search
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    authorName: "",
    tags: [] as string[]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/blogs?page=${currentPage}&limit=${limit}&search=${searchTerm}`);
      if (response.data.data) {
        setBlogs(response.data.data);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setBlogs(Array.isArray(response.data) ? response.data : []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Failed to fetch blogs", error);
      toast.error("Failed to load editorial archive");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map(t => t.trim());
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleOpenModal = (blog: IBlog | null = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        image: blog.image || "",
        authorName: blog.authorName,
        tags: blog.tags
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        image: "",
        authorName: "",
        tags: []
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        await api.put(`/admin/blogs/${editingBlog._id}`, formData);
        toast.success("Masterpiece refined and updated");
      } else {
        await api.post("/admin/blogs", formData);
        toast.success("New masterpiece published");
      }
      handleCloseModal();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to publish changes");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to retract this masterpiece?")) {
      try {
        await api.delete(`/admin/blogs/${id}`);
        toast.success("Masterpiece removed from archives");
        fetchData();
      } catch (error) {
        toast.error("Failed to strike the masterpiece");
      }
    }
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse font-bold uppercase tracking-widest text-[10px]">Opening the archives...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            Blog <span className="text-primary italic">Management</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Create and edit blog posts for your shop.
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group lg:min-w-[240px] justify-center"
        >
          <Plus size={24} className="group-hover:rotate-180 transition-transform duration-500" />
          Publish New
        </button>
      </div>

      <div className="relative group max-w-2xl">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={24} />
        <input 
          type="text" 
          placeholder="Search blogs..." 
          className="w-full pl-16 pr-8 py-5 bg-card border border-border rounded-3xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm text-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {blogs.map((blog) => (
          <div key={blog._id} className="group luxury-card relative flex flex-col md:flex-row gap-0 overflow-hidden p-0 border-none">
            <div className="md:w-64 h-64 md:h-auto overflow-hidden bg-accent relative flex-shrink-0">
              {blog.image ? (
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-primary/5">
                  <ImageIcon size={48} />
                </div>
              )}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {blog.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-3 py-1 bg-black/40 backdrop-blur-md text-white text-[10px] rounded-lg uppercase font-bold tracking-widest border border-white/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex-1 p-8 flex flex-col justify-between bg-card">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold tracking-tight line-clamp-2 pr-10 group-hover:text-primary transition-colors duration-500 leading-tight">{blog.title}</h3>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={() => handleOpenModal(blog)}
                      className="p-3 border border-border bg-card rounded-2xl hover:bg-primary hover:text-primary-foreground hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(blog._id)}
                      className="p-3 border border-border bg-card rounded-2xl hover:bg-destructive hover:text-destructive-foreground hover:shadow-xl hover:shadow-destructive/20 transition-all duration-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-muted-foreground line-clamp-3 mb-6 text-sm leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-border/20">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-widest">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary">
                      {blog.authorName[0]}
                    </div>
                    {blog.authorName}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-widest">
                    <Clock size={14} className="text-primary" />
                    {new Date(blog.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest group-hover:translate-x-2 transition-transform cursor-pointer">
                  Edit <ArrowUpRight size={18} />
                </div>
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

      {/* Blog Form Modal */}
      <AdminModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingBlog ? "Edit Blog" : "Create Blog"}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Blog Title</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., The Science of Sericin: A Hidden Treasure"
                  className="w-full px-6 py-5 bg-muted/40 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Blog Image (URL)</label>
                <input 
                  type="text" 
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://exclusive.images/blog-cover.jpg"
                  className="w-full px-6 py-4 bg-muted/40 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Author Name</label>
                  <input 
                    type="text" 
                    name="authorName"
                    required
                    value={formData.authorName}
                    onChange={handleInputChange}
                    placeholder="Yumi Admin"
                    className="w-full px-6 py-4 bg-muted/40 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Blog Tags</label>
                  <input 
                    type="text" 
                    value={formData.tags.join(", ")}
                    onChange={handleTagsChange}
                    placeholder="Skincare, Rituals, Science"
                    className="w-full px-6 py-4 bg-muted/40 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Summary</label>
                <textarea 
                  name="excerpt"
                  rows={3}
                  required
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="A brief introduction to your masterpiece..."
                  className="w-full px-6 py-4 bg-muted/40 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Content</label>
                <textarea 
                  name="content"
                  rows={10}
                  required
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="The full story waiting to be told..."
                  className="w-full px-6 py-4 bg-muted/40 border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none font-medium text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              type="button" 
              onClick={handleCloseModal}
              className="flex-1 px-8 py-5 border border-border rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-muted transition-all"
            >
              Retract
            </button>
            <button 
              type="submit"
              className="flex-[2] px-8 py-5 bg-primary text-primary-foreground rounded-2xl font-bold uppercase tracking-widest text-xs shadow-2xl shadow-primary/30 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-3"
            >
              {editingBlog ? "Update Blog" : "Create Blog"}
              <CheckCircle2 size={18} />
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminBlogs;
