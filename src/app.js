import {
  loadProducts, loadClients, getCartDetails, addToCart, updateCartItem, removeFromCart,
  clearCart, setCartCoupon, clearCartCoupon, loadCart, decreaseStock, addOrder,
  findOrCreateClient, ordersForClient, getCartCount, loadOffers, getOffer, addOffer,
  updateOffer, deleteOffer, setOfferActive, updateProductPrice, getProduct,
  applyOffersToProducts, loadOrders
} from './storage.js';
import { featuredProducts, filterProducts, productCategories } from './catalog.js';
import { validateCoupon, recordCouponUse, loadCouponUsage } from './coupons.js';
import {
  normalizeConfig, setActiveConfig, getConfig, getRole, setRole, maskCreditLimit,
  canManageCatalog, canViewHistory, canViewMetrics, canAccessView, labelFor, applyTheme
} from './module-config.js';
import { computeMetrics } from './metrics.js';
import { validateOffer } from './offers.js';
import { completeCheckout, validateCheckout } from './checkout.js';
import { processPayment } from './payments.js';
import { escapeHtml, formatCurrency, toNumber } from './utils.js';
import { productCatalog } from './components/product-catalog.js';
import { productFilters } from './components/product-filters.js';
import { cartView } from './components/cart.js';
import { couponForm } from './components/coupon-form.js';
import { checkoutForm } from './components/checkout-form.js';
import { orderConfirmation } from './components/order-confirmation.js';
import { orderHistory } from './components/order-history.js';
import { adminPanel } from './components/admin-panel.js';
import { metricsDashboard } from './components/metrics-dashboard.js';

const state = {
  view: 'catalog',
  filters: { category: 'all', maxPrice: '' },
  couponMessage: null,
  checkoutValues: {},
  checkoutErrors: {},
  checkoutMessage: null,
  lastOrder: null,
  historyClientId: null,
  adminUnlocked: false,
  paymentBehavior: 'success',
  metrics: { from: '', to: '', category: '' },
  admin: {
    message: null,
    offerValues: {},
    offerErrors: {},
    priceErrors: {},
    editingOfferId: null
  }
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
  const unlockedAdmin = view !== 'admin' || state.adminUnlocked;
  const allowed = canAccessView(getRole(), view) && unlockedAdmin;
  const activeView = allowed ? view : 'catalog';

  setNotice(qs('role-denied'), allowed ? null : {
    type: 'error',
    text: `${labelFor('accessRestricted', 'Acceso restringido')} (${labelFor(view, view)})`
  });
  const access = qs('role-access');
  if (access) access.hidden = allowed;
  const deniedReturn = qs('role-denied-return');
  if (deniedReturn) deniedReturn.hidden = allowed;

  state.view = activeView;
  globalThis.document?.querySelectorAll('.view').forEach((section) => {
    section.hidden = section.id !== `view-${activeView}`;
  });

  globalThis.document?.querySelectorAll('[data-view]').forEach((button) => {
    const active = button.dataset.view === activeView;
    button.classList.toggle('is-active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });

  if (activeView === 'catalog') renderCatalog();
  if (activeView === 'cart') renderCart();
  if (activeView === 'checkout') renderCheckout();
  if (activeView === 'confirmation') renderConfirmation();
  if (activeView === 'history') renderHistory();
  if (activeView === 'admin') renderAdmin();
  if (activeView === 'metrics') renderMetrics();

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
  const filtered = applyOffersToProducts(filterProducts(products, state.filters));
  const featured = applyOffersToProducts(featuredProducts(products));

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
    catalogHost.innerHTML = productCatalog({ featured, products: filtered, role: getRole() });
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
  setNotice(qs('checkout-message'), { type: 'info', text: 'Procesando pago…' });

  const result = await completeCheckout({
    data,
    details,
    coupon,
    payment: ({ amount, method }) => processPayment({
      amount,
      method,
      behavior: state.paymentBehavior
    }),
    actions: {
      decreaseStock: (items) => items.every((item) => decreaseStock(item.productId, item.quantity)),
      createClient: (clientData) => findOrCreateClient(clientData),
      createOrder: (orderData) => addOrder(orderData),
      recordCouponUse,
      clearCart
    }
  });

  if (!result.ok) {
    state.checkoutMessage = {
      type: 'error',
      text: result.message || 'No se pudo procesar el pago. Intenta nuevamente.'
    };
    renderCheckout();
    return;
  }

  state.lastOrder = result.order;
  state.historyClientId = result.client.id;
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
    role: getRole(),
    allowed: canViewHistory(getRole())
  });
}

function handleHistoryChange(event) {
  if (event.target.id !== 'history-client') return;
  state.historyClientId = event.target.value;
  renderHistory();
}

/* ------------------------------ Administración ----------------------------- */

function renderAdmin() {
  const host = qs('admin');
  if (!host) return;
  host.innerHTML = adminPanel({
    allowed: canManageCatalog(getRole()),
    products: loadProducts(),
    offers: loadOffers(),
    message: state.admin.message,
    offerValues: state.admin.offerValues,
    offerErrors: state.admin.offerErrors,
    priceErrors: state.admin.priceErrors,
    editingOfferId: state.admin.editingOfferId
  });
}

function refreshCommerce() {
  renderCatalog();
  renderCart();
  renderMetrics();
  updateCartCount();
}

function readOfferData(form) {
  return {
    productId: form.querySelector('#offer-product')?.value ?? '',
    type: form.querySelector('#offer-type')?.value ?? '',
    value: form.querySelector('#offer-value')?.value ?? '',
    startDate: form.querySelector('#offer-start')?.value ?? '',
    endDate: form.querySelector('#offer-end')?.value ?? ''
  };
}

function handleAdminSubmit(event) {
  if (event.target.id !== 'offer-form') return;
  event.preventDefault();

  const data = readOfferData(event.target);
  const product = getProduct(data.productId);
  const validation = validateOffer(data, { product });

  if (!validation.valid) {
    state.admin.offerValues = data;
    state.admin.offerErrors = validation.errors;
    state.admin.message = { type: 'error', text: Object.values(validation.errors).join(' ') };
    renderAdmin();
    return;
  }

  try {
    if (state.admin.editingOfferId) {
      updateOffer(state.admin.editingOfferId, { ...data, value: Number(data.value) });
    } else {
      addOffer({ ...data, value: Number(data.value), active: true });
    }
    state.admin.message = { type: 'success', text: 'Oferta guardada correctamente.' };
    state.admin.offerValues = {};
    state.admin.offerErrors = {};
    state.admin.editingOfferId = null;
    refreshCommerce();
    renderAdmin();
  } catch (error) {
    state.admin.offerErrors = error.errors || {};
    state.admin.message = { type: 'error', text: error.message };
    renderAdmin();
  }
}

function handleAdminClick(event) {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;

  if (action === 'save-price') {
    const productId = button.dataset.productId;
    const input = qs(`price-${productId}`);
    try {
      updateProductPrice(productId, input?.value);
      state.admin.priceErrors = {};
      state.admin.message = { type: 'success', text: 'Precio actualizado correctamente.' };
      refreshCommerce();
    } catch (error) {
      state.admin.priceErrors = { [productId]: error.message };
      state.admin.message = { type: 'error', text: error.message };
    }
    renderAdmin();
    return;
  }

  const offerId = button.dataset.offerId;
  const offer = offerId ? getOffer(offerId) : null;

  if (action === 'edit-offer' && offer) {
    state.admin.offerValues = {
      productId: offer.productId,
      type: offer.type,
      value: offer.value,
      startDate: offer.startDate,
      endDate: offer.endDate
    };
    state.admin.offerErrors = {};
    state.admin.editingOfferId = offer.id;
    state.admin.message = { type: 'info', text: 'Editando oferta. Guarda los cambios para aplicarlos.' };
    renderAdmin();
    return;
  }

  if (action === 'cancel-offer-edit') {
    state.admin.offerValues = {};
    state.admin.offerErrors = {};
    state.admin.editingOfferId = null;
    state.admin.message = null;
    renderAdmin();
    return;
  }

  if (action === 'toggle-offer' && offer) {
    setOfferActive(offer.id, !offer.active);
    state.admin.message = {
      type: 'success',
      text: offer.active ? 'Oferta desactivada.' : 'Oferta activada.'
    };
    refreshCommerce();
    renderAdmin();
    return;
  }

  if (action === 'delete-offer' && offer) {
    deleteOffer(offer.id);
    state.admin.offerValues = {};
    state.admin.offerErrors = {};
    state.admin.editingOfferId = null;
    state.admin.message = { type: 'success', text: 'Oferta eliminada.' };
    refreshCommerce();
    renderAdmin();
  }
}

/* --------------------------------- Métricas -------------------------------- */

function renderMetrics() {
  const host = qs('metrics-content');
  if (!host) return;

  const categorySelect = qs('metrics-category');
  if (categorySelect) {
    const categories = [...new Set(loadProducts().map((product) => product.category).filter(Boolean))].sort();
    const options = ['', ...categories];
    categorySelect.innerHTML = options
      .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category || labelFor('allCategories', 'Todas las categorías'))}</option>`)
      .join('');
    categorySelect.value = state.metrics.category;
  }

  const metrics = computeMetrics({
    orders: loadOrders(),
    products: loadProducts(),
    offers: loadOffers(),
    couponUsage: loadCouponUsage(),
    filters: state.metrics
  });
  host.innerHTML = metricsDashboard({
    allowed: canAccessView(getRole(), 'metrics'),
    metrics
  });
}

function handleMetricsChange(event) {
  if (event.target.id === 'metrics-category') {
    state.metrics.category = event.target.value;
    renderMetrics();
  }
}

function syncMetricsControls() {
  const from = qs('metrics-from');
  const to = qs('metrics-to');
  const category = qs('metrics-category');
  if (from) from.value = state.metrics.from;
  if (to) to.value = state.metrics.to;
  if (category) category.value = state.metrics.category;
}

function handleMetricsClick(event) {
  const categoryButton = event.target.closest?.('[data-chart-category]');
  if (categoryButton) {
    state.metrics.category = categoryButton.dataset.chartCategory;
    syncMetricsControls();
    renderMetrics();
    return;
  }

  const dateButton = event.target.closest?.('[data-chart-date]');
  if (dateButton) {
    state.metrics.from = dateButton.dataset.chartDate;
    state.metrics.to = dateButton.dataset.chartDate;
    syncMetricsControls();
    renderMetrics();
    return;
  }

  if (event.target.id !== 'metrics-reset') return;
  state.metrics = { from: '', to: '', category: '' };
  syncMetricsControls();
  renderMetrics();
}

function handleMetricsSubmit(event) {
  if (event.target.id !== 'metrics-filter-form') return;
  event.preventDefault();
  state.metrics = {
    from: qs('metrics-from')?.value || '',
    to: qs('metrics-to')?.value || '',
    category: qs('metrics-category')?.value || ''
  };
  renderMetrics();
}

/* ---------------------------------- Arranque ------------------------------- */

const ADMIN_ACCESS_CODE = '1234';

function renderRoleSelector() {
  const select = qs('role-select');
  if (!select) return;
  const roles = getConfig().roles || {};
  select.innerHTML = Object.entries(roles)
    .map(([value, role]) => `<option value="${escapeHtml(value)}">${escapeHtml(role?.label || value)}</option>`)
    .join('');
  select.value = getRole();
}

function applyRolePermissions() {
  const role = getRole();
  const permissions = { canViewHistory, canManageCatalog, canViewMetrics };
  globalThis.document?.querySelectorAll('[data-view][data-requires]').forEach((button) => {
    const check = permissions[button.dataset.requires];
    button.hidden = typeof check === 'function' ? !check(role) : true;
  });

  const logout = qs('role-logout');
  if (logout) {
    logout.hidden = role === 'customer';
    logout.textContent = labelFor('logout', 'Cerrar sesión');
  }

  const adminAccess = qs('admin-access');
  if (adminAccess) adminAccess.hidden = role !== 'admin';
}

function resetPrivilegedState() {
  state.adminUnlocked = false;
  state.filters = { category: 'all', maxPrice: '' };
  state.metrics = { from: '', to: '', category: '' };
  state.admin.message = null;
  state.admin.offerValues = {};
  state.admin.offerErrors = {};
  state.admin.priceErrors = {};
  state.admin.editingOfferId = null;
  const adminCode = qs('admin-code');
  if (adminCode) adminCode.value = '';
  setNotice(qs('admin-access-error'), null);
}

function handleRoleChange(event) {
  if (event.target.id !== 'role-select') return;
  setRole(event.target.value);
  resetPrivilegedState();
  renderRoleSelector();
  applyRolePermissions();
  showView(state.view);
}

function handleRoleLogout() {
  setRole('customer');
  resetPrivilegedState();
  renderRoleSelector();
  applyRolePermissions();
  showView('catalog');
  setNotice(qs('catalog-feedback'), {
    type: 'info',
    text: labelFor('returnedToCustomer', 'Volviste a la vista pública de cliente.')
  });
}

function handleRoleDeniedReturn() {
  showView('catalog');
}

function requestAdminAccess() {
  if (!canManageCatalog(getRole())) return false;
  if (state.adminUnlocked) return true;
  const inputCode = String(qs('admin-code')?.value || '').trim();
  const code = inputCode || globalThis.prompt?.('Ingresa el código de acceso:');
  if (String(code || '').trim() === ADMIN_ACCESS_CODE) {
    state.adminUnlocked = true;
    setNotice(qs('admin-access-error'), null);
    return true;
  }
  setNotice(qs('admin-access-error'), { type: 'error', text: 'Acceso denegado' });
  return false;
}

function bindStaticControls() {
  globalThis.document?.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.view === 'admin' && !requestAdminAccess()) return;
      showView(button.dataset.view);
    });
  });



  qs('role-select')?.addEventListener('change', handleRoleChange);
  qs('role-logout')?.addEventListener('click', handleRoleLogout);
  qs('role-denied-return')?.addEventListener('click', handleRoleDeniedReturn);
  qs('admin-access')?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (requestAdminAccess()) showView('admin');
  });
  viewElement('metrics')?.addEventListener('change', handleMetricsChange);
  viewElement('metrics')?.addEventListener('click', handleMetricsClick);
  viewElement('metrics')?.addEventListener('submit', handleMetricsSubmit);
  qs('product-catalog')?.addEventListener('click', handleCatalogClick);
  qs('product-filters')?.addEventListener('change', handleFilterChange);
  qs('product-filters')?.addEventListener('click', handleFilterClick);
  viewElement('cart')?.addEventListener('click', handleCartClick);
  viewElement('cart')?.addEventListener('change', handleCartChange);
  viewElement('checkout')?.addEventListener('submit', handleCheckoutSubmit);
  viewElement('confirmation')?.addEventListener('click', handleConfirmationClick);
  qs('history')?.addEventListener('change', handleHistoryChange);
  qs('admin')?.addEventListener('submit', handleAdminSubmit);
  qs('admin')?.addEventListener('click', handleAdminClick);
}

export async function boot(config) {
  setActiveConfig(normalizeConfig(config));
  applyTheme();
  renderRoleSelector();
  applyRolePermissions();

  const brand = qs('brand-name');
  if (brand) brand.textContent = getConfig().moduleName;
  if (globalThis.document) globalThis.document.title = getConfig().moduleName;

  loadProducts();
  loadClients();
  loadOffers();
  loadOrders();

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
