import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchBlogBySlug, clearSelectedBlog } from "@/redux/slices/blogSlice";
import { Calendar, User, ChevronLeft, Share2, Tag } from "lucide-react";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { selectedBlog, status } = useAppSelector((state) => state.blogs);

  useEffect(() => {
    if (slug) {
      dispatch(fetchBlogBySlug(slug));
    }
    return () => {
      dispatch(clearSelectedBlog());
    };
  }, [slug, dispatch]);

  if (status === "loading" || !selectedBlog) {
    return (
      <div className="min-h-screen bg-white pt-40 animate-pulse">
        <div className="max-w-4xl mx-auto px-6">
          <div className="h-4 bg-slate-100 w-32 rounded mb-10" />
          <div className="h-12 bg-slate-100 w-full rounded mb-6" />
          <div className="h-6 bg-slate-100 w-2/3 rounded mb-12" />
          <div className="aspect-[21/9] bg-slate-100 rounded-3xl mb-12" />
          <div className="space-y-4">
            <div className="h-4 bg-slate-100 w-full rounded" />
            <div className="h-4 bg-slate-100 w-full rounded" />
            <div className="h-4 bg-slate-100 w-3/4 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(selectedBlog.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors mb-10 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Blog</span>
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-8 leading-[1.15]">
            {selectedBlog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-slate-100">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{selectedBlog.authorName}</p>
                  <p className="text-slate-400">Author</p>
                </div>
              </div>

              <div className="hidden sm:flex flex-col gap-0.5 text-sm">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Published on</span>
                </div>
                <p className="font-bold text-slate-900">{formattedDate}</p>
              </div>
            </div>

            <button className="p-3 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-2xl shadow-slate-100">
          <img
            src={selectedBlog.image}
            alt={selectedBlog.title}
            className="w-full h-full object-cover"
          />
        </div>

        <article className="prose prose-slate prose-lg max-w-none mb-16">
          <p className="text-xl text-slate-600 font-medium leading-relaxed mb-10 italic">
            {selectedBlog.excerpt}
          </p>
          <div className="text-slate-800 leading-loose space-y-8 whitespace-pre-wrap">
            {selectedBlog.content}
          </div>
        </article>

        <footer className="pt-12 border-t border-slate-100">
          <div className="flex items-center gap-4 flex-wrap">
            <Tag className="w-4 h-4 text-slate-400" />
            {selectedBlog.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 bg-slate-50 rounded-full text-sm font-bold text-slate-600 border border-slate-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BlogDetail;
