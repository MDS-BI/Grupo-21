import { escapeHtml, formatCurrency } from '../utils.js';
import { labelFor, maskCreditLimit } from '../module-config.js';

const INVALID_TEXT_TOKENS = new Set(['undefined', 'null', 'nan']);

function readableText(value, fallback = '') {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'number' && !Number.isFinite(value)) return fallback;
  const text = String(value).trim();
  return INVALID_TEXT_TOKENS.has(text.toLowerCase()) ? fallback : text;
}

function clientLabel(client = {}) {
  return readableText(client.name)
    || readableText(client.email)
    || readableText(client.code)
    || 'Cliente sin nombre';
}

export function orderHistory({ clients = [], selectedClientId = '', orders = [], role = 'sales', allowed = true } = {}) {
  if (!allowed) {
    return `<p class="notice notice--error" role="alert">${escapeHtml(labelFor('accessRestricted', 'Acceso restringido: no tienes permisos para ver esta sección.'))}</p>`;
  }

  const usableClients = clients.filter((client) => readableText(client?.id));
  const selectedId = readableText(selectedClientId);
  const clientOptions = usableClients.map((client) => {
    const id = readableText(client.id);
    const selected = id === selectedId ? ' selected' : '';
    return `<option value="${escapeHtml(id)}"${selected}>${escapeHtml(clientLabel(client))}</option>`;
  }).join('');

  const selectedClient = usableClients.find((client) => readableText(client.id) === selectedId) || null;
  const creditDisplay = selectedClient
    ? maskCreditLimit(formatCurrency(selectedClient.creditLimit), role)
    : '—';

  const rows = orders.length
    ? orders.map((order) => {
      const documentType = readableText(order.documentType, 'Pedido');
      const date = readableText(order.date).slice(0, 10);
      const orderNumber = readableText(order.orderNumber, '—');
      const status = readableText(order.status, '—');
      return `
      <tr data-order-id="${escapeHtml(readableText(order.id))}">
        <td>${escapeHtml(documentType)}</td>
        <td>${escapeHtml(date)}</td>
        <td>${escapeHtml(orderNumber)}</td>
        <td>${formatCurrency(order.total)}</td>
        <td><span class="badge badge--status" data-status="${escapeHtml(status)}">${escapeHtml(status)}</span></td>
      </tr>
    `;
    }).join('')
    : `<tr><td colspan="5" class="empty-state">${escapeHtml(labelFor('emptyHistory', 'No hay documentos de venta para este cliente.'))}</td></tr>`;

  return `
    <div class="history-toolbar">
      <label class="field field--inline">
        <span>Cliente</span>
        <select id="history-client">${clientOptions}</select>
      </label>
      <p class="history-credit">Límite de crédito: <strong id="history-credit-limit">${escapeHtml(creditDisplay)}</strong></p>
    </div>
    <table class="history-table">
      <caption class="sr-only">Documentos de venta del cliente</caption>
      <thead>
        <tr>
          <th scope="col">Tipo</th>
          <th scope="col">Fecha</th>
          <th scope="col">Número</th>
          <th scope="col">Monto</th>
          <th scope="col">Estado</th>
        </tr>
      </thead>
      <tbody id="history-list">${rows}</tbody>
    </table>
  `;
}
