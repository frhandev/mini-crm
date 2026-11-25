import { Empty } from '@/components/shared/Empty';
import { Field } from '@/components/shared/Field';
import { Header } from '@/components/shared/Header';
import { Modal } from '@/components/shared/Modal';
import { Panel } from '@/components/shared/Panel';
import { SearchBox } from '@/components/shared/SearchBox';
import { Table } from '@/components/shared/Table';
import { Button } from '@/components/ui/button';
import { PreviewNotice } from '@/preview/PreviewNotice';
import type { Member } from '@/types/user';
import { Plus } from 'lucide-react';
import { useState } from 'react';

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
