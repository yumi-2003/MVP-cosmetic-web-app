import Category from "../models/Category";

export const listCategories = async (query: { page?: string; limit?: string } = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 100)); // Default to 100 as categories are usually few
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Category.find()
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Category.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return { data, page, limit, total, totalPages };
};

export const getCategoryBySlug = async (slug: string) => {
  return Category.findOne({ slug }).lean();
};

export const createCategory = async (categoryData: any) => {
  return await Category.create(categoryData);
};

export const updateCategory = async (id: string, categoryData: any) => {
  return await Category.findByIdAndUpdate(id, categoryData, { new: true, runValidators: true });
};

export const deleteCategory = async (id: string) => {
  return await Category.findByIdAndDelete(id);
};
