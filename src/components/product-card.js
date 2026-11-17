import { escapeHtml, formatCurrency } from '../utils.js';
import { labelFor } from '../module-config.js';
import { isAvailable } from '../catalog.js';

export function productCard(product) {
  const available = isAvailable(product);
  const soldOut = !available;
  const hasOffer = Boolean(product.offer) && Number(product.originalPrice) > Number(product.price);
  const priceMarkup = hasOffer
    ? `<span class="price--offer">${formatCurrency(product.price)}</span> <span class="price--original">${formatCurrency(product.originalPrice)}</span>`
    : formatCurrency(product.price);
  const image = String(product?.image || '').trim();
  const mediaMarkup = image
    ? `<img class="product-card__media product-card__image" src="${escapeHtml(image)}" alt="${escapeHtml(product.name || '')}" loading="lazy" />`
    : `<div class="product-card__media" aria-hidden="true">${escapeHtml((product?.name || '?').slice(0, 2).toUpperCase())}</div>`;
  return `
    <article class="product-card${soldOut ? ' is-sold-out' : ''}" data-product-id="${escapeHtml(product.id)}">
      ${mediaMarkup}
      <div class="product-card__body">
        <p class="product-card__category">${escapeHtml(product.category || '')}</p>
        <h3 class="product-card__name">${escapeHtml(product.name)}</h3>
        <p class="product-card__description">${escapeHtml(product.description || '')}</p>
        <p class="product-card__price" data-price="${escapeHtml(product.price)}"${hasOffer ? ` data-original-price="${escapeHtml(product.originalPrice)}"` : ''}>${priceMarkup}</p>
        ${hasOffer ? `<span class="badge badge--offer">${escapeHtml(labelFor('offerBadge', 'Oferta'))}</span>` : ''}
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
