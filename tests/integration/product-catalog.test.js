// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountMarkup, startApp, clickNav, buyFromCatalog } from '../helpers/app-fixture.js';

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
});

describe('product catalog view', () => {
  it('renders featured products and the full catalog on boot', async () => {
    await startApp();
    expect(document.querySelectorAll('#featured-grid .product-card')).toHaveLength(3);
    expect(document.querySelectorAll('#catalog-grid .product-card')).toHaveLength(8);
    expect(document.querySelectorAll('#catalog-grid [data-action="buy"]')).toHaveLength(8);
    expect(document.getElementById('view-catalog').hidden).toBe(false);
  });

  it('marks sold-out products and disables their buy button', async () => {
    await startApp();
    const card = document.querySelector('#catalog-grid [data-product-id="prod-audio-01"]');
    expect(card.classList.contains('is-sold-out')).toBe(true);
    expect(card.querySelector('.badge--soldout').textContent).toContain('Agotado');
    expect(card.querySelector('[data-action="buy"]').disabled).toBe(true);
  });

  it('adds an available product to the cart and updates the badge', async () => {
    await startApp();
    buyFromCatalog('prod-phone-01');
    expect(document.getElementById('cart-count').textContent).toBe('1');
    expect(document.getElementById('catalog-feedback').hidden).toBe(false);
    expect(JSON.parse(localStorage.getItem('erp.cart')).items[0].productId).toBe('prod-phone-01');
  });

  it('does not add sold-out products to the cart', async () => {
    await startApp();
    const button = document.querySelector('#catalog-grid [data-product-id="prod-audio-01"] [data-action="buy"]');
    button.click();
    expect(document.getElementById('cart-count').textContent).toBe('0');
  });

  it('navigates between views', async () => {
    await startApp();
    clickNav('cart');
    expect(document.getElementById('view-cart').hidden).toBe(false);
    expect(document.getElementById('view-catalog').hidden).toBe(true);
    clickNav('history');
    expect(document.getElementById('view-history').hidden).toBe(false);
    clickNav('catalog');
    expect(document.getElementById('view-catalog').hidden).toBe(false);
  });

  it('applies module branding from the configuration', async () => {
    await startApp({ config: { moduleName: 'Tienda Acme', theme: { accentColor: '#0f62fe' } } });
    expect(document.getElementById('brand-name').textContent).toBe('Tienda Acme');
    expect(document.title).toBe('Tienda Acme');
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('#0f62fe');
  });
});
