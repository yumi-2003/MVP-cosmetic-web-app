import React, { useEffect, useState } from "react";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Tag, 
  Calendar,
  User as UserIcon,
  Eye,
  ArrowUpRight
} from "lucide-react";
import api from "../../redux/api";
import type { IBlog } from "../../redux/types";

const AdminBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/blogs");
        setBlogs(response.data);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await api.delete(`/admin/blogs/${id}`);
        setBlogs(blogs.filter(b => b._id !== id));
      } catch (error) {
        alert("Failed to delete blog post");
      }
    }
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.authorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Blog <span className="text-primary text-xl align-top">Editorial</span>
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Create and manage compelling content for your audience.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
          <Plus size={20} />
          Create Post
        </button>
      </div>

      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Filter blogs by title or author..." 
          className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredBlogs.map((blog) => (
          <div key={blog._id} className="group bg-card/30 backdrop-blur-md border border-border/50 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-300">
            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-48 h-48 md:h-auto overflow-hidden bg-accent relative">
                {blog.image ? (
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-primary/5">
                    <BookOpen size={48} />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  {blog.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-black/50 backdrop-blur-md text-white text-[10px] rounded-md uppercase font-bold tracking-widest border border-white/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold tracking-tight line-clamp-2 pr-4 group-hover:text-primary transition-colors">{blog.title}</h3>
                    <div className="flex gap-1">
                      <button className="p-2 border border-border bg-background rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(blog._id)}
                        className="p-2 border border-border bg-background rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-3 mb-4">
                    {blog.excerpt}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <UserIcon size={12} className="text-primary" />
                      {blog.authorName}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Calendar size={12} className="text-primary" />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider group-hover:translate-x-1 transition-transform cursor-pointer">
                    Read More <ArrowUpRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBlogs;
