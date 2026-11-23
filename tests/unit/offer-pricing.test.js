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
    expect(offers).toHaveLength(3);
    expect(loadOffers()).toHaveLength(offers.length);

    const price = getProductPrice('prod-steel-zip-knit');
    expect(price.originalPrice).toBe(77990);
    expect(price.price).toBe(70191);
    expect(price.discount).toBe(7799);
    expect(price.offer.id).toBe('offer-steel-zip-10');
  });

  it('applies the offer price to cart lines and totals', () => {
    addToCart('prod-steel-zip-knit', 2);
    const details = getCartDetails();
    expect(details.items[0].price).toBe(70191);
    expect(details.items[0].originalPrice).toBe(77990);
    expect(details.items[0].hasOffer).toBe(true);
    expect(details.items[0].lineTotal).toBe(140382);
    expect(details.subtotal).toBe(140382);
  });

  it('restores the original price when the offer is deactivated', () => {
    const offer = loadOffers().find((entry) => entry.productId === 'prod-steel-zip-knit');
    addToCart('prod-steel-zip-knit', 2);
    expect(getCartDetails().subtotal).toBe(140382);

    setOfferActive(offer.id, false);
    expect(getCartDetails().subtotal).toBe(155980);
    expect(getCartDetails().items[0].hasOffer).toBe(false);
  });

  it('recalculates cart totals after a product price update', () => {
    addToCart('prod-black-zipper-layers');
    expect(getCartDetails().subtotal).toBe(67990);

    updateProductPrice('prod-black-zipper-layers', 60000);
    expect(getProduct('prod-black-zipper-layers').price).toBe(60000);
    expect(getCartDetails().subtotal).toBe(60000);
  });

  it('rejects invalid product prices and keeps the previous value', () => {
    expect(() => updateProductPrice('prod-black-zipper-layers', -1)).toThrow(/precio/i);
    expect(() => updateProductPrice('prod-black-zipper-layers', 'abc')).toThrow(/precio/i);
    expect(() => updateProductPrice('prod-black-zipper-layers', '')).toThrow(/precio/i);
    expect(getProduct('prod-black-zipper-layers').price).toBe(67990);
  });

  it('does not expose offers for products without an active promotion', () => {
    const price = getProductPrice('prod-black-zipper-layers');
    expect(price.offer).toBeNull();
    expect(price.price).toBe(price.originalPrice);
  });
});
