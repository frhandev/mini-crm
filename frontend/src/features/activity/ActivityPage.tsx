import { useState } from 'react';
import { Header } from '@/components/shared/Header';
import { Panel } from '@/components/shared/Panel';
import { SearchBox } from '@/components/shared/SearchBox';
import { Table } from '@/components/shared/Table';
import { Empty } from '@/components/shared/Empty';
import type { Activity } from '@/types/activity';
import { date } from '@/lib/formatters';

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
