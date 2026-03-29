import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createBlog } from "@/redux/slices/blogSlice";
import { ChevronLeft, Image as ImageIcon, Sparkles, Send } from "lucide-react";

const CreateBlog = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "error">("idle");

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    authorName: user ? `${user.firstname} ${user.lastname}` : "",
    image: "",
    tags: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(",").map((t) => t.trim()).filter((t) => t),
        authorId: user?._id,
      };

      const result = await dispatch(createBlog(blogData)).unwrap();
      navigate(`/blog/${result.slug}`);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="container px-6 mx-auto max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors mb-10 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Blog</span>
        </Link>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create Blog Post</h1>
              <p className="text-slate-500">Share your beauty wisdom with the community.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-widest">
                Post Title
              </label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Write a catchy title..."
                className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all text-lg font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-widest">
                  Author Name
                </label>
                <input
                  required
                  type="text"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-widest">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="Skincare, Trends..."
                  className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-widest flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                Featured Image URL
              </label>
              <input
                required
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-white transition-all font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-widest">
                Short Excerpt
              </label>
              <textarea
                required
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={2}
                placeholder="A brief summary to entice readers..."
                className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 ml-1 uppercase tracking-widest">
                Body Content
              </label>
              <textarea
                required
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={10}
                placeholder="Tell your story..."
                className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-rose-400 focus:ring-4 focus:ring-white transition-all resize-none leading-relaxed"
              />
            </div>

            {status === "error" && (
              <div className="p-4 bg-rose-50 rounded-2xl text-rose-500 font-bold text-sm text-center">
                Something went wrong. Please check your inputs and try again.
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-slate-200"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span>Publish Blog Post</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
