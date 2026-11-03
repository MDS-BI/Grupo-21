export const DEFAULT_CONFIG = {
  moduleName: 'Módulo de Ventas',
  labels: {
    catalog: 'Catálogo',
    featured: 'Productos destacados',
    products: 'Productos',
    cart: 'Carrito',
    checkout: 'Pago',
    history: 'Historial',
    buy: 'Comprar',
    soldOut: 'Agotado',
    addToCart: 'Agregar al carrito',
    applyCoupon: 'Aplicar',
    removeCoupon: 'Quitar cupón',
    continueToCheckout: 'Continuar al pago',
    confirmOrder: 'Confirmar pedido',
    emptyCart: 'Tu carrito está vacío.',
    emptyHistory: 'No hay documentos de venta para este cliente.'
  },
  customFields: [],
  statusLifecycle: {
    statuses: ['Cotización', 'Pedido', 'Facturado'],
    transitions: {
      'Cotización': ['Pedido'],
      'Pedido': ['Facturado'],
      'Facturado': []
    }
  },
  theme: {
    accentColor: '#1F7A3E'
  },
  roles: {
    sales: { label: 'Ventas', canViewFinancials: false },
    finance: { label: 'Finanzas', canViewFinancials: true }
  }
};

export const userConfig = {
  moduleName: 'Módulo de Ventas',
  theme: { accentColor: '#1F7A3E' }
};

const ROLES = Object.keys(DEFAULT_CONFIG.roles);
const ROLE_KEY = 'erp.role';

let activeConfig = null;

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function mergeConfig(base, override) {
  const result = { ...base };
  Object.entries(override || {}).forEach(([key, value]) => {
    if (isPlainObject(value) && isPlainObject(base[key])) {
      result[key] = mergeConfig(base[key], value);
    } else {
      result[key] = value;
    }
  });
  return result;
}

function isValidCssColor(value) {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  return /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed)
    || /^(rgb|rgba|hsl|hsla)\([^)]*\)$/i.test(trimmed)
    || /^[a-z]+$/i.test(trimmed);
}

export function normalizeConfig(config) {
  const merged = mergeConfig(DEFAULT_CONFIG, config || {});
  const errors = [];

  if (!String(merged.moduleName ?? '').trim()) {
    errors.push('moduleName es obligatorio.');
    merged.moduleName = DEFAULT_CONFIG.moduleName;
  }

  merged.labels = mergeConfig(DEFAULT_CONFIG.labels, merged.labels || {});

  const accent = merged.theme?.accentColor;
  if (!accent || !isValidCssColor(accent)) {
    if (accent) errors.push(`accentColor inválido: "${accent}".`);
    merged.theme = { ...merged.theme, accentColor: DEFAULT_CONFIG.theme.accentColor };
  }

  if (Array.isArray(merged.customFields)) {
    const baseKeys = new Set([
      'id', 'entity_id', 'name', 'code', 'taxId', 'email', 'phone', 'address',
      'category', 'description', 'creditLimit', 'paymentTerms', 'status', 'price', 'stock'
    ]);
    merged.customFields = merged.customFields.filter((field) => {
      if (!field || !field.key) {
        errors.push('Cada campo personalizado debe tener una clave.');
        return false;
      }
      if (baseKeys.has(field.key)) {
        errors.push(`La clave "${field.key}" choca con un campo base.`);
        return false;
      }
      return true;
    });
  }

  Object.defineProperty(merged, 'errors', {
    value: errors,
    enumerable: false,
    configurable: true
  });

  return merged;
}

export function loadModuleConfig(config) {
  const normalized = normalizeConfig(config);
  setActiveConfig(normalized);
  return normalized;
}

export function setActiveConfig(config) {
  activeConfig = config ? normalizeConfig(config) : null;
  return activeConfig;
}

export function getConfig() {
  return activeConfig || DEFAULT_CONFIG;
}

export function labelFor(key, fallback = '') {
  const labels = getConfig().labels || {};
  return labels[key] || fallback || key;
}

export function getRole() {
  try {
    const stored = globalThis.localStorage?.getItem(ROLE_KEY);
    return ROLES.includes(stored) ? stored : 'sales';
  } catch {
    return 'sales';
  }
}

export function setRole(role) {
  const next = ROLES.includes(role) ? role : 'sales';
  try {
    globalThis.localStorage?.setItem(ROLE_KEY, next);
  } catch {
    // Almacenamiento no disponible: se conserva el rol por defecto.
  }
  return next;
}

export function canViewFinancials(role = getRole()) {
  return Boolean(getConfig().roles?.[role]?.canViewFinancials);
}

export function maskCreditLimit(value, role = getRole()) {
  if (canViewFinancials(role)) return value;
  return '•••••';
}

export function applyTheme(config = getConfig(), doc = globalThis.document) {
  if (!doc?.documentElement) return;
  const accent = config?.theme?.accentColor || DEFAULT_CONFIG.theme.accentColor;
  doc.documentElement.style.setProperty('--accent', accent);
}
