import {
  loadProducts, loadClients, getCartDetails, addToCart, updateCartItem, removeFromCart,
  clearCart, setCartCoupon, clearCartCoupon, loadCart, decreaseStock, addOrder,
  findOrCreateClient, ordersForClient, getCartCount
} from './storage.js';
import { featuredProducts, filterProducts, productCategories } from './catalog.js';
import { validateCoupon, recordCouponUse } from './coupons.js';
import {
  normalizeConfig, setActiveConfig, getConfig, getRole, setRole, maskCreditLimit, applyTheme
} from './module-config.js';
import { validateCheckout } from './checkout.js';
import { processPayment } from './payments.js';
import { escapeHtml, formatCurrency, toNumber } from './utils.js';
import { productCatalog } from './components/product-catalog.js';
import { productFilters } from './components/product-filters.js';
import { cartView } from './components/cart.js';
import { couponForm } from './components/coupon-form.js';
import { checkoutForm } from './components/checkout-form.js';
import { orderConfirmation } from './components/order-confirmation.js';
import { orderHistory } from './components/order-history.js';

const state = {
  view: 'catalog',
  filters: { category: 'all', maxPrice: '' },
  couponMessage: null,
  checkoutValues: {},
  checkoutErrors: {},
  checkoutMessage: null,
  lastOrder: null,
  historyClientId: null,
  paymentBehavior: 'success'
};

function qs(id) {
  return globalThis.document?.getElementById(id) || null;
}

function viewElement(view) {
  return qs(`view-${view}`);
}

function setNotice(element, message) {
  if (!element) return;
  if (!message) {
    element.hidden = true;
    element.textContent = '';
    element.className = 'notice';
    return;
  }
  element.hidden = false;
  element.textContent = message.text;
  element.className = `notice notice--${message.type || 'info'}`;
}

export function showView(view) {
  state.view = view;
  globalThis.document?.querySelectorAll('.view').forEach((section) => {
    section.hidden = section.id !== `view-${view}`;
  });

  globalThis.document?.querySelectorAll('[data-view]').forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle('is-active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });

  if (view === 'catalog') renderCatalog();
  if (view === 'cart') renderCart();
  if (view === 'checkout') renderCheckout();
  if (view === 'confirmation') renderConfirmation();
  if (view === 'history') renderHistory();

  updateCartCount();
}

function updateCartCount() {
  const badge = qs('cart-count');
  if (badge) badge.textContent = String(getCartCount());
}

function currentCoupon(subtotal) {
  const cart = loadCart();
  if (!cart.couponCode) return { valid: false, code: null, discount: 0 };
  const result = validateCoupon(cart.couponCode, { subtotal });
  return {
    valid: result.valid,
    code: cart.couponCode,
    discount: result.valid ? result.discount : 0,
    reason: result.reason,
    coupon: result.coupon
  };
}

/* --------------------------------- Catálogo -------------------------------- */

function renderCatalog() {
  const products = loadProducts();
  const filtered = filterProducts(products, state.filters);
  const featured = featuredProducts(products);

  const filtersHost = qs('product-filters');
  if (filtersHost) {
    filtersHost.innerHTML = productFilters({
      categories: productCategories(products),
      category: state.filters.category,
      maxPrice: state.filters.maxPrice
    });
  }

  const catalogHost = qs('product-catalog');
  if (catalogHost) {
    catalogHost.innerHTML = productCatalog({ featured, products: filtered });
  }

  const message = qs('catalog-message');
  if (message) {
    if (filtered.length === 0) {
      message.hidden = false;
      message.textContent = 'No hay productos que coincidan con los filtros seleccionados.';
      message.className = 'notice notice--info';
    } else {
      message.hidden = true;
      message.textContent = '';
      message.className = 'notice';
    }
  }
}

function handleCatalogClick(event) {
  const button = event.target.closest('[data-action="buy"]');
  if (!button || button.disabled) return;
  const productId = button.dataset.productId;
  try {
    addToCart(productId, 1);
    updateCartCount();
    setNotice(qs('catalog-feedback'), { type: 'success', text: 'Producto agregado al carrito.' });
  } catch (error) {
    setNotice(qs('catalog-feedback'), { type: 'error', text: error.message });
  }
}

function handleFilterChange(event) {
  const target = event.target;
  if (target.id === 'filter-category') {
    state.filters.category = target.value;
    renderCatalog();
  }
  if (target.id === 'filter-max-price') {
    state.filters.maxPrice = target.value;
    renderCatalog();
  }
}

function handleFilterClick(event) {
  if (event.target.id !== 'filter-reset') return;
  state.filters = { category: 'all', maxPrice: '' };
  renderCatalog();
}

/* ---------------------------------- Carrito -------------------------------- */

function renderCart() {
  const details = getCartDetails();
  const coupon = currentCoupon(details.subtotal);
  const discount = coupon.valid ? coupon.discount : 0;
  const total = Math.max(0, details.subtotal - discount);

  const cartHost = qs('cart');
  if (cartHost) cartHost.innerHTML = cartView(details.items);

  const subtotalEl = qs('cart-subtotal');
  const discountEl = qs('cart-discount');
  const totalEl = qs('cart-total');
  if (subtotalEl) subtotalEl.textContent = formatCurrency(details.subtotal);
  if (discountEl) discountEl.textContent = formatCurrency(discount);
  if (totalEl) totalEl.textContent = formatCurrency(total);

  const couponHost = qs('coupon-area');
  if (couponHost) {
    couponHost.innerHTML = couponForm({
      code: coupon.code,
      message: state.couponMessage,
      applied: Boolean(coupon.code)
    });
  }

  updateCartCount();
}

function handleCartClick(event) {
  const removeButton = event.target.closest('[data-action="remove"]');
  if (removeButton) {
    removeFromCart(removeButton.dataset.productId);
    state.couponMessage = { type: 'info', text: 'Producto eliminado del carrito.' };
    renderCart();
    return;
  }

  if (event.target.id === 'apply-coupon') {
    const input = qs('coupon-code');
    const details = getCartDetails();
    const result = validateCoupon(input?.value, { subtotal: details.subtotal });
    if (result.valid) {
      setCartCoupon(result.coupon.code);
      state.couponMessage = { type: 'success', text: `Cupón aplicado: ${formatCurrency(result.discount)} de descuento.` };
    } else {
      state.couponMessage = { type: 'error', text: result.reason };
    }
    renderCart();
    return;
  }

  if (event.target.id === 'remove-coupon') {
    clearCartCoupon();
    state.couponMessage = { type: 'info', text: 'Cupón eliminado. El total volvió a su valor original.' };
    renderCart();
    return;
  }

  if (event.target.id === 'go-checkout') {
    if (getCartDetails().items.length === 0) {
      state.couponMessage = { type: 'error', text: 'Agrega al menos un producto antes de continuar.' };
      renderCart();
      return;
    }
    showView('checkout');
  }
}

function handleCartChange(event) {
  const target = event.target;
  if (target.dataset?.action !== 'quantity') return;
  try {
    updateCartItem(target.dataset.productId, toNumber(target.value, 1));
    state.couponMessage = null;
  } catch (error) {
    state.couponMessage = { type: 'error', text: error.message };
  }
  renderCart();
}

/* --------------------------------- Checkout -------------------------------- */

function renderCheckout() {
  const host = qs('checkout');
  if (!host) return;
  host.innerHTML = checkoutForm(state.checkoutValues, state.checkoutErrors);
  setNotice(qs('checkout-message'), state.checkoutMessage);
}

function readCheckoutData(form) {
  return {
    fullName: form.querySelector('#checkout-fullName')?.value ?? '',
    email: form.querySelector('#checkout-email')?.value ?? '',
    address: form.querySelector('#checkout-address')?.value ?? '',
    city: form.querySelector('#checkout-city')?.value ?? '',
    postalCode: form.querySelector('#checkout-postalCode')?.value ?? '',
    phone: form.querySelector('#checkout-phone')?.value ?? '',
    paymentMethod: form.querySelector('#checkout-paymentMethod')?.value ?? ''
  };
}

async function handleCheckoutSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const data = readCheckoutData(form);
  state.checkoutValues = data;

  const validation = validateCheckout(data);
  if (!validation.valid) {
    state.checkoutErrors = validation.errors;
    state.checkoutMessage = null;
    renderCheckout();
    return;
  }
  state.checkoutErrors = {};

  const details = getCartDetails();
  if (details.items.length === 0) {
    state.checkoutMessage = { type: 'error', text: 'Tu carrito está vacío.' };
    renderCheckout();
    return;
  }

  const products = loadProducts();
  const missingStock = details.items.find((item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return !product || toNumber(product.stock, 0) < item.quantity;
  });
  if (missingStock) {
    state.checkoutMessage = { type: 'error', text: `No hay stock suficiente de ${missingStock.name}.` };
    renderCheckout();
    return;
  }

  const coupon = currentCoupon(details.subtotal);
  const discount = coupon.valid ? coupon.discount : 0;
  const total = Math.max(0, details.subtotal - discount);

  setNotice(qs('checkout-message'), { type: 'info', text: 'Procesando pago…' });

  try {
    await processPayment({ amount: total, method: data.paymentMethod, behavior: state.paymentBehavior });
  } catch (error) {
    state.checkoutMessage = { type: 'error', text: error.message };
    renderCheckout();
    return;
  }

  const stockOk = details.items.every((item) => decreaseStock(item.productId, item.quantity));
  if (!stockOk) {
    state.checkoutMessage = { type: 'error', text: 'Un producto se quedó sin stock mientras confirmabas. Revisa el carrito.' };
    renderCheckout();
    return;
  }

  const client = findOrCreateClient({
    name: data.fullName,
    email: data.email,
    address: data.address,
    city: data.city,
    phone: data.phone
  });

  const order = addOrder({
    clientId: client.id,
    documentType: 'Pedido',
    status: 'Pedido',
    items: details.items,
    subtotal: details.subtotal,
    discount,
    total,
    couponCode: coupon.valid ? coupon.code : null,
    paymentMethod: data.paymentMethod,
    shipping: {
      fullName: data.fullName,
      email: data.email,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      phone: data.phone
    }
  });

  if (coupon.valid) recordCouponUse(coupon.code);

  clearCart();
  state.lastOrder = order;
  state.historyClientId = client.id;
  state.checkoutValues = {};
  state.checkoutErrors = {};
  state.checkoutMessage = null;
  state.couponMessage = null;
  showView('confirmation');
}

function renderConfirmation() {
  const host = qs('confirmation');
  if (!host) return;
  if (!state.lastOrder) {
    host.innerHTML = '<p class="empty-state">Todavía no hay un pedido confirmado.</p>';
    return;
  }
  host.innerHTML = orderConfirmation(state.lastOrder);
}

function handleConfirmationClick(event) {
  if (event.target.dataset?.action === 'go-catalog') showView('catalog');
  if (event.target.dataset?.action === 'go-history') showView('history');
}

/* --------------------------------- Historial ------------------------------- */

function renderHistory() {
  const host = qs('history');
  if (!host) return;
  const clients = loadClients();
  if (!state.historyClientId && clients.length) state.historyClientId = clients[0].id;
  if (state.historyClientId && !clients.some((client) => client.id === state.historyClientId)) {
    state.historyClientId = clients[0]?.id || null;
  }
  const orders = state.historyClientId ? ordersForClient(state.historyClientId) : [];
  host.innerHTML = orderHistory({
    clients,
    selectedClientId: state.historyClientId || '',
    orders,
    role: getRole()
  });
}

function handleHistoryChange(event) {
  if (event.target.id !== 'history-client') return;
  state.historyClientId = event.target.value;
  renderHistory();
}

/* ---------------------------------- Arranque ------------------------------- */

function bindStaticControls() {
  globalThis.document?.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => showView(button.dataset.view));
  });

  const roleSelect = qs('role-select');
  if (roleSelect) {
    roleSelect.value = getRole();
    roleSelect.addEventListener('change', () => {
      setRole(roleSelect.value);
      if (state.view === 'history') renderHistory();
    });
  }

  qs('product-catalog')?.addEventListener('click', handleCatalogClick);
  qs('product-filters')?.addEventListener('change', handleFilterChange);
  qs('product-filters')?.addEventListener('click', handleFilterClick);
  viewElement('cart')?.addEventListener('click', handleCartClick);
  viewElement('cart')?.addEventListener('change', handleCartChange);
  viewElement('checkout')?.addEventListener('submit', handleCheckoutSubmit);
  viewElement('confirmation')?.addEventListener('click', handleConfirmationClick);
  qs('history')?.addEventListener('change', handleHistoryChange);
}

export async function boot(config) {
  setActiveConfig(normalizeConfig(config));
  applyTheme();

  const brand = qs('brand-name');
  if (brand) brand.textContent = getConfig().moduleName;
  if (globalThis.document) globalThis.document.title = getConfig().moduleName;

  loadProducts();
  loadClients();

  bindStaticControls();
  showView('catalog');
  updateCartCount();
  return state;
}

export const initApp = boot;

export function getAppState() {
  return state;
}

export function __setPaymentBehavior(behavior) {
  state.paymentBehavior = behavior;
}

export { formatCurrency };
