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
  it('goes from catalog filter to confirmation and then to authorized history', async () => {
    await startApp();

    changeValue(document.getElementById('filter-category'), 'Accesorios');
    expect(document.querySelectorAll('#catalog-grid .product-card')).toHaveLength(5);

    buyFromCatalog('prod-jockey');
    expect(document.getElementById('cart-count').textContent).toBe('1');

    clickNav('cart');
    changeValue(document.getElementById('coupon-code'), 'AHORRA5000');
    document.getElementById('apply-coupon').click();
    expect(document.getElementById('cart-discount').textContent).toBe(formatCurrency(5000));
    expect(document.getElementById('cart-total').textContent).toBe(formatCurrency(11990));

    document.getElementById('go-checkout').click();
    fillCheckout({ fullName: 'Bruno Díaz', email: 'bruno@example.com' });
    submitForm(document.getElementById('checkout-form'));
    await flush();

    expect(document.getElementById('view-confirmation').hidden).toBe(false);
    const orderNumber = document.getElementById('order-number').textContent;
    expect(orderNumber).toMatch(/^PED-\d{8}-\d{4}$/);
    expect(document.getElementById('confirmation').textContent).toContain(formatCurrency(11990));
    expect(document.querySelector('[data-action="go-history"]')).toBeNull();

    changeValue(document.getElementById('role-select'), 'sales');
    clickNav('history');
    expect(document.querySelector('#history-list').textContent).toContain(orderNumber);
    expect(document.querySelector('#history-list').textContent).toContain(formatCurrency(11990));

    const products = JSON.parse(localStorage.getItem('erp.products'));
    expect(products.find((product) => product.id === 'prod-jockey').stock).toBe(29);
  });

  it('offers the history button in the confirmation when the role is Vendedor', async () => {
    localStorage.setItem('erp.role', 'sales');
    await startApp();

    buyFromCatalog('prod-jockey');
    clickNav('cart');
    document.getElementById('go-checkout').click();
    fillCheckout({ fullName: 'Bruno Díaz', email: 'bruno@example.com' });
    submitForm(document.getElementById('checkout-form'));
    await flush();

    const historyButton = document.querySelector('[data-action="go-history"]');
    expect(historyButton).not.toBeNull();
    historyButton.click();
    expect(document.getElementById('view-history').hidden).toBe(false);
  });
});
