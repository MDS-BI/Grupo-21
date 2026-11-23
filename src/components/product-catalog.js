import { escapeHtml } from '../utils.js';
import { labelFor } from '../module-config.js';
import { productCard } from './product-card.js';

export function productGrid(products, { role } = {}) {
  if (!products || products.length === 0) {
    return '<p class="empty-state">No hay productos para mostrar.</p>';
  }
  return products.map((product) => productCard(product, { role })).join('');
}

export function productCatalog({ featured = [], products = [], role } = {}) {
  return `
    <section class="featured-section" aria-labelledby="featured-title">
      <h2 id="featured-title" class="section-title">${escapeHtml(labelFor('featured', 'Productos destacados'))}</h2>
      <div id="featured-grid" class="product-grid">${productGrid(featured, { role })}</div>
    </section>
    <section class="catalog-section" aria-labelledby="catalog-grid-title">
      <h2 id="catalog-grid-title" class="section-title">${escapeHtml(labelFor('products', 'Productos'))}</h2>
      <div id="catalog-grid" class="product-grid">${productGrid(products, { role })}</div>
    </section>
  `;
}
