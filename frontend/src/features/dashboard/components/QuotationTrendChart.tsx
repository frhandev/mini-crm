import { Panel } from '@/components/shared/Panel';
import { money } from '@/lib/formatters';
import { total } from '@/preview/calculations';
import type { Quote } from '@/types/quotation';
import { useState } from 'react';

export function QuotationTrendChart({ quotes }: { quotes: Quote[] }) {
  const [months, setMonths] = useState(6);
  const values = ['Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas']
    .map((month, i) => ({
      month,
      value: quotes
        .filter((q) => new Date(q.createdAt).getUTCMonth() === 5 + i)
        .reduce((sum, q) => sum + total(q.items), 0),
    }))
    .slice(-months);
  const max = Math.max(50000, Math.ceil(Math.max(...values.map((v) => v.value)) / 50000) * 50000);
  const points = values.map((v, i) => [62 + (i * 492) / (months - 1), 140 - (v.value / max) * 120]);
  const line = points.map((p) => p.join(',')).join(' ');
  return (
    <Panel
      title="Teklif hareketi"
      action={
        <select
          aria-label="Grafik dönemi"
          value={months}
          onChange={(e) => setMonths(+e.target.value)}
        >
          <option value={6}>Son 6 ay</option>
          <option value={3}>Son 3 ay</option>
        </select>
      }
    >
      <div className="chart-body">
        <div className="legend">
          <i />
          Teklif tutarı
        </div>
        <svg
          viewBox="0 0 582 170"
          role="img"
          aria-label={values.map((v) => v.month + ' ' + money(v.value)).join(', ')}
        >
          {[0, 1, 2, 3, 4].map((n) => (
            <g key={n}>
              <line x1="60" x2="555" y1={20 + n * 30} y2={20 + n * 30} className="gridline" />
              <text x="48" y={24 + n * 30} textAnchor="end">
                {Math.round((max * (4 - n)) / 4000)} bin ₺
              </text>
            </g>
          ))}
          <polygon points={'62,140 ' + line + ' 554,140'} className="area" />
          <polyline points={line} className="chart-line" />
          {points.map(([x, y], i) => (
            <g key={x}>
              <circle cx={x} cy={y} r="4" className="point">
                <title>{money(values[i].value)}</title>
              </circle>
              <text x={x} y="163" textAnchor="middle">
                {values[i].month}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Panel>
  );
}
