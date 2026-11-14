import { beforeEach, describe, expect, it } from 'vitest';
import {
  OFFER_TYPES, validateOffer, isOfferActive, offerPriceFor, resolveProductPrice
} from '../../src/offers.js';

const baseOffer = {
  productId: 'prod-phone-01',
  type: 'percent',
  value: 15,
  startDate: '2026-01-01',
  endDate: '2026-12-31',
  active: true
};

describe('offer validation', () => {
  it('accepts a valid percentage offer', () => {
    const result = validateOffer(baseOffer);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('accepts a valid fixed offer within the product price', () => {
    const result = validateOffer(
      { ...baseOffer, type: 'fixed', value: 50000 },
      { product: { id: 'prod-phone-01', price: 499990 } }
    );
    expect(result.valid).toBe(true);
  });

  it('exposes the supported offer types', () => {
    expect(OFFER_TYPES).toEqual(['percent', 'fixed']);
  });

  it('rejects a missing product', () => {
    const result = validateOffer({ ...baseOffer, productId: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.productId).toBeTruthy();
  });

  it('rejects an unknown offer type', () => {
    const result = validateOffer({ ...baseOffer, type: 'bogo' });
    expect(result.valid).toBe(false);
    expect(result.errors.type).toBeTruthy();
  });

  it('rejects non-positive and non-numeric values', () => {
    for (const value of [0, -5, '', 'abc', null]) {
      const result = validateOffer({ ...baseOffer, value });
      expect(result.valid).toBe(false);
      expect(result.errors.value).toBeTruthy();
    }
  });

  it('rejects a percentage above 100 %', () => {
    const result = validateOffer({ ...baseOffer, value: 120 });
    expect(result.valid).toBe(false);
    expect(result.errors.value).toMatch(/100/);
  });

  it('rejects a fixed discount greater than the product price', () => {
    const result = validateOffer(
      { ...baseOffer, type: 'fixed', value: 600000 },
      { product: { id: 'prod-phone-01', price: 499990 } }
    );
    expect(result.valid).toBe(false);
    expect(result.errors.value).toMatch(/precio/i);
  });

  it('rejects invalid dates and an end date before the start date', () => {
    expect(validateOffer({ ...baseOffer, startDate: '2026-13-01' }).errors.startDate).toBeTruthy();
    expect(validateOffer({ ...baseOffer, endDate: '' }).errors.endDate).toBeTruthy();

    const reversed = validateOffer({ ...baseOffer, startDate: '2026-06-10', endDate: '2026-06-01' });
    expect(reversed.valid).toBe(false);
    expect(reversed.errors.endDate).toMatch(/posterior/i);
  });
});

describe('offer activity and pricing', () => {
  const now = new Date('2026-06-15T12:00:00.000Z');

  it('considers active offers within their validity window', () => {
    expect(isOfferActive(baseOffer, now)).toBe(true);
    expect(isOfferActive({ ...baseOffer, active: false }, now)).toBe(false);
    expect(isOfferActive({ ...baseOffer, startDate: '2026-07-01' }, now)).toBe(false);
    expect(isOfferActive({ ...baseOffer, endDate: '2026-06-01' }, now)).toBe(false);
    expect(isOfferActive({ ...baseOffer, startDate: '2026-06-15', endDate: '2026-06-15' }, now)).toBe(true);
  });

  it('calculates percentage and fixed prices', () => {
    expect(offerPriceFor(100000, { type: 'percent', value: 25 })).toBe(75000);
    expect(offerPriceFor(100000, { type: 'fixed', value: 30000 })).toBe(70000);
    expect(offerPriceFor(100000, { type: 'fixed', value: 300000 })).toBe(0);
  });

  it('returns the original price when there is no active offer', () => {
    const product = { id: 'prod-phone-01', price: 499990 };
    const resolved = resolveProductPrice(product, [baseOffer], new Date('2020-01-01T00:00:00.000Z'));
    expect(resolved.price).toBe(499990);
    expect(resolved.discount).toBe(0);
    expect(resolved.offer).toBeNull();
  });

  it('ignores inactive or expired offers', () => {
    const product = { id: 'prod-phone-01', price: 499990 };
    const offers = [
      { ...baseOffer, id: 'inactive', active: false },
      { ...baseOffer, id: 'expired', endDate: '2025-12-31' }
    ];
    const resolved = resolveProductPrice(product, offers, now);
    expect(resolved.price).toBe(499990);
    expect(resolved.offer).toBeNull();
  });

  it('applies the best active offer when several are available', () => {
    const product = { id: 'prod-phone-01', price: 100000 };
    const offers = [
      { ...baseOffer, id: 'ten', value: 10 },
      { ...baseOffer, id: 'forty', type: 'fixed', value: 40000 }
    ];
    const resolved = resolveProductPrice(product, offers, now);
    expect(resolved.offer.id).toBe('forty');
    expect(resolved.price).toBe(60000);
    expect(resolved.originalPrice).toBe(100000);
    expect(resolved.discount).toBe(40000);
  });
});
