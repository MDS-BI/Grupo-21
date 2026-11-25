// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountMarkup, startApp, changeValue } from '../helpers/app-fixture.js';

let scrollCalls = [];

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
  scrollCalls = [];
  Element.prototype.scrollIntoView = vi.fn(function scrollIntoViewStub(options) {
    scrollCalls.push({ id: this.id, options });
  });
});

afterEach(() => {
  delete Element.prototype.scrollIntoView;
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

  it('filters, closes and scrolls from every TIENDA dropdown option', async () => {
    const app = await startApp();
    const cases = [
      {
        view: 'featured',
        target: 'productos-destacados',
        filters: { category: 'all', maxPrice: '', featuredOnly: true },
        ids: ['prod-steel-zip-knit', 'prod-polera-coach-c', 'prod-black-zipper-layers', 'prod-jockey']
      },
      {
        view: 'all',
        target: 'productos',
        filters: { category: 'all', maxPrice: '', featuredOnly: false },
        ids: [
          'prod-steel-zip-knit',
          'prod-polera-coach-c',
          'prod-black-zipper-layers',
          'prod-jockey',
          'prod-bandanas',
          'prod-llavero-rootsouth',
          'prod-tarjetero-rootsouth',
          'prod-vaso-matero'
        ]
      },
      {
        view: 'Knit',
        target: 'productos',
        filters: { category: 'Knit', maxPrice: '', featuredOnly: false },
        ids: ['prod-steel-zip-knit']
      },
      {
        view: 'Poleras',
        target: 'productos',
        filters: { category: 'Poleras', maxPrice: '', featuredOnly: false },
        ids: ['prod-polera-coach-c']
      },
      {
        view: 'Polerones',
        target: 'productos',
        filters: { category: 'Polerones', maxPrice: '', featuredOnly: false },
        ids: ['prod-black-zipper-layers']
      },
      {
        view: 'Accesorios',
        target: 'productos',
        filters: { category: 'Accesorios', maxPrice: '', featuredOnly: false },
        ids: ['prod-jockey', 'prod-bandanas', 'prod-llavero-rootsouth', 'prod-tarjetero-rootsouth', 'prod-vaso-matero']
      }
    ];

    for (const entry of cases) {
      scrollCalls.length = 0;
      document.getElementById('shop-menu-toggle').click();
      expect(document.getElementById('shop-menu').hidden).toBe(false);

      document.querySelector(`[data-shop-view="${entry.view}"]`).click();

      expect(app.getAppState().filters).toEqual(entry.filters);
      expect(cardIds()).toEqual(entry.ids);
      expect(document.getElementById('view-catalog').hidden).toBe(false);
      expect(document.getElementById('shop-menu').hidden).toBe(true);
      expect(document.getElementById('shop-menu-toggle').getAttribute('aria-expanded')).toBe('false');
      expect(scrollCalls).toHaveLength(1);
      expect(scrollCalls[0].id).toBe(entry.target);
      expect(scrollCalls[0].options).toEqual({ behavior: 'smooth', block: 'start' });
    }
  });
});
