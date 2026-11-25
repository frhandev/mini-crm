import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

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
