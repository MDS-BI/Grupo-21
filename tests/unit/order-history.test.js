// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  loadOrders, addOrder, ordersForClient, deleteOrder, deleteOrdersForClient,
  addClient, loadClients, updateClient, deleteClient, validateClient
} from '../../src/storage.js';
import { maskCreditLimit, setActiveConfig } from '../../src/module-config.js';
import { seedOrders } from '../../src/data/seed-orders.js';

beforeEach(() => {
  localStorage.clear();
  setActiveConfig(null);
});

function orderFor(clientId, date) {
  return addOrder({
    clientId,
    date,
    items: [{ productId: 'prod-steel-zip-knit', name: 'Steel Zip Knit', quantity: 1, lineTotal: 70191 }],
    subtotal: 70191,
    total: 70191
  });
}

describe('clients and order history', () => {
  it('seeds a demo client with the RootSouth order history', () => {
    expect(loadClients()).toHaveLength(1);
    expect(loadClients()[0].code).toBe('CLI-001');

    const orders = loadOrders();
    expect(orders).toHaveLength(12);
    expect(seedOrders).toHaveLength(12);
    expect(orders.map((order) => order.id).sort()).toEqual(seedOrders.map((order) => order.id).sort());
    expect(orders.every((order) => order.clientId === 'client-demo')).toBe(true);
    expect(orders.every((order) => /^PED-\d{8}-0001$/.test(order.orderNumber))).toBe(true);
    expect(new Set(orders.map((order) => order.orderNumber)).size).toBe(12);
    expect(orders.filter((order) => order.status === 'Facturado')).toHaveLength(4);
    expect(orders.filter((order) => order.status === 'Pedido')).toHaveLength(5);
    expect(orders.filter((order) => order.status === 'Cotización')).toHaveLength(2);
    expect(orders.filter((order) => order.status === 'Cancelado')).toHaveLength(1);
    expect(ordersForClient('client-demo')).toHaveLength(12);
  });

  it('validates client name, code and email', () => {
    expect(validateClient({ name: '', code: '' }).valid).toBe(false);
    expect(validateClient({ name: 'Acme', code: 'AC-1', email: 'bad' }).errors.email).toBeTruthy();
    expect(validateClient({ name: 'Acme', code: 'AC-1', email: 'a@b.cl' }).valid).toBe(true);
  });

  it('creates, updates and deletes clients', () => {
    const client = addClient({ name: 'Globex', email: 'globex@example.com' });
    expect(client.code).toMatch(/^CLI-/);
    updateClient(client.id, { city: 'Valparaíso' });
    expect(loadClients().find((entry) => entry.id === client.id).city).toBe('Valparaíso');
    deleteClient(client.id);
    expect(loadClients().some((entry) => entry.id === client.id)).toBe(false);
  });

  it('assigns sequential order numbers and filters by client', () => {
    const buyer = addClient({ name: 'Compradora', email: 'compradora@example.com' });
    const other = addClient({ name: 'Otro cliente', email: 'otro@example.com' });
    const a = orderFor(buyer.id, '2026-01-01T10:00:00.000Z');
    const b = orderFor(buyer.id, '2026-02-01T10:00:00.000Z');
    orderFor(other.id, '2026-03-01T10:00:00.000Z');

    expect(a.orderNumber).toMatch(/^PED-\d{8}-0001$/);
    expect(b.orderNumber).toMatch(/^PED-\d{8}-0002$/);
    expect(loadOrders()).toHaveLength(15);

    const buyerOrders = ordersForClient(buyer.id);
    expect(buyerOrders).toHaveLength(2);
    expect(buyerOrders[0].id).toBe(b.id);
    expect(buyerOrders[1].id).toBe(a.id);
  });

  it('deletes a single order and cascades orders when deleting a client', () => {
    const inventoryClient = addClient({ name: 'Inventario', email: 'inv@example.com' });
    const first = orderFor(inventoryClient.id, '2026-04-01T10:00:00.000Z');
    orderFor(inventoryClient.id, '2026-04-02T10:00:00.000Z');

    deleteOrder(first.id);
    expect(ordersForClient(inventoryClient.id)).toHaveLength(1);

    expect(deleteOrdersForClient(inventoryClient.id)).toBe(true);
    expect(ordersForClient(inventoryClient.id)).toHaveLength(0);

    orderFor(inventoryClient.id, '2026-04-03T10:00:00.000Z');
    deleteClient(inventoryClient.id);
    expect(ordersForClient(inventoryClient.id)).toHaveLength(0);
  });

  it('masks credit limits for roles without owner/admin permission', () => {
    expect(maskCreditLimit('$2.500.000', 'customer')).toBe('•••••');
    expect(maskCreditLimit('$2.500.000', 'sales')).toBe('•••••');
    expect(maskCreditLimit('$2.500.000', 'admin')).toBe('$2.500.000');
  });
});
