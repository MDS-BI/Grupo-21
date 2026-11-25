// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mountMarkup, startApp, clickNav, submitForm, changeValue, buyFromCatalog
} from '../helpers/app-fixture.js';
import { formatCurrency } from '../../src/utils.js';

async function openAdmin(code = '1234') {
  await startApp();
  changeValue(document.getElementById('role-select'), 'admin');
  document.getElementById('admin-code').value = code;
  submitForm(document.getElementById('admin-access'));
}

function fillOfferForm({ productId, type = 'percent', value, startDate = '2026-01-01', endDate = '2099-12-31' }) {
  document.getElementById('offer-product').value = productId;
  document.getElementById('offer-type').value = type;
  document.getElementById('offer-value').value = String(value);
  document.getElementById('offer-start').value = startDate;
  document.getElementById('offer-end').value = endDate;
}

function storedOffers() {
  return JSON.parse(localStorage.getItem('erp.offers') || '[]');
}

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
});

describe('admin panel access control', () => {
  it('asks for the access code in the profile panel and denies entry when it is wrong', async () => {
    await startApp();
    changeValue(document.getElementById('role-select'), 'admin');
    expect(document.getElementById('profile-panel').contains(document.getElementById('admin-access'))).toBe(true);
    expect(document.getElementById('admin-access').hidden).toBe(false);
    expect(document.getElementById('admin-access-error').hidden).toBe(true);
    expect(document.getElementById('role-logout').hidden).toBe(true);
    expect(document.getElementById('manage-menu-toggle').hidden).toBe(true);

    document.getElementById('admin-code').value = '9999';
    submitForm(document.getElementById('admin-access'));

    expect(document.getElementById('admin-access-error').textContent).toMatch(/acceso denegado/i);
    expect(document.getElementById('view-admin').hidden).toBe(true);
    expect(document.getElementById('offer-form')).toBeNull();
    expect(document.getElementById('role-logout').hidden).toBe(true);
    expect(document.getElementById('manage-menu-toggle').hidden).toBe(true);
  });

  it('shows the administration controls after entering the correct code', async () => {
    await openAdmin('1234');
    expect(document.querySelector('#role-select [value="admin"]').textContent).toBe('Gerente General');
    expect(document.getElementById('admin-access').hidden).toBe(true);
    expect(document.getElementById('role-logout').hidden).toBe(false);
    expect(document.getElementById('manage-menu-toggle').hidden).toBe(false);
    expect(document.getElementById('view-admin').hidden).toBe(false);
    expect(document.getElementById('admin-denied')).toBeNull();
    expect(document.getElementById('offer-form')).not.toBeNull();
    expect(document.getElementById('offers-list')).not.toBeNull();
    expect(document.getElementById('price-prod-jockey')).not.toBeNull();
  });

  it('denies the panel to roles without catalog permissions', async () => {
    await startApp();
    expect(document.querySelector('[data-view="admin"]').hidden).toBe(true);
    clickNav('admin');

    expect(document.getElementById('view-admin').hidden).toBe(true);
    expect(document.getElementById('offer-form')).toBeNull();
  });
});

describe('admin price management', () => {
  it('updates a product price and reflects it in the catalog', async () => {
    await openAdmin();
    document.getElementById('price-prod-jockey').value = '15000';
    document.querySelector('[data-action="save-price"][data-product-id="prod-jockey"]').click();

    const product = JSON.parse(localStorage.getItem('erp.products'))
      .find((entry) => entry.id === 'prod-jockey');
    expect(product.price).toBe(15000);

    clickNav('catalog');
    const card = document.querySelector('#catalog-grid [data-product-id="prod-jockey"]');
    expect(card.querySelector('.product-card__price').textContent).toContain(formatCurrency(15000));
  });

  it('rejects negative or non-numeric prices with a clear message', async () => {
    await openAdmin();
    const input = document.getElementById('price-prod-jockey');
    const save = document.querySelector('[data-action="save-price"][data-product-id="prod-jockey"]');

    input.value = '-10';
    save.click();
    expect(document.getElementById('admin-message').textContent).toMatch(/precio/i);

    input.value = 'abc';
    save.click();
    expect(document.getElementById('admin-message').textContent).toMatch(/precio/i);

    const product = JSON.parse(localStorage.getItem('erp.products'))
      .find((entry) => entry.id === 'prod-jockey');
    expect(product.price).toBe(16990);
  });
});

describe('admin offer management', () => {
  it('creates an offer and shows the discount in the catalog', async () => {
    await openAdmin();
    fillOfferForm({ productId: 'prod-jockey', value: 50 });
    submitForm(document.getElementById('offer-form'));

    const offer = storedOffers().find((entry) => entry.productId === 'prod-jockey');
    expect(offer).toBeTruthy();
    expect(offer.type).toBe('percent');
    expect(offer.value).toBe(50);

    clickNav('catalog');
    const card = document.querySelector('#catalog-grid [data-product-id="prod-jockey"]');
    expect(card.querySelector('.price--offer').textContent).toContain(formatCurrency(8495));
    expect(card.querySelector('.price--original').textContent).toContain(formatCurrency(16990));
    expect(card.querySelector('.badge--offer')).not.toBeNull();
  });

  it('rejects a discount over 100 % and an end date before the start date', async () => {
    await openAdmin();
    const before = storedOffers().length;

    fillOfferForm({ productId: 'prod-tarjetero-rootsouth', value: 150 });
    submitForm(document.getElementById('offer-form'));
    expect(storedOffers()).toHaveLength(before);
    expect(document.getElementById('admin-message').textContent).toMatch(/100/);

    fillOfferForm({
      productId: 'prod-tarjetero-rootsouth',
      value: 10,
      startDate: '2026-06-10',
      endDate: '2026-06-01'
    });
    submitForm(document.getElementById('offer-form'));
    expect(storedOffers()).toHaveLength(before);
    expect(document.getElementById('admin-message').textContent).toMatch(/posterior/i);
  });

  it('edits an offer and lets the admin deactivate it', async () => {
    await openAdmin();
    fillOfferForm({ productId: 'prod-jockey', value: 10 });
    submitForm(document.getElementById('offer-form'));

    const created = storedOffers().find((entry) => entry.productId === 'prod-jockey');
    document.querySelector(`[data-offer-id="${created.id}"] [data-action="edit-offer"]`).click();
    document.getElementById('offer-value').value = '20';
    submitForm(document.getElementById('offer-form'));

    const edited = storedOffers().find((entry) => entry.id === created.id);
    expect(edited.value).toBe(20);

    clickNav('catalog');
    const discounted = document.querySelector('#catalog-grid [data-product-id="prod-jockey"] .price--offer');
    expect(discounted.textContent).toContain(formatCurrency(13592));

    clickNav('admin');
    document.querySelector(`[data-offer-id="${created.id}"] [data-action="toggle-offer"]`).click();

    const deactivated = storedOffers().find((entry) => entry.id === created.id);
    expect(deactivated.active).toBe(false);

    clickNav('catalog');
    const card = document.querySelector('#catalog-grid [data-product-id="prod-jockey"]');
    expect(card.querySelector('.price--offer')).toBeNull();
    expect(card.querySelector('.product-card__price').textContent).toContain(formatCurrency(16990));
  });

  it('applies the offer in the cart and recalculates when deactivated', async () => {
    await openAdmin();
    fillOfferForm({ productId: 'prod-jockey', value: 50 });
    submitForm(document.getElementById('offer-form'));

    clickNav('catalog');
    buyFromCatalog('prod-jockey');
    clickNav('cart');
    expect(document.getElementById('cart-subtotal').textContent).toBe(formatCurrency(8495));

    const created = storedOffers().find((entry) => entry.productId === 'prod-jockey');
    clickNav('admin');
    document.querySelector(`[data-offer-id="${created.id}"] [data-action="toggle-offer"]`).click();
    clickNav('cart');
    expect(document.getElementById('cart-subtotal').textContent).toBe(formatCurrency(16990));
  });
});
