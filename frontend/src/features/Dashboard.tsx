import { useState } from 'react';
import {
  ArrowRight,
  Users,
  Files,
  Wallet,
  CheckCheck,
  Plus,
  UserPlus,
  CalendarDays,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header, Panel, Empty } from '@/components/shared/Elements';
import { QuoteTable } from './Records';
import {
  money,
  total,
  statusLabels,
  date,
  type Status,
  type Customer,
  type Quote,
  type Go,
  type Activity,
} from '@/lib/model';
function Trend({ quotes }: { quotes: Quote[] }) {
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
function Distribution({ quotes }: { quotes: Quote[] }) {
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
export function Dashboard({
  customers,
  quotes,
  activities,
  go,
  empty,
}: {
  customers: Customer[];
  quotes: Quote[];
  activities: Activity[];
  go: Go;
  empty: boolean;
}) {
  const accepted = quotes.filter((q) => q.status === 'Accepted');
  const cards = [
    {
      label: 'Toplam müşteri',
      value: customers.length,
      sub: customers.filter((c) => !c.isArchived).length + ' aktif müşteri',
      icon: Users,
    },
    {
      label: 'Toplam teklif',
      value: quotes.length,
      sub: quotes.filter((q) => q.status === 'Draft').length + ' taslak teklif',
      icon: Files,
    },
    {
      label: 'Toplam teklif tutarı',
      value: money(quotes.reduce((n, q) => n + total(q.items), 0)),
      sub: 'Tüm teklifler',
      icon: Wallet,
    },
    {
      label: 'Kabul edilen',
      value: accepted.length,
      sub: money(accepted.reduce((n, q) => n + total(q.items), 0)) + ' teklif tutarı',
      icon: CheckCheck,
    },
  ];
  return (
    <>
      <Header title="Genel Bakış" description="Müşterileriniz ve satış teklifleriniz bir arada.">
        <Button variant="outline" onClick={() => go('newCustomer')}>
          <UserPlus />
          Yeni Müşteri
        </Button>
        <Button onClick={() => go('newQuote')}>
          <Plus />
          Yeni Teklif
        </Button>
      </Header>
      <div className="overview-label">
        <h2>Satış özeti</h2>
        <span>
          <CalendarDays size={15} />
          25 Kasım 2026
        </span>
      </div>
      <div className="stats">
        {cards.map(({ label, value, sub, icon: Icon }, i) => (
          <section className="stat" key={label}>
            <div>
              <span className={'stat-icon tone-' + i}>
                <Icon size={17} />
              </span>
              <h3>{label}</h3>
            </div>
            <strong>{empty ? 0 : value}</strong>
            <small>{empty ? 'Henüz veri yok' : sub}</small>
          </section>
        ))}
      </div>
      {empty ? (
        <Empty text="Satış hareketleri ilk teklifinizle burada görünecek." />
      ) : (
        <>
          <div className="charts">
            <Trend quotes={quotes} />
            <Distribution quotes={quotes} />
          </div>
          <Panel
            title="Son teklifler"
            action={
              <button className="link" onClick={() => go('quotes')}>
                Tüm teklifler <ArrowRight size={15} />
              </button>
            }
          >
            <QuoteTable rows={quotes.slice(0, 5)} customers={customers} go={go} />
          </Panel>
          <Panel title="Son müşteri hareketleri">
            <ul className="activity-feed">
              {activities.slice(0, 3).map((a) => (
                <li key={a.id}>
                  <UserPlus size={17} />
                  <button className="reference" onClick={() => go('customer', a.id)}>
                    {a.description}
                  </button>
                  <span>{a.action}</span>
                  <small>{date(a.date)}</small>
                </li>
              ))}
            </ul>
          </Panel>
        </>
      )}
    </>
  );
}
