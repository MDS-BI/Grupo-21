// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mountMarkup, startApp, clickNav, changeValue, submitForm, fillCheckout, flush, buyFromCatalog
} from '../helpers/app-fixture.js';
import { SEED_VERSION } from '../../src/storage.js';
import { formatCurrency } from '../../src/utils.js';

function customOrders() {
  return [
    {
      id: 'o1', status: 'Pedido', total: 100000, discount: 0, date: '2026-04-10T10:00:00.000Z',
      items: [{ productId: 'prod-steel-zip-knit', name: 'Steel Zip Knit', quantity: 1, lineTotal: 100000 }]
    },
    {
      id: 'o2', status: 'Pedido', total: 50000, discount: 0, date: '2026-05-10T10:00:00.000Z',
      items: [{ productId: 'prod-polera-coach-c', name: 'Polera Coach C - Gris Claro', quantity: 1, lineTotal: 50000 }]
    },
    {
      id: 'o3', status: 'Facturado', total: 30000, discount: 0, date: '2026-05-15T10:00:00.000Z',
      items: [{ productId: 'prod-steel-zip-knit', name: 'Steel Zip Knit', quantity: 1, lineTotal: 30000 }]
    },
    {
      id: 'o4', status: 'Cancelado', total: 999999, discount: 0, date: '2026-05-16T10:00:00.000Z', items: []
    }
  ];
}

async function openMetrics(orders) {
  localStorage.setItem('erp.role', 'admin');
  await startApp();
  if (orders) {
    localStorage.setItem('erp.seedVersion', SEED_VERSION);
    localStorage.setItem('erp.orders', JSON.stringify(orders));
  }
  clickNav('metrics');
}

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
});

describe('metrics dashboard', () => {
  it('shows the RootSouth baseline revenue, sales, ticket and status distribution', async () => {
    await openMetrics();
    expect(document.getElementById('view-metrics').hidden).toBe(false);
    expect(document.getElementById('metrics-revenue').textContent).toBe(formatCurrency(896122));
    expect(document.getElementById('metrics-sales').textContent).toBe('9');
    expect(document.getElementById('metrics-average').textContent).toBe(formatCurrency(99569));
    expect(document.getElementById('metrics-documents').textContent).toBe('12');
    expect(document.getElementById('metrics-status').textContent).toContain('Pedido');
    expect(document.getElementById('metrics-status').textContent).toContain('Facturado');
    expect(document.getElementById('metrics-status').textContent).toContain('Cotización');
    expect(document.getElementById('metrics-status').textContent).toContain('Cancelado');
    expect(document.getElementById('metrics-discounts').textContent).toContain(formatCurrency(25000));
  });

  it('ranks RootSouth products and warns about low stock', async () => {
    await openMetrics();
    expect(document.getElementById('metrics-top-products').textContent).toContain('Steel Zip Knit');
    expect(document.getElementById('metrics-top-products').textContent).toContain('Polera Coach C - Gris Claro');
    expect(document.getElementById('metrics-stock-alerts').textContent).toContain('Bandanas');
  });

  it('renders accessible charts, semantic status colors and product progress bars', async () => {
    await openMetrics();
    expect(document.querySelector('#metrics-category-chart [data-chart="revenue-category"]')).not.toBeNull();
    expect(document.querySelector('#metrics-date-chart [data-chart="sales-date"]')).not.toBeNull();
    const statusChart = document.querySelector('#metrics-status-chart [data-chart="status-distribution"]');
    expect(statusChart).not.toBeNull();
    expect(statusChart.querySelector('.status-chart__segment--success')).not.toBeNull();
    expect(statusChart.querySelector('.status-chart__segment--danger')).not.toBeNull();
    expect(document.querySelector('#metrics-top-products .progress-track__fill')).not.toBeNull();
  });

  it('filters metrics from the category chart control', async () => {
    await openMetrics(customOrders());
    document.querySelector('[data-chart-category="Poleras"]').click();
    expect(document.getElementById('metrics-revenue').textContent).toBe(formatCurrency(50000));
    expect(document.getElementById('metrics-category').value).toBe('Poleras');
  });

  it('keeps legacy exact-date chart filtering compatible', async () => {
    await openMetrics(customOrders());
    const legacyButton = document.createElement('button');
    legacyButton.type = 'button';
    legacyButton.dataset.chartDate = '2026-05-10';
    document.getElementById('view-metrics').append(legacyButton);
    legacyButton.click();
    expect(document.getElementById('metrics-revenue').textContent).toBe(formatCurrency(50000));
    expect(document.getElementById('metrics-from').value).toBe('2026-05-10');
    expect(document.getElementById('metrics-to').value).toBe('2026-05-10');
  });

  it('filters metrics by month from the sales evolution chart', async () => {
    await openMetrics(customOrders());
    document.querySelector('[data-chart-from="2026-05-01"]').click();
    expect(document.getElementById('metrics-revenue').textContent).toBe(formatCurrency(80000));
    expect(document.getElementById('metrics-from').value).toBe('2026-05-01');
    expect(document.getElementById('metrics-to').value).toBe('2026-05-31');
  });

  it('recalculates every indicator when date and category filters are applied', async () => {
    await openMetrics(customOrders());
    changeValue(document.getElementById('metrics-from'), '2026-05-01');
    changeValue(document.getElementById('metrics-to'), '2026-05-31');
    changeValue(document.getElementById('metrics-category'), 'Poleras');
    document.getElementById('metrics-apply').click();

    expect(document.getElementById('metrics-revenue').textContent).toBe(formatCurrency(50000));
    expect(document.getElementById('metrics-sales').textContent).toBe('1');
    expect(document.getElementById('metrics-top-products').textContent).toContain('Polera Coach C - Gris Claro');
  });

  it('shows zeros and an empty state when no order matches', async () => {
    await openMetrics(customOrders());
    changeValue(document.getElementById('metrics-category'), 'Accesorios');
    document.getElementById('metrics-apply').click();

    expect(document.getElementById('metrics-revenue').textContent).toBe(formatCurrency(0));
    expect(document.getElementById('metrics-sales').textContent).toBe('0');
    expect(document.getElementById('metrics-empty').hidden).toBe(false);
    expect(document.querySelector('#metrics-category-chart .empty-state')).not.toBeNull();
    expect(document.querySelector('#metrics-date-chart .empty-state')).not.toBeNull();
  });

  it('reflects a new purchase immediately', async () => {
    await openMetrics();
    expect(document.getElementById('metrics-sales').textContent).toBe('9');

    buyFromCatalog('prod-steel-zip-knit');
    clickNav('cart');
    document.getElementById('go-checkout').click();
    fillCheckout();
    submitForm(document.getElementById('checkout-form'));
    await flush();

    clickNav('metrics');
    expect(document.getElementById('metrics-sales').textContent).toBe('10');
    expect(document.getElementById('metrics-revenue').textContent).toBe(formatCurrency(966313));
  });

  it('blocks the panel for roles without metrics permission', async () => {
    await startApp();
    expect(document.getElementById('manage-menu-toggle').hidden).toBe(true);
    expect(document.querySelector('[data-view="metrics"]').hidden).toBe(true);
    clickNav('metrics');
    expect(document.getElementById('view-metrics').hidden).toBe(true);
    expect(document.getElementById('role-denied').textContent).toMatch(/permisos|restringido/i);
    expect(document.getElementById('metrics-revenue')).toBeNull();

    localStorage.setItem('erp.role', 'sales');
    const app = await startApp();
    app.showView('metrics');
    expect(document.getElementById('view-metrics').hidden).toBe(true);
    expect(document.getElementById('role-denied').textContent).toMatch(/permisos|restringido/i);
  });
});
