import { type ReactNode } from 'react';
import { Dialog } from 'radix-ui';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
