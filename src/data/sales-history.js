import { seedProducts } from './products.js';

export const HISTORY_CLIENTS = [
  { id: 'hist-client-01', name: 'Comercial Andina SpA' },
  { id: 'hist-client-02', name: 'Tecno Norte Ltda.' },
  { id: 'hist-client-03', name: 'Oficina Centro S.A.' },
  { id: 'hist-client-04', name: 'Distribuidora Sur' },
  { id: 'hist-client-05', name: 'Estudio Crea' },
  { id: 'hist-client-06', name: 'Servicios Bío Bío' }
];

export const HISTORY_MONTHS = ['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11'];

const MONTHLY_UNITS = {
  'prod-phone-01': [22, 25, 28, 24, 27, 30],
  'prod-accessory-01': [18, 21, 19, 24, 22, 25],
  'prod-accessory-02': [14, 16, 15, 18, 17, 19],
  'prod-audio-01': [10, 12, 11, 13, 12, 14],
  'prod-tablet-01': [8, 9, 7, 10, 11, 12],
  'prod-audio-02': [6, 5, 7, 6, 8, 7],
  'prod-laptop-01': [3, 4, 3, 5, 4, 6],
  'prod-laptop-02': [1, 0, 1, 0, 1, 1]
};

function splitUnits(total, parts) {
  const chunks = Array.from({ length: parts }, (_, index) =>
    Math.floor(total / parts) + (index < total % parts ? 1 : 0)
  );
  return chunks.filter((quantity) => quantity > 0);
}

export function buildSalesHistory() {
  const orders = [];
  const productsById = new Map(seedProducts.map((product) => [product.id, product]));
  let sequence = 1;

  HISTORY_MONTHS.forEach((month, monthIndex) => {
    Object.entries(MONTHLY_UNITS).forEach(([productId, monthlyQuantities], productIndex) => {
      const quantity = monthlyQuantities[monthIndex] || 0;
      if (quantity <= 0) return;

      const product = productsById.get(productId);
      if (!product) return;

      const parts = quantity >= 20 ? 3 : quantity >= 8 ? 2 : 1;
      splitUnits(quantity, parts).forEach((lineQuantity, chunkIndex) => {
        const day = 4 + ((monthIndex * 3 + productIndex * 2 + chunkIndex * 7) % 25);
        const date = `${month}-${String(day).padStart(2, '0')}T10:00:00.000Z`;
        const client = HISTORY_CLIENTS[(monthIndex * 2 + productIndex + chunkIndex) % HISTORY_CLIENTS.length];
        const lineTotal = product.price * lineQuantity;
        const orderNumber = `PED-${month.replace('-', '')}${String(day).padStart(2, '0')}-${String(sequence).padStart(4, '0')}`;
        sequence += 1;

        orders.push({
          id: `hist-order-${orderNumber}`,
          orderNumber,
          clientId: client.id,
          documentType: 'Factura',
          status: 'Facturado',
          items: [{
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: lineQuantity,
            lineTotal
          }],
          subtotal: lineTotal,
          discount: 0,
          total: lineTotal,
          couponCode: null,
          paymentMethod: 'Transferencia',
          shipping: { fullName: client.name, city: 'Santiago' },
          date,
          createdAt: date,
          updatedAt: date
        });
      });
    });
  });

  return orders.sort((a, b) => String(a.date).localeCompare(String(b.date)));
}
