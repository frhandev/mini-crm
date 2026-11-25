import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Header,
  Panel,
  SearchBox,
  Table,
  Empty,
  Field,
  PreviewNotice,
  Modal,
} from '@/components/shared/Elements';
import { date, initials, type Member, type Activity } from '@/lib/model';
export function UserList({ members }: { members: Member[] }) {
  const [search, setSearch] = useState(''),
    [role, setRole] = useState(''),
    [dialog, setDialog] = useState<'edit' | 'new' | 'disable' | null>(null),
    [member, setMember] = useState<Member>(),
    [done, setDone] = useState(false);
  const rows = members.filter(
    (m) =>
      (!role || String(m.admin) === role) &&
      (m.name + ' ' + m.email).toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr')),
  );
  const finish = () => {
    setDialog(null);
    setDone(true);
  };
  return (
    <>
      <Header
        title="Kullanıcılar"
        description="Çalışma alanındaki kullanıcıları ve rollerini inceleyin."
      >
        <Button
          onClick={() => {
            setMember(undefined);
            setDialog('new');
          }}
        >
          <Plus />
          Yeni Kullanıcı
        </Button>
      </Header>
      <Panel title="Ekip üyeleri">
        <div className="toolbar">
          <SearchBox value={search} change={setSearch} hint="Ad veya e-posta ara" />
          <select aria-label="Rol filtresi" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Tüm roller</option>
            <option value="true">Yönetici</option>
            <option value="false">Satış çalışanı</option>
          </select>
        </div>
        {rows.length ? (
          <Table heads={['Ad soyad', 'E-posta', 'Rol', 'Hesap', 'İşlemler']}>
            {rows.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.admin ? 'Yönetici' : 'Satış çalışanı'}</td>
                <td>{m.active ? 'Aktif' : 'Pasif'}</td>
                <td>
                  <div className="actions">
                    <button
                      className="link"
                      onClick={() => {
                        setMember(m);
                        setDialog('edit');
                      }}
                    >
                      Düzenle
                    </button>
                    {m.active && (
                      <button
                        onClick={() => {
                          setMember(m);
                          setDialog('disable');
                        }}
                      >
                        Pasifleştir
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <Empty />
        )}
      </Panel>
      {done && <PreviewNotice />}
      {dialog && (
        <Modal
          title={
            dialog === 'disable'
              ? 'Hesap pasifleştirilsin mi?'
              : dialog === 'new'
                ? 'Yeni Kullanıcı'
                : 'Kullanıcıyı Düzenle'
          }
          close={() => setDialog(null)}
        >
          {dialog === 'disable' ? (
            <>
              <p>{member?.name} için hesap pasifleştirme önizlemesi.</p>
              <Button onClick={finish}>Pasifleştirmeyi önizle</Button>
            </>
          ) : (
            <form
              className="stack"
              onSubmit={(e) => {
                e.preventDefault();
                finish();
              }}
            >
              <Field label="Ad soyad" defaultValue={member?.name} />
              <Field label="E-posta" type="email" defaultValue={member?.email} />
              <label className="field">
                Rol
                <select defaultValue={member?.admin ? 'admin' : 'sales'}>
                  <option value="admin">Yönetici</option>
                  <option value="sales">Satış çalışanı</option>
                </select>
              </label>
              <Button>Kaydet</Button>
            </form>
          )}
        </Modal>
      )}
    </>
  );
}
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
export function History({ activities }: { activities: Activity[] }) {
  const [search, setSearch] = useState(''),
    [user, setUser] = useState('');
  const rows = activities.filter(
    (a) =>
      (!user || a.user === user) &&
      (a.action + ' ' + a.description)
        .toLocaleLowerCase('tr')
        .includes(search.toLocaleLowerCase('tr')),
  );
  return (
    <>
      <Header
        title="İşlem Geçmişi"
        description="Çalışma alanındaki örnek kayıt hareketlerini inceleyin."
      />
      <Panel title="Son işlemler">
        <div className="toolbar">
          <SearchBox hint="İşlem veya açıklama ara" change={setSearch} value={search} />
          <select
            aria-label="Kullanıcı filtresi"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          >
            <option value="">Tüm kullanıcılar</option>
            {[...new Set(activities.map((a) => a.user))].map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>
        {rows.length ? (
          <Table heads={['Kullanıcı', 'İşlem', 'Kayıt türü', 'Açıklama', 'Zaman']}>
            {rows.map((a) => (
              <tr key={a.id}>
                <td>{a.user}</td>
                <td>{a.action}</td>
                <td>{a.entity}</td>
                <td>{a.description}</td>
                <td>
                  {date(a.date)} ·{' '}
                  {new Date(a.date).toLocaleTimeString('tr-TR', {
                    timeZone: 'Europe/Istanbul',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <Empty />
        )}
      </Panel>
    </>
  );
}
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
