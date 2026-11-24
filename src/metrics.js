import { normalizeText, toNumber } from './utils.js';

export const LOW_STOCK_THRESHOLD = 5;

const COMPLETED_STATUSES = new Set(['Pedido', 'Facturado']);
const BASE_STATUSES = ['Cotización', 'Pedido', 'Facturado', 'Cancelado'];
const STATUS_TONES = {
  'Cotización': 'warning',
  'Pedido': 'info',
  'Facturado': 'success',
  'Cancelado': 'danger'
};

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return !Number.isNaN(Date.parse(`${value}T00:00:00`));
}

function orderDate(order) {
  const value = String(order?.date || '').slice(0, 10);
  return isValidDate(value) ? value : '';
}

function matchesFilters(order, filters, productsById) {
  const date = orderDate(order);
  if (filters.from && date && date < filters.from) return false;
  if (filters.to && date && date > filters.to) return false;
  if (!filters.category) return true;
  const wanted = normalizeText(filters.category);
  return (Array.isArray(order?.items) ? order.items : []).some((item) => {
    const product = productsById.get(item?.productId);
    return product && normalizeText(product.category) === wanted;
  });
}

function orderTotal(order) {
  const direct = toNumber(order?.total, NaN);
  if (Number.isFinite(direct)) return Math.max(0, direct);
  return (Array.isArray(order?.items) ? order.items : [])
    .reduce((sum, item) => sum + toNumber(item?.lineTotal, 0), 0);
}

function increment(map, key, amount = 1) {
  if (!key) return;
  map[key] = (map[key] || 0) + amount;
}

function percentage(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

export function computeMetrics({ orders = [], products = [], offers = [], couponUsage = {}, filters = {} } = {}) {
  const productsById = new Map((Array.isArray(products) ? products : []).map((product) => [product?.id, product]));
  const offersById = new Map((Array.isArray(offers) ? offers : []).map((offer) => [offer?.id, offer]));
  const normalizedFilters = {
    from: isValidDate(filters.from) ? filters.from : '',
    to: isValidDate(filters.to) ? filters.to : '',
    category: normalizeText(filters.category)
  };

  const allOrders = Array.isArray(orders) ? orders : [];
  const filteredOrders = allOrders.filter((order) => matchesFilters(order, normalizedFilters, productsById));
  const completedOrders = filteredOrders.filter((order) => COMPLETED_STATUSES.has(order?.status));

  const statusCounts = {};
  [...BASE_STATUSES, ...allOrders.map((order) => order?.status).filter(Boolean)]
    .forEach((status) => {
      if (!statusCounts[status]) statusCounts[status] = 0;
    });
  filteredOrders.forEach((order) => {
    const status = order?.status || 'Pedido';
    statusCounts[status] = (statusCounts[status] || 0) + 1;
  });

  const revenue = completedOrders.reduce((sum, order) => sum + orderTotal(order), 0);
  const salesCount = completedOrders.length;
  const averageTicket = salesCount ? Math.round(revenue / salesCount) : 0;

  const rankings = new Map();
  const offerUses = {};
  let discountTotal = 0;
  completedOrders.forEach((order) => {
    discountTotal += toNumber(order?.discount, 0);
    (Array.isArray(order?.items) ? order.items : []).forEach((item) => {
      const productId = item?.productId;
      if (!productId) return;
      const product = productsById.get(productId);
      const entry = rankings.get(productId) || {
        productId,
        name: item?.name || product?.name || productId,
        category: product?.category || 'Otros',
        units: 0,
        revenue: 0
      };
      entry.units += toNumber(item?.quantity, 0);
      entry.revenue += toNumber(item?.lineTotal, 0);
      rankings.set(productId, entry);
      if (item?.offerId || item?.hasOffer) {
        const offerId = item.offerId
          || [...offersById.values()].find((offer) => offer?.productId === productId)?.id;
        if (offerId) increment(offerUses, offerId);
      }
    });
  });

  const ranked = [...rankings.values()]
    .sort((a, b) => b.revenue - a.revenue || b.units - a.units || a.name.localeCompare(b.name));
  const rankedRevenue = ranked.reduce((sum, product) => sum + product.revenue, 0);
  const maxRevenue = ranked[0]?.revenue || 0;
  const topProducts = ranked.map((product) => ({
    ...product,
    revenueShare: percentage(product.revenue, rankedRevenue),
    progressPercent: maxRevenue ? Math.round((product.revenue / maxRevenue) * 100) : 0
  }));

  const categoryTotals = new Map();
  topProducts.forEach((product) => {
    const category = product.category || 'Otros';
    const entry = categoryTotals.get(category) || { category, revenue: 0, units: 0 };
    entry.revenue += product.revenue;
    entry.units += product.units;
    categoryTotals.set(category, entry);
  });
  const revenueByCategory = [...categoryTotals.values()]
    .sort((a, b) => b.revenue - a.revenue || a.category.localeCompare(b.category, 'es'));

  const dateTotals = new Map();
  completedOrders.forEach((order) => {
    const date = orderDate(order) || 'sin-fecha';
    const entry = dateTotals.get(date) || { date, revenue: 0, salesCount: 0 };
    entry.revenue += orderTotal(order);
    entry.salesCount += 1;
    dateTotals.set(date, entry);
  });
  const salesByDate = [...dateTotals.values()]
    .sort((a, b) => a.date.localeCompare(b.date));

  const statusDistribution = [...BASE_STATUSES, ...Object.keys(statusCounts)]
    .filter((status, index, statuses) => status && statuses.indexOf(status) === index)
    .map((status) => ({
      status,
      count: toNumber(statusCounts[status], 0),
      percentage: percentage(toNumber(statusCounts[status], 0), filteredOrders.length),
      tone: STATUS_TONES[status] || 'neutral'
    }));

  const lowStock = (Array.isArray(products) ? products : [])
    .filter((product) => toNumber(product?.stock, 0) <= LOW_STOCK_THRESHOLD)
    .map((product) => ({
      productId: product.id,
      name: product.name || product.id,
      stock: toNumber(product.stock, 0)
    }))
    .sort((a, b) => a.stock - b.stock || a.name.localeCompare(b.name));

  const safeCouponUsage = couponUsage && typeof couponUsage === 'object' ? couponUsage : {};
  const couponUses = { ...safeCouponUsage };
  const couponUseTotal = Object.values(couponUses).reduce((sum, count) => sum + toNumber(count, 0), 0);

  return {
    revenue,
    salesCount,
    averageTicket,
    orderCount: filteredOrders.length,
    statusCounts,
    statusDistribution,
    revenueByCategory,
    salesByDate,
    topProducts,
    lowStock,
    discountTotal,
    couponUses,
    couponUseTotal,
    offerUses,
    hasData: filteredOrders.length > 0
  };
}
