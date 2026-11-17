import { afterEach, beforeEach } from 'vitest';

const jsdomStorage = globalThis.jsdom?.window?.localStorage;
if (!globalThis.localStorage && jsdomStorage) {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    writable: true,
    value: jsdomStorage
  });
}

function clearStorage() {
  try {
    globalThis.localStorage?.clear();
  } catch {
    // Sin localStorage disponible (entorno Node puro).
  }
}

beforeEach(() => {
  clearStorage();
});

afterEach(() => {
  clearStorage();
});
