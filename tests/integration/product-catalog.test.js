// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountMarkup, startApp, clickNav, buyFromCatalog } from '../helpers/app-fixture.js';
import { formatCurrency } from '../../src/utils.js';

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
});

describe('product catalog view', () => {
  it('renders four featured and eight catalog products with images, names and prices', async () => {
    await startApp();
    expect(document.querySelectorAll('#featured-grid .product-card')).toHaveLength(4);
    expect(document.querySelector('#featured-grid').className).toContain('product-grid--featured');
    expect(document.querySelector('#catalog-grid').className).toContain('product-grid--catalog');

    const cards = [...document.querySelectorAll('#catalog-grid .product-card')];
    expect(cards).toHaveLength(8);
    expect(document.querySelectorAll('#catalog-grid [data-action="buy"]')).toHaveLength(8);
    expect(document.getElementById('view-catalog').hidden).toBe(false);

    const expected = new Map([
      ['prod-steel-zip-knit', ['Steel Zip Knit', '/images/producto-1.jpg', 70191]],
      ['prod-polera-coach-c', ['Polera Coach C - Gris Claro', '/images/producto-2.jpg', 20990]],
      ['prod-black-zipper-layers', ['Black Zipper Layers', '/images/producto-3.jpg', 67990]],
      ['prod-jockey', ['Jockey', '/images/producto-4.jpg', 16990]],
      ['prod-bandanas', ['Bandanas', '/images/producto-5.jpg', 2997]],
      ['prod-llavero-rootsouth', ['Llavero Rootsouth Original', '/images/producto-6.jpg', 5000]],
      ['prod-tarjetero-rootsouth', ['Tarjetero Rootsouth', '/images/producto-7.jpg', 9790]],
      ['prod-vaso-matero', ['Vaso Matero', '/images/producto-8.jpg', 9990]]
    ]);

    expect(cards.map((card) => card.dataset.productId).sort()).toEqual([...expected.keys()].sort());
    cards.forEach((card) => {
      const [name, image, price] = expected.get(card.dataset.productId);
      const img = card.querySelector('img.product-card__image');
      expect(img).not.toBeNull();
      expect(img.getAttribute('src')).toBe(image);
      expect(img.getAttribute('alt')).toBe(name);
      expect(card.querySelector('.product-card__name').textContent).toBe(name);
      expect(card.querySelector('.product-card__price').textContent).toContain(formatCurrency(price));
    });
    expect(document.querySelectorAll('#catalog-grid img[src^="/images/producto-"]')).toHaveLength(8);
  });

  it('marks sold-out products and disables their buy button', async () => {
    await startApp();
    const card = document.querySelector('#catalog-grid [data-product-id="prod-bandanas"]');
    expect(card.classList.contains('is-sold-out')).toBe(true);
    expect(card.querySelector('.badge--soldout').textContent).toContain('Agotado');
    expect(card.querySelector('[data-action="buy"]').disabled).toBe(true);
  });

  it('adds an available product to the cart and updates the badge', async () => {
    await startApp();
    buyFromCatalog('prod-steel-zip-knit');
    expect(document.getElementById('cart-count').textContent).toBe('1');
    expect(document.getElementById('catalog-feedback').hidden).toBe(false);
    expect(JSON.parse(localStorage.getItem('erp.cart')).items[0].productId).toBe('prod-steel-zip-knit');
  });

  it('does not add sold-out products to the cart', async () => {
    await startApp();
    const button = document.querySelector('#catalog-grid [data-product-id="prod-bandanas"] [data-action="buy"]');
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

  it('shows the Hero Banner and keeps a flat four-column layout', async () => {
    await startApp();
    const header = document.querySelector('#view-catalog .view-header');
    expect(header).not.toBeNull();
    expect(document.querySelector('#catalog-title').textContent).toBe('Catálogo de productos');
    expect(document.querySelector('.hero__eyebrow')).not.toBeNull();

    const css = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8');
    expect(css).toContain('/images/hero-banner.jpg');
    expect(css).toContain('rgba(0, 0, 0, 0.72)');
    expect(css).toContain('grid-template-columns: repeat(4, minmax(0, 1fr))');
    expect(css.lastIndexOf('#view-catalog .view-header')).toBeGreaterThan(css.indexOf('background-image: none !important'));
  });

  it('applies module branding and the Scuffers visual tokens', async () => {
    await startApp({ config: { moduleName: 'Tienda Acme', theme: { accentColor: '#0f62fe' } } });
    expect(document.getElementById('brand-name').textContent).toBe('Tienda Acme');
    expect(document.title).toBe('Tienda Acme');
    expect(document.documentElement.style.getPropertyValue('--accent')).toBe('#0f62fe');

    const css = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8').toLowerCase();
    expect(css).toContain('#ffffff');
    expect(css).toContain('#f4f4f4');
    expect(css).toContain('#111111');
    expect(css).toContain('aspect-ratio: 3 / 4');
    expect(css).toContain('border-radius: 0');
  });
});
