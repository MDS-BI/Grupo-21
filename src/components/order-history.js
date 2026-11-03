import { escapeHtml, formatCurrency } from '../utils.js';
import { labelFor, maskCreditLimit } from '../module-config.js';

export function orderHistory({ clients = [], selectedClientId = '', orders = [], role = 'sales' } = {}) {
  const clientOptions = clients.map((client) => {
    const selected = client.id === selectedClientId ? ' selected' : '';
    return `<option value="${escapeHtml(client.id)}"${selected}>${escapeHtml(client.name)}</option>`;
  }).join('');

  const selectedClient = clients.find((client) => client.id === selectedClientId) || null;
  const creditDisplay = selectedClient
    ? maskCreditLimit(formatCurrency(selectedClient.creditLimit), role)
    : '—';

  const rows = orders.length
    ? orders.map((order) => `
      <tr data-order-id="${escapeHtml(order.id)}">
        <td>${escapeHtml(order.documentType || 'Pedido')}</td>
        <td>${escapeHtml(String(order.date || '').slice(0, 10))}</td>
        <td>${escapeHtml(order.orderNumber || '')}</td>
        <td>${formatCurrency(order.total)}</td>
        <td><span class="badge badge--status" data-status="${escapeHtml(order.status || '')}">${escapeHtml(order.status || '')}</span></td>
      </tr>
    `).join('')
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
