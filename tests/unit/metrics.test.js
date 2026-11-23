import { describe, expect, it } from 'vitest';
import { computeMetrics } from '../../src/metrics.js';

const products = [
  { id: 'p1', name: 'Producto 1', category: 'smartphone', stock: 0 },
  { id: 'p2', name: 'Producto 2', category: 'smartphone', stock: 2 },
  { id: 'p3', name: 'Producto 3', category: 'audio', stock: 20 }
];

const orders = [
  {
    status: 'Pedido',
    total: 100000,
    discount: 10000,
    couponCode: 'BIENVENIDO10',
    date: '2026-05-01T10:00:00.000Z',
    items: [
      { productId: 'p1', name: 'Producto 1', quantity: 1, lineTotal: 100000 },
      { productId: 'p2', name: 'Producto 2', quantity: 2, lineTotal: 20000, offerId: 'offer-1' }
    ]
  },
  {
    status: 'Facturado',
    total: 50000,
    discount: 0,
    couponCode: null,
    date: '2026-05-10T10:00:00.000Z',
    items: [{ productId: 'p2', name: 'Producto 2', quantity: 1, lineTotal: 50000 }]
  },
  { status: 'Cancelado', total: 99999, discount: 0, date: '2026-05-11T10:00:00.000Z', items: [] },
  { status: 'Cotización', total: 70000, discount: 0, date: '2026-05-12T10:00:00.000Z', items: [] }
];

describe('computeMetrics', () => {
  it('calculates revenue, completed sales and average ticket excluding cancelled orders', () => {
    const metrics = computeMetrics({ orders, products });
    expect(metrics.revenue).toBe(150000);
    expect(metrics.salesCount).toBe(2);
    expect(metrics.averageTicket).toBe(75000);
    expect(metrics.orderCount).toBe(4);
  });

  it('groups every document by status', () => {
    const metrics = computeMetrics({ orders, products });
    expect(metrics.statusCounts).toMatchObject({
      Cotización: 1,
      Pedido: 1,
      Facturado: 1,
      Cancelado: 1
    });
  });

  it('ranks products by revenue and units', () => {
    const metrics = computeMetrics({ orders, products });
    expect(metrics.topProducts[0]).toMatchObject({ productId: 'p1', units: 1, revenue: 100000 });
    expect(metrics.topProducts[1]).toMatchObject({ productId: 'p2', units: 3, revenue: 70000 });
    expect(metrics.topProducts.some((entry) => entry.productId === 'p3')).toBe(false);
  });

  it('reports products with critical or zero stock', () => {
    const metrics = computeMetrics({ orders, products });
    expect(metrics.lowStock.map((entry) => entry.productId)).toEqual(['p1', 'p2']);
    expect(metrics.lowStock[0].stock).toBe(0);
  });

  it('accumulates discounts, coupon uses and offer uses', () => {
    const metrics = computeMetrics({ orders, products, couponUsage: { BIENVENIDO10: 3 } });
    expect(metrics.discountTotal).toBe(10000);
    expect(metrics.couponUses).toEqual({ BIENVENIDO10: 3 });
    expect(metrics.couponUseTotal).toBe(3);
    expect(metrics.offerUses).toEqual({ 'offer-1': 1 });
  });

  it('returns zeros without dividing by zero when there are no orders', () => {
    const metrics = computeMetrics({ orders: [], products: [], couponUsage: {} });
    expect(metrics.revenue).toBe(0);
    expect(metrics.salesCount).toBe(0);
    expect(metrics.averageTicket).toBe(0);
    expect(metrics.hasData).toBe(false);
  });
});
