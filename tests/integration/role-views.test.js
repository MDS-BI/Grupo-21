// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountMarkup, startApp, clickNav, changeValue } from '../helpers/app-fixture.js';

async function bootAs(role) {
  if (role) localStorage.setItem('erp.role', role);
  return startApp();
}

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
});

describe('role-based views', () => {
  it('shows purchase and history views to a customer', async () => {
    await bootAs('customer');
    expect(document.querySelector('[data-view="history"]').hidden).toBe(false);
    expect(document.querySelector('[data-view="admin"]').hidden).toBe(true);
    expect(document.querySelector('[data-view="metrics"]').hidden).toBe(true);
    expect(document.getElementById('view-catalog').hidden).toBe(false);
    expect(document.getElementById('role-logout').hidden).toBe(true);

    clickNav('history');
    expect(document.querySelectorAll('#history-list tr')).toHaveLength(4);
  });

  it('shows history and stock availability to sales staff but hides admin and metrics', async () => {
    await bootAs('sales');
    expect(document.querySelector('[data-view="history"]').hidden).toBe(false);
    expect(document.querySelector('[data-view="admin"]').hidden).toBe(true);
    expect(document.querySelector('[data-view="metrics"]').hidden).toBe(true);
    expect(document.querySelector('.product-card__stock')).not.toBeNull();
    expect(document.getElementById('role-logout').hidden).toBe(false);
  });

  it('shows the full navigation to the owner', async () => {
    await bootAs('admin');
    expect(document.querySelector('[data-view="history"]').hidden).toBe(false);
    expect(document.querySelector('[data-view="admin"]').hidden).toBe(false);
    expect(document.querySelector('[data-view="metrics"]').hidden).toBe(false);
  });

  it('blocks direct access to a restricted view with a clear notice and a way back', async () => {
    await bootAs('customer');
    clickNav('metrics');
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
    document.getElementById('role-logout').click();

    expect(localStorage.getItem('erp.role')).toBe('customer');
    expect(document.getElementById('view-catalog').hidden).toBe(false);
    expect(document.querySelector('[data-view="metrics"]').hidden).toBe(true);
    expect(document.querySelector('[data-view="admin"]').hidden).toBe(true);
    expect(document.getElementById('role-logout').hidden).toBe(true);
  });

  it('rebuilds navigation immediately when the active role changes', async () => {
    await bootAs('customer');
    changeValue(document.getElementById('role-select'), 'admin');
    expect(document.querySelector('[data-view="metrics"]').hidden).toBe(false);
    clickNav('metrics');
    expect(document.getElementById('view-metrics').hidden).toBe(false);
  });

  it('keeps stock availability hidden for customer and visible for sales roles', async () => {
    await bootAs('sales');
    expect(document.querySelector('.product-card__stock')).not.toBeNull();
    changeValue(document.getElementById('role-select'), 'customer');
    expect(document.querySelector('.product-card__stock')).toBeNull();
  });
});
