// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mountMarkup, startApp, clickNav, submitForm, buyFromCatalog
} from '../helpers/app-fixture.js';
import { formatCurrency } from '../../src/utils.js';

function stubPrompt(value) {
  vi.stubGlobal('prompt', vi.fn(() => value));
}

function stubAlert() {
  const alert = vi.fn();
  vi.stubGlobal('alert', alert);
  return alert;
}

async function openAdmin(code = '1234') {
  stubPrompt(code);
  await startApp();
  clickNav('admin');
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

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('admin panel access control', () => {
  it('prompts for the access code and denies entry when it is wrong', async () => {
    const alert = stubAlert();
    stubPrompt('9999');
    await startApp();

    clickNav('admin');

    expect(alert).toHaveBeenCalledWith('Acceso denegado');
    expect(document.getElementById('view-admin').hidden).toBe(true);
    expect(document.getElementById('offer-form')).toBeNull();
  });

  it('shows the administration controls after entering the correct code', async () => {
    await openAdmin('1234');
    expect(document.getElementById('view-admin').hidden).toBe(false);
    expect(document.getElementById('admin-denied')).toBeNull();
    expect(document.getElementById('offer-form')).not.toBeNull();
    expect(document.getElementById('offers-list')).not.toBeNull();
    expect(document.getElementById('price-prod-phone-01')).not.toBeNull();
  });
});

describe('admin price management', () => {
  it('updates a product price and reflects it in the catalog', async () => {
    await openAdmin();
    document.getElementById('price-prod-phone-01').value = '450000';
    document.querySelector('[data-action="save-price"][data-product-id="prod-phone-01"]').click();

    const product = JSON.parse(localStorage.getItem('erp.products'))
      .find((entry) => entry.id === 'prod-phone-01');
    expect(product.price).toBe(450000);

    clickNav('catalog');
    const card = document.querySelector('#catalog-grid [data-product-id="prod-phone-01"]');
    expect(card.querySelector('.product-card__price').textContent).toContain(formatCurrency(450000));
  });

  it('rejects negative or non-numeric prices with a clear message', async () => {
    await openAdmin();
    const input = document.getElementById('price-prod-phone-01');
    const save = document.querySelector('[data-action="save-price"][data-product-id="prod-phone-01"]');

    input.value = '-10';
    save.click();
    expect(document.getElementById('admin-message').textContent).toMatch(/precio/i);

    input.value = 'abc';
    save.click();
    expect(document.getElementById('admin-message').textContent).toMatch(/precio/i);

    const product = JSON.parse(localStorage.getItem('erp.products'))
      .find((entry) => entry.id === 'prod-phone-01');
    expect(product.price).toBe(499990);
  });
});

describe('admin offer management', () => {
  it('creates an offer and shows the discount in the catalog', async () => {
    await openAdmin();
    fillOfferForm({ productId: 'prod-accessory-02', value: 50 });
    submitForm(document.getElementById('offer-form'));

    const offer = storedOffers().find((entry) => entry.productId === 'prod-accessory-02');
    expect(offer).toBeTruthy();
    expect(offer.type).toBe('percent');
    expect(offer.value).toBe(50);

    clickNav('catalog');
    const card = document.querySelector('#catalog-grid [data-product-id="prod-accessory-02"]');
    expect(card.querySelector('.price--offer').textContent).toContain(formatCurrency(9995));
    expect(card.querySelector('.price--original').textContent).toContain(formatCurrency(19990));
    expect(card.querySelector('.badge--offer')).not.toBeNull();
  });

  it('rejects a discount over 100 % and an end date before the start date', async () => {
    await openAdmin();
    const before = storedOffers().length;

    fillOfferForm({ productId: 'prod-laptop-02', value: 150 });
    submitForm(document.getElementById('offer-form'));
    expect(storedOffers()).toHaveLength(before);
    expect(document.getElementById('admin-message').textContent).toMatch(/100/);

    fillOfferForm({
      productId: 'prod-laptop-02',
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
    fillOfferForm({ productId: 'prod-accessory-02', value: 10 });
    submitForm(document.getElementById('offer-form'));

    const created = storedOffers().find((entry) => entry.productId === 'prod-accessory-02');
    document.querySelector(`[data-offer-id="${created.id}"] [data-action="edit-offer"]`).click();
    document.getElementById('offer-value').value = '20';
    submitForm(document.getElementById('offer-form'));

    const edited = storedOffers().find((entry) => entry.id === created.id);
    expect(edited.value).toBe(20);

    clickNav('catalog');
    const discounted = document.querySelector('#catalog-grid [data-product-id="prod-accessory-02"] .price--offer');
    expect(discounted.textContent).toContain(formatCurrency(15992));

    clickNav('admin');
    document.querySelector(`[data-offer-id="${created.id}"] [data-action="toggle-offer"]`).click();

    const deactivated = storedOffers().find((entry) => entry.id === created.id);
    expect(deactivated.active).toBe(false);

    clickNav('catalog');
    const card = document.querySelector('#catalog-grid [data-product-id="prod-accessory-02"]');
    expect(card.querySelector('.price--offer')).toBeNull();
    expect(card.querySelector('.product-card__price').textContent).toContain(formatCurrency(19990));
  });

  it('applies the offer in the cart and recalculates when deactivated', async () => {
    await openAdmin();
    fillOfferForm({ productId: 'prod-accessory-02', value: 50 });
    submitForm(document.getElementById('offer-form'));

    clickNav('catalog');
    buyFromCatalog('prod-accessory-02');
    clickNav('cart');
    expect(document.getElementById('cart-subtotal').textContent).toBe(formatCurrency(9995));

    const created = storedOffers().find((entry) => entry.productId === 'prod-accessory-02');
    clickNav('admin');
    document.querySelector(`[data-offer-id="${created.id}"] [data-action="toggle-offer"]`).click();
    clickNav('cart');
    expect(document.getElementById('cart-subtotal').textContent).toBe(formatCurrency(19990));
  });
});
