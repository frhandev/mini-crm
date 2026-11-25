import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Customer } from '@/types/customer';
import type { Go, Scenario } from '@/preview/types';
import { Header } from '@/components/shared/Header';
import { Panel } from '@/components/shared/Panel';
import { Empty } from '@/components/shared/Empty';
import { PreviewNotice } from '@/preview/PreviewNotice';
import { Modal } from '@/components/shared/Modal';
import { Field } from '@/components/shared/Field';
import { type Item, type Quote } from '@/types/quotation';
import { total } from '@/preview/calculations';
import { money } from '@/lib/formatters';

export function QuotationBuilderPage({
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
