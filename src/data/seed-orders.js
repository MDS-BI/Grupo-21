function dateFromOffset(days, referenceDate) {
  const date = new Date(referenceDate);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

function orderNumber(date, sequence) {
  return `PED-${date.replace(/-/g, '')}-${String(sequence).padStart(4, '0')}`;
}

export function createSeedOrders(referenceDate = new Date()) {
  const templates = [
    {
      offset: 82,
      status: 'Pedido',
      documentType: 'Pedido',
      discount: 0,
      couponCode: null,
      paymentMethod: 'Tarjeta',
      items: [
        ['prod-polera-coach-c', 'Polera Coach C - Gris Claro', 25990, 2],
        ['prod-jockey', 'Jockey', 16990, 1]
      ]
    },
    {
      offset: 76,
      status: 'Facturado',
      documentType: 'Facturado',
      discount: 10000,
      couponCode: 'ROOT10',
      paymentMethod: 'Transferencia',
      items: [
        ['prod-steel-zip-knit', 'Steel Zip Knit', 77990, 1],
        ['prod-black-zipper-layers', 'Black Zipper Layers', 67990, 1]
      ]
    },
    {
      offset: 70,
      status: 'Cotización',
      documentType: 'Cotización',
      discount: 0,
      couponCode: null,
      paymentMethod: 'Tarjeta',
      items: [
        ['prod-bandanas', 'Bandanas', 2997, 2],
        ['prod-llavero-rootsouth', 'Llavero Rootsouth Original', 5000, 3],
        ['prod-tarjetero-rootsouth', 'Tarjetero Rootsouth', 9790, 1]
      ]
    },
    {
      offset: 64,
      status: 'Pedido',
      documentType: 'Pedido',
      discount: 0,
      couponCode: null,
      paymentMethod: 'Tarjeta',
      items: [
        ['prod-vaso-matero', 'Vaso Matero', 9990, 4],
        ['prod-polera-coach-c', 'Polera Coach C - Gris Claro', 25990, 1]
      ]
    },
    {
      offset: 58,
      status: 'Facturado',
      documentType: 'Facturado',
      discount: 0,
      couponCode: null,
      paymentMethod: 'Transferencia',
      items: [
        ['prod-black-zipper-layers', 'Black Zipper Layers', 67990, 2]
      ]
    },
    {
      offset: 52,
      status: 'Pedido',
      documentType: 'Pedido',
      discount: 5000,
      couponCode: 'OFERTA5',
      paymentMethod: 'Tarjeta',
      items: [
        ['prod-jockey', 'Jockey', 16990, 3],
        ['prod-bandanas', 'Bandanas', 2997, 4]
      ]
    },
    {
      offset: 46,
      status: 'Facturado',
      documentType: 'Facturado',
      discount: 0,
      couponCode: null,
      paymentMethod: 'Tarjeta',
      items: [
        ['prod-steel-zip-knit', 'Steel Zip Knit', 77990, 1],
        ['prod-tarjetero-rootsouth', 'Tarjetero Rootsouth', 9790, 2]
      ]
    },
    {
      offset: 40,
      status: 'Cotización',
      documentType: 'Cotización',
      discount: 0,
      couponCode: null,
      paymentMethod: 'Tarjeta',
      items: [
        ['prod-llavero-rootsouth', 'Llavero Rootsouth Original', 5000, 5],
        ['prod-vaso-matero', 'Vaso Matero', 9990, 2]
      ]
    },
    {
      offset: 34,
      status: 'Pedido',
      documentType: 'Pedido',
      discount: 10000,
      couponCode: 'ROOT10',
      paymentMethod: 'Transferencia',
      items: [
        ['prod-polera-coach-c', 'Polera Coach C - Gris Claro', 25990, 3],
        ['prod-black-zipper-layers', 'Black Zipper Layers', 67990, 1]
      ]
    },
    {
      offset: 28,
      status: 'Facturado',
      documentType: 'Facturado',
      discount: 0,
      couponCode: null,
      paymentMethod: 'Tarjeta',
      items: [
        ['prod-steel-zip-knit', 'Steel Zip Knit', 77990, 2]
      ]
    },
    {
      offset: 16,
      status: 'Cancelado',
      documentType: 'Pedido',
      discount: 0,
      couponCode: null,
      paymentMethod: 'Tarjeta',
      items: [
        ['prod-jockey', 'Jockey', 16990, 2],
        ['prod-vaso-matero', 'Vaso Matero', 9990, 1]
      ]
    },
    {
      offset: 6,
      status: 'Pedido',
      documentType: 'Pedido',
      discount: 0,
      couponCode: null,
      paymentMethod: 'Tarjeta',
      items: [
        ['prod-polera-coach-c', 'Polera Coach C - Gris Claro', 25990, 1],
        ['prod-bandanas', 'Bandanas', 2997, 2],
        ['prod-tarjetero-rootsouth', 'Tarjetero Rootsouth', 9790, 1]
      ]
    }
  ];

  return templates.map((template, index) => {
    const date = dateFromOffset(template.offset, referenceDate);
    const items = template.items.map(([productId, name, price, quantity]) => ({
      productId,
      name,
      price,
      quantity,
      lineTotal: price * quantity
    }));
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    return {
      id: `seed-order-${String(index + 1).padStart(3, '0')}`,
      orderNumber: orderNumber(date, 1),
      clientId: 'client-demo',
      documentType: template.documentType,
      status: template.status,
      date,
      items,
      subtotal,
      discount: template.discount,
      total: subtotal - template.discount,
      couponCode: template.couponCode,
      paymentMethod: template.paymentMethod
    };
  });
}

export const seedOrders = createSeedOrders();
