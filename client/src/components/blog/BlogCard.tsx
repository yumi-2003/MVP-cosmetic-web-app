import { Link } from "react-router-dom";
import type { IBlog } from "@/redux/types";
import { Calendar, User, ArrowRight } from "lucide-react";

interface BlogCardProps {
  blog: IBlog;
}

const BlogCard = ({ blog }: BlogCardProps) => {
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border/50 flex flex-col h-full">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-foreground shadow-sm">
            {blog.tags[0] || "Beauty"}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary/70" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary/70" />
            <span>{blog.authorName}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {blog.title}
        </h3>

        <p className="text-muted-foreground/80 text-sm leading-relaxed mb-6 line-clamp-3">
          {blog.excerpt}
        </p>

        <div className="mt-auto pt-6 border-t border-border/40">
          <Link
            to={`/blog/${blog.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-foreground group/btn transition-all"
          >
            <span>Read More</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
