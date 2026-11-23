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
    addToCart('prod-black-zipper-layers', 1);
    const details = getCartDetails();
    expect(details.items).toHaveLength(1);
    expect(details.items[0].name).toBe('Black Zipper Layers');
    expect(details.count).toBe(1);
    expect(details.subtotal).toBe(67990);
    expect(getCartCount()).toBe(1);
  });

  it('increments quantity when the same product is added twice', () => {
    addToCart('prod-black-zipper-layers');
    addToCart('prod-black-zipper-layers');
    expect(getCartDetails().items[0].quantity).toBe(2);
    expect(getCartDetails().subtotal).toBe(135980);
  });

  it('rejects products without stock or with insufficient stock', () => {
    expect(() => addToCart('prod-bandanas')).toThrow(/stock/i);
    addToCart('prod-steel-zip-knit', 12);
    expect(() => addToCart('prod-steel-zip-knit', 1)).toThrow(/stock/i);
    expect(() => addToCart('missing-product')).toThrow(/no encontrado/i);
  });

  it('updates quantities and removes lines when quantity reaches zero', () => {
    addToCart('prod-black-zipper-layers');
    updateCartItem('prod-black-zipper-layers', 3);
    expect(getCartDetails().items[0].quantity).toBe(3);
    updateCartItem('prod-black-zipper-layers', 0);
    expect(getCartDetails().items).toHaveLength(0);
  });

  it('prevents updating beyond available stock', () => {
    addToCart('prod-steel-zip-knit');
    expect(() => updateCartItem('prod-steel-zip-knit', 99)).toThrow(/stock/i);
  });

  it('removes and clears items', () => {
    addToCart('prod-black-zipper-layers');
    addToCart('prod-jockey');
    removeFromCart('prod-black-zipper-layers');
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
