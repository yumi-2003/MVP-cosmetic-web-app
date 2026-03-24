import Order, { OrderDocument, OrderItem } from "../models/Order";
import Product from "../models/Product";
import ApiError from "../utils/ApiError";
import { calculateTotals } from "../utils/calculateTotals";

export interface CartOwner {
  userId?: string;
  sessionId?: string;
}

const ownerFilter = (owner: CartOwner) => {
  if (owner.userId) return { user: owner.userId };
  if (owner.sessionId) return { sessionId: owner.sessionId };
  throw new ApiError(401, "User authentication or session ID required");
};

const getCart = async (owner: CartOwner) => {
  const filter = { ...ownerFilter(owner), status: "cart" };
  const carts = await Order.find(filter).sort({ createdAt: -1 });
  
  if (carts.length > 1) {
    // Self-healing: Merge or Delete duplicates. Taking the most recent one.
    const [latest, ...others] = carts;
    await Order.deleteMany({ _id: { $in: others.map(c => c._id) } });
    return latest;
  }
  
  return carts[0] || null;
};

const getOrCreateCart = async (owner: CartOwner) => {
  const filter = { ...ownerFilter(owner), status: "cart" };
  
  // Atomic findOneAndUpdate with upsert ensures only one cart is created/returned
  let cart = await Order.findOneAndUpdate(
    filter,
    { $setOnInsert: { items: [], subtotal: 0, tax: 0, shipping: 0, total: 0 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return cart;
};

const recalcTotals = async (cart: OrderDocument) => {
  const totals = calculateTotals(cart.items);
  cart.subtotal = totals.subtotal;
  cart.tax = totals.tax;
  cart.shipping = totals.shipping;
  cart.total = totals.total;
  await cart.save();
  return cart;
};

const cleanCart = async (cart: OrderDocument) => {
  if (cart.items.length === 0) return cart;

  const productIds = cart.items.map((item) => item.product);
  const existingProducts = await Product.find({ _id: { $in: productIds } }).lean();
  const productMap = new Map(
    existingProducts.map((p) => [p._id.toString(), p])
  );

  let changed = false;
  const originalCount = cart.items.length;

  cart.items = cart.items.filter((item) => {
    const p = productMap.get(item.product.toString());
    if (!p) {
      changed = true;
      return false;
    }
    // Optional: Update name/image if they changed in DB
    if (item.name !== p.name || item.image !== p.images?.[0]) {
      item.name = p.name;
      item.image = p.images?.[0];
      changed = true;
    }
    return true;
  });

  if (changed || cart.items.length !== originalCount) {
    await recalcTotals(cart);
  }
  return cart;
};

export const getCartForOwner = async (owner: CartOwner) => {
  const cart = await getOrCreateCart(owner);
  return cleanCart(cart);
};

export const addItemToCart = async (
  owner: CartOwner,
  productId: string,
  quantity: number
) => {
  const product = await Product.findById(productId).lean();
  if (!product) throw new ApiError(404, "Product not found");

  const cart = await getOrCreateCart(owner);
  const existing = cart.items.find((item) => item.product.toString() === productId);

  const totalRequested = (existing?.quantity || 0) + quantity;
  const stock = product.countInStock || 0;

  if (totalRequested > stock) {
    throw new ApiError(
      400,
      `Only ${stock} items available in stock`
    );
  }

  if (existing) {
    existing.quantity += quantity;
  } else {
    const newItem: OrderItem = {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0],
    };
    cart.items.push(newItem);
  }

  return recalcTotals(cart);
};

export const updateCartItem = async (
  owner: CartOwner,
  productId: string,
  quantity: number
) => {
  const cart = await getOrCreateCart(owner);
  const product = await Product.findById(productId).lean();
  
  if (!product) {
    // Product gone? Remove it from cart
    cart.items = cart.items.filter((entry) => entry.product.toString() !== productId);
    return recalcTotals(cart);
  }

  const stock = product.countInStock || 0;
  if (quantity > stock) {
    throw new ApiError(
      400, 
      `Only ${stock} items available in stock`
    );
  }

  const item = cart.items.find((entry) => entry.product.toString() === productId);
  if (!item) throw new ApiError(404, "Cart item not found");

  if (quantity <= 0) {
    cart.items = cart.items.filter(
      (entry) => entry.product.toString() !== productId
    );
  } else {
    item.quantity = quantity;
  }

  return recalcTotals(cart);
};

export const removeCartItem = async (owner: CartOwner, productId: string) => {
  const cart = await getOrCreateCart(owner);
  cart.items = cart.items.filter((entry) => entry.product.toString() !== productId);
  return recalcTotals(cart);
};

export const clearCartForOwner = async (owner: CartOwner) => {
  const filter = ownerFilter(owner);
  await Order.deleteMany({ ...filter, status: "cart" });
};
