import { Field } from '@/components/shared/Field';
import { Header } from '@/components/shared/Header';
import { Panel } from '@/components/shared/Panel';
import { Button } from '@/components/ui/button';
import { PreviewNotice } from '@/preview/PreviewNotice';
import { useState } from 'react';

export function Settings() {
  const [done, setDone] = useState(false);
  return (
    <>
      <Header
        title="Şirket Ayarları"
        description="Önerilen şirket ve uygulama ayarlarının önizlemesi."
      />
      <Panel title="Şirket bilgileri">
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <div className="fields">
            <Field label="Şirket adı" defaultValue="Yakamoz Çözümleri" />
            <Field label="İletişim e-postası" defaultValue="bilgi@example.com" type="email" />
            <Field label="Uygulama dili" value="Türkçe" readOnly />
            <Field label="Para birimi" value="Türk lirası (TRY)" readOnly />
          </div>
          <Button>Kaydet</Button>
          {done && <PreviewNotice />}
        </form>
      </Panel>
    </>
  );
}
