// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  loadCoupons, validateCoupon, calculateDiscount, recordCouponUse, loadCouponUsage
} from '../../src/coupons.js';

beforeEach(() => {
  localStorage.clear();
});

describe('coupons', () => {
  it('seeds the available coupons', () => {
    const codes = loadCoupons().map((coupon) => coupon.code);
    expect(codes).toEqual(['BIENVENIDO10', 'AHORRA5000', 'EXPIRADO', 'AGOTADO']);
  });

  it('calculates percentage and fixed discounts', () => {
    expect(calculateDiscount({ type: 'percent', value: 10 }, 100000)).toBe(10000);
    expect(calculateDiscount({ type: 'fixed', value: 5000 }, 100000)).toBe(5000);
    expect(calculateDiscount({ type: 'fixed', value: 5000 }, 2000)).toBe(2000);
    expect(calculateDiscount(null, 100000)).toBe(0);
  });

  it('accepts a valid percentage coupon case-insensitively', () => {
    const result = validateCoupon('  bienvenido10 ', { subtotal: 500000 });
    expect(result.valid).toBe(true);
    expect(result.coupon.code).toBe('BIENVENIDO10');
    expect(result.discount).toBe(50000);
  });

  it('accepts a valid fixed coupon', () => {
    const result = validateCoupon('AHORRA5000', { subtotal: 60000 });
    expect(result.valid).toBe(true);
    expect(result.discount).toBe(5000);
  });

  it('rejects empty, unknown, expired and exhausted coupons', () => {
    expect(validateCoupon('', { subtotal: 1000 }).reason).toMatch(/ingresa/i);
    expect(validateCoupon('NOEXISTE', { subtotal: 1000 }).reason).toMatch(/no existe/i);
    expect(validateCoupon('EXPIRADO', { subtotal: 1000, now: new Date('2026-01-01') }).reason).toMatch(/vencido/i);
    expect(validateCoupon('AGOTADO', { subtotal: 1000 }).reason).toMatch(/límite/i);
  });

  it('tracks coupon usage and enforces the limit', () => {
    recordCouponUse('AGOTADO');
    expect(loadCouponUsage().AGOTADO).toBe(1);
    recordCouponUse('bienvenido10');
    expect(loadCouponUsage().BIENVENIDO10).toBe(1);
    expect(validateCoupon('BIENVENIDO10', { subtotal: 1000 }).valid).toBe(true);
  });
});
