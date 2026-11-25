import { useState } from 'react';
import { Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import { Brand, Field } from '@/components/shared/Elements';
import { Button } from '@/components/ui/button';
import { pageNames, type Page, type Scenario, type Go } from '@/lib/model';
export function Login({ go, scenario }: { go: Go; scenario: Scenario }) {
  const [visible, setVisible] = useState(false);
  return (
    <main className="login">
      <div>
        <Brand />
        <h1>Tekrar hoş geldiniz</h1>
        <p>Mini CRM çalışma alanınıza giriş yapın.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            go('dashboard');
          }}
        >
          <Field
            label="E-posta"
            type="email"
            placeholder="ad@example.com"
            required
            autoComplete="username"
            error={scenario === 'invalid' ? 'Geçerli bir e-posta adresi girin.' : undefined}
          />
          <div className="password">
            <Field
              label="Parola"
              type={visible ? 'text' : 'password'}
              required
              autoComplete="current-password"
              error={scenario === 'invalid' ? 'Parolanızı girin.' : undefined}
            />
            <button
              type="button"
              aria-label={visible ? 'Parolayı gizle' : 'Parolayı göster'}
              onClick={() => setVisible(!visible)}
            >
              {visible ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {scenario === 'error' && (
            <p role="alert" className="invalid">
              E-posta veya parola hatalı.
            </p>
          )}
          <Button disabled={scenario === 'loading'}>
            {scenario === 'loading' ? 'Giriş yapılıyor…' : 'Giriş yap'}
            <ArrowRight />
          </Button>
          <small>Tasarım önizlemesi · Örnek bilgiler kullanın.</small>
        </form>
      </div>
    </main>
  );
}
export function SystemPage({ page, go, retry }: { page: Page; go: Go; retry: () => void }) {
  return (
    <section className="system panel">
      <Shield />
      <small>{page === 'forbidden' ? '403' : page === 'missing' ? '404' : '500'}</small>
      <h1>{pageNames[page]}</h1>
      <p>
        {page === 'forbidden'
          ? 'Bu alanı görüntülemek için yönetici rolü gerekir.'
          : page === 'missing'
            ? 'Aradığınız sayfaya ulaşılamadı.'
            : 'Veriler şu anda görüntülenemiyor.'}
      </p>
      <div className="actions">
        {page === 'error' && <Button onClick={retry}>Tekrar dene</Button>}
        <Button variant="outline" onClick={() => go('dashboard')}>
          Genel bakışa dön
        </Button>
      </div>
    </section>
  );
}
