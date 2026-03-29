const STORAGE_KEY = "recently-viewed-products";
const MAX_ITEMS = 8;

const isBrowser = () => typeof window !== "undefined";

export const getRecentlyViewedProductIds = () => {
  if (!isBrowser()) return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
};

export const trackRecentlyViewedProductId = (productId: string) => {
  if (!isBrowser() || !productId) return;

  const next = [productId, ...getRecentlyViewedProductIds().filter((id) => id !== productId)].slice(
    0,
    MAX_ITEMS
  );

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};
