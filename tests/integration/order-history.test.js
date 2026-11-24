// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountMarkup, completePurchase, clickNav, changeValue } from '../helpers/app-fixture.js';
import { addClient } from '../../src/storage.js';
import { formatCurrency } from '../../src/utils.js';

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
});

describe('order history view', () => {
  it('lists the new purchase and the RootSouth seed documents', async () => {
    await completePurchase();
    clickNav('history');
    expect(document.querySelectorAll('#history-list tr')).toHaveLength(1);
    const row = document.querySelector('#history-list tr');
    expect(row.textContent).toContain('Pedido');
    expect(row.textContent).toContain(formatCurrency(70191));
    expect(row.textContent).toMatch(/PED-\d{8}-\d{4}/);
    const newOrder = JSON.parse(localStorage.getItem('erp.orders'))
      .find((entry) => entry.shipping?.email === 'ana@example.com');
    expect(document.getElementById('history-client').value).toBe(newOrder.clientId);

    const select = document.getElementById('history-client');
    const demoOption = [...select.options].find((option) => option.textContent.includes('Cliente Demo'));
    changeValue(select, demoOption.value);
    expect(document.querySelectorAll('#history-list tr')).toHaveLength(12);
    const history = document.getElementById('history-list').textContent;
    expect(history).toContain('Cotización');
    expect(history).toContain('Pedido');
    expect(history).toContain('Facturado');
    expect(history).toContain('Cancelado');
    expect(history).toContain(formatCurrency(68970));
    expect(history).toContain(formatCurrency(155980));
  });

  it('masks the credit limit for sales and reveals it only for the owner', async () => {
    await completePurchase();
    clickNav('history');
    expect(document.getElementById('history-credit-limit').textContent).toBe('•••••');

    changeValue(document.getElementById('role-select'), 'admin');
    expect(document.getElementById('history-credit-limit').textContent).toBe(formatCurrency(0));
    expect(localStorage.getItem('erp.role')).toBe('admin');
  });

  it('shows an empty state for a client without documents', async () => {
    await completePurchase();
    addClient({ name: 'Sin Documentos', code: 'SIN-1', email: 'sin@example.com' });
    clickNav('catalog');
    clickNav('history');

    const select = document.getElementById('history-client');
    const option = [...select.options].find((entry) => entry.textContent.includes('Sin Documentos'));
    changeValue(select, option.value);
    expect(document.querySelector('#history-list .empty-state')).not.toBeNull();
    expect(document.querySelector('#history-list').textContent).toMatch(/No hay documentos/i);
  });
});
