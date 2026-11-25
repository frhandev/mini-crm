import { Panel } from '@/components/shared/Panel';
import { statusLabels } from '@/lib/status-labels';
import { type Quote, type Status } from '@/types/quotation';

export function QuotationStatusChart({ quotes }: { quotes: Quote[] }) {
  const rows = (Object.keys(statusLabels) as Status[]).map((status) => ({
    status,
    count: quotes.filter((q) => q.status === status).length,
  }));
  return (
    <Panel title="Teklif durumları">
      <div className="distribution">
        <div className="ringchart">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            {rows.map(({ status, count }, i) => {
              const start =
                (rows.slice(0, i).reduce((n, r) => n + r.count, 0) / quotes.length) * 100;
              return (
                <circle
                  key={status}
                  className={'arc ' + status}
                  cx="50"
                  cy="50"
                  r="41"
                  pathLength="100"
                  strokeDasharray={Math.max(0, (count / quotes.length) * 100 - 1) + ' 100'}
                  strokeDashoffset={-start}
                  transform="rotate(-90 50 50)"
                />
              );
            })}
          </svg>
          <div>
            <strong>{quotes.length}</strong>
            <small>teklif</small>
          </div>
        </div>
        <ul>
          {rows.map((r) => (
            <li key={r.status}>
              <i className={'dot ' + r.status} />
              {statusLabels[r.status]}
              <b>{r.count}</b>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
