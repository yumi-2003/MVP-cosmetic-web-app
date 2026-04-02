import Blog from "../models/Blog";

export interface BlogQuery {
  page?: string;
  limit?: string;
  sort?: string;
  tag?: string;
  search?: string;
}

export const listBlogs = async (query: BlogQuery) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};
  if (query.tag) {
    filter.tags = query.tag;
  }
  if (query.search) {
    filter.$or = [
      { title: { $regex: query.search, $options: "i" } },
      { content: { $regex: query.search, $options: "i" } },
      { tags: { $in: [new RegExp(query.search, "i")] } }
    ];
  }

  const sort: Record<string, any> = query.sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

  const [data, total] = await Promise.all([
    Blog.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return { data, page, limit, total, totalPages };
};

export const createBlog = async (blogData: any) => {
  // Slug generation (can be improved)
  if (!blogData.slug && blogData.title) {
    blogData.slug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  return await Blog.create(blogData);
};

export const updateBlog = async (id: string, blogData: any) => {
  return await Blog.findByIdAndUpdate(id, blogData, { new: true, runValidators: true });
};

export const deleteBlog = async (id: string) => {
  return await Blog.findByIdAndDelete(id);
};
