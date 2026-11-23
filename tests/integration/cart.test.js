// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountMarkup, startApp, clickNav, buyFromCatalog, changeValue } from '../helpers/app-fixture.js';
import { formatCurrency } from '../../src/utils.js';

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
});

async function openCartWithPhone() {
  await startApp();
  buyFromCatalog('prod-phone-01');
  clickNav('cart');
}

describe('cart view', () => {
  it('shows cart lines and a subtotal equal to the line total', async () => {
    await openCartWithPhone();
    expect(document.querySelectorAll('#cart-items .cart-line')).toHaveLength(1);
    expect(document.querySelector('#cart-items .cart-line__name').textContent).toContain('Smartphone Nova X');
    expect(document.getElementById('cart-subtotal').textContent).toBe(formatCurrency(499990));
    expect(document.getElementById('cart-total').textContent).toBe(formatCurrency(499990));
  });

  it('updates totals when quantity changes', async () => {
    await openCartWithPhone();
    changeValue(document.querySelector('.qty-input'), '2');
    expect(document.getElementById('cart-subtotal').textContent).toBe(formatCurrency(999980));
    expect(document.getElementById('cart-total').textContent).toBe(formatCurrency(999980));
    expect(document.getElementById('cart-count').textContent).toBe('2');
  });

  it('reports when quantity exceeds available stock', async () => {
    await openCartWithPhone();
    changeValue(document.querySelector('.qty-input'), '99');
    expect(document.getElementById('cart-subtotal').textContent).toBe(formatCurrency(499990));
    const message = document.getElementById('coupon-message');
    expect(message.hidden).toBe(false);
    expect(message.textContent).toMatch(/stock/i);
  });

  it('removes lines and shows the empty state', async () => {
    await openCartWithPhone();
    document.querySelector('[data-action="remove"]').click();
    expect(document.getElementById('cart-items')).toBeNull();
    expect(document.getElementById('cart-empty')).not.toBeNull();
    expect(document.getElementById('cart-subtotal').textContent).toBe(formatCurrency(0));
    expect(document.getElementById('cart-count').textContent).toBe('0');
  });

  it('blocks checkout when the cart is empty', async () => {
    await startApp();
    clickNav('cart');
    document.getElementById('go-checkout').click();
    expect(document.getElementById('view-cart').hidden).toBe(false);
    expect(document.getElementById('view-checkout').hidden).toBe(true);
    expect(document.getElementById('coupon-message').textContent).toMatch(/al menos un producto/i);
  });
});
