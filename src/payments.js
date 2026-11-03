export const GATEWAY_TIMEOUT_MS = 50;

export async function processPayment({ amount = 0, method = 'Tarjeta', behavior = 'success' } = {}) {
  await new Promise((resolve) => setTimeout(resolve, 0));

  if (behavior === 'timeout') {
    const error = new Error('La pasarela de pago agotó el tiempo de espera. Intenta nuevamente.');
    error.code = 'TIMEOUT';
    throw error;
  }

  if (behavior === 'declined') {
    const error = new Error('El pago fue rechazado. Verifica el método de pago.');
    error.code = 'DECLINED';
    throw error;
  }

  return {
    ok: true,
    reference: `PAY-${Date.now()}`,
    amount,
    method
  };
}
