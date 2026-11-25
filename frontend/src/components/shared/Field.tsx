import { useId } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

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