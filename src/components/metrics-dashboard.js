import { escapeHtml, formatCurrency } from '../utils.js';
import { labelFor } from '../module-config.js';

function statusRows(statusCounts = {}) {
  return Object.entries(statusCounts)
    .map(([status, count]) => `
      <tr>
        <th scope="row">${escapeHtml(status)}</th>
        <td>${Number(count) || 0}</td>
      </tr>
    `)
    .join('');
}

function productRows(products = []) {
  if (!products.length) return '<li class="empty-state">No hay productos vendidos en el periodo seleccionado.</li>';
  return products
    .map((product) => `
      <li class="metric-highlight">
        <span>${escapeHtml(product.name || product.productId)}</span>
        <span>${Number(product.units) || 0} uds. · ${formatCurrency(Number(product.revenue) || 0)}</span>
      </li>
    `)
    .join('');
}

function stockRows(products = []) {
  if (!products.length) return '<li class="empty-state">No hay productos con stock crítico.</li>';
  return products
    .map((product) => `
      <li class="metric-highlight">
        <span>${escapeHtml(product.name || product.productId)}</span>
        <span class="badge badge--stock${Number(product.stock) === 0 ? ' badge--soldout' : ''}">
          ${Number(product.stock) === 0 ? escapeHtml(labelFor('soldOut', 'Agotado')) : `${Number(product.stock)} uds.`}
        </span>
      </li>
    `)
    .join('');
}

export function metricsDashboard({ allowed = true, metrics = {} } = {}) {
  if (!allowed) {
    return `
      <section class="notice notice--error" role="alert">
        ${escapeHtml(labelFor('accessRestricted', 'Acceso restringido: no tienes permisos para ver esta sección.'))}
      </section>
    `;
  }

  const couponUses = Object.entries(metrics.couponUses || {})
    .map(([code, count]) => `${escapeHtml(code)} (${Number(count) || 0})`)
    .join(', ');

  return `
    <div class="metrics-dashboard">
      <p id="metrics-empty" class="empty-state"${metrics.hasData ? ' hidden' : ''}>
        No hay ventas registradas para el periodo o la categoría seleccionados.
      </p>
      <div class="kpi-grid">
        <article class="kpi-card">
          <p class="kpi-card__label">Ingresos totales</p>
          <p id="metrics-revenue" class="kpi-card__value">${formatCurrency(Number(metrics.revenue) || 0)}</p>
        </article>
        <article class="kpi-card">
          <p class="kpi-card__label">Ventas completadas</p>
          <p id="metrics-sales" class="kpi-card__value">${Number(metrics.salesCount) || 0}</p>
        </article>
        <article class="kpi-card">
          <p class="kpi-card__label">Ticket promedio</p>
          <p id="metrics-average" class="kpi-card__value">${formatCurrency(Number(metrics.averageTicket) || 0)}</p>
        </article>
        <article class="kpi-card">
          <p class="kpi-card__label">Documentos registrados</p>
          <p id="metrics-documents" class="kpi-card__value">${Number(metrics.orderCount) || 0}</p>
        </article>
      </div>
      <div class="metric-highlights">
        <section class="highlight-card" aria-labelledby="metrics-status-title">
          <h2 id="metrics-status-title" class="section-title">Documentos por estado</h2>
          <table class="metrics-table" id="metrics-status">
            <caption class="sr-only">Cantidad de documentos por estado</caption>
            <thead><tr><th scope="col">Estado</th><th scope="col">Cantidad</th></tr></thead>
            <tbody>${statusRows(metrics.statusCounts)}</tbody>
          </table>
        </section>
        <section class="highlight-card" aria-labelledby="metrics-top-title">
          <h2 id="metrics-top-title" class="section-title">Productos más vendidos</h2>
          <ol id="metrics-top-products" class="metric-list">${productRows(metrics.topProducts)}</ol>
        </section>
        <section class="highlight-card" aria-labelledby="metrics-stock-title">
          <h2 id="metrics-stock-title" class="section-title">Alertas de stock</h2>
          <ul id="metrics-stock-alerts" class="metric-list">${stockRows(metrics.lowStock)}</ul>
        </section>
        <section class="highlight-card" aria-labelledby="metrics-discounts-title">
          <h2 id="metrics-discounts-title" class="section-title">Descuentos y cupones</h2>
          <p id="metrics-discounts">
            Descuento total: ${formatCurrency(Number(metrics.discountTotal) || 0)}.
            Usos de cupones: ${couponUses || 'ninguno'}.
          </p>
        </section>
      </div>
    </div>
  `;
}
