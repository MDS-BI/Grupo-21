// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  addToCart, updateCartItem, removeFromCart, clearCart, loadCart,
  getCartDetails, getCartCount, setCartCoupon, clearCartCoupon
} from '../../src/storage.js';

beforeEach(() => {
  localStorage.clear();
});

describe('cart storage', () => {
  it('adds products and computes totals', () => {
    addToCart('prod-phone-01', 1);
    const details = getCartDetails();
    expect(details.items).toHaveLength(1);
    expect(details.count).toBe(1);
    expect(details.subtotal).toBe(499990);
    expect(getCartCount()).toBe(1);
  });

  it('increments quantity when the same product is added twice', () => {
    addToCart('prod-phone-01');
    addToCart('prod-phone-01');
    expect(getCartDetails().items[0].quantity).toBe(2);
    expect(getCartDetails().subtotal).toBe(999980);
  });

  it('rejects products without stock or with insufficient stock', () => {
    expect(() => addToCart('prod-audio-01')).toThrow(/stock/i);
    addToCart('prod-laptop-02', 2);
    expect(() => addToCart('prod-laptop-02', 1)).toThrow(/stock/i);
    expect(() => addToCart('missing-product')).toThrow(/no encontrado/i);
  });

  it('updates quantities and removes lines when quantity reaches zero', () => {
    addToCart('prod-phone-01');
    updateCartItem('prod-phone-01', 3);
    expect(getCartDetails().items[0].quantity).toBe(3);
    updateCartItem('prod-phone-01', 0);
    expect(getCartDetails().items).toHaveLength(0);
  });

  it('prevents updating beyond available stock', () => {
    addToCart('prod-laptop-01');
    expect(() => updateCartItem('prod-laptop-01', 99)).toThrow(/stock/i);
  });

  it('removes and clears items', () => {
    addToCart('prod-phone-01');
    addToCart('prod-tablet-01');
    removeFromCart('prod-phone-01');
    expect(getCartDetails().items).toHaveLength(1);
    clearCart();
    expect(getCartDetails().items).toHaveLength(0);
    expect(loadCart()).toEqual({ items: [], couponCode: null });
  });

  it('stores and clears the applied coupon code', () => {
    setCartCoupon('bienvenido10');
    expect(loadCart().couponCode).toBe('BIENVENIDO10');
    clearCartCoupon();
    expect(loadCart().couponCode).toBeNull();
  });
});
