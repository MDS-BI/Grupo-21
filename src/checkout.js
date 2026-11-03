import { isValidEmail, toNumber } from './utils.js';

export function validateCheckout(data = {}) {
  const errors = {};
  if (!String(data.fullName ?? '').trim()) errors.fullName = 'El nombre es obligatorio.';
  if (!String(data.email ?? '').trim()) {
    errors.email = 'El correo electrónico es obligatorio.';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'El correo electrónico no es válido.';
  }
  if (!String(data.address ?? '').trim()) errors.address = 'La dirección es obligatoria.';
  if (!String(data.city ?? '').trim()) errors.city = 'La ciudad es obligatoria.';
  if (!String(data.postalCode ?? '').trim()) errors.postalCode = 'El código postal es obligatorio.';
  if (!String(data.paymentMethod ?? '').trim()) errors.paymentMethod = 'Selecciona un método de pago.';
  return { valid: Object.keys(errors).length === 0, errors };
}

export function generateOrderNumber(date = new Date(), sequence = 1) {
  const day = date.toISOString().slice(0, 10).replace(/-/g, '');
  return `PED-${day}-${String(toNumber(sequence, 1)).padStart(4, '0')}`;
}
