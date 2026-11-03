import { escapeHtml, formatCurrency } from '../utils.js';
import { labelFor } from '../module-config.js';
import { isAvailable } from '../catalog.js';

export function productCard(product) {
  const available = isAvailable(product);
  const soldOut = !available;
  return `
    <article class="product-card${soldOut ? ' is-sold-out' : ''}" data-product-id="${escapeHtml(product.id)}">
      <div class="product-card__media" aria-hidden="true">${escapeHtml((product.name || '?').slice(0, 2).toUpperCase())}</div>
      <div class="product-card__body">
        <p class="product-card__category">${escapeHtml(product.category || '')}</p>
        <h3 class="product-card__name">${escapeHtml(product.name)}</h3>
        <p class="product-card__description">${escapeHtml(product.description || '')}</p>
        <p class="product-card__price">${formatCurrency(product.price)}</p>
        ${soldOut ? `<span class="badge badge--soldout">${escapeHtml(labelFor('soldOut', 'Agotado'))}</span>` : ''}
        <button
          type="button"
          class="btn btn--primary buy-button"
          data-action="buy"
          data-product-id="${escapeHtml(product.id)}"
          ${soldOut ? 'disabled aria-disabled="true"' : ''}
        >${escapeHtml(labelFor('buy', 'Comprar'))}</button>
      </div>
    </article>
  `;
}
