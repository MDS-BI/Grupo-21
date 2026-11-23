// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountMarkup, startApp, clickNav, buyFromCatalog, changeValue } from '../helpers/app-fixture.js';
import { formatCurrency } from '../../src/utils.js';

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
});

async function openCartWithSteel() {
  await startApp();
  buyFromCatalog('prod-steel-zip-knit');
  clickNav('cart');
}

function applyCoupon(code) {
  changeValue(document.getElementById('coupon-code'), code);
  document.getElementById('apply-coupon').click();
}

describe('coupon flow', () => {
  it('applies a percentage coupon and updates discount and total', async () => {
    await openCartWithSteel();
    applyCoupon('bienvenido10');
    expect(document.getElementById('coupon-message').textContent).toContain('Cupón aplicado');
    expect(document.getElementById('cart-discount').textContent).toBe(formatCurrency(7019));
    expect(document.getElementById('cart-total').textContent).toBe(formatCurrency(63172));
    expect(JSON.parse(localStorage.getItem('erp.cart')).couponCode).toBe('BIENVENIDO10');
  });

  it('applies a fixed coupon', async () => {
    await openCartWithSteel();
    applyCoupon('AHORRA5000');
    expect(document.getElementById('cart-discount').textContent).toBe(formatCurrency(5000));
    expect(document.getElementById('cart-total').textContent).toBe(formatCurrency(65191));
  });

  it('rejects an unknown coupon without changing the total', async () => {
    await openCartWithSteel();
    applyCoupon('NOEXISTE');
    const message = document.getElementById('coupon-message');
    expect(message.className).toContain('notice--error');
    expect(message.textContent).toMatch(/no existe/i);
    expect(document.getElementById('cart-discount').textContent).toBe(formatCurrency(0));
    expect(document.getElementById('cart-total').textContent).toBe(formatCurrency(70191));
  });

  it('reports an expired coupon', async () => {
    await openCartWithSteel();
    applyCoupon('EXPIRADO');
    expect(document.getElementById('coupon-message').textContent).toMatch(/vencido/i);
    expect(document.getElementById('cart-discount').textContent).toBe(formatCurrency(0));
  });

  it('removes an applied coupon and restores the total', async () => {
    await openCartWithSteel();
    applyCoupon('BIENVENIDO10');
    expect(document.getElementById('remove-coupon')).not.toBeNull();
    document.getElementById('remove-coupon').click();
    expect(document.getElementById('cart-discount').textContent).toBe(formatCurrency(0));
    expect(document.getElementById('cart-total').textContent).toBe(formatCurrency(70191));
    expect(JSON.parse(localStorage.getItem('erp.cart')).couponCode).toBeNull();
  });
});
