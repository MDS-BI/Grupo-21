import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export function mountMarkup() {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = (match ? match[1] : html).replace(/<script[\s\S]*?<\/script>/gi, '');
  document.body.innerHTML = body;
  return document.body;
}

export async function startApp({ config, paymentBehavior } = {}) {
  const app = await import('../../src/app.js');
  if (paymentBehavior) app.__setPaymentBehavior(paymentBehavior);
  await app.boot(config);
  return app;
}

export function changeValue(element, value) {
  element.value = value;
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

export function submitForm(form) {
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

export function flush(ms = 25) {
  return new Promise((resolveFlush) => setTimeout(resolveFlush, ms));
}

export function clickNav(view) {
  document.querySelector(`[data-view="${view}"]`).click();
}

export function buyFromCatalog(productId) {
  const button = document.querySelector(`#catalog-grid [data-product-id="${productId}"] [data-action="buy"]`);
  button.click();
  return button;
}

export async function completePurchase({ config, paymentBehavior, overrides } = {}) {
  const app = await startApp({ config, paymentBehavior });
  buyFromCatalog('prod-phone-01');
  clickNav('cart');
  document.getElementById('go-checkout').click();
  fillCheckout(overrides);
  submitForm(document.getElementById('checkout-form'));
  await flush();
  return app;
}

export function fillCheckout(overrides = {}) {
  const values = {
    fullName: 'Ana Pérez',
    email: 'ana@example.com',
    address: 'Calle Falsa 123',
    city: 'Santiago',
    postalCode: '8320000',
    phone: '+56 9 1234 5678',
    paymentMethod: 'Tarjeta',
    ...overrides
  };
  const map = {
    fullName: 'checkout-fullName',
    email: 'checkout-email',
    address: 'checkout-address',
    city: 'checkout-city',
    postalCode: 'checkout-postalCode',
    phone: 'checkout-phone',
    paymentMethod: 'checkout-paymentMethod'
  };
  Object.entries(map).forEach(([key, id]) => {
    const element = document.getElementById(id);
    if (element) element.value = values[key];
  });
  return values;
}
