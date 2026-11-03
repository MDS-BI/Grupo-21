import { normalizeText, toNumber } from './utils.js';

export function isAvailable(product) {
  return toNumber(product?.stock, 0) > 0;
}

export function featuredProducts(products) {
  return (products || []).filter((product) => Boolean(product.featured));
}

export function productCategories(products) {
  const categories = new Set();
  (products || []).forEach((product) => {
    if (product.category) categories.add(product.category);
  });
  return [...categories].sort((a, b) => a.localeCompare(b, 'es'));
}

export function filterProducts(products, filters = {}) {
  const category = filters.category || 'all';
  const maxPrice = filters.maxPrice === '' || filters.maxPrice === null || filters.maxPrice === undefined
    ? null
    : toNumber(filters.maxPrice, null);

  return (products || []).filter((product) => {
    const matchesCategory = category === 'all' || product.category === category;
    const matchesPrice = maxPrice === null || toNumber(product.price, 0) <= maxPrice;
    return matchesCategory && matchesPrice;
  });
}

export function searchProducts(products, term) {
  const needle = normalizeText(term);
  if (!needle) return products || [];
  return (products || []).filter((product) => {
    const haystack = normalizeText(`${product.name} ${product.description} ${product.category}`);
    return haystack.includes(needle);
  });
}
