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

export async function completeCheckout({ data = {}, details, coupon, payment, actions = {} } = {}) {
  const validation = validateCheckout(data);
  if (!validation.valid) {
    return { ok: false, errors: validation.errors };
  }

  const items = Array.isArray(details?.items) ? details.items : [];
  if (items.length === 0) {
    return { ok: false, message: 'Tu carrito está vacío.' };
  }

  const subtotal = toNumber(details.subtotal, 0);
  const discount = coupon?.valid ? toNumber(coupon.discount, 0) : 0;
  const total = Math.max(0, subtotal - discount);

  try {
    await payment?.({ amount: total, method: data.paymentMethod });
  } catch (error) {
    return { ok: false, message: error.message };
  }

  if (!actions.decreaseStock?.(items) || !actions.createOrder) {
    return { ok: false, message: 'No se pudo confirmar el pedido. Revisa el stock y vuelve a intentarlo.' };
  }

  const client = actions.createClient(data);
  const order = actions.createOrder({
    clientId: client.id,
    documentType: 'Pedido',
    status: 'Pedido',
    items,
    subtotal,
    discount,
    total,
    couponCode: coupon?.valid ? coupon.code : null,
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

  if (coupon?.valid) actions.recordCouponUse(coupon.code);
  actions.clearCart();
  return { ok: true, order, client };
}
