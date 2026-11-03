import { escapeHtml, formatCurrency } from '../utils.js';

export function orderConfirmation(order = {}) {
  const items = (order.items || []).map((item) => `
    <li>${escapeHtml(item.name)} × ${escapeHtml(item.quantity)} — ${formatCurrency(item.lineTotal)}</li>
  `).join('');

  return `
    <div class="confirmation-card" id="order-confirmation">
      <p class="confirmation-card__eyebrow">Compra confirmada</p>
      <h2 class="confirmation-card__title">¡Gracias por tu pedido!</h2>
      <p>Número de pedido: <strong id="order-number">${escapeHtml(order.orderNumber || '')}</strong></p>
      <ul class="confirmation-card__items">${items}</ul>
      <p class="confirmation-card__total">Total pagado: <strong>${formatCurrency(order.total)}</strong></p>
      <p class="confirmation-card__meta">Método de pago: ${escapeHtml(order.paymentMethod || '')}</p>
      <div class="confirmation-card__actions">
        <button type="button" class="btn btn--primary" data-action="go-catalog">Seguir comprando</button>
        <button type="button" class="btn btn--ghost" data-action="go-history">Ver historial</button>
      </div>
    </div>
  `;
}
