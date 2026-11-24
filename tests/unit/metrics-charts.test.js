import { describe, expect, it } from 'vitest';
import {
  revenueByCategoryChart,
  salesByDateChart,
  statusDistributionChart,
  rankingProgress
} from '../../src/components/metrics-charts.js';

describe('metrics charts', () => {
  it('renders an accessible category bar chart with clickable filters and a fallback table', () => {
    const markup = revenueByCategoryChart([
      { category: 'Knit', revenue: 90000, units: 3 },
      { category: 'Poleras', revenue: 45000, units: 2 }
    ]);
    expect(markup).toContain('role="img"');
    expect(markup).toContain('aria-label="Gráfico de barras de ingresos por categoría"');
    expect(markup).toContain('data-chart-category="Knit"');
    expect(markup).toContain('title="Filtrar métricas por Knit"');
    expect(markup).toContain('style="width: 100%"');
    expect(markup).toContain('style="width: 50%"');
    expect(markup).toContain('<table class="sr-only">');
    expect(markup).toContain('Ingresos por categoría');
  });

  it('renders an accessible sales evolution chart with clickable dates', () => {
    const markup = salesByDateChart([
      { date: '2026-10-01', revenue: 100000, salesCount: 1 },
      { date: '2026-10-05', revenue: 50000, salesCount: 1 }
    ]);
    expect(markup).toContain('data-chart="sales-date"');
    expect(markup).toContain('data-chart-date="2026-10-01"');
    expect(markup).toContain('style="height: 100%"');
    expect(markup).toContain('aria-label="Filtrar por 2026-10-05"');
    expect(markup).toContain('Evolución de ventas por fecha');
  });

  it('renders proportional status segments with semantic tones', () => {
    const markup = statusDistributionChart([
      { status: 'Facturado', count: 3, percentage: 75, tone: 'success' },
      { status: 'Cancelado', count: 1, percentage: 25, tone: 'danger' }
    ]);
    expect(markup).toContain('status-chart__segment--success');
    expect(markup).toContain('status-chart__segment--danger');
    expect(markup).toContain('style="width: 75%"');
    expect(markup).toContain('75 %');
    expect(markup).toContain('Distribución proporcional de documentos por estado');
  });

  it('uses an empty state when a chart has no data', () => {
    expect(revenueByCategoryChart([])).toContain('No hay ingresos por categoría');
    expect(salesByDateChart([])).toContain('No hay ventas');
    expect(statusDistributionChart([
      { status: 'Pedido', count: 0, percentage: 0, tone: 'info' }
    ])).toContain('No hay documentos');
  });

  it('renders clamped and escaped ranking progress bars', () => {
    const markup = rankingProgress({ name: '<img src=x>', progressPercent: 250 });
    expect(markup).toContain('role="img"');
    expect(markup).toContain('&lt;img src=x&gt;');
    expect(markup).toContain('style="width: 100%"');
    expect(rankingProgress({ progressPercent: -10 })).toContain('style="width: 0%"');
  });
});
