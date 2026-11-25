import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Customer } from '@/types/customer';
import type { Go, Scenario } from '@/preview/types';
import { Header } from '@/components/shared/Header';
import { Panel } from '@/components/shared/Panel';
import { Field } from '@/components/shared/Field';
import { PreviewNotice } from '@/preview/PreviewNotice';

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
