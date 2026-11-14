// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  addToCart, getCartDetails, getProduct, getProductPrice, loadOffers, setOfferActive,
  updateProductPrice
} from '../../src/storage.js';

beforeEach(() => {
  localStorage.clear();
});

describe('offer pricing in storage', () => {
  it('seeds offers once and exposes the effective product price', () => {
    const offers = loadOffers();
    expect(offers.length).toBeGreaterThan(0);
    expect(loadOffers()).toHaveLength(offers.length);

    const price = getProductPrice('prod-accessory-01');
    expect(price.originalPrice).toBe(29990);
    expect(price.price).toBe(26991);
    expect(price.discount).toBe(2999);
    expect(price.offer).toBeTruthy();
  });

  it('applies the offer price to cart lines and totals', () => {
    addToCart('prod-accessory-01', 2);
    const details = getCartDetails();
    expect(details.items[0].price).toBe(26991);
    expect(details.items[0].originalPrice).toBe(29990);
    expect(details.items[0].hasOffer).toBe(true);
    expect(details.items[0].lineTotal).toBe(53982);
    expect(details.subtotal).toBe(53982);
  });

  it('restores the original price when the offer is deactivated', () => {
    const offer = loadOffers().find((entry) => entry.productId === 'prod-accessory-01');
    addToCart('prod-accessory-01', 2);
    expect(getCartDetails().subtotal).toBe(53982);

    setOfferActive(offer.id, false);
    expect(getCartDetails().subtotal).toBe(59980);
    expect(getCartDetails().items[0].hasOffer).toBe(false);
  });

  it('recalculates cart totals after a product price update', () => {
    addToCart('prod-phone-01');
    expect(getCartDetails().subtotal).toBe(499990);

    updateProductPrice('prod-phone-01', 450000);
    expect(getProduct('prod-phone-01').price).toBe(450000);
    expect(getCartDetails().subtotal).toBe(450000);
  });

  it('rejects invalid product prices and keeps the previous value', () => {
    expect(() => updateProductPrice('prod-phone-01', -1)).toThrow(/precio/i);
    expect(() => updateProductPrice('prod-phone-01', 'abc')).toThrow(/precio/i);
    expect(() => updateProductPrice('prod-phone-01', '')).toThrow(/precio/i);
    expect(getProduct('prod-phone-01').price).toBe(499990);
  });

  it('does not expose offers for products without an active promotion', () => {
    const price = getProductPrice('prod-phone-01');
    expect(price.offer).toBeNull();
    expect(price.price).toBe(price.originalPrice);
  });
});
