// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mountMarkup, startApp, clickNav, buyFromCatalog, fillCheckout, submitForm, flush, changeValue
} from '../helpers/app-fixture.js';
import { formatCurrency } from '../../src/utils.js';

async function completePurchase(overrides = {}) {
  await startApp();
  buyFromCatalog('prod-jockey');
  clickNav('cart');
  document.getElementById('go-checkout').click();
  fillCheckout({ fullName: 'Bruno Díaz', email: 'bruno@example.com', ...overrides });
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

  it('shows the exact buyer name and no undefined in the client selector', async () => {
    localStorage.setItem('erp.role', 'sales');
    localStorage.setItem('erp.clients', JSON.stringify([{
      id: 'client-legacy',
      name: '',
      code: 'CLI-900',
      email: 'antiguo@example.com',
      creditLimit: 0,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z'
    }]));

    await completePurchase();
    document.querySelector('[data-action="go-history"]').click();

    const options = [...document.querySelectorAll('#history-client option')];
    const selected = options.find((option) => option.selected);
    expect(selected).toBeTruthy();
    expect(selected.value).toBeTruthy();
    expect(selected.textContent).toBe('Bruno Díaz');
    expect(options.every((option) => option.value.trim() !== '' && option.textContent.trim() !== '')).toBe(true);

    const legacy = options.find((option) => option.textContent.includes('antiguo@example.com'));
    expect(legacy).toBeTruthy();
    expect(legacy.textContent).not.toMatch(/undefined|null|NaN/i);
    expect(document.body.textContent).not.toContain('undefined');
  });

  it('reveals the financial limit only after the Gerente General access code', async () => {
    localStorage.setItem('erp.role', 'sales');
    await completePurchase();
    document.querySelector('[data-action="go-history"]').click();
    expect(document.getElementById('history-credit-limit').textContent).toBe('•••••');

    changeValue(document.getElementById('role-select'), 'admin');
    expect(document.getElementById('admin-access').hidden).toBe(false);
    expect(document.getElementById('view-history').hidden).toBe(true);
    expect(document.getElementById('history-credit-limit').textContent).toBe('•••••');

    document.getElementById('admin-code').value = '1234';
    submitForm(document.getElementById('admin-access'));
    clickNav('history');
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
