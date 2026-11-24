// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_CONFIG, ROLES, normalizeConfig, loadModuleConfig, setActiveConfig, getConfig,
  labelFor, getRole, setRole, canViewFinancials, canManageCatalog, canViewHistory,
  canViewStock, canViewMetrics, canAccessView, maskCreditLimit
} from '../../src/module-config.js';

beforeEach(() => {
  localStorage.clear();
  setActiveConfig(DEFAULT_CONFIG);
});

describe('module configuration', () => {
  it('falls back to defaults when no configuration is provided', () => {
    const config = normalizeConfig(null);
    expect(config.errors).toEqual([]);
    expect(config.moduleName).toBe(DEFAULT_CONFIG.moduleName);
    expect(config.labels.catalog).toBe('Catálogo');
  });

  it('accepts a sales-style profile and keeps unspecified labels', () => {
    const config = normalizeConfig({
      moduleName: 'Ventas',
      labels: { catalog: 'Tienda' }
    });
    expect(config.errors).toEqual([]);
    expect(config.moduleName).toBe('Ventas');
    expect(config.labels.catalog).toBe('Tienda');
    expect(config.labels.cart).toBe(DEFAULT_CONFIG.labels.cart);
  });

  it('reports an invalid module name instead of failing silently', () => {
    const config = normalizeConfig({ moduleName: '' });
    expect(config.errors.some((error) => error.includes('moduleName'))).toBe(true);
    expect(config.moduleName).toBe(DEFAULT_CONFIG.moduleName);
  });

  it('rejects custom fields with missing keys or base-field collisions', () => {
    const missing = normalizeConfig({ customFields: [{}] });
    expect(missing.errors.some((error) => error.includes('clave'))).toBe(true);

    const collision = normalizeConfig({
      customFields: [{ key: 'name', label: 'Nombre', type: 'text' }]
    });
    expect(collision.errors.some((error) => error.includes('choca con un campo base'))).toBe(true);
  });

  it('validates the theme accent color and keeps the default when invalid', () => {
    const invalid = normalizeConfig({ theme: { accentColor: '#12345' } });
    expect(invalid.errors.some((error) => error.includes('accentColor'))).toBe(true);
    expect(invalid.theme.accentColor).toBe(DEFAULT_CONFIG.theme.accentColor);

    const valid = normalizeConfig({ theme: { accentColor: '#0f62fe' } });
    expect(valid.errors).toEqual([]);
    expect(valid.theme.accentColor).toBe('#0f62fe');
  });

  it('loads a configuration through the public API', () => {
    const config = loadModuleConfig({ moduleName: 'Módulo de Ventas' });
    expect(config.moduleName).toBe('Módulo de Ventas');
    expect(getConfig().moduleName).toBe('Módulo de Ventas');
  });

  it('exposes configuration labels and falls back when a label is missing', () => {
    setActiveConfig(normalizeConfig({ labels: { metrics: 'Indicadores' } }));
    expect(labelFor('metrics')).toBe('Indicadores');
    expect(labelFor('unknownLabel', 'Respaldo')).toBe('Respaldo');
  });

  it('exposes exactly the three roles defined by the sales profile', () => {
    expect(ROLES).toEqual(['customer', 'sales', 'admin']);
    expect(Object.keys(DEFAULT_CONFIG.roles)).toEqual(['customer', 'sales', 'admin']);
    expect(DEFAULT_CONFIG.roles.sales.label).toBe('Vendedor');
    expect(DEFAULT_CONFIG.roles.admin.label).toBe('Dueño/Administrador');
    expect(getRole()).toBe('customer');
    expect(setRole('sales')).toBe('sales');
    expect(getRole()).toBe('sales');
  });

  it('derives every permission from the active role', () => {
    expect(canViewFinancials('admin')).toBe(true);
    expect(canViewFinancials('sales')).toBe(false);
    expect(canViewFinancials('customer')).toBe(false);
    expect(canManageCatalog('admin')).toBe(true);
    expect(canViewHistory('customer')).toBe(true);
    expect(canViewHistory('sales')).toBe(true);
    expect(canViewStock('sales')).toBe(true);
    expect(canViewStock('customer')).toBe(false);
    expect(canViewMetrics('admin')).toBe(true);
    expect(canViewMetrics('sales')).toBe(false);
    expect(canAccessView('customer', 'catalog')).toBe(true);
    expect(canAccessView('customer', 'metrics')).toBe(false);
    expect(canAccessView('admin', 'metrics')).toBe(true);
  });

  it('masks credit limits for roles without financial permission', () => {
    expect(maskCreditLimit('$100', 'sales')).toBe('•••••');
    expect(maskCreditLimit('$100', 'customer')).toBe('•••••');
    expect(maskCreditLimit('$100', 'admin')).toBe('$100');
  });
});
