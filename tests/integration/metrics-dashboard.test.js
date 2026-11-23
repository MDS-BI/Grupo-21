// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mountMarkup, startApp, clickNav, changeValue, submitForm, fillCheckout, flush, buyFromCatalog
} from '../helpers/app-fixture.js';
import { formatCurrency } from '../../src/utils.js';

function seedOrders() {
  localStorage.setItem('erp.orders', JSON.stringify([
    {
      id: 'o1', status: 'Pedido', total: 100000, discount: 0, date: '2026-04-10T10:00:00.000Z',
      items: [{ productId: 'prod-phone-01', name: 'Smartphone Nova X', quantity: 1, lineTotal: 100000 }]
    },
    {
      id: 'o2', status: 'Pedido', total: 50000, discount: 0, date: '2026-05-10T10:00:00.000Z',
      items: [{ productId: 'prod-audio-02', name: 'Altavoz Bluetooth Beat', quantity: 1, lineTotal: 50000 }]
    },
    {
      id: 'o3', status: 'Facturado', total: 30000, discount: 0, date: '2026-05-15T10:00:00.000Z',
      items: [{ productId: 'prod-phone-01', name: 'Smartphone Nova X', quantity: 1, lineTotal: 30000 }]
    },
    {
      id: 'o4', status: 'Cancelado', total: 999999, discount: 0, date: '2026-05-16T10:00:00.000Z', items: []
    }
  ]));
}

async function openMetrics() {
  localStorage.setItem('erp.role', 'admin');
  await startApp();
  clickNav('metrics');
}

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
  seedOrders();
});

describe('metrics dashboard', () => {
  it('shows revenue, sales count, average ticket and status distribution for the owner', async () => {
    await openMetrics();
    expect(document.getElementById('view-metrics').hidden).toBe(false);
    expect(document.getElementById('metrics-revenue').textContent).toBe(formatCurrency(180000));
    expect(document.getElementById('metrics-sales').textContent).toBe('3');
    expect(document.getElementById('metrics-average').textContent).toBe(formatCurrency(60000));
    expect(document.getElementById('metrics-status').textContent).toContain('Facturado');
    expect(document.getElementById('metrics-status').textContent).toContain('Cancelado');
  });

  it('ranks products and warns about low stock', async () => {
    await openMetrics();
    expect(document.getElementById('metrics-top-products').textContent).toContain('Smartphone Nova X');
    expect(document.getElementById('metrics-stock-alerts').textContent).toContain('Auriculares Sonora Pro');
  });

  it('recalculates every indicator when date and category filters are applied', async () => {
    await openMetrics();
    changeValue(document.getElementById('metrics-from'), '2026-05-01');
    changeValue(document.getElementById('metrics-to'), '2026-05-31');
    changeValue(document.getElementById('metrics-category'), 'Audio');
    document.getElementById('metrics-apply').click();

    expect(document.getElementById('metrics-revenue').textContent).toBe(formatCurrency(50000));
    expect(document.getElementById('metrics-sales').textContent).toBe('1');
    expect(document.getElementById('metrics-top-products').textContent).toContain('Altavoz Bluetooth Beat');
  });

  it('shows zeros and an empty state when no order matches', async () => {
    await openMetrics();
    changeValue(document.getElementById('metrics-category'), 'Accesorios');
    document.getElementById('metrics-apply').click();

    expect(document.getElementById('metrics-revenue').textContent).toBe(formatCurrency(0));
    expect(document.getElementById('metrics-sales').textContent).toBe('0');
    expect(document.getElementById('metrics-empty').hidden).toBe(false);
  });

  it('reflects a new purchase immediately', async () => {
    await openMetrics();
    expect(document.getElementById('metrics-sales').textContent).toBe('3');

    buyFromCatalog('prod-phone-01');
    clickNav('cart');
    document.getElementById('go-checkout').click();
    fillCheckout();
    submitForm(document.getElementById('checkout-form'));
    await flush();

    clickNav('metrics');
    expect(document.getElementById('metrics-sales').textContent).toBe('4');
    expect(document.getElementById('metrics-revenue').textContent).toBe(formatCurrency(679990));
  });

  it('blocks the panel for roles without metrics permission', async () => {
    await startApp();
    clickNav('metrics');
    expect(document.getElementById('metrics-content').textContent).toMatch(/permisos|restringido/i);
    expect(document.getElementById('metrics-revenue')).toBeNull();
  });
});
