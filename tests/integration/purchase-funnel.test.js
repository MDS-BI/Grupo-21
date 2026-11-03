// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mountMarkup, startApp, clickNav, buyFromCatalog, changeValue, fillCheckout, submitForm, flush
} from '../helpers/app-fixture.js';
import { formatCurrency } from '../../src/utils.js';

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
});

describe('purchase funnel end to end', () => {
  it('goes from catalog filter to confirmation and history', async () => {
    await startApp();

    changeValue(document.getElementById('filter-category'), 'Audio');
    expect(document.querySelectorAll('#catalog-grid .product-card')).toHaveLength(2);

    buyFromCatalog('prod-audio-02');
    expect(document.getElementById('cart-count').textContent).toBe('1');

    clickNav('cart');
    changeValue(document.getElementById('coupon-code'), 'AHORRA5000');
    document.getElementById('apply-coupon').click();
    expect(document.getElementById('cart-discount').textContent).toBe(formatCurrency(5000));
    expect(document.getElementById('cart-total').textContent).toBe(formatCurrency(54990));

    document.getElementById('go-checkout').click();
    fillCheckout({ fullName: 'Bruno Díaz', email: 'bruno@example.com' });
    submitForm(document.getElementById('checkout-form'));
    await flush();

    expect(document.getElementById('view-confirmation').hidden).toBe(false);
    const orderNumber = document.getElementById('order-number').textContent;
    expect(orderNumber).toMatch(/^PED-\d{8}-\d{4}$/);
    expect(document.getElementById('confirmation').textContent).toContain(formatCurrency(54990));

    clickNav('history');
    expect(document.querySelector('#history-list').textContent).toContain(orderNumber);
    expect(document.querySelector('#history-list').textContent).toContain(formatCurrency(54990));

    const products = JSON.parse(localStorage.getItem('erp.products'));
    expect(products.find((product) => product.id === 'prod-audio-02').stock).toBe(2);
  });
});
