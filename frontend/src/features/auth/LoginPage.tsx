import { Brand } from '@/components/shared/Brand';
import { Field } from '@/components/shared/Field';
import { Button } from '@/components/ui/button';
import type { Go, Scenario } from '@/preview/types';
import { EyeOff, Eye, ArrowRight } from 'lucide-react';
import { useState } from 'react';

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

            if (scenario === 'error' || scenario === 'invalid' || scenario === 'loading') {
              return;
            }

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
