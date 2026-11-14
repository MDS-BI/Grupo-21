import { isValidDate, toNumber } from './utils.js';

export const OFFER_TYPES = ['percent', 'fixed'];

export function dateString(value = new Date()) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? '' : value.toISOString().slice(0, 10);
  }
  return String(value ?? '').slice(0, 10);
}

export function validateOffer(data = {}, { product = undefined } = {}) {
  const errors = {};

  const productId = String(data.productId ?? '').trim();
  if (!productId) {
    errors.productId = 'Selecciona un producto para la oferta.';
  } else if (product === null) {
    errors.productId = 'El producto seleccionado no existe.';
  }

  const type = String(data.type ?? '').trim();
  if (!OFFER_TYPES.includes(type)) {
    errors.type = 'El tipo de descuento debe ser porcentaje o monto fijo.';
  }

  const value = toNumber(data.value, NaN);
  if (!Number.isFinite(value) || value <= 0) {
    errors.value = 'El valor del descuento debe ser un número mayor que cero.';
  } else if (type === 'percent' && value > 100) {
    errors.value = 'El porcentaje de descuento no puede superar el 100 %.';
  } else if (type === 'fixed' && product) {
    if (value > toNumber(product.price, 0)) {
      errors.value = 'El descuento no puede superar el precio del producto.';
    }
  }

  const startDate = String(data.startDate ?? '').trim();
  const endDate = String(data.endDate ?? '').trim();
  if (!startDate) {
    errors.startDate = 'La fecha de inicio es obligatoria.';
  } else if (!isValidDate(startDate)) {
    errors.startDate = 'La fecha de inicio no es válida.';
  }
  if (!endDate) {
    errors.endDate = 'La fecha de fin es obligatoria.';
  } else if (!isValidDate(endDate)) {
    errors.endDate = 'La fecha de fin no es válida.';
  }
  if (!errors.startDate && !errors.endDate && endDate < startDate) {
    errors.endDate = 'La fecha de fin debe ser igual o posterior a la fecha de inicio.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function isOfferActive(offer, now = new Date()) {
  if (!offer || offer.active === false) return false;
  const today = dateString(now);
  if (!today) return false;
  if (offer.startDate && today < String(offer.startDate).slice(0, 10)) return false;
  if (offer.endDate && today > String(offer.endDate).slice(0, 10)) return false;
  return true;
}

export function offerPriceFor(productPrice, offer) {
  const price = toNumber(productPrice, 0);
  if (!offer) return price;
  if (offer.type === 'fixed') {
    return Math.max(0, Math.round(price - toNumber(offer.value, 0)));
  }
  if (offer.type === 'percent') {
    const discount = (price * toNumber(offer.value, 0)) / 100;
    return Math.max(0, Math.round(price - discount));
  }
  return price;
}

export function resolveProductPrice(product, offers = [], now = new Date()) {
  const originalPrice = toNumber(product?.price, 0);
  const productId = product?.id ?? null;

  const candidates = (offers || [])
    .filter((offer) => offer && offer.productId === productId && isOfferActive(offer, now))
    .map((offer) => ({ offer, price: offerPriceFor(originalPrice, offer) }))
    .filter((entry) => entry.price < originalPrice)
    .sort((a, b) => a.price - b.price);

  if (candidates.length === 0) {
    return { price: originalPrice, originalPrice, discount: 0, offer: null };
  }

  const chosen = candidates[0];
  return {
    price: chosen.price,
    originalPrice,
    discount: originalPrice - chosen.price,
    offer: chosen.offer
  };
}
