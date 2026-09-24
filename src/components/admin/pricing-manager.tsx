"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  createPricingPackage,
  updatePricingPackage,
  deletePricingPackage,
} from "@/actions/pricing";
import type { PricingPackage } from "@/types";

function PricingPackageForm({
  pkg,
  onDone,
}: {
  pkg?: PricingPackage;
  onDone: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const action = (formData: FormData) => {
    startTransition(async () => {
      try {
        if (pkg) {
          await updatePricingPackage(pkg.id, formData);
          toast.success("Пакет обновлён");
        } else {
          await createPricingPackage(formData);
          toast.success("Пакет добавлен");
        }
        router.refresh();
        onDone();
      } catch {
        toast.error("Не удалось сохранить пакет");
      }
    });
  };

  return (
    <form action={action} className="space-y-4 border border-border bg-card p-5">
      <div className="space-y-3">
        <Label>Название</Label>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-normal text-muted-foreground">
            Русский
          </Label>
          <Input id="name" name="name" required defaultValue={pkg?.name ?? ""} placeholder="Например, Premium" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name_ro" className="text-xs font-normal text-muted-foreground">
            Română
          </Label>
          <Input id="name_ro" name="name_ro" defaultValue={pkg?.name_ro ?? ""} placeholder="De ex. Premium" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name_en" className="text-xs font-normal text-muted-foreground">
            English
          </Label>
          <Input id="name_en" name="name_en" defaultValue={pkg?.name_en ?? ""} placeholder="E.g. Premium" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">
          Цена{" "}
          <span className="text-xs normal-case text-muted-foreground">(необязательно)</span>
        </Label>
        <Input id="price" name="price" defaultValue={pkg?.price ?? ""} placeholder="от 800 €" />
      </div>
      <div className="space-y-3">
        <Label>Что включено (по одному пункту на строку)</Label>
        <div className="space-y-2">
          <Label htmlFor="features" className="text-xs font-normal text-muted-foreground">
            Русский
          </Label>
          <Textarea
            id="features"
            name="features"
            rows={8}
            required
            defaultValue={pkg?.features.join("\n") ?? ""}
            placeholder={"Один фотограф\nОдин видеограф\nФотоальбом"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="features_ro" className="text-xs font-normal text-muted-foreground">
            Română{" "}
            <span className="normal-case text-muted-foreground">
              (необязательно, по той же строке, что и выше)
            </span>
          </Label>
          <Textarea
            id="features_ro"
            name="features_ro"
            rows={8}
            defaultValue={pkg?.features_ro?.join("\n") ?? ""}
            placeholder={"Un fotograf\nUn videograf\nAlbum foto"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="features_en" className="text-xs font-normal text-muted-foreground">
            English{" "}
            <span className="normal-case text-muted-foreground">
              (optional, same line order as above)
            </span>
          </Label>
          <Textarea
            id="features_en"
            name="features_en"
            rows={8}
            defaultValue={pkg?.features_en?.join("\n") ?? ""}
            placeholder={"One photographer\nOne videographer\nPhoto album"}
          />
        </div>
      </div>
      <label className="flex items-center justify-between gap-4">
        <span>
          <span className="block text-sm font-medium">Выделить пакет</span>
          <span className="block text-xs text-muted-foreground">
            Пакет будет визуально выделен как рекомендуемый
          </span>
        </span>
        <Switch name="is_featured" defaultChecked={pkg?.is_featured ?? false} />
      </label>
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          Сохранить
        </Button>
        <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
          Отмена
        </Button>
      </div>
    </form>
  );
}

export function PricingManager({ packages }: { packages: PricingPackage[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const sorted = packages.slice().sort((a, b) => a.position - b.position);

  const handleDelete = (pkg: PricingPackage) => {
    if (!confirm(`Удалить пакет «${pkg.name}»?`)) return;
    startTransition(async () => {
      try {
        await deletePricingPackage(pkg.id);
        toast.success("Пакет удалён");
        router.refresh();
      } catch {
        toast.error("Не удалось удалить пакет");
      }
    });
  };

  return (
    <div className="space-y-4">
      {!creating && (
        <Button type="button" onClick={() => setCreating(true)}>
          <Plus className="size-4" />
          Добавить пакет
        </Button>
      )}

      {creating && <PricingPackageForm onDone={() => setCreating(false)} />}

      {sorted.length === 0 ? (
        <p className="border border-border bg-card px-5 py-10 text-center text-sm text-muted-foreground">
          Пакетов пока нет.
        </p>
      ) : (
        <div className="divide-y divide-border border border-border bg-card">
          {sorted.map((pkg) =>
            editingId === pkg.id ? (
              <div key={pkg.id} className="p-1">
                <PricingPackageForm pkg={pkg} onDone={() => setEditingId(null)} />
              </div>
            ) : (
              <div key={pkg.id} className="flex items-start justify-between gap-4 px-5 py-4">
                <div>
                  <p className="flex items-center gap-2 font-medium">
                    {pkg.name}
                    {pkg.is_featured && <Star className="size-3.5 fill-accent text-accent" />}
                  </p>
                  {pkg.price && <p className="text-sm text-muted-foreground">{pkg.price}</p>}
                  <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                    {pkg.features.map((feature, i) => (
                      <li key={i}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={isPending}
                    onClick={() => setEditingId(pkg.id)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    disabled={isPending}
                    onClick={() => handleDelete(pkg)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
