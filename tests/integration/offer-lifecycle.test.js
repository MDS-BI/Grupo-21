// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mountMarkup, startApp, clickNav, buyFromCatalog, submitForm
} from '../helpers/app-fixture.js';
import { formatCurrency } from '../../src/utils.js';

function storedOffers() {
  return JSON.parse(localStorage.getItem('erp.offers') || '[]');
}

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
});

describe('offer lifecycle end to end', () => {
  it('goes from admin offer creation to catalog discount, cart price and rollback', async () => {
    localStorage.setItem('erp.role', 'admin');
    await startApp();

    clickNav('admin');
    document.getElementById('offer-product').value = 'prod-phone-01';
    document.getElementById('offer-type').value = 'percent';
    document.getElementById('offer-value').value = '20';
    document.getElementById('offer-start').value = '2026-01-01';
    document.getElementById('offer-end').value = '2099-12-31';
    submitForm(document.getElementById('offer-form'));

    const offer = storedOffers().find((entry) => entry.productId === 'prod-phone-01');
    expect(offer).toBeTruthy();

    clickNav('catalog');
    const card = document.querySelector('#catalog-grid [data-product-id="prod-phone-01"]');
    expect(card.querySelector('.price--offer').textContent).toContain(formatCurrency(399992));
    expect(card.querySelector('.price--original').textContent).toContain(formatCurrency(499990));
    expect(card.querySelector('.badge--offer')).not.toBeNull();

    buyFromCatalog('prod-phone-01');
    clickNav('cart');
    expect(document.getElementById('cart-subtotal').textContent).toBe(formatCurrency(399992));
    expect(document.getElementById('cart-total').textContent).toBe(formatCurrency(399992));
    expect(document.querySelector('#cart-items .cart-line__total').textContent).toBe(formatCurrency(399992));

    clickNav('admin');
    document.querySelector(`[data-offer-id="${offer.id}"] [data-action="toggle-offer"]`).click();
    expect(storedOffers().find((entry) => entry.id === offer.id).active).toBe(false);

    clickNav('catalog');
    const restored = document.querySelector('#catalog-grid [data-product-id="prod-phone-01"]');
    expect(restored.querySelector('.price--offer')).toBeNull();
    expect(restored.querySelector('.product-card__price').textContent).toContain(formatCurrency(499990));

    clickNav('cart');
    expect(document.getElementById('cart-subtotal').textContent).toBe(formatCurrency(499990));
    expect(document.getElementById('cart-total').textContent).toBe(formatCurrency(499990));
  });
});
