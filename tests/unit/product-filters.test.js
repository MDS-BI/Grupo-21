import { describe, expect, it } from 'vitest';
import { filterProducts, featuredProducts, productCategories, isAvailable } from '../../src/catalog.js';
import { seedProducts } from '../../src/data/products.js';

describe('catalog filters', () => {
  it('lists categories sorted alphabetically', () => {
    expect(productCategories(seedProducts)).toEqual([
      'Accesorios', 'Audio', 'Laptops', 'Smartphones', 'Tablets'
    ]);
  });

  it('returns only featured products', () => {
    const featured = featuredProducts(seedProducts);
    expect(featured).toHaveLength(3);
    expect(featured.every((product) => product.featured)).toBe(true);
  });

  it('filters by category', () => {
    const laptops = filterProducts(seedProducts, { category: 'Laptops' });
    expect(laptops).toHaveLength(2);
    expect(laptops.every((product) => product.category === 'Laptops')).toBe(true);
  });

  it('filters by maximum price', () => {
    const cheap = filterProducts(seedProducts, { category: 'all', maxPrice: '50000' });
    expect(cheap.map((product) => product.id).sort()).toEqual(['prod-accessory-01', 'prod-accessory-02']);
  });

  it('combines category and price filters', () => {
    expect(filterProducts(seedProducts, { category: 'Smartphones', maxPrice: '100000' })).toHaveLength(0);
    expect(filterProducts(seedProducts, { category: 'Smartphones', maxPrice: '600000' })).toHaveLength(1);
  });

  it('treats empty filters as no restriction', () => {
    expect(filterProducts(seedProducts, { category: 'all', maxPrice: '' })).toHaveLength(seedProducts.length);
    expect(filterProducts(seedProducts)).toHaveLength(seedProducts.length);
  });

  it('detects availability from stock', () => {
    expect(isAvailable({ stock: 1 })).toBe(true);
    expect(isAvailable({ stock: 0 })).toBe(false);
    expect(isAvailable({})).toBe(false);
  });
});
