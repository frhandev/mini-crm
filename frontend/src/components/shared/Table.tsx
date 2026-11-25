import type { ReactNode } from 'react';

type TableProps = {
  heads: string[];
  children: ReactNode;
  label?: string;
};

export function Table({ heads, children, label = 'Tablo' }: TableProps) {
  return (
    <div className="table-scroll" role="region" tabIndex={0} aria-label={label}>
      <table>
        <thead>
          <tr>
            {heads.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
