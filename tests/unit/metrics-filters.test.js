import { describe, expect, it } from 'vitest';
import { computeMetrics } from '../../src/metrics.js';

const products = [
  { id: 'phone', name: 'Teléfono', category: 'smartphone', stock: 30 },
  { id: 'tablet', name: 'Tablet', category: 'tablet', stock: 1 }
];

const orders = [
  {
    status: 'Pedido',
    total: 200000,
    date: '2026-04-05T12:00:00.000Z',
    items: [{ productId: 'phone', quantity: 1, lineTotal: 200000 }]
  },
  {
    status: 'Pedido',
    total: 300000,
    date: '2026-05-20T12:00:00.000Z',
    items: [{ productId: 'tablet', quantity: 2, lineTotal: 300000 }]
  }
];

describe('metrics filters', () => {
  it('filters orders by an inclusive date range', () => {
    const metrics = computeMetrics({
      orders,
      products,
      filters: { from: '2026-05-01', to: '2026-05-31' }
    });
    expect(metrics.revenue).toBe(300000);
    expect(metrics.salesCount).toBe(1);
    expect(metrics.orderCount).toBe(1);
  });

  it('filters orders by product category', () => {
    const metrics = computeMetrics({ orders, products, filters: { category: 'smartphone' } });
    expect(metrics.revenue).toBe(200000);
    expect(metrics.topProducts).toHaveLength(1);
    expect(metrics.topProducts[0].productId).toBe('phone');
  });

  it('combines category and date filters', () => {
    const metrics = computeMetrics({
      orders,
      products,
      filters: { from: '2026-05-01', to: '2026-05-31', category: 'tablet' }
    });
    expect(metrics.revenue).toBe(300000);
  });

  it('returns an informative empty result when no order matches', () => {
    const metrics = computeMetrics({ orders, products, filters: { category: 'audio' } });
    expect(metrics.revenue).toBe(0);
    expect(metrics.salesCount).toBe(0);
    expect(metrics.orderCount).toBe(0);
    expect(metrics.hasData).toBe(false);
    expect(metrics.topProducts).toEqual([]);
  });

  it('keeps stock alerts visible even when no sales match the filter', () => {
    const metrics = computeMetrics({ orders, products, filters: { category: 'audio' } });
    expect(metrics.lowStock.map((entry) => entry.productId)).toEqual(['tablet']);
  });

  it('ignores invalid dates instead of failing', () => {
    const metrics = computeMetrics({ orders, products, filters: { from: 'not-a-date', to: '' } });
    expect(metrics.orderCount).toBe(2);
  });
});
