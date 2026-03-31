import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchBlogs } from "@/redux/slices/blogSlice";
import BlogCard from "./BlogCard";
import { MoveRight } from "lucide-react";

const BlogSection = () => {
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.blogs);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBlogs());
    }
  }, [status, dispatch]);

  const latestBlogs = items.slice(0, 3);

  if (status === "loading" && items.length === 0) {
    return (
      <section className="py-24 bg-muted">
        <div className="container px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted-foreground/20 w-48 rounded mb-4 mx-auto" />
            <div className="h-4 bg-muted-foreground/20 w-72 rounded mb-12 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-2xl h-[400px]" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-background">
      <div className="container px-6 lg:px-12 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4 tracking-tight">
              Latest from the Blog
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Explore our latest tips, trends, and expert advice for your beauty journey.
            </p>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 group text-primary font-bold tracking-wide py-2"
          >
            <span>View All Stories</span>
            <div className="w-8 h-[2px] bg-primary/20 group-hover:w-12 transition-all duration-300 relative">
              <MoveRight className="w-4 h-4 text-primary absolute right-0 top-1/2 -translate-y-1/2" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
