import { escapeHtml, formatCurrency } from '../utils.js';

const MONTH_NAMES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const formatUnits = (value) => `${value} uds.`;

function monthLabel(month) {
  const [year, number] = String(month).split('-');
  const name = MONTH_NAMES[Number(number) - 1] || number;
  return `${name} ${year}`;
}

function horizontalBars({ title, items, getValue, formatValue, highlights = {} }) {
  if (!items.length) {
    return `<div class="chart-card"><h3 class="chart-card__title">${escapeHtml(title)}</h3><p class="empty-state">No hay datos para este gráfico.</p></div>`;
  }

  const max = Math.max(...items.map(getValue), 1);
  const rows = items.map((item) => {
    const value = getValue(item);
    const key = item.productId || item.category;
    const highlight = highlights[key];
    const name = item.name || item.category;
    const formatted = formatValue(value);
    const width = Math.max(0, Math.min(100, (value / max) * 100)).toFixed(1);
    const badge = highlight
      ? `<span class="bar-chart__badge bar-chart__badge--${highlight}">${highlight === 'best' ? 'Más vendido' : 'Menos vendido'}</span>`
      : '';

    return `
      <li class="bar-chart__item${highlight ? ` bar-chart__item--${highlight}` : ''}">
        <span class="bar-chart__label">${escapeHtml(name)}${badge}</span>
        <span class="bar-chart__track" role="img" aria-label="${escapeHtml(name)}: ${escapeHtml(formatted)}">
          <span class="bar-chart__fill" style="width: ${width}%"></span>
        </span>
        <span class="bar-chart__value">${escapeHtml(formatted)}</span>
      </li>`;
  }).join('');

  return `
    <div class="chart-card">
      <h3 class="chart-card__title">${escapeHtml(title)}</h3>
      <ul class="bar-chart">${rows}</ul>
    </div>`;
}

function monthlyBars(items) {
  if (!items.length) {
    return '<div class="chart-card"><h3 class="chart-card__title">Ingresos por mes</h3><p class="empty-state">No hay datos para este gráfico.</p></div>';
  }

  const max = Math.max(...items.map((item) => item.revenue), 1);
  const bars = items.map((item) => {
    const height = Math.max(2, (item.revenue / max) * 100).toFixed(1);
    const label = monthLabel(item.month);
    return `
      <li class="column-chart__item">
        <span class="column-chart__value">${escapeHtml(formatCurrency(item.revenue))}</span>
        <span class="column-chart__plot">
          <span class="column-chart__bar" role="img" aria-label="${escapeHtml(label)}: ${escapeHtml(formatCurrency(item.revenue))}" style="height: ${height}%"></span>
        </span>
        <span class="column-chart__label">${escapeHtml(label)}</span>
      </li>`;
  }).join('');

  return `
    <div class="chart-card">
      <h3 class="chart-card__title">Ingresos por mes</h3>
      <ul class="column-chart">${bars}</ul>
    </div>`;
}

function highlightCard(product, type) {
  if (!product) {
    return `<article class="highlight-card highlight-card--${type}"><p class="highlight-card__eyebrow">Sin datos</p></article>`;
  }
  const eyebrow = type === 'best' ? 'Producto más vendido' : 'Producto menos vendido';
  return `
    <article class="highlight-card highlight-card--${type}">
      <p class="highlight-card__eyebrow">${eyebrow}</p>
      <h3 class="highlight-card__name">${escapeHtml(product.name)}</h3>
      <p class="highlight-card__detail">
        <strong>${formatUnits(product.unitsSold)}</strong> · ${escapeHtml(product.category)} · ${escapeHtml(formatCurrency(product.revenue))}
      </p>
    </article>`;
}

export function metricsDashboard({
  summary = {},
  productMetrics = [],
  categoryMetrics = [],
  monthlyMetrics = [],
  bestSeller = null,
  worstSeller = null
} = {}) {
  const kpis = [
    { label: 'Ingresos totales', value: formatCurrency(summary.totalRevenue || 0) },
    { label: 'Unidades vendidas', value: formatUnits(summary.totalUnits || 0) },
    { label: 'Pedidos facturados', value: String(summary.totalOrders || 0) },
    { label: 'Ticket promedio', value: formatCurrency(summary.averageOrderValue || 0) }
  ].map((kpi) => `
    <article class="kpi-card">
      <p class="kpi-card__label">${escapeHtml(kpi.label)}</p>
      <strong class="kpi-card__value">${escapeHtml(kpi.value)}</strong>
    </article>
  `).join('');

  const highlights = {
    ...(bestSeller ? { [bestSeller.productId]: 'best' } : {}),
    ...(worstSeller && worstSeller.productId !== bestSeller?.productId
      ? { [worstSeller.productId]: 'worst' }
      : {})
  };

  return `
    <p class="notice notice--info">Datos simulados de demostración (junio a noviembre de 2026). Precios históricos de lista.</p>
    <div class="kpi-grid">${kpis}</div>
    <div class="metric-highlights">
      ${highlightCard(bestSeller, 'best')}
      ${highlightCard(worstSeller, 'worst')}
    </div>
    <div class="charts-grid">
      ${horizontalBars({
        title: 'Unidades vendidas por producto',
        items: productMetrics,
        getValue: (product) => product.unitsSold,
        formatValue: formatUnits,
        highlights
      })}
      ${horizontalBars({
        title: 'Ingresos por categoría',
        items: categoryMetrics,
        getValue: (category) => category.revenue,
        formatValue: formatCurrency
      })}
      ${monthlyBars(monthlyMetrics)}
    </div>
  `;
}
