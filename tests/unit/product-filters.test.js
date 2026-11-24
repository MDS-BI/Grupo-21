import { describe, expect, it } from 'vitest';
import { filterProducts, featuredProducts, productCategories, isAvailable } from '../../src/catalog.js';
import { seedProducts } from '../../src/data/products.js';

describe('catalog filters', () => {
  it('lists categories sorted alphabetically', () => {
    expect(productCategories(seedProducts)).toEqual([
      'Accesorios', 'Knit', 'Poleras', 'Polerones'
    ]);
  });

  it('returns only featured products', () => {
    const featured = featuredProducts(seedProducts);
    expect(featured).toHaveLength(4);
    expect(featured.every((product) => product.featured)).toBe(true);
    expect(featured.map((product) => product.id)).toEqual([
      'prod-steel-zip-knit',
      'prod-polera-coach-c',
      'prod-black-zipper-layers',
      'prod-jockey'
    ]);
  });

  it('filters by category', () => {
    const knit = filterProducts(seedProducts, { category: 'Knit' });
    expect(knit).toHaveLength(1);
    expect(knit[0].id).toBe('prod-steel-zip-knit');
    expect(knit.every((product) => product.category === 'Knit')).toBe(true);
  });

  it('filters by maximum price', () => {
    const cheap = filterProducts(seedProducts, { category: 'all', maxPrice: '50000' });
    expect(cheap.map((product) => product.id).sort()).toEqual([
      'prod-bandanas',
      'prod-jockey',
      'prod-llavero-rootsouth',
      'prod-polera-coach-c',
      'prod-tarjetero-rootsouth',
      'prod-vaso-matero'
    ]);
  });

  it('combines category and price filters', () => {
    expect(filterProducts(seedProducts, { category: 'Knit', maxPrice: '100' })).toHaveLength(0);
    expect(filterProducts(seedProducts, { category: 'Polerones', maxPrice: '900000' })).toHaveLength(1);
    expect(filterProducts(seedProducts, { category: 'Polerones', maxPrice: '900000' })[0].id)
      .toBe('prod-black-zipper-layers');
  });

  it('treats empty filters as no restriction', () => {
    expect(filterProducts(seedProducts, { category: 'all', maxPrice: '' })).toHaveLength(seedProducts.length);
    expect(filterProducts(seedProducts)).toHaveLength(seedProducts.length);
  });

  it('detects availability from stock', () => {
    expect(isAvailable(seedProducts.find((product) => product.id === 'prod-jockey'))).toBe(true);
    expect(isAvailable(seedProducts.find((product) => product.id === 'prod-bandanas'))).toBe(false);
    expect(isAvailable({})).toBe(false);
  });
});
