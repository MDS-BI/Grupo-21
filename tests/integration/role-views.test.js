// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountMarkup, startApp, changeValue, submitForm } from '../helpers/app-fixture.js';

async function bootAs(role) {
  if (role) localStorage.setItem('erp.role', role);
  return startApp();
}

function unlockAdmin(code = '1234') {
  document.getElementById('admin-code').value = code;
  submitForm(document.getElementById('admin-access'));
}

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
});

describe('role-based views', () => {
  it('offers exactly the three visible roles with the updated labels', async () => {
    await bootAs('customer');
    expect([...document.getElementById('role-select').options].map((option) => [
      option.value, option.textContent
    ])).toEqual([
      ['customer', 'Cliente'],
      ['sales', 'Vendedor'],
      ['admin', 'Gerente General']
    ]);
  });

  it('keeps purchase views available and hides restricted views for a customer', async () => {
    const app = await bootAs('customer');
    expect(document.getElementById('manage-menu-toggle').hidden).toBe(true);
    expect(document.querySelector('#manage-menu [data-view="history"]').hidden).toBe(true);
    expect(document.querySelector('#manage-menu [data-view="admin"]').hidden).toBe(true);
    expect(document.querySelector('#manage-menu [data-view="metrics"]').hidden).toBe(true);
    expect(document.getElementById('view-catalog').hidden).toBe(false);
    expect(document.getElementById('role-logout').hidden).toBe(true);

    app.showView('history');
    expect(document.getElementById('role-denied').textContent).toMatch(/restringido|permisos/i);
    expect(document.getElementById('view-history').hidden).toBe(true);
    expect(document.getElementById('history-list')).toBeNull();
  });

  it('shows history and stock availability to sales staff but hides admin and metrics', async () => {
    await bootAs('sales');
    expect(document.getElementById('manage-menu-toggle').hidden).toBe(false);
    expect(document.querySelector('#manage-menu [data-view="history"]').hidden).toBe(false);
    expect(document.querySelector('#manage-menu [data-view="admin"]').hidden).toBe(true);
    expect(document.querySelector('#manage-menu [data-view="metrics"]').hidden).toBe(true);
    expect(document.querySelector('.product-card__stock')).not.toBeNull();
    expect(document.getElementById('role-logout').hidden).toBe(false);
  });

  it('shows the full management menu to the verified Gerente General', async () => {
    await bootAs('admin');
    expect(document.getElementById('admin-access').hidden).toBe(false);
    unlockAdmin();

    expect(document.getElementById('manage-menu-toggle').hidden).toBe(false);
    expect(document.querySelector('#manage-menu [data-view="history"]').hidden).toBe(false);
    expect(document.querySelector('#manage-menu [data-view="admin"]').hidden).toBe(false);
    expect(document.querySelector('#manage-menu [data-view="metrics"]').hidden).toBe(false);
    expect(document.getElementById('role-logout').hidden).toBe(false);
  });

  it('keeps the Gerente General panel locked until the access code is verified', async () => {
    await bootAs('admin');
    expect(document.getElementById('admin-access').hidden).toBe(false);
    expect(document.getElementById('admin-access-error').hidden).toBe(true);
    expect(document.getElementById('role-logout').hidden).toBe(true);
    expect(document.getElementById('manage-menu-toggle').hidden).toBe(true);
    expect(document.querySelector('#manage-menu [data-view="history"]').hidden).toBe(true);
    expect(document.querySelector('#manage-menu [data-view="admin"]').hidden).toBe(true);
    expect(document.querySelector('#manage-menu [data-view="metrics"]').hidden).toBe(true);
    expect(document.getElementById('view-admin').hidden).toBe(true);

    unlockAdmin('9999');
    expect(document.getElementById('admin-access-error').textContent).toMatch(/acceso denegado/i);
    expect(document.getElementById('view-admin').hidden).toBe(true);
    expect(document.getElementById('manage-menu-toggle').hidden).toBe(true);

    unlockAdmin();
    expect(document.getElementById('view-admin').hidden).toBe(false);
    expect(document.getElementById('admin-access').hidden).toBe(true);
    expect(document.getElementById('manage-menu-toggle').hidden).toBe(false);
  });

  it('blocks direct access to restricted views with a clear notice and a way back', async () => {
    const app = await bootAs('customer');
    app.showView('metrics');
    expect(document.getElementById('role-denied').textContent).toMatch(/restringido|permisos/i);
    expect(document.getElementById('role-denied-return').hidden).toBe(false);
    expect(document.getElementById('view-metrics').hidden).toBe(true);
    expect(document.getElementById('metrics-revenue')).toBeNull();

    document.getElementById('role-denied-return').click();
    expect(document.getElementById('view-catalog').hidden).toBe(false);
    expect(document.getElementById('role-denied').hidden).toBe(true);
  });

  it('returns to the public customer view when internal session is closed', async () => {
    await bootAs('admin');
    unlockAdmin();
    expect(document.getElementById('role-logout').hidden).toBe(false);
    document.getElementById('role-logout').click();

    expect(localStorage.getItem('erp.role')).toBe('customer');
    expect(document.getElementById('view-catalog').hidden).toBe(false);
    expect(document.getElementById('manage-menu-toggle').hidden).toBe(true);
    expect(document.getElementById('role-logout').hidden).toBe(true);
    expect(document.getElementById('admin-access').hidden).toBe(true);
  });

  it('rebuilds navigation immediately when the active role changes', async () => {
    await bootAs('customer');
    changeValue(document.getElementById('role-select'), 'admin');
    expect(document.getElementById('admin-access').hidden).toBe(false);
    expect(document.getElementById('manage-menu-toggle').hidden).toBe(true);
    unlockAdmin();
    expect(document.getElementById('manage-menu-toggle').hidden).toBe(false);
    expect(document.querySelector('#manage-menu [data-view="metrics"]').hidden).toBe(false);
    document.querySelector('#manage-menu [data-view="metrics"]').click();
    expect(document.getElementById('view-metrics').hidden).toBe(false);
  });

  it('keeps stock availability hidden for customer and visible for sales roles', async () => {
    await bootAs('sales');
    expect(document.querySelector('.product-card__stock')).not.toBeNull();
    changeValue(document.getElementById('role-select'), 'customer');
    expect(document.querySelector('.product-card__stock')).toBeNull();
  });
});
