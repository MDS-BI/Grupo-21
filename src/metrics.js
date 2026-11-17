import { toNumber } from './utils.js';

function itemsOf(order) {
  return Array.isArray(order?.items) ? order.items : [];
}

function quantityOf(item) {
  return Math.max(0, toNumber(item?.quantity, 0));
}

function lineTotalOf(item) {
  const fallback = toNumber(item?.price, 0) * quantityOf(item);
  return Math.max(0, toNumber(item?.lineTotal, fallback));
}

export function computeProductMetrics(orders = [], products = []) {
  const byProduct = new Map();

  (products || []).forEach((product) => {
    byProduct.set(product.id, {
      productId: product.id,
      name: product.name || product.id,
      category: product.category || 'Sin categoría',
      unitsSold: 0,
      revenue: 0,
      orderCount: 0
    });
  });

  (orders || []).forEach((order) => {
    itemsOf(order).forEach((item) => {
      const entry = byProduct.get(item?.productId);
      if (!entry) return;
      entry.unitsSold += quantityOf(item);
      entry.revenue += lineTotalOf(item);
      entry.orderCount += 1;
    });
  });

  return [...byProduct.values()].sort(
    (a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue || a.name.localeCompare(b.name)
  );
}

export function getBestSeller(productMetrics = []) {
  return productMetrics.length ? productMetrics[0] : null;
}

export function getWorstSeller(productMetrics = []) {
  return productMetrics.length ? productMetrics[productMetrics.length - 1] : null;
}

export function computeCategoryMetrics(orders = [], products = []) {
  const byCategory = new Map();

  computeProductMetrics(orders, products).forEach((product) => {
    const entry = byCategory.get(product.category) || {
      category: product.category,
      unitsSold: 0,
      revenue: 0,
      productCount: 0
    };
    entry.unitsSold += product.unitsSold;
    entry.revenue += product.revenue;
    entry.productCount += 1;
    byCategory.set(product.category, entry);
  });

  return [...byCategory.values()].sort((a, b) => b.revenue - a.revenue);
}

export function computeMonthlyMetrics(orders = []) {
  const byMonth = new Map();

  (orders || []).forEach((order) => {
    const month = String(order?.date || '').slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(month)) return;

    const entry = byMonth.get(month) || { month, revenue: 0, orders: 0, unitsSold: 0 };
    entry.revenue += toNumber(order.total, 0);
    entry.orders += 1;
    entry.unitsSold += itemsOf(order).reduce((sum, item) => sum + quantityOf(item), 0);
    byMonth.set(month, entry);
  });

  return [...byMonth.values()].sort((a, b) => a.month.localeCompare(b.month));
}

export function computeSummary(orders = [], productMetrics = []) {
  const totalOrders = (orders || []).length;
  const totalRevenue = (orders || []).reduce((sum, order) => sum + toNumber(order?.total, 0), 0);
  const totalUnits = (productMetrics || []).reduce((sum, product) => sum + product.unitsSold, 0);

  return {
    totalRevenue,
    totalOrders,
    totalUnits,
    averageOrderValue: totalOrders ? totalRevenue / totalOrders : 0
  };
}

export function computeDashboardData(orders = [], products = []) {
  const productMetrics = computeProductMetrics(orders, products);
  return {
    productMetrics,
    bestSeller: getBestSeller(productMetrics),
    worstSeller: getWorstSeller(productMetrics),
    categoryMetrics: computeCategoryMetrics(orders, products),
    monthlyMetrics: computeMonthlyMetrics(orders),
    summary: computeSummary(orders, productMetrics)
  };
}
