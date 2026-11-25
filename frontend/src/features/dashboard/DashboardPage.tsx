import type { Go } from '@/preview/types';
import type { Activity } from '@/types/activity';
import type { Customer } from '@/types/customer';
import type { Quote } from '@/types/quotation';
import {
  ArrowRight,
  CalendarDays,
  CheckCheck,
  Files,
  Plus,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/shared/Header';
import { Empty } from '@/components/shared/Empty';
import { date, money } from '@/lib/formatters';
import { total } from '@/preview/calculations';
import { QuotationStatusChart } from './components/QuotationStatusChart';
import { QuotationTrendChart } from './components/QuotationTrendChart';
import { Panel } from '@/components/shared/Panel';
import { QuotationTable } from '../quotations/components/QuotationTable';

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
            <QuotationTrendChart quotes={quotes} />
            <QuotationStatusChart quotes={quotes} />
          </div>
          <Panel
            title="Son teklifler"
            action={
              <button className="link" onClick={() => go('quotes')}>
                Tüm teklifler <ArrowRight size={15} />
              </button>
            }
          >
            <QuotationTable rows={quotes.slice(0, 5)} customers={customers} go={go} />
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
