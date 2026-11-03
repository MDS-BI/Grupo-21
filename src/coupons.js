const COUPONS_KEY = 'erp.coupons';
const USAGE_KEY = 'erp.couponUsage';

const seedCoupons = [
  {
    code: 'BIENVENIDO10',
    type: 'percent',
    value: 10,
    active: true,
    expiresAt: '2027-12-31',
    usageLimit: 100
  },
  {
    code: 'AHORRA5000',
    type: 'fixed',
    value: 5000,
    active: true,
    expiresAt: '2027-12-31',
    usageLimit: 50
  },
  {
    code: 'EXPIRADO',
    type: 'percent',
    value: 20,
    active: true,
    expiresAt: '2020-01-01',
    usageLimit: 100
  },
  {
    code: 'AGOTADO',
    type: 'percent',
    value: 15,
    active: true,
    expiresAt: '2027-12-31',
    usageLimit: 0
  }
];

function read(key, fallback) {
  try {
    const raw = globalThis.localStorage?.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    // Almacenamiento no disponible.
  }
}

export function loadCoupons() {
  const stored = read(COUPONS_KEY, null);
  if (Array.isArray(stored)) return stored;
  const seeded = seedCoupons.map((coupon) => ({ ...coupon }));
  write(COUPONS_KEY, seeded);
  return seeded;
}

export function saveCoupons(coupons) {
  write(COUPONS_KEY, coupons || []);
}

export function loadCouponUsage() {
  const stored = read(USAGE_KEY, null);
  return stored && typeof stored === 'object' ? stored : {};
}

export function saveCouponUsage(usage) {
  write(USAGE_KEY, usage || {});
}

export function calculateDiscount(coupon, subtotal) {
  const amount = Number(subtotal) || 0;
  if (!coupon) return 0;
  if (coupon.type === 'fixed') {
    return Math.min(Number(coupon.value) || 0, amount);
  }
  return Math.round((amount * (Number(coupon.value) || 0)) / 100);
}

export function validateCoupon(code, { subtotal = 0, now = new Date() } = {}) {
  const normalized = String(code ?? '').trim().toUpperCase();
  if (!normalized) {
    return { valid: false, reason: 'Ingresa un código de cupón.' };
  }

  const coupon = loadCoupons().find((entry) => String(entry.code).toUpperCase() === normalized);
  if (!coupon) {
    return { valid: false, reason: 'El cupón no existe.' };
  }
  if (!coupon.active) {
    return { valid: false, reason: 'El cupón no está activo.' };
  }
  if (coupon.expiresAt && new Date(`${coupon.expiresAt}T23:59:59`) < now) {
    return { valid: false, reason: 'El cupón ha vencido.' };
  }

  const usage = loadCouponUsage()[coupon.code] || 0;
  if (coupon.usageLimit !== null && coupon.usageLimit !== undefined && usage >= coupon.usageLimit) {
    return { valid: false, reason: 'El cupón agotó su límite de uso.' };
  }

  return {
    valid: true,
    coupon,
    discount: calculateDiscount(coupon, subtotal),
    reason: ''
  };
}

export function recordCouponUse(code) {
  const normalized = String(code ?? '').trim().toUpperCase();
  if (!normalized) return;
  const usage = loadCouponUsage();
  const key = Object.keys(usage).find((entry) => entry.toUpperCase() === normalized) || normalized;
  usage[key] = (usage[key] || 0) + 1;
  saveCouponUsage(usage);
}

export function resetCouponsForTests() {
  write(COUPONS_KEY, null);
  write(USAGE_KEY, {});
}
