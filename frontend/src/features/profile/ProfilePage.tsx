import { Header } from '@/components/shared/Header';
import { Panel } from '@/components/shared/Panel';
import type { Member } from '@/types/user';
import { initials } from '@/lib/formatters';

export function Profile({ member }: { member: Member }) {
  return (
    <>
      <Header title="Profilim" description="Çalışma alanındaki hesap bilgileriniz." />
      <Panel
        title="Hesap bilgileri"
        action={<span className="avatar">{initials(member.name)}</span>}
      >
        <dl className="facts">
          {[
            ['Ad soyad', member.name],
            ['E-posta', member.email],
            ['Rol', member.admin ? 'Yönetici' : 'Satış çalışanı'],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Panel>
    </>
  );
}
