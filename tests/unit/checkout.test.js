import { describe, expect, it } from 'vitest';
import { validateCheckout, generateOrderNumber } from '../../src/checkout.js';

describe('checkout validation', () => {
  const valid = {
    fullName: 'Ana Pérez',
    email: 'ana@example.com',
    address: 'Calle Falsa 123',
    city: 'Santiago',
    postalCode: '8320000',
    paymentMethod: 'Tarjeta'
  };

  it('accepts complete and valid data', () => {
    expect(validateCheckout(valid)).toEqual({ valid: true, errors: {} });
  });

  it('reports every missing required field', () => {
    const { valid: ok, errors } = validateCheckout({});
    expect(ok).toBe(false);
    expect(Object.keys(errors).sort()).toEqual([
      'address', 'city', 'email', 'fullName', 'paymentMethod', 'postalCode'
    ]);
  });

  it('rejects an invalid email', () => {
    const { valid: ok, errors } = validateCheckout({ ...valid, email: 'ana-at-example' });
    expect(ok).toBe(false);
    expect(errors.email).toMatch(/no es válido/i);
  });

  it('builds order numbers with date and zero-padded sequence', () => {
    expect(generateOrderNumber(new Date('2026-03-04T12:00:00Z'), 7)).toBe('PED-20260304-0007');
    expect(generateOrderNumber(new Date('2026-03-04T12:00:00Z'))).toBe('PED-20260304-0001');
  });
});
