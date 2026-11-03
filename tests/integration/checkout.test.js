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

async function openCheckout() {
  await startApp();
  buyFromCatalog('prod-phone-01');
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
    expect(localStorage.getItem('erp.orders')).toBeNull();
  });

  it('keeps the entered values after a validation error', async () => {
    await openCheckout();
    fillCheckout({ email: '' });
    submitForm(document.getElementById('checkout-form'));
    expect(document.getElementById('checkout-fullName').value).toBe('Ana Pérez');
    expect(document.getElementById('checkout-fullName').value).toBe('Ana Pérez');
    expect(document.getElementById('error-email')).not.toBeNull();
  });

  it('creates an order, clears the cart and shows the confirmation', async () => {
    await completePurchase();
    expect(document.getElementById('view-confirmation').hidden).toBe(false);
    expect(document.getElementById('order-number').textContent).toMatch(/^PED-\d{8}-\d{4}$/);
    expect(document.getElementById('cart-count').textContent).toBe('0');

    const orders = JSON.parse(localStorage.getItem('erp.orders'));
    expect(orders).toHaveLength(1);
    expect(orders[0].total).toBe(499990);
    expect(orders[0].subtotal).toBe(499990);
    expect(orders[0].discount).toBe(0);
    expect(orders[0].status).toBe('Pedido');
    expect(orders[0].documentType).toBe('Pedido');
    expect(orders[0].paymentMethod).toBe('Tarjeta');
    expect(orders[0].clientId).toBeTruthy();

    const products = JSON.parse(localStorage.getItem('erp.products'));
    expect(products.find((product) => product.id === 'prod-phone-01').stock).toBe(11);

    const clients = JSON.parse(localStorage.getItem('erp.clients'));
    expect(clients.some((client) => client.name === 'Ana Pérez')).toBe(true);
    expect(JSON.parse(localStorage.getItem('erp.cart')).items).toHaveLength(0);
  });

  it('records coupon usage when checking out with a coupon', async () => {
    await startApp();
    buyFromCatalog('prod-phone-01');
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
    const orders = JSON.parse(localStorage.getItem('erp.orders'));
    expect(orders[0].discount).toBe(49999);
    expect(orders[0].total).toBe(449991);
  });

  it('keeps the cart when the payment is declined', async () => {
    await completePurchase({ paymentBehavior: 'declined' });
    expect(document.getElementById('view-checkout').hidden).toBe(false);
    const message = document.getElementById('checkout-message');
    expect(message.className).toContain('notice--error');
    expect(message.textContent).toMatch(/rechazado/i);
    expect(localStorage.getItem('erp.orders')).toBeNull();
    expect(JSON.parse(localStorage.getItem('erp.cart')).items).toHaveLength(1);
  });
});
