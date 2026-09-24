import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/** Stacked Русский/Română/English textarea trio for a list field (one item per line). */
export function LocalizedListField({
  label,
  name,
  value,
  valueRo,
  valueEn,
  rows = 4,
  placeholder,
}: {
  label: string;
  name: string;
  value: string[] | null;
  valueRo: string[] | null;
  valueEn: string[] | null;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label} (Русский, по одному пункту на строку)</Label>
      <Textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        defaultValue={value?.join("\n") ?? ""}
      />
      <Textarea
        name={`${name}_ro`}
        rows={rows}
        placeholder="Română (необязательно, тот же порядок строк, что и выше)"
        defaultValue={valueRo?.join("\n") ?? ""}
      />
      <Textarea
        name={`${name}_en`}
        rows={rows}
        placeholder="English (optional, same line order as above)"
        defaultValue={valueEn?.join("\n") ?? ""}
      />
    </div>
  );
}
