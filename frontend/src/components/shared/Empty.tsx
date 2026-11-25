import { Box } from "lucide-react";

export function Empty({ text = 'Henüz kayıt bulunmuyor.' }: { text?: string }) {
  return (
    <div className="empty">
      <Box />
      <p>{text}</p>
    </div>
  );
}
