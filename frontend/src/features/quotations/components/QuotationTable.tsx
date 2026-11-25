import { StatusBadge } from '@/components/shared/StatusBadge';
import { Table } from '@/components/shared/Table';
import { date, money } from '@/lib/formatters';
import { total } from '@/preview/calculations';
import type { Go } from '@/preview/types';
import type { Customer } from '@/types/customer';
import type { Quote } from '@/types/quotation';
import { ArrowUpRight } from 'lucide-react';

export function QuotationTable({
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
