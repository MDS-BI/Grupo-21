import { escapeHtml } from '../utils.js';

export function productFilters({ categories = [], category = 'all', maxPrice = '' } = {}) {
  const options = ['<option value="all">Todas las categorías</option>']
    .concat(categories.map((entry) => {
      const selected = entry === category ? ' selected' : '';
      return `<option value="${escapeHtml(entry)}"${selected}>${escapeHtml(entry)}</option>`;
    }))
    .join('');

  return `
    <form id="product-filter-form" class="filter-bar" role="search" aria-label="Filtros de catálogo">
      <label class="field field--inline">
        <span>Categoría</span>
        <select id="filter-category" name="category">${options}</select>
      </label>
      <label class="field field--inline">
        <span>Precio máximo</span>
        <input id="filter-max-price" name="maxPrice" type="number" min="0" step="1000"
          placeholder="Ej. 500000" value="${escapeHtml(maxPrice)}" />
      </label>
      <button type="button" id="filter-reset" class="btn btn--ghost">Limpiar filtros</button>
    </form>
  `;
}
