import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchBlogs } from "@/redux/slices/blogSlice";
import BlogCard from "@/components/blog/BlogCard";
import { Plus, Sparkles } from "lucide-react";

const BlogList = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.blogs);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="container px-6 lg:px-12 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full text-rose-500 font-bold text-xs tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Beauty Journal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 mb-6 leading-tight">
              Stories, Trends & Tips
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed max-w-lg">
              Explore our curated collection of articles, from skincare routines to the latest makeup breakthroughs.
            </p>
          </div>

          {user && (
            <Link
              to="/blog/create"
              className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold transition-all hover:bg-slate-800 hover:shadow-xl shadow-slate-200"
            >
              <div className="bg-white/20 p-1 rounded-lg">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <span>Share Your Story</span>
            </Link>
          )}
        </div>

        {status === "loading" && items.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-3xl h-[450px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}

        {!status.includes("loading") && items.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No blog posts found yet. Be the first to share one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
