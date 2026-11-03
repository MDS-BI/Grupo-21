import { escapeHtml } from '../utils.js';

function fieldError(errors, key) {
  if (!errors?.[key]) return '';
  return `<span class="field-error" id="error-${escapeHtml(key)}" role="alert">${escapeHtml(errors[key])}</span>`;
}

export function checkoutForm(values = {}, errors = {}) {
  const value = (key) => escapeHtml(values[key] ?? '');
  const selected = (key, option) => (values[key] === option ? ' selected' : '');

  return `
    <form id="checkout-form" class="checkout-form" novalidate>
      <div class="field-grid">
        <label class="field">
          <span>Nombre completo</span>
          <input id="checkout-fullName" name="fullName" type="text" value="${value('fullName')}" />
          ${fieldError(errors, 'fullName')}
        </label>
        <label class="field">
          <span>Correo electrónico</span>
          <input id="checkout-email" name="email" type="email" value="${value('email')}" />
          ${fieldError(errors, 'email')}
        </label>
        <label class="field field--wide">
          <span>Dirección de envío</span>
          <input id="checkout-address" name="address" type="text" value="${value('address')}" />
          ${fieldError(errors, 'address')}
        </label>
        <label class="field">
          <span>Ciudad</span>
          <input id="checkout-city" name="city" type="text" value="${value('city')}" />
          ${fieldError(errors, 'city')}
        </label>
        <label class="field">
          <span>Código postal</span>
          <input id="checkout-postalCode" name="postalCode" type="text" value="${value('postalCode')}" />
          ${fieldError(errors, 'postalCode')}
        </label>
        <label class="field">
          <span>Teléfono</span>
          <input id="checkout-phone" name="phone" type="tel" value="${value('phone')}" />
        </label>
        <label class="field">
          <span>Método de pago</span>
          <select id="checkout-paymentMethod" name="paymentMethod">
            <option value="">Selecciona un método</option>
            <option value="Tarjeta"${selected('paymentMethod', 'Tarjeta')}>Tarjeta</option>
            <option value="Transferencia"${selected('paymentMethod', 'Transferencia')}>Transferencia</option>
            <option value="Efectivo"${selected('paymentMethod', 'Efectivo')}>Efectivo</option>
            <option value="Crédito"${selected('paymentMethod', 'Crédito')}>Crédito</option>
          </select>
          ${fieldError(errors, 'paymentMethod')}
        </label>
      </div>
      <p id="checkout-message" class="notice" role="status" hidden></p>
      <button type="submit" id="confirm-order" class="btn btn--primary">Confirmar pedido</button>
    </form>
  `;
}
