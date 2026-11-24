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
    expect(document.querySelector('#catalog-grid .product-group')).toBeNull();
    expect(document.querySelectorAll('#featured-grid .product-card')).toHaveLength(4);
    changeValue(document.getElementById('filter-category'), 'Knit');
    expect(cardIds()).toEqual(['prod-steel-zip-knit']);
    expect(document.getElementById('filter-category').value).toBe('Knit');
  });

  it('filters by maximum price', async () => {
    await startApp();
    changeValue(document.getElementById('filter-max-price'), '50000');
    expect(cardIds().sort()).toEqual([
      'prod-bandanas',
      'prod-jockey',
      'prod-llavero-rootsouth',
      'prod-polera-coach-c',
      'prod-tarjetero-rootsouth',
      'prod-vaso-matero'
    ]);
  });

  it('combines category and price filters', async () => {
    await startApp();
    changeValue(document.getElementById('filter-category'), 'Polerones');
    changeValue(document.getElementById('filter-max-price'), '900000');
    expect(cardIds()).toEqual(['prod-black-zipper-layers']);
  });

  it('shows an empty message when no product matches', async () => {
    await startApp();
    changeValue(document.getElementById('filter-category'), 'Knit');
    changeValue(document.getElementById('filter-max-price'), '100');
    expect(cardIds()).toHaveLength(0);
    const message = document.getElementById('catalog-message');
    expect(message.hidden).toBe(false);
    expect(message.textContent).toContain('No hay productos');
  });

  it('resets filters back to the full catalog', async () => {
    await startApp();
    changeValue(document.getElementById('filter-category'), 'Poleras');
    expect(cardIds()).toEqual(['prod-polera-coach-c']);
    document.getElementById('filter-reset').click();
    expect(cardIds()).toHaveLength(8);
    expect(document.getElementById('filter-category').value).toBe('all');
    expect(document.getElementById('catalog-message').hidden).toBe(true);
  });
});
