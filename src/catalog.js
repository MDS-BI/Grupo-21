import { escapeHtml, normalizeText, toNumber } from './utils.js';

export function isAvailable(product) {
  return toNumber(product?.stock, 0) > 0;
}

export function productMedia(product) {
  const image = String(product?.image || '').trim();
  if (image) {
    return `<img class="product-card__media product-card__image" src="${escapeHtml(image)}" alt="${escapeHtml(product.name || '')}" loading="lazy" />`;
  }
  return `<div class="product-card__media" aria-hidden="true">${escapeHtml((product?.name || '?').slice(0, 2).toUpperCase())}</div>`;
}

export function featuredProducts(products) {
  return (products || []).filter((product) => Boolean(product.featured)).slice(0, 4);
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
