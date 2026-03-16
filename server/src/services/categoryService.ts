import Category from "../models/Category";

export const listCategories = async () => {
  return Category.find().sort({ name: 1 }).lean();
};

export const getCategoryBySlug = async (slug: string) => {
  return Category.findOne({ slug }).lean();
};
