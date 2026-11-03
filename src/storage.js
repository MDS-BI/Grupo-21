import { seedProducts } from './data/products.js';
import { generateOrderNumber } from './checkout.js';
import { isValidEmail, normalizeText, toNumber } from './utils.js';

export const KEYS = {
  products: 'erp.products',
  clients: 'erp.clients',
  orders: 'erp.orders',
  cart: 'erp.cart',
  role: 'erp.role',
  coupons: 'erp.coupons',
  couponUsage: 'erp.couponUsage'
};

const seedClient = {
  id: 'client-demo',
  name: 'Cliente Demo',
  code: 'CLI-001',
  email: 'demo@ventas.cl',
  address: 'Av. Siempre Viva 123',
  city: 'Santiago',
  creditLimit: 2500000,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
};

function store() {
  return globalThis.localStorage;
}

function read(key, fallback) {
  try {
    const raw = store()?.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    store()?.setItem(key, JSON.stringify(value));
  } catch {
    // Almacenamiento no disponible (modo privado o cuota excedida).
  }
}

function now() {
  return new Date().toISOString();
}

function genId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function clearAll() {
  Object.values(KEYS).forEach((key) => {
    try {
      store()?.removeItem(key);
    } catch {
      // Ignorar.
    }
  });
}

/* ------------------------------- Productos ------------------------------- */

export function loadProducts() {
  const stored = read(KEYS.products, null);
  if (Array.isArray(stored)) return stored;
  const seeded = seedProducts.map((product) => ({ ...product, createdAt: now(), updatedAt: now() }));
  write(KEYS.products, seeded);
  return seeded;
}

export function saveProducts(products) {
  write(KEYS.products, products || []);
}

export function getProduct(id) {
  return loadProducts().find((product) => product.id === id) || null;
}

export function addProduct(data = {}) {
  const products = loadProducts();
  const product = {
    id: data.id || genId('prod'),
    name: String(data.name ?? '').trim(),
    description: String(data.description ?? '').trim(),
    price: toNumber(data.price, 0),
    stock: toNumber(data.stock, 0),
    category: String(data.category ?? '').trim(),
    featured: Boolean(data.featured),
    createdAt: now(),
    updatedAt: now()
  };
  products.push(product);
  saveProducts(products);
  return product;
}

export function updateProduct(id, updates = {}) {
  const products = loadProducts();
  const product = products.find((entry) => entry.id === id);
  if (!product) return null;
  Object.assign(product, updates, { updatedAt: now() });
  saveProducts(products);
  return product;
}

export function deleteProduct(id) {
  const products = loadProducts();
  const next = products.filter((product) => product.id !== id);
  saveProducts(next);
  return next.length !== products.length;
}

export function decreaseStock(id, quantity = 1) {
  const products = loadProducts();
  const product = products.find((entry) => entry.id === id);
  const amount = toNumber(quantity, 0);
  if (!product || amount <= 0 || toNumber(product.stock, 0) < amount) return false;
  product.stock = toNumber(product.stock, 0) - amount;
  product.updatedAt = now();
  saveProducts(products);
  return true;
}

/* -------------------------------- Clientes -------------------------------- */

export function validateClient(data = {}) {
  const errors = {};
  if (!String(data.name ?? '').trim()) errors.name = 'El nombre del cliente es obligatorio.';
  if (!String(data.code ?? '').trim()) errors.code = 'El código del cliente es obligatorio.';
  if (data.email && !isValidEmail(data.email)) errors.email = 'El correo electrónico no es válido.';
  if (data.creditLimit !== undefined && data.creditLimit !== '' && toNumber(data.creditLimit, -1) < 0) {
    errors.creditLimit = 'El límite de crédito debe ser un número no negativo.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function loadClients() {
  const stored = read(KEYS.clients, null);
  if (Array.isArray(stored)) return stored;
  const seeded = [{ ...seedClient }];
  write(KEYS.clients, seeded);
  return seeded;
}

export function saveClients(clients) {
  write(KEYS.clients, clients || []);
}

export function getClient(id) {
  return loadClients().find((client) => client.id === id) || null;
}

export function addClient(data = {}) {
  const clients = loadClients();
  const client = {
    id: data.id || genId('client'),
    name: String(data.name ?? '').trim(),
    code: String(data.code ?? `CLI-${String(clients.length + 1).padStart(3, '0')}`).trim(),
    email: String(data.email ?? '').trim(),
    address: String(data.address ?? '').trim(),
    city: String(data.city ?? '').trim(),
    phone: String(data.phone ?? '').trim(),
    creditLimit: toNumber(data.creditLimit, 0),
    createdAt: now(),
    updatedAt: now()
  };
  clients.push(client);
  saveClients(clients);
  return client;
}

export function updateClient(id, updates = {}) {
  const clients = loadClients();
  const client = clients.find((entry) => entry.id === id);
  if (!client) return null;
  Object.assign(client, updates, { updatedAt: now() });
  saveClients(clients);
  return client;
}

export function deleteClient(id) {
  const clients = loadClients();
  const next = clients.filter((client) => client.id !== id);
  saveClients(next);
  deleteOrdersForClient(id);
  return next.length !== clients.length;
}

export function findOrCreateClient({ name, email, address, city, phone } = {}) {
  const clients = loadClients();
  const normalizedEmail = normalizeText(email);
  const existing = clients.find((client) => normalizedEmail && normalizeText(client.email) === normalizedEmail);
  if (existing) return existing;
  return addClient({ name, email, address, city, phone });
}

/* -------------------------------- Pedidos -------------------------------- */

export function loadOrders() {
  const stored = read(KEYS.orders, null);
  return Array.isArray(stored) ? stored : [];
}

export function saveOrders(orders) {
  write(KEYS.orders, orders || []);
}

export function nextOrderNumber(date = new Date()) {
  return generateOrderNumber(date, loadOrders().length + 1);
}

export function addOrder(data = {}) {
  const orders = loadOrders();
  const order = {
    id: data.id || genId('ord'),
    orderNumber: data.orderNumber || nextOrderNumber(),
    clientId: data.clientId || null,
    documentType: data.documentType || 'Pedido',
    status: data.status || 'Pedido',
    items: Array.isArray(data.items) ? data.items : [],
    subtotal: toNumber(data.subtotal, 0),
    discount: toNumber(data.discount, 0),
    total: toNumber(data.total, 0),
    couponCode: data.couponCode || null,
    paymentMethod: data.paymentMethod || '',
    shipping: data.shipping || {},
    date: data.date || now(),
    createdAt: now(),
    updatedAt: now()
  };
  orders.push(order);
  saveOrders(orders);
  return order;
}

export function updateOrder(id, updates = {}) {
  const orders = loadOrders();
  const order = orders.find((entry) => entry.id === id);
  if (!order) return null;
  Object.assign(order, updates, { updatedAt: now() });
  saveOrders(orders);
  return order;
}

export function deleteOrder(id) {
  const orders = loadOrders();
  const next = orders.filter((order) => order.id !== id);
  saveOrders(next);
  return next.length !== orders.length;
}

export function deleteOrdersForClient(clientId) {
  const orders = loadOrders();
  const next = orders.filter((order) => order.clientId !== clientId);
  saveOrders(next);
  return next.length !== orders.length;
}

export function ordersForClient(clientId) {
  return loadOrders()
    .filter((order) => order.clientId === clientId)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

/* -------------------------------- Carrito -------------------------------- */

export function loadCart() {
  const stored = read(KEYS.cart, null);
  if (stored && Array.isArray(stored.items)) return { ...stored, couponCode: stored.couponCode || null };
  return { items: [], couponCode: null };
}

export function saveCart(cart) {
  write(KEYS.cart, cart || { items: [], couponCode: null });
}

export function addToCart(productId, quantity = 1) {
  const product = getProduct(productId);
  if (!product) throw new Error('Producto no encontrado.');
  const amount = Math.max(1, toNumber(quantity, 1));
  const cart = loadCart();
  const item = cart.items.find((entry) => entry.productId === productId);
  const current = item ? item.quantity : 0;
  const next = current + amount;
  if (next > toNumber(product.stock, 0)) {
    throw new Error(`No hay stock suficiente de ${product.name}.`);
  }
  if (item) {
    item.quantity = next;
  } else {
    cart.items.push({ productId, quantity: amount });
  }
  saveCart(cart);
  return cart;
}

export function updateCartItem(productId, quantity) {
  const product = getProduct(productId);
  const cart = loadCart();
  const item = cart.items.find((entry) => entry.productId === productId);
  if (!item) return cart;
  const next = toNumber(quantity, 0);
  if (next <= 0) {
    return removeFromCart(productId);
  }
  if (product && next > toNumber(product.stock, 0)) {
    throw new Error(`No hay stock suficiente de ${product.name}.`);
  }
  item.quantity = next;
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId) {
  const cart = loadCart();
  cart.items = cart.items.filter((entry) => entry.productId !== productId);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  write(KEYS.cart, { items: [], couponCode: null });
}

export function setCartCoupon(code) {
  const cart = loadCart();
  cart.couponCode = code ? String(code).trim().toUpperCase() : null;
  saveCart(cart);
  return cart;
}

export function clearCartCoupon() {
  return setCartCoupon(null);
}

export function getCartDetails() {
  const cart = loadCart();
  const products = loadProducts();
  const items = cart.items
    .map((entry) => {
      const product = products.find((candidate) => candidate.id === entry.productId);
      if (!product) return null;
      const quantity = Math.max(1, toNumber(entry.quantity, 1));
      return {
        productId: product.id,
        name: product.name,
        price: toNumber(product.price, 0),
        quantity,
        lineTotal: toNumber(product.price, 0) * quantity
      };
    })
    .filter(Boolean);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  return { items, subtotal, count, couponCode: cart.couponCode || null };
}

export function cartTotalWithDiscount(discount = 0) {
  const { subtotal } = getCartDetails();
  return Math.max(0, subtotal - toNumber(discount, 0));
}

export function getCartCount() {
  return getCartDetails().count;
}
