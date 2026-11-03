import { boot } from './app.js';

export { boot };

if (typeof window !== 'undefined') {
  boot(window.__ERP_CONFIG__);
}
