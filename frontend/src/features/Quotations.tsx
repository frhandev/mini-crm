import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Panel,
  Table,
  Header,
  Field,
  Modal,
  StatusBadge,
  PreviewNotice,
  Empty,
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
  type Status,
  type Item,
} from '@/lib/model';
export function QuoteDetail({
  quote: q,
  customer,
  go,
  scenario,
}: {
  quote: Quote;
  customer: Customer;
  go: Go;
  scenario: Scenario;
}) {
  const [target, setTarget] = useState<Status | null>(null),
    [done, setDone] = useState(false);
  const timeline: Status[] =
    q.status === 'Draft'
      ? ['Draft']
      : q.status === 'Sent'
        ? ['Draft', 'Sent']
        : ['Draft', 'Sent', q.status];
  const transitions: Status[] =
    q.status === 'Draft' ? ['Sent'] : q.status === 'Sent' ? ['Accepted', 'Rejected'] : [];
  return (
    <>
      <Header title={q.reference} description={customer.companyName + ' · ' + date(q.createdAt)}>
        {q.status === 'Draft' && (
          <Button variant="outline" onClick={() => go('editQuote', q.id)}>
            Taslağı düzenle
          </Button>
        )}
        {transitions.map((s) => (
          <Button
            key={s}
            variant={s === 'Rejected' ? 'outline' : 'default'}
            onClick={() => setTarget(s)}
          >
            {s === 'Sent' ? 'Gönderildi işaretle' : s === 'Accepted' ? 'Kabul et' : 'Reddet'}
          </Button>
        ))}
      </Header>
      <Panel title="Teklif kalemleri" action={<StatusBadge status={q.status} />}>
        {q.items.length ? (
          <Table heads={['Açıklama', 'Miktar', 'Birim fiyat', 'Tutar']}>
            {q.items.map((i) => (
              <tr key={i.description}>
                <td>{i.description}</td>
                <td>{i.quantity}</td>
                <td>{money(i.unitPrice)}</td>
                <td>{money(total([i]))}</td>
              </tr>
            ))}
          </Table>
        ) : (
          <Empty text="Bu taslakta henüz kalem yok." />
        )}
        <div className="summary">
          Teklif toplamı <strong>{money(total(q.items))}</strong>
        </div>
      </Panel>
      <Panel title="Durum geçmişi">
        <ol className="timeline">
          {timeline.map((s) => (
            <li key={s}>
              <StatusBadge status={s} />
            </li>
          ))}
        </ol>
      </Panel>
      {scenario === 'invalid' && (
        <p role="alert" className="invalid">
          Bu durum geçişine izin verilmiyor.
        </p>
      )}
      {done && <PreviewNotice />}
      {target && (
        <Modal title={statusLabels[target] + ' olarak işaretle'} close={() => setTarget(null)}>
          {target === 'Sent' && !q.items.length ? (
            <p role="alert">Boş taslak gönderilemez. Önce en az bir teklif kalemi ekleyin.</p>
          ) : (
            <>
              <p>
                {q.reference} için yeni durum: {statusLabels[target]}.{' '}
                {target === 'Sent'
                  ? 'Bu işlem e-posta göndermez. Gönderildikten sonra kalemler düzenlenemez.'
                  : 'Bu karar teklif sürecini sonlandırır.'}
              </p>
              <Button
                onClick={() => {
                  setDone(true);
                  setTarget(null);
                }}
              >
                Değişikliği önizle
              </Button>
            </>
          )}
          <Button variant="outline" onClick={() => setTarget(null)}>
            Vazgeç
          </Button>
        </Modal>
      )}
    </>
  );
}
export function Builder({
  customers,
  quote,
  customerId,
  go,
  scenario,
}: {
  customers: Customer[];
  quote?: Quote;
  customerId?: string;
  go: Go;
  scenario: Scenario;
}) {
  const [selected, setSelected] = useState(quote?.customerId ?? customerId ?? ''),
    [lines, setLines] = useState(() => (quote?.items ?? []).map((i, key) => ({ ...i, key }))),
    [dirty, setDirty] = useState(scenario === 'dirty'),
    [confirm, setConfirm] = useState(false),
    [done, setDone] = useState(false),
    [submitted, setSubmitted] = useState(false);
  const customer = customers.find((c) => c.id === selected);
  const nextPage = () => go(quote ? 'quote' : 'quotes', quote?.id);
  const change = (key: number, values: Partial<Item>) => {
    setLines(lines.map((i) => (i.key === key ? { ...i, ...values } : i)));
    setDirty(true);
    setDone(false);
  };
  const invalid = (v: Item) => !v.description.trim() || v.quantity <= 0 || v.unitPrice < 0;
  const showErrors = submitted || scenario === 'invalid';
  return (
    <>
      <Header
        title={quote ? 'Taslağı Düzenle' : 'Yeni Teklif'}
        description={quote?.reference ?? 'Teklif numarası kayıt sırasında sunucuda oluşturulur.'}
      />
      <form
        className="stack"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
          setDone(!!selected && !lines.some(invalid));
        }}
      >
        <Panel title="Müşteri">
          <div className="form">
            <label className="field">
              Şirket
              <select
                value={selected}
                onChange={(e) => {
                  setSelected(e.target.value);
                  setDirty(true);
                  setDone(false);
                }}
              >
                <option value="">Müşteri seçin</option>
                {customers
                  .filter((c) => !c.isArchived || c.id === quote?.customerId)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName}
                    </option>
                  ))}
              </select>
            </label>
            {customer && (
              <p>
                {customer.name} · {customer.email}
              </p>
            )}
            {showErrors && !selected && <p className="invalid">Bir müşteri seçin.</p>}
          </div>
        </Panel>
        <Panel
          title="Teklif kalemleri"
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setLines([
                  ...lines,
                  { key: (lines.at(-1)?.key ?? 0) + 1, description: '', quantity: 1, unitPrice: 0 },
                ]);
                setDirty(true);
                setDone(false);
              }}
            >
              <Plus />
              Kalem ekle
            </Button>
          }
        >
          {!lines.length && <Empty text="Taslağa ilk teklif kalemini ekleyin." />}
          {lines.map((i, index) => (
            <div className="item-row" key={i.key}>
              <Field
                label={'Kalem ' + (index + 1)}
                placeholder="Hizmet açıklaması"
                value={i.description}
                error={showErrors && !i.description.trim() ? 'Açıklama girin.' : undefined}
                onChange={(e) => change(i.key, { description: e.target.value })}
              />
              <Field
                label="Miktar"
                type="number"
                min="0.01"
                step="any"
                value={i.quantity}
                onChange={(e) => change(i.key, { quantity: Number(e.target.value) })}
              />
              <Field
                label="Birim fiyat (₺)"
                type="number"
                min="0"
                step="any"
                value={i.unitPrice}
                onChange={(e) => change(i.key, { unitPrice: Number(e.target.value) })}
              />
              <strong>{money(total([i]))}</strong>
              <Button
                type="button"
                variant="ghost"
                aria-label={'Kalem ' + (index + 1) + ' sil'}
                onClick={() => {
                  setLines(lines.filter((l) => l.key !== i.key));
                  setDirty(true);
                  setDone(false);
                }}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          <div className="summary">
            Teklif toplamı<strong>{money(total(lines))}</strong>
          </div>
        </Panel>
        {dirty && <p className="muted">Kaydedilmemiş değişiklikler var.</p>}
        {scenario === 'invalid' && (
          <p className="invalid">Örnek doğrulama hatası: Kalem bilgilerini kontrol edin.</p>
        )}
        <div className="actions">
          <Button>Taslağı kaydet</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => (dirty ? setConfirm(true) : nextPage())}
          >
            Vazgeç
          </Button>
        </div>
        {done && <PreviewNotice />}
      </form>
      {confirm && (
        <Modal title="Taslak kapatılsın mı?" close={() => setConfirm(false)}>
          <p>Bu önizlemedeki değişiklikler kaybolacak.</p>
          <Button onClick={nextPage}>Değişiklikleri bırak</Button>
          <Button variant="outline" onClick={() => setConfirm(false)}>
            Düzenlemeye dön
          </Button>
        </Modal>
      )}
    </>
  );
}
