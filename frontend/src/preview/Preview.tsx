import { useState } from 'react';
import { Shell } from '@/layouts/AppShell';
import { customers, quotes, members, activities } from './fixtures';
import { CustomerDetail, CustomerForm, Records } from '@/features/Records';
import { Builder, QuoteDetail } from '@/features/Quotations';
import { Dashboard } from '@/features/Dashboard';
import { UserList, History, Settings, Profile } from '@/features/Administration';
import { Login, SystemPage } from '@/features/Access';
import { Modal, PreviewNotice, Header } from '@/components/shared/Elements';
import { Button } from '@/components/ui/button';
import { pageNames, type Page, type Go, type Scenario } from '@/lib/model';
const labels: Record<Scenario, string> = {
  normal: 'Standart',
  empty: 'Boş',
  error: 'Hata',
  success: 'Başarı bildirimi',
  loading: 'Yükleniyor',
  invalid: 'Doğrulama hatası',
  dirty: 'Kaydedilmemiş değişiklikler',
};
function options(page: Page): Scenario[] {
  if (page === 'login') return ['normal', 'loading', 'error', 'invalid'];
  if (['customers', 'quotes', 'dashboard'].includes(page))
    return ['normal', 'empty', 'loading', 'error'];
  if (page === 'editQuote' || page === 'newQuote')
    return ['normal', 'dirty', 'loading', 'invalid', 'success'];
  if (['quote', 'newCustomer', 'editCustomer'].includes(page))
    return ['normal', 'invalid', 'loading', 'success'];
  return ['normal'];
}
export default function Preview() {
  const [page, setPage] = useState<Page>('dashboard'),
    [id, setId] = useState<string>(),
    [admin, setAdmin] = useState(true),
    [scenario, setScenario] = useState<Scenario>('normal'),
    [review, setReview] = useState(false);
  const member = members[admin ? 0 : 1];
  const go: Go = (p, record) => {
    setPage(p);
    setId(record);
    setScenario('normal');
    window.scrollTo(0, 0);
  };
  const blocked = !admin && ['users', 'settings', 'activity'].includes(page);
  const c = customers.find((c) => c.id === id) ?? customers[0];
  const q =
    quotes.find((q) => q.id === id) ??
    (page === 'editQuote'
      ? quotes.find((q) => q.status === 'Draft' && q.items.length > 0)!
      : quotes[0]);
  const reviewPanel = review && (
    <Modal title="Tasarım önizlemesi" close={() => setReview(false)}>
      <p>Örnek verilerle ekranları, rolleri ve durumları inceleyin.</p>
      <label className="field">
        Önizleme rolü
        <select
          value={admin ? 'admin' : 'sales'}
          onChange={(e) => setAdmin(e.target.value === 'admin')}
        >
          <option value="admin">Yönetici</option>
          <option value="sales">Satış çalışanı</option>
        </select>
      </label>
      <label className="field">
        Ekran
        <select value={page} onChange={(e) => go(e.target.value as Page)}>
          {Object.entries(pageNames)
            .filter(([p]) => admin || !['users', 'settings', 'activity'].includes(p) || p === page)
            .map(([p, label]) => (
              <option key={p} value={p}>
                {label}
              </option>
            ))}
        </select>
      </label>
      <label className="field">
        Görünüm
        <select value={scenario} onChange={(e) => setScenario(e.target.value as Scenario)}>
          {options(page).map((s) => (
            <option key={s} value={s}>
              {labels[s]}
            </option>
          ))}
        </select>
      </label>
      <Button onClick={() => setReview(false)}>Önizlemeyi göster</Button>
    </Modal>
  );
  function render() {
    if (blocked) return <SystemPage page="forbidden" go={go} retry={() => go('dashboard')} />;
    if (scenario === 'loading')
      return (
        <>
          <Header title={pageNames[page]} description="Kayıtlar yükleniyor…" />
          <div role="status" aria-label="Yükleniyor" className="skeleton" />
        </>
      );
    if (scenario === 'error')
      return <SystemPage page="error" go={go} retry={() => setScenario('normal')} />;
    switch (page) {
      case 'dashboard':
        return (
          <Dashboard {...{ go, customers, quotes, activities }} empty={scenario === 'empty'} />
        );
      case 'customers':
      case 'quotes':
        return (
          <Records
            kind={page}
            go={go}
            customers={scenario === 'empty' ? [] : customers}
            quotes={scenario === 'empty' ? [] : quotes}
          />
        );
      case 'customer':
        return <CustomerDetail customer={c} {...{ admin, go, quotes }} />;
      case 'editCustomer':
      case 'newCustomer':
        return (
          <CustomerForm customer={page === 'editCustomer' ? c : undefined} {...{ go, scenario }} />
        );
      case 'quote':
        return (
          <QuoteDetail
            quote={q}
            customer={customers.find((c) => c.id === q.customerId)!}
            {...{ go, scenario }}
          />
        );
      case 'editQuote':
      case 'newQuote':
        return (
          <Builder
            quote={page === 'editQuote' && q.status === 'Draft' ? q : undefined}
            customerId={page === 'newQuote' ? id : undefined}
            {...{ customers, go, scenario }}
          />
        );
      case 'users':
        return <UserList members={members} />;
      case 'activity':
        return <History activities={activities} />;
      case 'profile':
        return <Profile member={member} />;
      case 'settings':
        return <Settings />;
      default:
        return <SystemPage page={page} go={go} retry={() => go('dashboard')} />;
    }
  }
  return (
    <>
      {page === 'login' ? (
        <>
          <Login {...{ go, scenario }} />
          <Button className="login-preview" variant="outline" onClick={() => setReview(true)}>
            Tasarım önizlemesi
          </Button>
        </>
      ) : (
        <Shell page={page} member={member} go={go} review={() => setReview(true)}>
          <div className="stack" key={[page, id, scenario, admin].join('-')}>
            {scenario === 'success' && <PreviewNotice />}
            {render()}
          </div>
        </Shell>
      )}
      {reviewPanel}
    </>
  );
}
