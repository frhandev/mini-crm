import type { ReactNode } from 'react';

export function Table({ heads, children }: { heads: string[]; children: ReactNode }) {
  return (
    <div className="table-scroll" tabIndex={0} aria-label="Tablo">
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
