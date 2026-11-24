// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  loadProducts, getProduct, addProduct, updateProduct, deleteProduct, decreaseStock,
  SEED_VERSION
} from '../../src/storage.js';
import { seedProducts } from '../../src/data/products.js';

beforeEach(() => {
  localStorage.clear();
});

describe('product storage', () => {
  it('seeds the catalog when storage is empty', () => {
    const products = loadProducts();
    expect(products).toHaveLength(8);
    expect(seedProducts).toHaveLength(8);
    expect(products.map((product) => product.id)).toContain('prod-steel-zip-knit');
    expect(products.map((product) => product.image)).toEqual(
      Array.from({ length: 8 }, (_, index) => `/images/producto-${index + 1}.jpg`)
    );
    expect(products.every((product) => product.image.startsWith('/images/producto-'))).toBe(true);
    expect(localStorage.getItem('erp.products')).not.toBeNull();
  });

  it('marks exactly four available RootSouth products as featured', () => {
    expect(seedProducts.filter((product) => product.featured)).toHaveLength(4);
    expect(loadProducts().filter((product) => product.featured).every((product) => product.stock > 0)).toBe(true);
  });

  it('does not duplicate the seed on repeated loads', () => {
    loadProducts();
    loadProducts();
    expect(loadProducts()).toHaveLength(seedProducts.length);
  });

  it('reseeds stale images and preserves custom images for the active schema', () => {
    const steel = seedProducts.find((product) => product.id === 'prod-steel-zip-knit');
    const black = seedProducts.find((product) => product.id === 'prod-black-zipper-layers');
    localStorage.setItem('erp.products', JSON.stringify([
      { ...steel, image: undefined },
      { ...black, image: '' },
      { id: 'custom-01', name: 'Gorra RootSouth', image: 'https://example.com/custom.jpg' }
    ]));

    const products = loadProducts();
    expect(products).toHaveLength(seedProducts.length);
    expect(products[0].image).toBe(steel.image);
    expect(products[2].image).toBe(black.image);
    expect(JSON.parse(localStorage.getItem('erp.products'))[0].image).toBe(steel.image);

    const custom = { id: 'custom-01', name: 'Gorra RootSouth', image: 'https://example.com/custom.jpg' };
    localStorage.setItem('erp.seedVersion', SEED_VERSION);
    localStorage.setItem('erp.products', JSON.stringify([custom]));
    expect(loadProducts()).toEqual([custom]);
    expect(getProduct('custom-01').image).toBe(custom.image);
  });

  it('refreshes stored seed products when the catalog version changes', () => {
    const seed = seedProducts.find((product) => product.id === 'prod-steel-zip-knit');
    localStorage.setItem('erp.seedVersion', 'tech-catalog-v1');
    localStorage.setItem('erp.products', JSON.stringify([
      { ...seed, name: 'Smartphone Nova X', category: 'Smartphones', image: 'https://old.example.jpg' }
    ]));

    const products = loadProducts();
    expect(products).toHaveLength(seedProducts.length);
    expect(products[0].name).toBe(seed.name);
    expect(products[0].category).toBe(seed.category);
    expect(products[0].image).toBe(seed.image);
    expect(localStorage.getItem('erp.seedVersion')).toBe(SEED_VERSION);
  });

  it('adds a product with normalized numeric fields', () => {
    const product = addProduct({ name: 'Gorra RootSouth', price: '89990', stock: '7', category: 'Accesorios' });
    expect(product.id).toBeTruthy();
    expect(product.price).toBe(89990);
    expect(product.stock).toBe(7);
    expect(getProduct(product.id).name).toBe('Gorra RootSouth');
  });

  it('updates and deletes products', () => {
    const product = addProduct({ name: 'Chaqueta RootSouth', price: 199990, stock: 4, category: 'Polerones' });
    const updated = updateProduct(product.id, { price: 179990, stock: 6 });
    expect(updated.price).toBe(179990);
    expect(getProduct(product.id).stock).toBe(6);
    expect(deleteProduct(product.id)).toBe(true);
    expect(getProduct(product.id)).toBeNull();
  });

  it('decreases stock only when enough units exist', () => {
    expect(decreaseStock('prod-steel-zip-knit', 2)).toBe(true);
    expect(getProduct('prod-steel-zip-knit').stock).toBe(10);
    expect(decreaseStock('prod-steel-zip-knit', 99)).toBe(false);
    expect(getProduct('prod-steel-zip-knit').stock).toBe(10);
    expect(decreaseStock('prod-bandanas', 1)).toBe(false);
    expect(decreaseStock('does-not-exist', 1)).toBe(false);
  });
});
