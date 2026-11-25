// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountMarkup, startApp, clickNav, buyFromCatalog, changeValue } from '../helpers/app-fixture.js';
import { formatCurrency } from '../../src/utils.js';

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
});

async function openCartWithJacket() {
  await startApp();
  buyFromCatalog('prod-black-zipper-layers');
  clickNav('cart');
}

describe('cart view', () => {
  it('shows cart lines and a subtotal equal to the line total', async () => {
    await openCartWithJacket();
    expect(document.querySelectorAll('#cart-items .cart-line')).toHaveLength(1);
    expect(document.querySelector('#cart-items .cart-line__name').textContent).toContain('Black Zipper Layers');
    expect(document.getElementById('cart-subtotal').textContent).toBe(formatCurrency(67990));
    expect(document.getElementById('cart-total').textContent).toBe(formatCurrency(67990));
  });

  it('updates totals when quantity changes', async () => {
    await openCartWithJacket();
    changeValue(document.querySelector('.qty-input'), '2');
    expect(document.getElementById('cart-subtotal').textContent).toBe(formatCurrency(135980));
    expect(document.getElementById('cart-total').textContent).toBe(formatCurrency(135980));
    expect(document.getElementById('cart-count').textContent).toBe('2');
    expect(document.getElementById('cart-toggle').getAttribute('aria-label')).toMatch(/2/);
  });

  it('reports when quantity exceeds available stock', async () => {
    await openCartWithJacket();
    changeValue(document.querySelector('.qty-input'), '99');
    expect(document.getElementById('cart-subtotal').textContent).toBe(formatCurrency(67990));
    const message = document.getElementById('coupon-message');
    expect(message.hidden).toBe(false);
    expect(message.textContent).toMatch(/stock/i);
  });

  it('removes lines and shows the empty state', async () => {
    await openCartWithJacket();
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
