// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mountMarkup, startApp, clickNav, buyFromCatalog, fillCheckout, submitForm, flush, changeValue
} from '../helpers/app-fixture.js';
import { formatCurrency } from '../../src/utils.js';

async function completePurchase() {
  await startApp();
  buyFromCatalog('prod-jockey');
  clickNav('cart');
  document.getElementById('go-checkout').click();
  fillCheckout({ fullName: 'Bruno Díaz', email: 'bruno@example.com' });
  submitForm(document.getElementById('checkout-form'));
  await flush();
  return document.getElementById('order-number').textContent;
}

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
});

describe('order history', () => {
  it('lists completed purchases for Vendedor with the credit limit masked', async () => {
    localStorage.setItem('erp.role', 'sales');
    const orderNumber = await completePurchase();
    expect(document.querySelector('[data-action="go-history"]')).not.toBeNull();
    document.querySelector('[data-action="go-history"]').click();

    const rows = document.querySelectorAll('#history-list tr[data-order-id]');
    expect(rows).toHaveLength(1);
    expect(rows[0].textContent).toContain(orderNumber);
    expect(rows[0].textContent).toContain(formatCurrency(16990));
    expect(document.getElementById('history-credit-limit').textContent).toBe('•••••');
  });

  it('reveals the financial limit when the Gerente General changes role', async () => {
    localStorage.setItem('erp.role', 'sales');
    await completePurchase();
    document.querySelector('[data-action="go-history"]').click();
    expect(document.getElementById('history-credit-limit').textContent).toBe('•••••');

    changeValue(document.getElementById('role-select'), 'admin');
    expect(document.getElementById('view-history').hidden).toBe(false);
    expect(document.getElementById('history-credit-limit').textContent).not.toBe('•••••');
  });

  it('shows the seeded documents to Vendedor before any new purchase', async () => {
    localStorage.setItem('erp.role', 'sales');
    await startApp();
    clickNav('history');
    expect(document.querySelectorAll('#history-list tr[data-order-id]').length).toBeGreaterThan(0);
    expect(document.getElementById('history-credit-limit').textContent).toBe('•••••');
  });
});
