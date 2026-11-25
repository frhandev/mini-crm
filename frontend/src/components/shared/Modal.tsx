import { useRef, type ReactNode } from 'react';
import { Dialog } from 'radix-ui';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';

type ModalProps = {
  title: string;
  children: ReactNode;
  close: () => void;
  trigger?: ReactNode;
  drawer?: boolean;
};

export function Modal({ title, children, close, trigger, drawer = false }: ModalProps) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) {
          close();
        }
      }}
    >
      {trigger}

      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />

        <Dialog.Content
          aria-describedby={undefined}
          className={'modal ' + (drawer ? 'drawer' : '')}
          onOpenAutoFocus={() => {
            const activeElement = document.activeElement;

            previousFocusRef.current = activeElement instanceof HTMLElement ? activeElement : null;
          }}
          onCloseAutoFocus={(event) => {
            const previousFocus = previousFocusRef.current;

            const anotherDialog = document.querySelector('[role="dialog"][data-state="open"]');

            if (
              !anotherDialog &&
              previousFocus?.isConnected &&
              previousFocus !== document.body &&
              previousFocus.getClientRects().length > 0
            ) {
              event.preventDefault();
              previousFocus.focus();
            }
          }}
        >
          <div className="panel-head">
            <Dialog.Title>{title}</Dialog.Title>

            <Dialog.Close asChild>
              <Button type="button" variant="ghost" aria-label="Kapat">
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
