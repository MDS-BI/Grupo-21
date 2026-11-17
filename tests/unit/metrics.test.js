// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { buildSalesHistory } from '../../src/data/sales-history.js';
import { loadSalesHistory, KEYS, loadProducts } from '../../src/storage.js';
import {
  computeDashboardData,
  computeCategoryMetrics,
  computeMonthlyMetrics,
  computeProductMetrics,
  computeSummary,
  getBestSeller,
  getWorstSeller
} from '../../src/metrics.js';
import { metricsDashboard } from '../../src/components/metrics-dashboard.js';

beforeEach(() => {
  localStorage.clear();
});

describe('historial de ventas simulado', () => {
  it('genera pedidos facturados de forma determinista', () => {
    const first = buildSalesHistory();
    const second = buildSalesHistory();

    expect(first.length).toBeGreaterThan(0);
    expect(first).toEqual(second);
    expect(first.every((order) => order.status === 'Facturado' && order.items.length === 1)).toBe(true);
    expect(first.every((order) => order.total === order.subtotal && order.total > 0)).toBe(true);
    expect(new Set(first.map((order) => order.orderNumber)).size).toBe(first.length);
  });

  it('se guarda en su propia clave de localStorage', () => {
    const seeded = loadSalesHistory();
    expect(seeded).toHaveLength(buildSalesHistory().length);
    expect(JSON.parse(localStorage.getItem(KEYS.salesHistory))).toEqual(seeded);
    expect(JSON.parse(localStorage.getItem(KEYS.orders) || '[]')).toEqual([]);
  });
});

describe('métricas de ventas', () => {
  const products = [
    { id: 'a', name: 'Producto A', category: 'Tech', price: 100 },
    { id: 'b', name: 'Producto B', category: 'Tech', price: 50 },
    { id: 'c', name: 'Producto C', category: 'Hogar', price: 20 }
  ];
  const orders = [
    {
      date: '2026-05-03T10:00:00.000Z',
      total: 250,
      items: [
        { productId: 'a', quantity: 2, lineTotal: 200 },
        { productId: 'c', quantity: 1, lineTotal: 50 }
      ]
    },
    {
      date: '2026-06-07T10:00:00.000Z',
      total: 270,
      items: [
        { productId: 'b', quantity: 4, lineTotal: 200 },
        { productId: 'a', quantity: 1, lineTotal: 70 }
      ]
    },
    { date: 'sin-fecha', total: 10, items: [] }
  ];

  it('agrega unidades e ingresos por producto y los ordena por unidades', () => {
    const metrics = computeProductMetrics(orders, products);

    expect(metrics.map((entry) => entry.productId)).toEqual(['b', 'a', 'c']);
    expect(metrics[0]).toMatchObject({ unitsSold: 4, revenue: 200, orderCount: 1, category: 'Tech' });
    expect(metrics[1]).toMatchObject({ unitsSold: 3, revenue: 270, orderCount: 2 });
    expect(metrics[2]).toMatchObject({ unitsSold: 1, revenue: 50 });
  });

  it('identifica el producto más vendido y el menos vendido', () => {
    const metrics = computeProductMetrics(orders, products);
    expect(getBestSeller(metrics).productId).toBe('b');
    expect(getWorstSeller(metrics).productId).toBe('c');
    expect(getBestSeller([])).toBe(null);
    expect(getWorstSeller([])).toBe(null);
  });

  it('agrupa ingresos por categoría', () => {
    const metrics = computeCategoryMetrics(orders, products);
    expect(metrics[0]).toMatchObject({ category: 'Tech', unitsSold: 7, revenue: 470, productCount: 2 });
    expect(metrics[1]).toMatchObject({ category: 'Hogar', unitsSold: 1, revenue: 50, productCount: 1 });
  });

  it('agrupa ingresos por mes e ignora fechas inválidas', () => {
    const metrics = computeMonthlyMetrics(orders);
    expect(metrics).toEqual([
      { month: '2026-05', revenue: 250, orders: 1, unitsSold: 3 },
      { month: '2026-06', revenue: 270, orders: 1, unitsSold: 5 }
    ]);
  });

  it('calcula el resumen general', () => {
    const metrics = computeProductMetrics(orders, products);
    expect(computeSummary(orders, metrics)).toEqual({
      totalRevenue: 530,
      totalOrders: 3,
      totalUnits: 8,
      averageOrderValue: 530 / 3
    });
  });

  it('el historial simulado tiene un ganador claro y un último lugar claro', () => {
    const data = computeDashboardData(buildSalesHistory(), loadProducts());
    expect(data.bestSeller.productId).toBe('prod-phone-01');
    expect(data.bestSeller.unitsSold).toBe(156);
    expect(data.worstSeller.productId).toBe('prod-laptop-02');
    expect(data.worstSeller.unitsSold).toBe(4);
    expect(data.summary.totalUnits).toBe(581);
    expect(data.monthlyMetrics).toHaveLength(6);
  });
});

describe('dashboard de métricas', () => {
  it('muestra los rankings, los KPIs y los tres gráficos', () => {
    const html = metricsDashboard(computeDashboardData(buildSalesHistory(), loadProducts()));

    expect(html).toContain('Producto más vendido');
    expect(html).toContain('Producto menos vendido');
    expect(html).toContain('Smartphone Nova X');
    expect(html).toContain('Laptop Studio 16');
    expect(html).toContain('Unidades vendidas por producto');
    expect(html).toContain('Ingresos por categoría');
    expect(html).toContain('Ingresos por mes');
    expect(html).toContain('bar-chart__item--best');
    expect(html).toContain('bar-chart__item--worst');
    expect(html).toContain('column-chart__bar');
  });
});
