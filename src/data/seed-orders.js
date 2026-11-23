export const seedOrders = [
  {
    id: 'seed-order-001',
    orderNumber: 'PED-20261001-0001',
    clientId: 'client-demo',
    documentType: 'Pedido',
    status: 'Pedido',
    date: '2026-10-01',
    items: [
      {
        productId: 'prod-steel-zip-knit',
        name: 'Steel Zip Knit',
        price: 77990,
        quantity: 1,
        lineTotal: 77990
      },
      {
        productId: 'prod-polera-coach-c',
        name: 'Polera Coach C - Gris Claro',
        price: 25990,
        quantity: 2,
        lineTotal: 51980
      }
    ],
    subtotal: 129970,
    discount: 0,
    total: 129970,
    couponCode: null,
    paymentMethod: 'Tarjeta'
  },
  {
    id: 'seed-order-002',
    orderNumber: 'PED-20261005-0001',
    clientId: 'client-demo',
    documentType: 'Facturado',
    status: 'Facturado',
    date: '2026-10-05',
    items: [
      {
        productId: 'prod-black-zipper-layers',
        name: 'Black Zipper Layers',
        price: 67990,
        quantity: 1,
        lineTotal: 67990
      },
      {
        productId: 'prod-jockey',
        name: 'Jockey',
        price: 16990,
        quantity: 2,
        lineTotal: 33980
      },
      {
        productId: 'prod-bandanas',
        name: 'Bandanas',
        price: 2997,
        quantity: 1,
        lineTotal: 2997
      }
    ],
    subtotal: 104967,
    discount: 10000,
    total: 94967,
    couponCode: 'ROOT10',
    paymentMethod: 'Transferencia'
  },
  {
    id: 'seed-order-003',
    orderNumber: 'PED-20261012-0001',
    clientId: 'client-demo',
    documentType: 'Cotización',
    status: 'Cotización',
    date: '2026-10-12',
    items: [
      {
        productId: 'prod-llavero-rootsouth',
        name: 'Llavero Rootsouth Original',
        price: 5000,
        quantity: 3,
        lineTotal: 15000
      },
      {
        productId: 'prod-tarjetero-rootsouth',
        name: 'Tarjetero Rootsouth',
        price: 9790,
        quantity: 1,
        lineTotal: 9790
      },
      {
        productId: 'prod-vaso-matero',
        name: 'Vaso Matero',
        price: 9990,
        quantity: 2,
        lineTotal: 19980
      }
    ],
    subtotal: 44770,
    discount: 0,
    total: 44770,
    couponCode: null,
    paymentMethod: 'Tarjeta'
  },
  {
    id: 'seed-order-004',
    orderNumber: 'PED-20261102-0001',
    clientId: 'client-demo',
    documentType: 'Pedido',
    status: 'Pedido',
    date: '2026-11-02',
    items: [
      {
        productId: 'prod-steel-zip-knit',
        name: 'Steel Zip Knit',
        price: 77990,
        quantity: 2,
        lineTotal: 155980
      },
      {
        productId: 'prod-polera-coach-c',
        name: 'Polera Coach C - Gris Claro',
        price: 25990,
        quantity: 1,
        lineTotal: 25990
      },
      {
        productId: 'prod-vaso-matero',
        name: 'Vaso Matero',
        price: 9990,
        quantity: 3,
        lineTotal: 29970
      }
    ],
    subtotal: 211940,
    discount: 20000,
    total: 191940,
    couponCode: 'ROOT20',
    paymentMethod: 'Tarjeta'
  }
];
