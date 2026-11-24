import { escapeHtml, formatCurrency } from '../utils.js';

function toSafePercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function chartEmpty(message) {
  return `<p class="empty-state">${escapeHtml(message)}</p>`;
}

export function revenueByCategoryChart(items = []) {
  const rows = Array.isArray(items) ? items : [];
  if (!rows.length) return chartEmpty('No hay ingresos por categoría en el periodo seleccionado.');

  const maxRevenue = Math.max(...rows.map((item) => Number(item.revenue) || 0), 0);
  const bars = rows.map((item) => {
    const category = String(item.category || 'Otros');
    const revenue = Number(item.revenue) || 0;
    const width = maxRevenue ? toSafePercent((revenue / maxRevenue) * 100) : 0;
    return `
      <li class="bar-chart__item">
        <button
          type="button"
          class="bar-chart__label chart-button"
          data-chart-category="${escapeHtml(category)}"
          title="Filtrar métricas por ${escapeHtml(category)}"
        >
          <span>${escapeHtml(category)}</span>
          <span class="bar-chart__badge">${Number(item.units) || 0} uds.</span>
        </button>
        <span class="bar-chart__track">
          <span class="bar-chart__fill" style="width: ${width}%"></span>
        </span>
        <span class="bar-chart__value">${formatCurrency(revenue)}</span>
      </li>
    `;
  }).join('');

  const fallbackRows = rows.map((item) => `
    <tr><th scope="row">${escapeHtml(item.category || 'Otros')}</th><td>${formatCurrency(item.revenue)}</td></tr>
  `).join('');

  return `
    <div class="chart" role="img" aria-label="Gráfico de barras de ingresos por categoría" data-chart="revenue-category">
      <ul class="bar-chart">${bars}</ul>
      <table class="sr-only">
        <caption>Ingresos por categoría</caption>
        <tbody>${fallbackRows}</tbody>
      </table>
    </div>
  `;
}

export function salesByDateChart(items = []) {
  const rows = Array.isArray(items) ? items : [];
  if (!rows.length) return chartEmpty('No hay ventas en el periodo seleccionado.');

  const maxRevenue = Math.max(...rows.map((item) => Number(item.revenue) || 0), 0);
  const columns = rows.map((item) => {
    const date = String(item.date || 'sin-fecha');
    const revenue = Number(item.revenue) || 0;
    const height = maxRevenue ? Math.max(4, toSafePercent((revenue / maxRevenue) * 100)) : 4;
    return `
      <li class="column-chart__item">
        <span class="column-chart__value">${formatCurrency(revenue)}</span>
        <button
          type="button"
          class="column-chart__plot chart-button"
          data-chart-date="${escapeHtml(date)}"
          title="Filtrar métricas por ${escapeHtml(date)}"
          aria-label="Filtrar por ${escapeHtml(date)}"
        >
          <span class="column-chart__bar" style="height: ${height}%"></span>
        </button>
        <span class="column-chart__label">${escapeHtml(date)}</span>
      </li>
    `;
  }).join('');

  const fallbackRows = rows.map((item) => `
    <tr><th scope="row">${escapeHtml(item.date || 'sin-fecha')}</th><td>${formatCurrency(item.revenue)}</td></tr>
  `).join('');

  return `
    <div class="chart" role="img" aria-label="Gráfico de evolución de ventas por fecha" data-chart="sales-date">
      <ul class="column-chart">${columns}</ul>
      <table class="sr-only">
        <caption>Evolución de ventas por fecha</caption>
        <tbody>${fallbackRows}</tbody>
      </table>
    </div>
  `;
}

export function statusDistributionChart(items = []) {
  const rows = Array.isArray(items) ? items : [];
  if (!rows.length) return chartEmpty('No hay documentos en el periodo seleccionado.');

  const hasDocuments = rows.some((item) => Number(item.count) > 0);
  if (!hasDocuments) return chartEmpty('No hay documentos en el periodo seleccionado.');

  const segments = rows
    .filter((item) => Number(item.count) > 0)
    .map((item) => {
      const status = String(item.status || 'Sin estado');
      const tone = String(item.tone || 'neutral').replace(/[^a-z-]/gi, '');
      const width = toSafePercent(item.percentage);
      return `
        <span
          class="status-chart__segment status-chart__segment--${escapeHtml(tone)}"
          style="width: ${width}%"
          title="${escapeHtml(status)}: ${Number(item.count) || 0} (${width} %)"
        ></span>
      `;
    })
    .join('');

  const legend = rows.map((item) => {
    const status = String(item.status || 'Sin estado');
    const tone = String(item.tone || 'neutral').replace(/[^a-z-]/gi, '');
    return `
      <li class="status-chart__legend-item">
        <span class="status-chart__dot status-chart__dot--${escapeHtml(tone)}" aria-hidden="true"></span>
        <span>${escapeHtml(status)}</span>
        <strong>${Number(item.count) || 0} · ${toSafePercent(item.percentage)} %</strong>
      </li>
    `;
  }).join('');

  return `
    <div class="chart" role="img" aria-label="Distribución proporcional de documentos por estado" data-chart="status-distribution">
      <div class="status-chart__bar">${segments}</div>
      <ul class="status-chart__legend">${legend}</ul>
    </div>
  `;
}

export function rankingProgress(product = {}) {
  const percent = toSafePercent(product.progressPercent);
  const name = String(product.name || product.productId || 'Producto');
  return `
    <span
      class="progress-track"
      role="img"
      aria-label="Progreso de ventas de ${escapeHtml(name)}: ${percent} %"
      title="${percent} % del producto más vendido"
    >
      <span class="progress-track__fill" style="width: ${percent}%"></span>
    </span>
  `;
}
