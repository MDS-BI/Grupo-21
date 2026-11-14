import { escapeHtml, formatCurrency } from '../utils.js';
import { labelFor } from '../module-config.js';
import { isOfferActive, offerPriceFor } from '../offers.js';

function offerState(offer) {
  if (!offer.active) return 'Inactiva';
  return isOfferActive(offer) ? 'Activa' : 'Fuera de vigencia';
}

function priceRows(products, priceErrors) {
  if (!products.length) {
    return '<tr><td colspan="3" class="empty-state">No hay productos registrados.</td></tr>';
  }
  return products.map((product) => `
    <tr data-product-id="${escapeHtml(product.id)}">
      <td>
        <span class="admin-product__name">${escapeHtml(product.name)}</span>
        <span class="admin-product__category">${escapeHtml(product.category || '')}</span>
      </td>
      <td>${formatCurrency(product.price)}</td>
      <td class="admin-price-cell">
        <label class="sr-only" for="price-${escapeHtml(product.id)}">Precio de ${escapeHtml(product.name)}</label>
        <input
          id="price-${escapeHtml(product.id)}"
          class="admin-price-input"
          type="number"
          min="0"
          step="1000"
          value="${escapeHtml(product.price)}"
        />
        <button
          type="button"
          class="btn btn--small btn--primary"
          data-action="save-price"
          data-product-id="${escapeHtml(product.id)}"
        >${escapeHtml(labelFor('savePrice', 'Guardar precio'))}</button>
        ${priceErrors[product.id] ? `<span class="field-error" data-price-error="${escapeHtml(product.id)}">${escapeHtml(priceErrors[product.id])}</span>` : ''}
      </td>
    </tr>
  `).join('');
}

function offerRows(offers, products) {
  if (!offers.length) {
    return `<tr><td colspan="6" class="empty-state">${escapeHtml(labelFor('emptyOffers', 'No hay ofertas registradas.'))}</td></tr>`;
  }
  return offers.map((offer) => {
    const product = products.find((entry) => entry.id === offer.productId) || null;
    const discount = offer.type === 'percent'
      ? `${offer.value} %`
      : formatCurrency(offer.value);
    const finalPrice = product ? offerPriceFor(product.price, offer) : 0;
    return `
      <tr data-offer-id="${escapeHtml(offer.id)}">
        <td>${escapeHtml(product?.name || offer.productId)}</td>
        <td>${escapeHtml(discount)}</td>
        <td>${escapeHtml(offer.startDate)} — ${escapeHtml(offer.endDate)}</td>
        <td>${formatCurrency(finalPrice)}</td>
        <td><span class="badge badge--status" data-offer-state="${escapeHtml(offerState(offer))}">${escapeHtml(offerState(offer))}</span></td>
        <td class="admin-actions">
          <button type="button" class="btn btn--small btn--ghost" data-action="edit-offer" data-offer-id="${escapeHtml(offer.id)}">${escapeHtml(labelFor('editOffer', 'Editar oferta'))}</button>
          <button type="button" class="btn btn--small btn--ghost" data-action="toggle-offer" data-offer-id="${escapeHtml(offer.id)}">${escapeHtml(offer.active ? labelFor('deactivateOffer', 'Desactivar') : labelFor('activateOffer', 'Activar'))}</button>
          <button type="button" class="btn btn--small btn--danger" data-action="delete-offer" data-offer-id="${escapeHtml(offer.id)}">${escapeHtml(labelFor('deleteOffer', 'Eliminar'))}</button>
        </td>
      </tr>
    `;
  }).join('');
}

export function adminPanel({
  allowed = true,
  products = [],
  offers = [],
  message = null,
  offerValues = {},
  offerErrors = {},
  priceErrors = {},
  editingOfferId = null
} = {}) {
  if (!allowed) {
    return `<p id="admin-denied" class="notice notice--error" role="alert">${escapeHtml(labelFor('permissionDenied', 'No tienes permisos para administrar el catálogo.'))}</p>`;
  }

  const notice = message
    ? `<p id="admin-message" class="notice notice--${escapeHtml(message.type || 'info')}" role="status">${escapeHtml(message.text)}</p>`
    : '<p id="admin-message" class="notice" role="status" hidden></p>';

  const productOptions = products.map((product) => {
    const selected = offerValues.productId === product.id ? ' selected' : '';
    return `<option value="${escapeHtml(product.id)}"${selected}>${escapeHtml(product.name)}</option>`;
  }).join('');

  const editing = Boolean(editingOfferId);
  const type = offerValues.type || 'percent';
  const formError = Object.values(offerErrors || {}).join(' ');

  return `
    ${notice}
    <div class="admin-grid">
      <section class="admin-card" aria-labelledby="admin-prices-title">
        <h2 id="admin-prices-title" class="section-title">${escapeHtml(labelFor('prices', 'Precios'))}</h2>
        <table class="admin-table" id="admin-price-table">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Precio actual</th>
              <th scope="col">Nuevo precio</th>
            </tr>
          </thead>
          <tbody>${priceRows(products, priceErrors || {})}</tbody>
        </table>
      </section>

      <section class="admin-card" aria-labelledby="admin-offers-title">
        <h2 id="admin-offers-title" class="section-title">${escapeHtml(labelFor('offers', 'Ofertas'))}</h2>
        <form id="offer-form" class="offer-form" novalidate>
          ${editing ? `<p class="offer-form__editing">Editando la oferta seleccionada.</p>` : ''}
          <div class="field-grid">
            <label class="field field--inline">
              <span>Producto</span>
              <select id="offer-product" name="productId">${productOptions}</select>
            </label>
            <label class="field field--inline">
              <span>Tipo de descuento</span>
              <select id="offer-type" name="type">
                <option value="percent"${type === 'percent' ? ' selected' : ''}>Porcentaje</option>
                <option value="fixed"${type === 'fixed' ? ' selected' : ''}>Monto fijo</option>
              </select>
            </label>
            <label class="field field--inline">
              <span>Valor</span>
              <input id="offer-value" name="value" type="number" min="0" step="0.01" value="${escapeHtml(offerValues.value ?? '')}" />
            </label>
            <label class="field field--inline">
              <span>Fecha de inicio</span>
              <input id="offer-start" name="startDate" type="date" value="${escapeHtml(offerValues.startDate || '')}" />
            </label>
            <label class="field field--inline">
              <span>Fecha de fin</span>
              <input id="offer-end" name="endDate" type="date" value="${escapeHtml(offerValues.endDate || '')}" />
            </label>
          </div>
          ${formError ? `<p id="offer-error" class="field-error" role="alert">${escapeHtml(formError)}</p>` : '<p id="offer-error" class="field-error" role="alert" hidden></p>'}
          <div class="offer-form__actions">
            <button type="submit" id="offer-submit" class="btn btn--primary">${escapeHtml(editing ? labelFor('editOffer', 'Editar oferta') : labelFor('newOffer', 'Nueva oferta'))}</button>
            ${editing ? '<button type="button" class="btn btn--ghost" data-action="cancel-offer-edit">Cancelar</button>' : ''}
          </div>
        </form>

        <table class="admin-table" id="offers-table">
          <caption class="sr-only">Ofertas registradas</caption>
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Descuento</th>
              <th scope="col">Vigencia</th>
              <th scope="col">Precio final</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody id="offers-list">${offerRows(offers, products)}</tbody>
        </table>
      </section>
    </div>
  `;
}
