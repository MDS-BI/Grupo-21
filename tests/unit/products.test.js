// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  loadProducts, getProduct, addProduct, updateProduct, deleteProduct, decreaseStock
} from '../../src/storage.js';
import { seedProducts } from '../../src/data/products.js';

beforeEach(() => {
  localStorage.clear();
});

describe('product storage', () => {
  it('seeds the catalog when storage is empty', () => {
    const products = loadProducts();
    expect(products).toHaveLength(seedProducts.length);
    expect(products.map((product) => product.id)).toContain('prod-phone-01');
    expect(localStorage.getItem('erp.products')).not.toBeNull();
  });

  it('does not duplicate the seed on repeated loads', () => {
    loadProducts();
    loadProducts();
    expect(loadProducts()).toHaveLength(seedProducts.length);
  });

  it('adds a product with normalized numeric fields', () => {
    const product = addProduct({ name: 'Teclado Mecánico', price: '89990', stock: '7', category: 'Accesorios' });
    expect(product.id).toBeTruthy();
    expect(product.price).toBe(89990);
    expect(product.stock).toBe(7);
    expect(getProduct(product.id).name).toBe('Teclado Mecánico');
  });

  it('updates and deletes products', () => {
    const product = addProduct({ name: 'Monitor', price: 199990, stock: 4, category: 'Accesorios' });
    const updated = updateProduct(product.id, { price: 179990, stock: 6 });
    expect(updated.price).toBe(179990);
    expect(getProduct(product.id).stock).toBe(6);
    expect(deleteProduct(product.id)).toBe(true);
    expect(getProduct(product.id)).toBeNull();
  });

  it('decreases stock only when enough units exist', () => {
    expect(decreaseStock('prod-phone-01', 2)).toBe(true);
    expect(getProduct('prod-phone-01').stock).toBe(10);
    expect(decreaseStock('prod-phone-01', 99)).toBe(false);
    expect(getProduct('prod-phone-01').stock).toBe(10);
    expect(decreaseStock('prod-audio-01', 1)).toBe(false);
    expect(decreaseStock('does-not-exist', 1)).toBe(false);
  });
});
