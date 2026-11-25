// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { mountMarkup, startApp, clickNav, changeValue, submitForm, buyFromCatalog } from '../helpers/app-fixture.js';

const ANNOUNCEMENT = 'ENVÍO GRATIS SOBRE $99.000 CLP · COLECCIÓN ROOTSOUTH 2026 · CUPÓN BIENVENIDO10 — 10% OFF · DESPACHO A TODO CHILE · CAMBIOS Y DEVOLUCIONES FÁCILES';

async function bootAs(role) {
  if (role) localStorage.setItem('erp.role', role);
  return startApp();
}

function unlockAdmin(code = '1234') {
  document.getElementById('admin-code').value = code;
  submitForm(document.getElementById('admin-access'));
}

function pressEscape() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
}

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  mountMarkup();
});

describe('editorial header shell', () => {
  it('renders the announcement bar and the three-zone navigation', async () => {
    await bootAs('customer');

    const messages = document.querySelectorAll('.announcement-track .announcement-message');
    expect(messages).toHaveLength(2);
    expect(messages[0].textContent).toBe(ANNOUNCEMENT);
    expect(messages[1].textContent).toBe(ANNOUNCEMENT);
    expect(messages[1].getAttribute('aria-hidden')).toBe('true');
    expect(document.querySelector('.announcement-bar').contains(document.querySelector('.announcement-track'))).toBe(true);
    const left = document.querySelector('.nav-header__left');
    const center = document.querySelector('.nav-header__center');
    const right = document.querySelector('.nav-header__right');
    expect(left).not.toBeNull();
    expect(center).not.toBeNull();
    expect(right).not.toBeNull();
    expect(left.contains(document.getElementById('shop-menu-toggle'))).toBe(true);
    expect(left.contains(document.getElementById('manage-menu-toggle'))).toBe(true);
    expect(center.contains(document.getElementById('brand-name'))).toBe(true);
    expect(document.querySelector('.brand__mark')).toBeNull();
    expect(right.contains(document.getElementById('profile-toggle'))).toBe(true);
    expect(right.contains(document.getElementById('cart-toggle'))).toBe(true);
    expect(document.getElementById('brand-name').textContent).toBe('ROOTSOUTH®');
    expect(document.getElementById('brand-name').closest('a')).not.toBeNull();
  });

  it('exposes accessible toggles and the TIENDA menu contents', async () => {
    await bootAs('customer');

    const shopToggle = document.getElementById('shop-menu-toggle');
    const manageToggle = document.getElementById('manage-menu-toggle');
    const profileToggle = document.getElementById('profile-toggle');
    expect(shopToggle.getAttribute('aria-expanded')).toBe('false');
    expect(shopToggle.getAttribute('aria-controls')).toBe('shop-menu');
    expect(document.getElementById('shop-menu').hidden).toBe(true);
    expect(manageToggle.hidden).toBe(true);
    expect(profileToggle.getAttribute('aria-controls')).toBe('profile-panel');
    expect(document.getElementById('profile-panel').hidden).toBe(true);

    expect(document.querySelector('#shop-menu [data-shop-view="all"]').textContent).toContain('Ver todo');
    expect(document.querySelector('#shop-menu [data-shop-view="featured"]').textContent).toContain('Destacados');
    for (const label of ['Knit', 'Poleras', 'Polerones', 'Accesorios']) {
      expect(document.querySelector(`#shop-menu [data-shop-view="${label}"]`).textContent).toContain(label);
    }
    expect(document.querySelector('#shop-menu .menu-thumb').getAttribute('src')).toBe('/images/producto-1.jpg');
  });

  it('opens only one panel at a time and closes it on outside click or Escape', async () => {
    await bootAs('admin');
    const profileToggle = document.getElementById('profile-toggle');
    const shopToggle = document.getElementById('shop-menu-toggle');

    profileToggle.click();
    expect(document.getElementById('profile-panel').hidden).toBe(false);
    expect(profileToggle.getAttribute('aria-expanded')).toBe('true');

    shopToggle.click();
    expect(document.getElementById('profile-panel').hidden).toBe(true);
    expect(profileToggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.getElementById('shop-menu').hidden).toBe(false);
    expect(shopToggle.getAttribute('aria-expanded')).toBe('true');

    document.body.click();
    expect(document.getElementById('shop-menu').hidden).toBe(true);
    expect(shopToggle.getAttribute('aria-expanded')).toBe('false');

    profileToggle.click();
    pressEscape();
    expect(document.getElementById('profile-panel').hidden).toBe(true);
    expect(profileToggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(profileToggle);
  });

  it('closes open panels on navigation, role change and logout', async () => {
    await bootAs('admin');
    unlockAdmin();
    const manageToggle = document.getElementById('manage-menu-toggle');
    const profileToggle = document.getElementById('profile-toggle');

    manageToggle.click();
    expect(document.getElementById('manage-menu').hidden).toBe(false);
    clickNav('admin');
    expect(document.getElementById('manage-menu').hidden).toBe(true);
    expect(manageToggle.getAttribute('aria-expanded')).toBe('false');

    profileToggle.click();
    changeValue(document.getElementById('role-select'), 'sales');
    expect(document.getElementById('profile-panel').hidden).toBe(true);

    profileToggle.click();
    document.getElementById('role-logout').click();
    expect(document.getElementById('profile-panel').hidden).toBe(true);
    expect(localStorage.getItem('erp.role')).toBe('customer');
  });

  it('keeps the cart count inside the top-level cart control', async () => {
    await bootAs('customer');
    buyFromCatalog('prod-jockey');
    buyFromCatalog('prod-jockey');
    expect(document.getElementById('cart-toggle').contains(document.getElementById('cart-count'))).toBe(true);
    expect(document.getElementById('cart-count').textContent).toBe('2');
    expect(document.getElementById('cart-toggle').getAttribute('aria-label')).toContain('2');
  });

  it('maps the visible role controls to the requested access matrix', async () => {
    await bootAs('customer');
    expect(document.getElementById('manage-menu-toggle').hidden).toBe(true);
    expect(document.querySelector('#manage-menu [data-view="history"]').hidden).toBe(true);
    expect(document.getElementById('role-logout').hidden).toBe(true);

    changeValue(document.getElementById('role-select'), 'sales');
    expect(document.getElementById('manage-menu-toggle').hidden).toBe(false);
    expect(document.querySelector('#manage-menu [data-view="history"]').hidden).toBe(false);
    expect(document.querySelector('#manage-menu [data-view="admin"]').hidden).toBe(true);
    expect(document.querySelector('#manage-menu [data-view="metrics"]').hidden).toBe(true);
    expect(document.getElementById('role-logout').hidden).toBe(false);

    changeValue(document.getElementById('role-select'), 'admin');
    expect(document.getElementById('admin-access').hidden).toBe(false);
    expect(document.getElementById('admin-access-error').hidden).toBe(true);
    expect(document.getElementById('role-logout').hidden).toBe(true);
    expect(document.getElementById('manage-menu-toggle').hidden).toBe(true);
    expect(document.querySelector('#manage-menu [data-view="history"]').hidden).toBe(true);
    expect(document.querySelector('#manage-menu [data-view="admin"]').hidden).toBe(true);
    expect(document.querySelector('#manage-menu [data-view="metrics"]').hidden).toBe(true);

    unlockAdmin();
    expect(document.getElementById('admin-access').hidden).toBe(true);
    expect(document.getElementById('role-logout').hidden).toBe(false);
    expect(document.getElementById('manage-menu-toggle').hidden).toBe(false);
    expect(document.querySelector('#manage-menu [data-view="history"]').hidden).toBe(false);
    expect(document.querySelector('#manage-menu [data-view="admin"]').hidden).toBe(false);
    expect(document.querySelector('#manage-menu [data-view="metrics"]').hidden).toBe(false);
  });

  it('defines the editorial header and final Hero rules in CSS', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8').toLowerCase();

    expect(css).toContain('.announcement-bar');
    expect(css).toContain('.nav-header');
    expect(css).toContain('.nav-header__center');
    expect(css).toContain('left: 0');
    expect(css).not.toMatch(/#shop-menu\s*\{[^}]*translatex\(-50%\)/);
    expect(css).toContain('.profile-container');
    expect(css).toContain('position: relative');
    expect(css).toContain('#profile-panel.header-menu--profile');
    expect(css).toContain('right: 0');
    expect(css).toContain('left: auto');
    expect(css).toContain('overflow: hidden');
    expect(css).toContain('@keyframes announcement-marquee');
    expect(css).toContain('translatex(-50%)');
    expect(css).toContain('linear infinite');
    expect(css).toContain('animation-play-state: paused');
    expect(css).toContain('.menu-thumb');
    expect(css).toContain('.hero__content');
    expect(css).toContain('#111111');
    expect(css).toContain('#ffffff');
    expect(css).toContain('linear-gradient(90deg, rgba(0, 0, 0, 0.68) 0%, rgba(0, 0, 0, 0.2) 100%)');
    expect(css).not.toContain('rgba(0, 0, 0, 0.72)');
    expect(css).not.toContain('rgba(10, 10, 10, 0.92)');
    expect(css.lastIndexOf('#view-catalog .view-header')).toBeGreaterThan(css.indexOf('background-image: none !important'));
    expect(css.lastIndexOf('#view-catalog .hero__eyebrow')).toBeGreaterThan(css.indexOf('.hero__eyebrow {'));
  });
});
