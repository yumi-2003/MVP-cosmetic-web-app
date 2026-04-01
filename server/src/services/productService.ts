import Category from "../models/Category";
import Product, { ProductProps } from "../models/Product";

export interface ProductQuery {
  page?: string;
  limit?: string;
  sort?: string;
  category?: string;
  tags?: string;
  skinTypes?: string;
  concerns?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
}

const parseList = (value?: string) => {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseSort = (value?: string) => {
  if (!value) return { createdAt: -1 };

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price: { price: 1 },
    "-price": { price: -1 },
    rating: { rating: 1 },
    "-rating": { rating: -1 },
    name: { name: 1 },
    "-name": { name: -1 },
  };

  if (sortMap[value]) return sortMap[value];

  if (value.startsWith("-")) {
    return { [value.slice(1)]: -1 } as Record<string, 1 | -1>;
  }

  return { [value]: 1 } as Record<string, 1 | -1>;
};

export const listProducts = async (query: ProductQuery) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 12));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};

  if (query.category) {
    const category = await Category.findOne({ slug: query.category }).lean();
    if (!category) {
      return {
        data: [],
        page,
        limit,
        total: 0,
        totalPages: 0,
      };
    }
    filter.category = category._id;
  }

  const tags = parseList(query.tags);
  if (tags.length) filter.tags = { $in: tags };

  const skinTypes = parseList(query.skinTypes);
  if (skinTypes.length) filter.skinTypes = { $in: skinTypes };

  const concerns = parseList(query.concerns);
  if (concerns.length) filter.concerns = { $in: concerns };

  if (query.minPrice || query.maxPrice) {
    const priceFilter: Record<string, unknown> = {};
    if (query.minPrice) priceFilter.$gte = Number(query.minPrice);
    if (query.maxPrice) priceFilter.$lte = Number(query.maxPrice);
    filter.price = priceFilter;
  }

  if (query.inStock === "true") {
    filter.countInStock = { $gt: 0 };
  } else if (query.inStock === "false") {
    filter.countInStock = { $eq: 0 };
  }

  const sort = parseSort(query.sort);

  const [data, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sort as any)
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return { data, page, limit, total, totalPages };
};

export const getProductBySlug = async (slug: string) => {
  return Product.findOne({ slug })
    .populate("category", "name slug")
    .lean();
};

export const createProduct = async (productData: Partial<ProductProps>) => {
  return await Product.create(productData);
};

export const updateProduct = async (id: string, productData: Partial<ProductProps>) => {
  return await Product.findByIdAndUpdate(id, productData, { new: true, runValidators: true });
};

export const deleteProduct = async (id: string) => {
  return await Product.findByIdAndDelete(id);
};
