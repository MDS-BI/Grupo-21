// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  mountMarkup, startApp, clickNav, buyFromCatalog, submitForm, fillCheckout, flush, completePurchase
} from '../helpers/app-fixture.js';

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
});

function storedOrders() {
  return JSON.parse(localStorage.getItem('erp.orders') || '[]');
}

async function openCheckout() {
  await startApp();
  buyFromCatalog('prod-steel-zip-knit');
  clickNav('cart');
  document.getElementById('go-checkout').click();
}

describe('checkout flow', () => {
  it('shows validation errors and stays on the checkout view when data is missing', async () => {
    await openCheckout();
    submitForm(document.getElementById('checkout-form'));
    expect(document.getElementById('view-checkout').hidden).toBe(false);
    expect(document.getElementById('error-fullName')).not.toBeNull();
    expect(document.getElementById('error-email')).not.toBeNull();
    expect(document.getElementById('error-address')).not.toBeNull();
    expect(document.getElementById('error-city')).not.toBeNull();
    expect(document.getElementById('error-postalCode')).not.toBeNull();
    expect(document.getElementById('error-paymentMethod')).not.toBeNull();
    expect(storedOrders()).toHaveLength(12);
  });

  it('keeps the entered values after a validation error', async () => {
    await openCheckout();
    fillCheckout({ email: '' });
    submitForm(document.getElementById('checkout-form'));
    expect(document.getElementById('checkout-fullName').value).toBe('Ana Pérez');
    expect(document.getElementById('checkout-address').value).toBe('Calle Falsa 123');
    expect(document.getElementById('error-email')).not.toBeNull();
  });

  it('creates an order, clears the cart and shows the confirmation', async () => {
    await completePurchase();
    expect(document.getElementById('view-confirmation').hidden).toBe(false);
    expect(document.getElementById('order-number').textContent).toMatch(/^PED-\d{8}-\d{4}$/);
    expect(document.getElementById('cart-count').textContent).toBe('0');

    expect(storedOrders()).toHaveLength(13);
    const order = storedOrders().find((entry) => entry.shipping?.email === 'ana@example.com');
    expect(order.total).toBe(70191);
    expect(order.subtotal).toBe(70191);
    expect(order.discount).toBe(0);
    expect(order.status).toBe('Pedido');
    expect(order.documentType).toBe('Pedido');
    expect(order.paymentMethod).toBe('Tarjeta');
    expect(order.clientId).toBeTruthy();

    const products = JSON.parse(localStorage.getItem('erp.products'));
    expect(products.find((product) => product.id === 'prod-steel-zip-knit').stock).toBe(11);

    const clients = JSON.parse(localStorage.getItem('erp.clients'));
    expect(clients.some((client) => client.id === order.clientId)).toBe(true);
    expect(order.shipping.fullName).toBe('Ana Pérez');
    expect(JSON.parse(localStorage.getItem('erp.cart')).items).toHaveLength(0);
  });

  it('records coupon usage when checking out with a coupon', async () => {
    await startApp();
    buyFromCatalog('prod-steel-zip-knit');
    clickNav('cart');
    const couponInput = document.getElementById('coupon-code');
    couponInput.value = 'BIENVENIDO10';
    document.getElementById('apply-coupon').click();
    document.getElementById('go-checkout').click();
    fillCheckout();
    submitForm(document.getElementById('checkout-form'));
    await flush();

    const usage = JSON.parse(localStorage.getItem('erp.couponUsage'));
    expect(usage.BIENVENIDO10).toBe(1);
    const order = storedOrders().find((entry) => entry.shipping?.email === 'ana@example.com');
    expect(order.discount).toBe(7019);
    expect(order.total).toBe(63172);
  });

  it('keeps the cart when the payment is declined', async () => {
    await completePurchase({ paymentBehavior: 'declined' });
    expect(document.getElementById('view-checkout').hidden).toBe(false);
    const message = document.getElementById('checkout-message');
    expect(message.className).toContain('notice--error');
    expect(message.textContent).toMatch(/rechazado/i);
    expect(storedOrders()).toHaveLength(12);
    expect(JSON.parse(localStorage.getItem('erp.cart')).items).toHaveLength(1);
  });
});
