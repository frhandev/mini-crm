import { useState } from 'react';
import { Tabs } from 'radix-ui';
import { ArrowUpRight, Plus, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Header,
  Panel,
  SearchBox,
  Pages,
  Table,
  Empty,
  StatusBadge,
  Field,
  Modal,
  PreviewNotice,
} from '@/components/shared/Elements';
import {
  date,
  money,
  total,
  statusLabels,
  type Customer,
  type Quote,
  type Go,
  type Scenario,
} from '@/lib/model';
export function QuoteTable({
  rows,
  customers,
  go,
}: {
  rows: Quote[];
  customers: Customer[];
  go: Go;
}) {
  return (
    <Table heads={['Teklif no', 'Müşteri', 'Tarih', 'Teklif tutarı', 'Durum', 'İşlem']}>
      {rows.map((q) => (
        <tr key={q.id}>
          <td>
            <button className="reference" onClick={() => go('quote', q.id)}>
              {q.reference}
            </button>
          </td>
          <td>{customers.find((c) => c.id === q.customerId)?.companyName}</td>
          <td>{date(q.createdAt)}</td>
          <td className="numeric">{money(total(q.items))}</td>
          <td>
            <StatusBadge status={q.status} />
          </td>
          <td>
            {q.status === 'Draft' ? (
              <button className="link" onClick={() => go('editQuote', q.id)}>
                Düzenle
              </button>
            ) : (
              <button
                title="Teklifi aç"
                aria-label={q.reference + ' detayları'}
                onClick={() => go('quote', q.id)}
              >
                <ArrowUpRight size={17} />
              </button>
            )}
          </td>
        </tr>
      ))}
    </Table>
  );
}
export function Records({
  customers,
  quotes,
  kind,
  go,
}: {
  customers: Customer[];
  quotes: Quote[];
  kind: 'customers' | 'quotes';
  go: Go;
}) {
  const [search, setSearch] = useState(''),
    [filter, setFilter] = useState(''),
    [company, setCompany] = useState(''),
    [order, setOrder] = useState('new'),
    [page, setPage] = useState(1);
  const isCustomer = kind === 'customers';
  const query = search.trim().toLocaleLowerCase('tr');
  const size = 6;
  const byDate = (a: { createdAt: string }, b: { createdAt: string }) =>
    a.createdAt.localeCompare(b.createdAt) * (order === 'new' ? -1 : 1);
  const clients = customers
    .filter(
      (c) =>
        (!filter || String(c.isArchived) === filter) &&
        [c.name, c.companyName, c.email].some((v) => v.toLocaleLowerCase('tr').includes(query)),
    )
    .sort(byDate);
  const offers = quotes
    .filter(
      (q) =>
        (!filter || q.status === filter) &&
        (!company || q.customerId === company) &&
        q.reference.toLowerCase().includes(query),
    )
    .sort(byDate);
  const count = isCustomer ? clients.length : offers.length;
  const start = (page - 1) * size;
  return (
    <>
      <Header
        title={isCustomer ? 'Müşteriler' : 'Teklifler'}
        description={
          isCustomer
            ? 'Müşteri kayıtlarını ve iletişim bilgilerini yönetin.'
            : 'Satış tekliflerini ve güncel durumlarını takip edin.'
        }
      >
        <Button onClick={() => go(isCustomer ? 'newCustomer' : 'newQuote')}>
          <Plus />
          {isCustomer ? 'Yeni Müşteri' : 'Yeni Teklif'}
        </Button>
      </Header>
      <Panel title={isCustomer ? 'Müşteri listesi' : 'Teklif listesi'}>
        <div className="toolbar">
          <SearchBox
            value={search}
            change={(v) => {
              setSearch(v);
              setPage(1);
            }}
            hint={isCustomer ? 'Ad, şirket veya e-posta ara' : 'Teklif numarası ara'}
          />
          <select
            aria-label="Durum"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Tüm durumlar</option>
            {isCustomer ? (
              <>
                <option value="false">Aktif</option>
                <option value="true">Arşivlendi</option>
              </>
            ) : (
              Object.entries(statusLabels).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))
            )}
          </select>
          {!isCustomer && (
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
          )}
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
        {!count ? (
          <Empty
            text={search || filter || company ? 'Aramanızla eşleşen kayıt bulunamadı.' : undefined}
          />
        ) : isCustomer ? (
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
        ) : (
          <QuoteTable rows={offers.slice(start, start + size)} customers={customers} go={go} />
        )}
        <Pages count={count} page={page} size={size} change={setPage} />
      </Panel>
    </>
  );
}
export function CustomerDetail({
  customer: c,
  quotes,
  go,
  admin,
}: {
  customer: Customer;
  quotes: Quote[];
  go: Go;
  admin: boolean;
}) {
  const [archive, setArchive] = useState(false),
    [done, setDone] = useState(false);
  const history = quotes.filter((q) => q.customerId === c.id);
  return (
    <>
      <Header title={c.companyName} description="Müşteri kaydı ve teklif geçmişi">
        <Button variant="outline" onClick={() => go('editCustomer', c.id)}>
          Düzenle
        </Button>
        {!c.isArchived && (
          <Button onClick={() => go('newQuote', c.id)}>
            <Plus />
            Yeni Teklif
          </Button>
        )}
      </Header>
      <Tabs.Root defaultValue="details" className="stack">
        <Tabs.List aria-label="Müşteri kaydı" className="record-tabs">
          <Tabs.Trigger value="details">Müşteri bilgileri</Tabs.Trigger>
          <Tabs.Trigger value="history">Teklif geçmişi ({history.length})</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="details">
          <Panel title="Müşteri bilgileri" action={<Building2 />}>
            <dl className="facts">
              {[
                ['Yetkili', c.name],
                ['E-posta', c.email],
                ['Telefon', c.phone],
                ['Oluşturulma', date(c.createdAt)],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
              <div>
                <dt>Durum</dt>
                <dd>
                  <StatusBadge status={c.isArchived ? 'Archived' : 'Active'} />
                </dd>
              </div>
            </dl>
            {admin && !c.isArchived && (
              <div className="panel-foot">
                <Button variant="outline" onClick={() => setArchive(true)}>
                  Müşteriyi arşivle
                </Button>
              </div>
            )}
          </Panel>
        </Tabs.Content>
        <Tabs.Content value="history">
          <Panel title="Teklif geçmişi">
            {history.length ? <QuoteTable rows={history} customers={[c]} go={go} /> : <Empty />}
          </Panel>
        </Tabs.Content>
      </Tabs.Root>
      {archive && (
        <Modal title="Müşteri arşivlensin mi?" close={() => setArchive(false)}>
          <p>
            {c.companyName} arşive taşınır. Kayıt ve teklif geçmişi korunur. Arşivlenen müşteri için
            yeni teklif oluşturulamaz.
          </p>
          <div className="actions">
            <Button variant="outline" onClick={() => setArchive(false)}>
              Vazgeç
            </Button>
            <Button
              onClick={() => {
                setArchive(false);
                setDone(true);
              }}
            >
              Arşivlemeyi önizle
            </Button>
          </div>
        </Modal>
      )}
      {done && <PreviewNotice />}
    </>
  );
}
export function CustomerForm({
  customer,
  go,
  scenario,
}: {
  customer?: Customer;
  go: Go;
  scenario: Scenario;
}) {
  const [done, setDone] = useState(false);
  return (
    <>
      <Header
        title={customer ? 'Müşteriyi Düzenle' : 'Yeni Müşteri'}
        description="Şirket ve yetkili kişi bilgilerini girin."
      />
      <Panel title="İletişim bilgileri">
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          {customer?.isArchived && (
            <p className="notice">Arşiv kaydı · Düzenleme politikası henüz belirlenmedi.</p>
          )}
          <div className="fields">
            <Field label="Yetkili adı" defaultValue={customer?.name} />
            <Field label="Şirket adı" defaultValue={customer?.companyName} />
            <Field
              label="E-posta"
              type="email"
              defaultValue={customer?.email}
              error={scenario === 'invalid' ? 'Geçerli bir e-posta adresi girin.' : undefined}
            />
            <Field label="Telefon" type="tel" defaultValue={customer?.phone} />
          </div>
          <div className="actions">
            <Button type="submit">Kaydet</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => go(customer ? 'customer' : 'customers', customer?.id)}
            >
              Vazgeç
            </Button>
          </div>
          {done && <PreviewNotice />}
        </form>
      </Panel>
    </>
  );
}
