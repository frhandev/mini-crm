import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Header } from '@/components/shared/Header';
import { Panel } from '@/components/shared/Panel';
import { SearchBox } from '@/components/shared/SearchBox';
import { Pages } from '@/components/shared/Pages';
import { Empty } from '@/components/shared/Empty';

import { QuotationTable } from './components/QuotationTable';

import { statusLabels } from '@/lib/status-labels';

import type { Customer } from '@/types/customer';
import type { Quote } from '@/types/quotation';
import type { Go } from '@/preview/types';

type QuotationsPageProps = {
  customers: Customer[];
  quotes: Quote[];
  go: Go;
};

export function QuotationsPage({ customers, quotes, go }: QuotationsPageProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [company, setCompany] = useState('');
  const [order, setOrder] = useState('new');
  const [page, setPage] = useState(1);

  const query = search.trim().toLocaleLowerCase('tr');
  const size = 6;

  const offers = quotes
    .filter(
      (q) =>
        (!filter || q.status === filter) &&
        (!company || q.customerId === company) &&
        q.reference.toLowerCase().includes(query),
    )
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) * (order === 'new' ? -1 : 1));

  const count = offers.length;
  const start = (page - 1) * size;

  return (
    <>
      <Header title="Teklifler" description="Satış tekliflerini ve güncel durumlarını takip edin.">
        <Button onClick={() => go('newQuote')}>
          <Plus />
          Yeni Teklif
        </Button>
      </Header>

      <Panel title="Teklif listesi">
        <div className="toolbar">
          {/* Search */}
          <SearchBox
            value={search}
            change={(v) => {
              setSearch(v);
              setPage(1);
            }}
            hint="Teklif numarası ara"
          />

          {/* Quotation status filter */}
          <select
            aria-label="Durum"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tüm durumlar</option>

            {Object.entries(statusLabels).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>

          {/* Customer filter */}
          <select
            aria-label="Müşteri"
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tüm müşteriler</option>

            {customers.map((c) => (
              <option value={c.id} key={c.id}>
                {c.companyName}
              </option>
            ))}
          </select>

          {/* Sorting */}
          <select
            aria-label="Tarihe göre sırala"
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              setPage(1);
            }}
          >
            <option value="new">En yeni önce</option>
            <option value="old">En eski önce</option>
          </select>
        </div>

        {/* Quotation table */}
        {!count ? (
          <Empty
            text={search || filter || company ? 'Aramanızla eşleşen kayıt bulunamadı.' : undefined}
          />
        ) : (
          <QuotationTable rows={offers.slice(start, start + size)} customers={customers} go={go} />
        )}

        <Pages count={count} page={page} size={size} change={setPage} />
      </Panel>
    </>
  );
}
