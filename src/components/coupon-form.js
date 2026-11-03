import { escapeHtml } from '../utils.js';
import { labelFor } from '../module-config.js';

export function couponForm({ code = null, message = null, applied = false } = {}) {
  const notice = message
    ? `<p id="coupon-message" class="notice notice--${escapeHtml(message.type || 'info')}" role="status">${escapeHtml(message.text)}</p>`
    : '<p id="coupon-message" class="notice" role="status" hidden></p>';

  return `
    <div class="coupon-box">
      <label class="field">
        <span>Código de descuento</span>
        <div class="coupon-box__row">
          <input id="coupon-code" name="couponCode" type="text" autocomplete="off"
            placeholder="Ej. BIENVENIDO10" value="${escapeHtml(code || '')}" />
          <button type="button" id="apply-coupon" class="btn btn--primary">${escapeHtml(labelFor('applyCoupon', 'Aplicar'))}</button>
          ${applied ? `<button type="button" id="remove-coupon" class="btn btn--ghost">${escapeHtml(labelFor('removeCoupon', 'Quitar cupón'))}</button>` : ''}
        </div>
      </label>
      ${notice}
    </div>
  `;
}
