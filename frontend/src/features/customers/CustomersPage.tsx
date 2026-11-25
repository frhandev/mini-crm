import { useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Header } from '@/components/shared/Header';
import { Panel } from '@/components/shared/Panel';
import { SearchBox } from '@/components/shared/SearchBox';
import { Pages } from '@/components/shared/Pages';
import { Table } from '@/components/shared/Table';
import { Empty } from '@/components/shared/Empty';
import { StatusBadge } from '@/components/shared/StatusBadge';

import { date } from '@/lib/formatters';

import type { Customer } from '@/types/customer';
import type { Go } from '@/preview/types';

type CustomersPageProps = {
  customers: Customer[];
  go: Go;
};

export function CustomersPage({ customers, go }: CustomersPageProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [order, setOrder] = useState('new');
  const [page, setPage] = useState(1);

  const query = search.trim().toLocaleLowerCase('tr');
  const size = 6;

  const clients = customers
    .filter(
      (c) =>
        (!filter || String(c.isArchived) === filter) &&
        [c.name, c.companyName, c.email].some((v) => v.toLocaleLowerCase('tr').includes(query)),
    )
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) * (order === 'new' ? -1 : 1));

  const count = clients.length;
  const start = (page - 1) * size;

  return (
    <>
      <Header title="Müşteriler" description="Müşteri kayıtlarını ve iletişim bilgilerini yönetin.">
        <Button onClick={() => go('newCustomer')}>
          <Plus />
          Yeni Müşteri
        </Button>
      </Header>

      <Panel title="Müşteri listesi">
        <div className="toolbar">
          {/* Search */}
          <SearchBox
            value={search}
            change={(v) => {
              setSearch(v);
              setPage(1);
            }}
            hint="Ad, şirket veya e-posta ara"
          />

          {/* Customer status filter */}
          <select
            aria-label="Durum"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tüm durumlar</option>
            <option value="false">Aktif</option>
            <option value="true">Arşivlendi</option>
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

        {/* Customer table */}
        {!count ? (
          <Empty text={search || filter ? 'Aramanızla eşleşen kayıt bulunamadı.' : undefined} />
        ) : (
          <Table
            heads={['Şirket / Yetkili', 'E-posta', 'Telefon', 'Durum', 'Oluşturulma', 'İşlem']}
          >
            {clients.slice(start, start + size).map((c) => (
              <tr key={c.id}>
                <td>
                  <button className="reference" onClick={() => go('customer', c.id)}>
                    {c.companyName}
                  </button>

                  <small>{c.name}</small>
                </td>

                <td>{c.email}</td>
                <td>{c.phone}</td>

                <td>
                  <StatusBadge status={c.isArchived ? 'Archived' : 'Active'} />
                </td>

                <td>{date(c.createdAt)}</td>

                <td>
                  <button className="link" onClick={() => go('editCustomer', c.id)}>
                    Düzenle
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        )}

        <Pages count={count} page={page} size={size} change={setPage} />
      </Panel>
    </>
  );
}
