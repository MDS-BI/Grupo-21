import { afterEach, beforeEach } from 'vitest';

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
