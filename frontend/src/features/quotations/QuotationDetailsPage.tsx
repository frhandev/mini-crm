import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Customer } from '@/types/customer';
import type { Go, Scenario } from '@/preview/types';
import { Header } from '@/components/shared/Header';
import { Panel } from '@/components/shared/Panel';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Table } from '@/components/shared/Table';
import { Empty } from '@/components/shared/Empty';
import { PreviewNotice } from '@/preview/PreviewNotice';
import { Modal } from '@/components/shared/Modal';
import { type Quote, type Status } from '@/types/quotation';
import { date, money } from '@/lib/formatters';
import { total } from '@/preview/calculations';
import { statusLabels } from '@/lib/status-labels';

export function QuotationDetailsPage({
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
