import { Search } from 'lucide-react';
import { Input } from '../ui/input';

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
