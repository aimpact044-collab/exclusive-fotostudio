import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/** Stacked Русский/Română/English textarea trio for one translatable settings field. */
export function LocalizedTextField({
  label,
  name,
  value,
  valueRo,
  valueEn,
  rows = 2,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  value: string | null;
  valueRo: string | null;
  valueEn: string | null;
  rows?: number;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label} (Русский)</Label>
      <Textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        defaultValue={value ?? ""}
        required={required}
      />
      <Textarea
        name={`${name}_ro`}
        rows={rows}
        placeholder={`${label} (Română, необязательно)`}
        defaultValue={valueRo ?? ""}
      />
      <Textarea
        name={`${name}_en`}
        rows={rows}
        placeholder={`${label} (English, optional)`}
        defaultValue={valueEn ?? ""}
      />
    </div>
  );
}
