import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageNames, type Go, type Page } from '@/preview/types';

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
