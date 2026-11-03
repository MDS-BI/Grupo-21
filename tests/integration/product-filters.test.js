// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mountMarkup, startApp, changeValue } from '../helpers/app-fixture.js';

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
});

function cardIds() {
  return [...document.querySelectorAll('#catalog-grid .product-card')].map((card) => card.dataset.productId);
}

describe('catalog filters', () => {
  it('filters by category and keeps the selection visible', async () => {
    await startApp();
    changeValue(document.getElementById('filter-category'), 'Smartphones');
    expect(cardIds()).toEqual(['prod-phone-01']);
    expect(document.getElementById('filter-category').value).toBe('Smartphones');
  });

  it('filters by maximum price', async () => {
    await startApp();
    changeValue(document.getElementById('filter-max-price'), '50000');
    expect(cardIds().sort()).toEqual(['prod-accessory-01', 'prod-accessory-02']);
  });

  it('combines category and price filters', async () => {
    await startApp();
    changeValue(document.getElementById('filter-category'), 'Laptops');
    changeValue(document.getElementById('filter-max-price'), '900000');
    expect(cardIds()).toEqual(['prod-laptop-01']);
  });

  it('shows an empty message when no product matches', async () => {
    await startApp();
    changeValue(document.getElementById('filter-category'), 'Smartphones');
    changeValue(document.getElementById('filter-max-price'), '100');
    expect(cardIds()).toHaveLength(0);
    const message = document.getElementById('catalog-message');
    expect(message.hidden).toBe(false);
    expect(message.textContent).toContain('No hay productos');
  });

  it('resets filters back to the full catalog', async () => {
    await startApp();
    changeValue(document.getElementById('filter-category'), 'Audio');
    expect(cardIds().sort()).toEqual(['prod-audio-01', 'prod-audio-02']);
    document.getElementById('filter-reset').click();
    expect(cardIds()).toHaveLength(8);
    expect(document.getElementById('filter-category').value).toBe('all');
    expect(document.getElementById('catalog-message').hidden).toBe(true);
  });
});
