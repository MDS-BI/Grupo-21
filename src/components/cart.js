import { escapeHtml, formatCurrency } from '../utils.js';
import { labelFor } from '../module-config.js';

export function cartView(items = []) {
  if (!items.length) {
    return `<p class="empty-state" id="cart-empty">${escapeHtml(labelFor('emptyCart', 'Tu carrito está vacío.'))}</p>`;
  }

  const rows = items.map((item) => `
    <li class="cart-line" data-product-id="${escapeHtml(item.productId)}">
      <div class="cart-line__info">
        <span class="cart-line__name">${escapeHtml(item.name)}</span>
        <span class="cart-line__price">${formatCurrency(item.price)}</span>
      </div>
      <div class="cart-line__controls">
        <label class="sr-only" for="qty-${escapeHtml(item.productId)}">Cantidad de ${escapeHtml(item.name)}</label>
        <input
          id="qty-${escapeHtml(item.productId)}"
          class="qty-input"
          type="number"
          min="1"
          step="1"
          value="${item.quantity}"
          data-action="quantity"
          data-product-id="${escapeHtml(item.productId)}"
        />
        <span class="cart-line__total">${formatCurrency(item.lineTotal)}</span>
        <button
          type="button"
          class="btn btn--danger btn--small"
          data-action="remove"
          data-product-id="${escapeHtml(item.productId)}"
        >Quitar</button>
      </div>
    </li>
  `).join('');

  return `<ul class="cart-list" id="cart-items">${rows}</ul>`;
}
