// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_CONFIG, ROLES, getRole, setRole, setActiveConfig, canViewFinancials,
  canManageCatalog, canViewHistory, canViewStock, canViewMetrics, canAccessView
} from '../../src/module-config.js';

beforeEach(() => {
  localStorage.clear();
  setActiveConfig(DEFAULT_CONFIG);
});

describe('role permissions', () => {
  it('exposes a customer role with purchase and history access', () => {
    expect(DEFAULT_CONFIG.roles.customer).toBeTruthy();
    expect(canViewHistory('customer')).toBe(true);
    expect(canViewStock('customer')).toBe(false);
    expect(canViewMetrics('customer')).toBe(false);
    expect(canManageCatalog('customer')).toBe(false);
    expect(canAccessView('customer', 'catalog')).toBe(true);
    expect(canAccessView('customer', 'cart')).toBe(true);
    expect(canAccessView('customer', 'history')).toBe(true);
  });

  it('gives the seller history and stock visibility but no metrics or catalog editing', () => {
    expect(DEFAULT_CONFIG.roles.sales.label).toBe('Vendedor');
    expect(canViewHistory('sales')).toBe(true);
    expect(canViewStock('sales')).toBe(true);
    expect(canViewMetrics('sales')).toBe(false);
    expect(canManageCatalog('sales')).toBe(false);
  });

  it('reserves global metrics and catalog management for the owner/admin', () => {
    expect(canViewMetrics('admin')).toBe(true);
    expect(canManageCatalog('admin')).toBe(true);
    expect(canViewHistory('admin')).toBe(true);
    expect(canViewFinancials('admin')).toBe(true);
    expect(canAccessView('admin', 'metrics')).toBe(true);
  });

  it('restricts financial data exclusively to the owner/admin role', () => {
    expect(ROLES).toEqual(['customer', 'sales', 'admin']);
    expect(canViewFinancials('admin')).toBe(true);
    expect(canViewFinancials('sales')).toBe(false);
    expect(canViewFinancials('customer')).toBe(false);
    expect(canViewMetrics('admin')).toBe(true);
  });

  it('blocks direct access to restricted views', () => {
    expect(canAccessView('customer', 'admin')).toBe(false);
    expect(canAccessView('customer', 'metrics')).toBe(false);
    expect(canAccessView('sales', 'metrics')).toBe(false);
    expect(canAccessView('sales', 'admin')).toBe(false);
  });

  it('persists the active role and returns to customer on logout', () => {
    setRole('admin');
    expect(getRole()).toBe('admin');
    expect(localStorage.getItem('erp.role')).toBe('admin');
    setRole('customer');
    expect(getRole()).toBe('customer');
    setRole('unknown');
    expect(getRole()).toBe('customer');
  });
});
