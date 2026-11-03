// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountMarkup, completePurchase, clickNav, changeValue } from '../helpers/app-fixture.js';
import { formatCurrency } from '../../src/utils.js';

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
});

describe('order history view', () => {
  it('lists the new purchase for the buyer', async () => {
    await completePurchase();
    clickNav('history');
    expect(document.querySelectorAll('#history-list tr')).toHaveLength(1);
    const row = document.querySelector('#history-list tr');
    expect(row.textContent).toContain('Pedido');
    expect(row.textContent).toContain(formatCurrency(499990));
    expect(row.textContent).toMatch(/PED-\d{8}-\d{4}/);
    expect(document.getElementById('history-client').selectedOptions[0].textContent).toContain('Ana Pérez');
  });

  it('masks the credit limit for sales and reveals it for finance', async () => {
    await completePurchase();
    clickNav('history');
    expect(document.getElementById('history-credit-limit').textContent).toBe('•••••');

    changeValue(document.getElementById('role-select'), 'finance');
    expect(document.getElementById('history-credit-limit').textContent).toBe(formatCurrency(0));
    expect(localStorage.getItem('erp.role')).toBe('finance');
  });

  it('shows an empty state for a client without documents', async () => {
    await completePurchase();
    clickNav('history');
    const select = document.getElementById('history-client');
    const demoOption = [...select.options].find((option) => option.textContent.includes('Cliente Demo'));
    changeValue(select, demoOption.value);
    expect(document.querySelector('#history-list .empty-state')).not.toBeNull();
    expect(document.querySelector('#history-list').textContent).toMatch(/No hay documentos/i);
  });
});
