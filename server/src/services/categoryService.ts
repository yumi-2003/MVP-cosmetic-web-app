import Category from "../models/Category";

export const listCategories = async () => {
  return Category.find().sort({ name: 1 }).lean();
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
