import { useState, type ReactNode } from 'react';
import { DropdownMenu } from 'radix-ui';
import {
  LayoutDashboard,
  Users,
  Files,
  History,
  Settings,
  Contact,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  LogOut,
  UserRound,
  PanelsTopLeft,
} from 'lucide-react';
import { Brand, Modal } from '@/components/shared/Elements';
import { Button } from '@/components/ui/button';
import { pageNames, initials, type Go, type Member, type Page } from '@/lib/model';
const primary = [
  { page: 'dashboard', icon: LayoutDashboard },
  { page: 'customers', icon: Contact },
  { page: 'quotes', icon: Files },
] as const;
const management = [
  { page: 'users', icon: Users },
  { page: 'settings', icon: Settings },
  { page: 'activity', icon: History },
] as const;
export function Shell({
  page,
  member,
  go,
  review,
  children,
}: {
  page: Page;
  member: Member;
  go: Go;
  review: () => void;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false),
    [mobile, setMobile] = useState(false);
  const section =
    (
      {
        customer: 'customers',
        newCustomer: 'customers',
        editCustomer: 'customers',
        quote: 'quotes',
        newQuote: 'quotes',
        editQuote: 'quotes',
      } as Partial<Record<Page, Page>>
    )[page] ?? page;
  function items(rows: readonly ((typeof primary)[number] | (typeof management)[number])[]) {
    return rows.map(({ page: p, icon: Icon }) => (
      <button
        key={p}
        className={'nav-item ' + (section === p ? 'active' : '')}
        aria-current={section === p ? 'page' : undefined}
        title={pageNames[p]}
        aria-label={pageNames[p]}
        onClick={() => {
          go(p);
          setMobile(false);
        }}
      >
        <Icon />
        <span>{pageNames[p]}</span>
      </button>
    ));
  }
  const navigation = (
    <>
      <div className="brand-area">
        <Brand />
      </div>
      <nav aria-label="Ana menü">
        <h2>ÇALIŞMA ALANI</h2>
        {items(primary)}
        {member.admin && (
          <>
            <h2>YÖNETİM</h2>
            {items(management)}
          </>
        )}
      </nav>
      <div className="sidebar-end">
        <button
          className="nav-item"
          title="Tasarım önizlemesi"
          aria-label="Tasarım önizlemesi"
          onClick={() => {
            setMobile(false);
            review();
          }}
        >
          <SlidersHorizontal />
          <span>Tasarım önizlemesi</span>
        </button>
        <div className="account">
          <button
            title="Profilim"
            aria-label="Profilim"
            onClick={() => {
              go('profile');
              setMobile(false);
            }}
          >
            <span className="avatar">{initials(member.name)}</span>
            <span>
              <b>{member.name}</b>
              <small>{member.admin ? 'Yönetici' : 'Satış çalışanı'}</small>
            </span>
          </button>
          <button title="Çıkış yap" aria-label="Çıkış yap" onClick={() => go('login')}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </>
  );
  return (
    <div className={'shell ' + (collapsed ? 'collapsed' : '')}>
      <a className="skip" href="#content">
        İçeriğe geç
      </a>
      <aside>{navigation}</aside>
      {mobile && (
        <Modal title="Gezinme" drawer close={() => setMobile(false)}>
          {navigation}
        </Modal>
      )}
      <div className="workspace">
        <header className="topbar">
          <button className="mobile-toggle" aria-label="Menüyü aç" onClick={() => setMobile(true)}>
            <Menu />
          </button>
          <button
            className="desktop-toggle"
            aria-label={collapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </button>
          <nav aria-label="Sayfa yolu" className="crumb">
            <PanelsTopLeft size={15} />
            <span>Çalışma alanı</span>
            <ChevronRight size={13} />
            <b>{pageNames[page]}</b>
          </nav>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button className="profile-menu" variant="ghost" aria-label="Hesap menüsü">
                <span className="avatar">{initials(member.name)}</span>
                <ChevronDown size={14} />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="end" className="menu">
                <DropdownMenu.Item onSelect={() => go('profile')}>
                  <UserRound />
                  Profilim
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => go('login')}>
                  <LogOut />
                  Çıkış yap
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </header>
        <main id="content" className="content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
