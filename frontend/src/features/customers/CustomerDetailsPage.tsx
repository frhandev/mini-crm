import { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Customer } from '@/types/customer';
import type { Go } from '@/preview/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Header } from '@/components/shared/Header';
import { Panel } from '@/components/shared/Panel';
import { Empty } from '@/components/shared/Empty';
import { type Quote } from '@/types/quotation';
import { date } from '@/lib/formatters';
import { Modal } from '@/components/shared/Modal';
import { PreviewNotice } from '@/preview/PreviewNotice';
import { Tabs } from 'radix-ui';
import { QuotationTable } from '../quotations/components/QuotationTable';

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
            {history.length ? <QuotationTable rows={history} customers={[c]} go={go} /> : <Empty />}
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
