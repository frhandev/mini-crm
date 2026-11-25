import { statusLabels, type Status } from "@/types/quotation";
import { Badge } from "../ui/badge";

export function StatusBadge({ status }: { status: Status | 'Active' | 'Archived' }) {
  return (
    <Badge className={'status ' + status}>
      <i />
      {status === 'Active' ? 'Aktif' : status === 'Archived' ? 'Arşivlendi' : statusLabels[status]}
    </Badge>
  );
}