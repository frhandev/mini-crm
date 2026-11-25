import { useId, type ReactNode } from 'react';
import { Dialog } from 'radix-ui';
import { Box, X, Search, ChevronLeft, ChevronRight, Layers3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { statusLabels, type Status } from '@/lib/model';
export function Brand() {
  return (
    <div className="brand">
      <span>
        <Layers3 size={23} />
      </span>
      Mini CRM
    </div>
  );
}
export function Header({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-head">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="actions">{children}</div>
    </header>
  );
}
export function StatusBadge({ status }: { status: Status | 'Active' | 'Archived' }) {
  return (
    <Badge className={'status ' + status}>
      <i />
      {status === 'Active' ? 'Aktif' : status === 'Archived' ? 'Arşivlendi' : statusLabels[status]}
    </Badge>
  );
}
export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="panel">
      <header className="panel-head">
        <h2>{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}
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
export function Field({
  label,
  error,
  ...props
}: { label: string; error?: string } & React.ComponentProps<typeof Input>) {
  const id = useId();
  return (
    <div className="field">
      <Label htmlFor={id}>{label}</Label>
      <Input
        {...props}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? id + '-error' : undefined}
      />
      {error && (
        <small className="invalid" id={id + '-error'}>
          {error}
        </small>
      )}
    </div>
  );
}
export function SearchBox({
  value,
  change,
  hint,
}: {
  value: string;
  change: (v: string) => void;
  hint: string;
}) {
  return (
    <label className="search">
      <Search size={16} />
      <Input
        aria-label={hint}
        placeholder={hint}
        value={value}
        onChange={(e) => change(e.target.value)}
      />
    </label>
  );
}
export function Empty({ text = 'Henüz kayıt bulunmuyor.' }: { text?: string }) {
  return (
    <div className="empty">
      <Box />
      <p>{text}</p>
    </div>
  );
}
export function Pages({
  count,
  page,
  size,
  change,
}: {
  count: number;
  page: number;
  size: number;
  change: (n: number) => void;
}) {
  return (
    <footer className="pagination">
      <span>
        {count} kayıt · {count ? (page - 1) * size + 1 + '–' + Math.min(page * size, count) : '0'}{' '}
        gösteriliyor
      </span>
      <div className="actions">
        <Button
          variant="outline"
          aria-label="Önceki sayfa"
          disabled={page <= 1}
          onClick={() => change(page - 1)}
        >
          <ChevronLeft />
        </Button>
        <span>
          {page} / {Math.max(1, Math.ceil(count / size))}
        </span>
        <Button
          variant="outline"
          aria-label="Sonraki sayfa"
          disabled={page * size >= count}
          onClick={() => change(page + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </footer>
  );
}
export function Modal({
  title,
  children,
  close,
  trigger,
  drawer = false,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
  trigger?: ReactNode;
  drawer?: boolean;
}) {
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      {trigger}
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content
          aria-describedby={undefined}
          className={'modal ' + (drawer ? 'drawer' : '')}
        >
          <div className="panel-head">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" aria-label="Kapat">
                <X />
              </Button>
            </Dialog.Close>
          </div>
          <div className="modal-body">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export function PreviewNotice() {
  return (
    <p role="status" className="notice">
      İşlem önizlemesi tamamlandı. Veriler kaydedilmedi.
    </p>
  );
}
